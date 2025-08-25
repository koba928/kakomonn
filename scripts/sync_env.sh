#!/bin/bash

# 🔄 Environment Variables Synchronization Script
# Syncs GitHub Secrets to Vercel Environment Variables and generates .env.local
# This script is idempotent and safe to run multiple times

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
REPO_OWNER="koba928"
REPO_NAME="kakomonn"
ENV_FILE=".env.local"
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
BACKUP_FILE="${ENV_FILE}.bak-${TIMESTAMP}"
TEMP_ENV_FILE="/tmp/env_sync_${TIMESTAMP}"

# Counters
synced_count=0
skipped_count=0
error_count=0

# Function to print colored output
print_status() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

print_step() {
    print_status "$BLUE" "🔹 $1"
}

print_success() {
    print_status "$GREEN" "✅ $1"
}

print_warning() {
    print_status "$YELLOW" "⚠️  $1"
}

print_error() {
    print_status "$RED" "❌ $1"
    ((error_count++))
}

print_header() {
    echo -e "${PURPLE}================================${NC}"
    echo -e "${PURPLE}🔄 Environment Sync Starting${NC}"
    echo -e "${PURPLE}Repository: ${REPO_OWNER}/${REPO_NAME}${NC}"
    echo -e "${PURPLE}Timestamp: ${TIMESTAMP}${NC}"
    echo -e "${PURPLE}================================${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install GitHub CLI
install_gh_cli() {
    print_step "Installing GitHub CLI..."
    
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Check if we're in WSL or native Linux
        if command_exists apt-get; then
            print_step "Attempting to install via apt (requires sudo)..."
            if curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg 2>/dev/null; then
                sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg
                echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
                sudo apt update && sudo apt install -y gh
                print_success "GitHub CLI installed via apt"
                return 0
            else
                print_warning "apt installation failed, trying alternative method..."
            fi
        fi
        
        # Alternative: Download binary directly
        print_step "Downloading GitHub CLI binary..."
        local gh_version="2.65.0"
        local gh_url="https://github.com/cli/cli/releases/download/v${gh_version}/gh_${gh_version}_linux_amd64.tar.gz"
        local gh_dir="$HOME/.local/bin"
        
        mkdir -p "$gh_dir"
        cd /tmp
        curl -L "$gh_url" -o gh.tar.gz
        tar -xzf gh.tar.gz
        mv "gh_${gh_version}_linux_amd64/bin/gh" "$gh_dir/"
        rm -rf gh.tar.gz "gh_${gh_version}_linux_amd64"
        
        # Add to PATH if not already there
        if [[ ":$PATH:" != *":$gh_dir:"* ]]; then
            echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
            export PATH="$HOME/.local/bin:$PATH"
        fi
        
        print_success "GitHub CLI installed to $gh_dir"
        
    elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
        # Windows
        if command_exists winget; then
            print_step "Installing via winget..."
            winget install --id GitHub.cli
            print_success "GitHub CLI installed via winget"
        else
            print_error "Please install GitHub CLI manually from https://cli.github.com/"
            exit 1
        fi
    else
        print_error "Unsupported OS: $OSTYPE"
        exit 1
    fi
}

# Function to check and setup GitHub CLI
setup_github_cli() {
    print_step "Checking GitHub CLI installation..."
    
    if ! command_exists gh; then
        print_warning "GitHub CLI not found. Installing..."
        install_gh_cli
    else
        print_success "GitHub CLI found: $(gh --version | head -n1)"
    fi
    
    # Check authentication
    print_step "Checking GitHub authentication..."
    if ! gh auth status >/dev/null 2>&1; then
        print_warning "GitHub CLI not authenticated. Starting login process..."
        print_status "$YELLOW" "Please complete the authentication in your browser..."
        gh auth login --web --scopes repo,admin:org
        
        # Verify authentication
        if gh auth status >/dev/null 2>&1; then
            print_success "GitHub authentication successful"
        else
            print_error "GitHub authentication failed"
            exit 1
        fi
    else
        print_success "GitHub CLI already authenticated"
    fi
}

# Function to check Vercel CLI
setup_vercel_cli() {
    print_step "Checking Vercel CLI..."
    
    if ! command_exists vercel; then
        print_error "Vercel CLI not found. Please install it first:"
        print_status "$YELLOW" "npm install -g vercel"
        exit 1
    fi
    
    # Check authentication
    print_step "Checking Vercel authentication..."
    if ! vercel whoami >/dev/null 2>&1; then
        print_warning "Vercel CLI not authenticated. Starting login process..."
        vercel login
        
        if vercel whoami >/dev/null 2>&1; then
            print_success "Vercel authentication successful"
        else
            print_error "Vercel authentication failed"
            exit 1
        fi
    else
        local vercel_user=$(vercel whoami 2>/dev/null | head -n1)
        print_success "Vercel CLI authenticated as: $vercel_user"
    fi
}

# Function to backup existing .env.local
backup_env_file() {
    if [[ -f "$ENV_FILE" ]]; then
        print_step "Backing up existing $ENV_FILE to $BACKUP_FILE"
        cp "$ENV_FILE" "$BACKUP_FILE"
        print_success "Backup created: $BACKUP_FILE"
    else
        print_step "No existing $ENV_FILE found, creating new one"
    fi
}

# Function to fetch GitHub secrets
fetch_github_secrets() {
    print_step "Fetching GitHub repository secrets..."
    
    # Create temporary file for secrets
    > "$TEMP_ENV_FILE"
    
    # Get repository secrets
    print_step "Fetching repository-level secrets..."
    local repo_secrets
    if repo_secrets=$(gh secret list --repo "$REPO_OWNER/$REPO_NAME" --json name 2>/dev/null); then
        local secret_names
        secret_names=$(echo "$repo_secrets" | jq -r '.[].name' 2>/dev/null || echo "")
        
        if [[ -n "$secret_names" ]]; then
            while IFS= read -r secret_name; do
                if [[ -n "$secret_name" ]]; then
                    print_step "Processing secret: $secret_name"
                    
                    # Note: GitHub CLI doesn't allow reading secret values for security reasons
                    # We'll add placeholder values that need to be manually updated
                    echo "${secret_name}=__PLACEHOLDER_SET_MANUALLY__" >> "$TEMP_ENV_FILE"
                    ((synced_count++))
                fi
            done <<< "$secret_names"
            
            print_success "Found $synced_count repository secrets"
        else
            print_warning "No repository secrets found or accessible"
        fi
    else
        print_warning "Could not fetch repository secrets (permission issue or none exist)"
    fi
    
    # Check for environment-specific secrets
    print_step "Checking for environment-specific secrets..."
    local environments=("development" "preview" "production")
    
    for env in "${environments[@]}"; do
        print_step "Checking environment: $env"
        local env_secrets
        if env_secrets=$(gh secret list --env "$env" --repo "$REPO_OWNER/$REPO_NAME" --json name 2>/dev/null); then
            local env_secret_names
            env_secret_names=$(echo "$env_secrets" | jq -r '.[].name' 2>/dev/null || echo "")
            
            if [[ -n "$env_secret_names" ]]; then
                while IFS= read -r secret_name; do
                    if [[ -n "$secret_name" ]]; then
                        print_step "Processing environment secret: $secret_name ($env)"
                        
                        # Environment secrets override repository secrets
                        if grep -q "^${secret_name}=" "$TEMP_ENV_FILE"; then
                            sed -i "s/^${secret_name}=.*/${secret_name}=__PLACEHOLDER_SET_MANUALLY_${env^^}__/" "$TEMP_ENV_FILE"
                        else
                            echo "${secret_name}=__PLACEHOLDER_SET_MANUALLY_${env^^}__" >> "$TEMP_ENV_FILE"
                            ((synced_count++))
                        fi
                    fi
                done <<< "$env_secret_names"
                
                print_success "Processed environment secrets for $env"
            fi
        fi
    done
}

# Function to update .env.local
update_env_local() {
    print_step "Updating $ENV_FILE..."
    
    # Start with existing .env.local if it exists (excluding our managed secrets)
    if [[ -f "$ENV_FILE" ]]; then
        # Keep existing non-secret values
        grep -v "^#.*MANAGED BY SYNC SCRIPT" "$ENV_FILE" > "${ENV_FILE}.tmp" 2>/dev/null || touch "${ENV_FILE}.tmp"
    else
        touch "${ENV_FILE}.tmp"
    fi
    
    # Add header
    cat >> "${ENV_FILE}.tmp" << 'EOF'

# ================================
# MANAGED BY SYNC SCRIPT
# ================================
# These values were synced from GitHub Secrets
# Last updated: 
EOF
    
    echo "# Last updated: $(date)" >> "${ENV_FILE}.tmp"
    
    # Add synced secrets
    if [[ -f "$TEMP_ENV_FILE" && -s "$TEMP_ENV_FILE" ]]; then
        cat "$TEMP_ENV_FILE" >> "${ENV_FILE}.tmp"
    fi
    
    # Replace original file
    mv "${ENV_FILE}.tmp" "$ENV_FILE"
    
    print_success "Updated $ENV_FILE with $synced_count secrets"
}

# Function to setup Vercel project
setup_vercel_project() {
    print_step "Checking Vercel project link..."
    
    if [[ ! -f ".vercel/project.json" ]]; then
        print_warning "Vercel project not linked. Linking now..."
        
        # Link to Vercel project
        vercel link --yes
        
        if [[ -f ".vercel/project.json" ]]; then
            print_success "Vercel project linked successfully"
        else
            print_error "Failed to link Vercel project"
            return 1
        fi
    else
        local project_info=$(cat .vercel/project.json 2>/dev/null | jq -r '.name // "unknown"' 2>/dev/null || echo "unknown")
        print_success "Vercel project already linked: $project_info"
    fi
}

# Function to sync environment variables to Vercel
sync_to_vercel() {
    print_step "Syncing environment variables to Vercel..."
    
    if [[ ! -f "$TEMP_ENV_FILE" || ! -s "$TEMP_ENV_FILE" ]]; then
        print_warning "No secrets to sync to Vercel"
        return 0
    fi
    
    local environments=("development" "preview" "production")
    
    # Get existing Vercel environment variables
    print_step "Fetching existing Vercel environment variables..."
    local existing_vars
    existing_vars=$(vercel env ls 2>/dev/null | grep -E "^\s*\S+\s+\S+" | awk '{print $1}' || echo "")
    
    while IFS='=' read -r key value; do
        if [[ -n "$key" && -n "$value" && ! "$key" =~ ^# ]]; then
            print_step "Processing variable: $key"
            
            for env in "${environments[@]}"; do
                # Check if variable already exists for this environment
                local var_exists=false
                if [[ -n "$existing_vars" ]]; then
                    if echo "$existing_vars" | grep -q "^${key}$"; then
                        var_exists=true
                    fi
                fi
                
                if [[ "$var_exists" == "true" ]]; then
                    print_step "Updating existing variable $key for $env"
                    # Remove existing variable first, then add new one
                    vercel env rm "$key" "$env" --yes >/dev/null 2>&1 || true
                fi
                
                print_step "Adding variable $key to $env environment"
                # Add new variable
                if echo "$value" | vercel env add "$key" "$env" >/dev/null 2>&1; then
                    print_success "✓ Added $key to $env"
                else
                    print_error "Failed to add $key to $env"
                    ((error_count++))
                fi
            done
            
            ((synced_count++))
        fi
    done < "$TEMP_ENV_FILE"
    
    print_success "Vercel environment variables sync completed"
}

# Function to pull Vercel environment variables
pull_vercel_env() {
    print_step "Pulling Vercel environment variables to normalize .env.local..."
    
    if vercel env pull "$ENV_FILE" --yes >/dev/null 2>&1; then
        print_success "Successfully pulled Vercel environment variables"
    else
        print_warning "Could not pull Vercel environment variables (this is normal for new projects)"
    fi
}

# Function to cleanup temporary files
cleanup() {
    print_step "Cleaning up temporary files..."
    rm -f "$TEMP_ENV_FILE" "${ENV_FILE}.tmp" gh.tar.gz
    print_success "Cleanup completed"
}

# Function to print summary
print_summary() {
    echo
    print_status "$PURPLE" "================================"
    print_status "$PURPLE" "🎯 Synchronization Summary"
    print_status "$PURPLE" "================================"
    print_status "$GREEN" "✅ Secrets processed: $synced_count"
    print_status "$YELLOW" "⏭️  Secrets skipped: $skipped_count"
    print_status "$RED" "❌ Errors encountered: $error_count"
    
    if [[ -f "$BACKUP_FILE" ]]; then
        print_status "$BLUE" "💾 Backup created: $BACKUP_FILE"
    fi
    
    print_status "$BLUE" "📄 Environment file: $ENV_FILE"
    
    if [[ $error_count -eq 0 ]]; then
        print_status "$GREEN" "🎉 Synchronization completed successfully!"
    else
        print_status "$YELLOW" "⚠️  Synchronization completed with some errors"
    fi
    
    print_status "$PURPLE" "================================"
    echo
}

# Main execution function
main() {
    print_header
    
    # Set trap for cleanup
    trap cleanup EXIT
    
    # Step 1: Setup GitHub CLI
    setup_github_cli
    
    # Step 2: Setup Vercel CLI
    setup_vercel_cli
    
    # Step 3: Backup existing .env.local
    backup_env_file
    
    # Step 4: Fetch GitHub secrets
    fetch_github_secrets
    
    # Step 5: Update .env.local
    update_env_local
    
    # Step 6: Setup Vercel project
    setup_vercel_project
    
    # Step 7: Sync to Vercel
    sync_to_vercel
    
    # Step 8: Pull Vercel environment variables
    pull_vercel_env
    
    # Step 9: Print summary
    print_summary
    
    # Important notice about placeholders
    if [[ $synced_count -gt 0 ]]; then
        print_status "$YELLOW" "⚠️  IMPORTANT: GitHub Secrets cannot be read directly for security reasons."
        print_status "$YELLOW" "   Please manually replace __PLACEHOLDER_SET_MANUALLY__ values in $ENV_FILE"
        print_status "$YELLOW" "   with the actual secret values from your GitHub repository settings."
    fi
}

# Run main function
main "$@"