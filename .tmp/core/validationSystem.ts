import { DesignStructure, GenerationStructure } from './structureGenerator'
import * as fs from 'fs'
import * as path from 'path'

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  warnings: string[]
  suggestions: string[]
}

export class ValidationSystem {
  async validateGeneration(structure: GenerationStructure, outputPath: string): Promise<ValidationResult> {
    const errors: string[] = []
    const warnings: string[] = []
    const suggestions: string[] = []

    // Check if main app file exists
    const mainAppPath = path.join(outputPath, 'page.tsx')
    if (!fs.existsSync(mainAppPath)) {
      errors.push('Main app file (page.tsx) not found')
    } else {
      // Validate main app file content
      const appContent = fs.readFileSync(mainAppPath, 'utf-8')
      const appValidation = this.validateAppContent(appContent, structure.design)
      errors.push(...appValidation.errors)
      warnings.push(...appValidation.warnings)
      suggestions.push(...appValidation.suggestions)
    }

    // Check for required dependencies
    const packageJsonPath = path.join(process.cwd(), 'package.json')
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
      const depValidation = this.validateDependencies(packageJson, structure.validation.dependencies)
      errors.push(...depValidation.errors)
      warnings.push(...depValidation.warnings)
    }

    // Validate TypeScript compilation
    const tsValidation = await this.validateTypeScript(outputPath)
    errors.push(...tsValidation.errors)
    warnings.push(...tsValidation.warnings)

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions
    }
  }

  private validateAppContent(content: string, design: DesignStructure): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []
    const suggestions: string[] = []

    // Check for natural language text
    const naturalLanguagePatterns = [
      /\/\*[\s\S]*?\*\//g, // Block comments
      /\/\/.*$/gm, // Line comments
      /【.*?】/g, // Japanese brackets
      /（.*?）/g, // Japanese parentheses
      /説明|解説|コメント|Comment|Explanation/g // Common explanation words
    ]

    for (const pattern of naturalLanguagePatterns) {
      const matches = content.match(pattern)
      if (matches) {
        errors.push(`Natural language text found: ${matches.join(', ')}`)
      }
    }

    // Check for required imports
    const requiredImports = [
      "import React",
      "from '@/components/ui/",
      "'use client'"
    ]

    for (const importStatement of requiredImports) {
      if (!content.includes(importStatement)) {
        warnings.push(`Missing import: ${importStatement}`)
      }
    }

    // Check for proper TypeScript typing
    if (!content.includes('interface ') && !content.includes('type ')) {
      warnings.push('No TypeScript interfaces or types found')
    }

    // Check for responsive design classes
    const responsiveClasses = ['sm:', 'md:', 'lg:', 'xl:']
    const hasResponsive = responsiveClasses.some(cls => content.includes(cls))
    if (!hasResponsive) {
      suggestions.push('Consider adding responsive design classes')
    }

    // Check for proper error handling
    if (!content.includes('try') && !content.includes('catch')) {
      suggestions.push('Consider adding error handling')
    }

    // Check for accessibility
    const accessibilityAttributes = ['aria-', 'role=', 'alt=']
    const hasAccessibility = accessibilityAttributes.some(attr => content.includes(attr))
    if (!hasAccessibility) {
      suggestions.push('Consider adding accessibility attributes')
    }

    return { isValid: errors.length === 0, errors, warnings, suggestions }
  }

  private validateDependencies(packageJson: any, requiredDeps: string[]): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []
    const suggestions: string[] = []

    const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies }

    for (const dep of requiredDeps) {
      if (dep.includes('*')) {
        // Handle wildcard dependencies like @radix-ui/react-*
        const prefix = dep.replace('*', '')
        const hasMatchingDep = Object.keys(allDeps).some(key => key.startsWith(prefix))
        if (!hasMatchingDep) {
          warnings.push(`No dependencies matching pattern: ${dep}`)
        }
      } else {
        if (!allDeps[dep]) {
          errors.push(`Missing required dependency: ${dep}`)
        }
      }
    }

    return { isValid: errors.length === 0, errors, warnings, suggestions }
  }

  private async validateTypeScript(outputPath: string): Promise<ValidationResult> {
    const errors: string[] = []
    const warnings: string[] = []
    const suggestions: string[] = []

    try {
      // Basic TypeScript syntax validation
      const files = fs.readdirSync(outputPath).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'))
      
      for (const file of files) {
        const filePath = path.join(outputPath, file)
        const content = fs.readFileSync(filePath, 'utf-8')
        
        // Check for basic syntax errors
        const syntaxIssues = this.checkBasicSyntax(content)
        errors.push(...syntaxIssues.map(issue => `${file}: ${issue}`))
        
        // Check for unused imports
        const unusedImports = this.checkUnusedImports(content)
        warnings.push(...unusedImports.map(imp => `${file}: Unused import '${imp}'`))
      }
    } catch (error) {
      errors.push(`TypeScript validation failed: ${error}`)
    }

    return { isValid: errors.length === 0, errors, warnings, suggestions }
  }

  private checkBasicSyntax(content: string): string[] {
    const errors: string[] = []

    // Check for unmatched brackets
    const openBraces = (content.match(/\{/g) || []).length
    const closeBraces = (content.match(/\}/g) || []).length
    if (openBraces !== closeBraces) {
      errors.push('Unmatched braces')
    }

    // Check for unmatched parentheses
    const openParens = (content.match(/\(/g) || []).length
    const closeParens = (content.match(/\)/g) || []).length
    if (openParens !== closeParens) {
      errors.push('Unmatched parentheses')
    }

    // Check for unterminated strings
    const singleQuotes = (content.match(/'/g) || []).length
    const doubleQuotes = (content.match(/"/g) || []).length
    if (singleQuotes % 2 !== 0 || doubleQuotes % 2 !== 0) {
      errors.push('Unterminated string literal')
    }

    return errors
  }

  private checkUnusedImports(content: string): string[] {
    const unusedImports: string[] = []
    
    // Extract import statements
    const importMatches = content.match(/import\s+.*?\s+from\s+['"].*?['"]/g) || []
    
    for (const importStatement of importMatches) {
      const importedItems = this.extractImportedItems(importStatement)
      
      for (const item of importedItems) {
        // Check if the imported item is used in the code
        const usageRegex = new RegExp(`\\b${item}\\b`, 'g')
        const usageMatches = content.match(usageRegex) || []
        
        // If only found in import statement, it's unused
        if (usageMatches.length <= 1) {
          unusedImports.push(item)
        }
      }
    }
    
    return unusedImports
  }

  private extractImportedItems(importStatement: string): string[] {
    const items: string[] = []
    
    // Handle default imports
    const defaultMatch = importStatement.match(/import\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s+from/)
    if (defaultMatch) {
      items.push(defaultMatch[1])
    }
    
    // Handle named imports
    const namedMatch = importStatement.match(/import\s+\{([^}]+)\}/)
    if (namedMatch) {
      const namedItems = namedMatch[1].split(',').map(item => item.trim().split(' as ')[0])
      items.push(...namedItems)
    }
    
    return items
  }

  async autoFix(structure: GenerationStructure, outputPath: string): Promise<boolean> {
    try {
      const mainAppPath = path.join(outputPath, 'page.tsx')
      
      if (fs.existsSync(mainAppPath)) {
        let content = fs.readFileSync(mainAppPath, 'utf-8')
        
        // Remove natural language comments
        content = this.removeNaturalLanguageText(content)
        
        // Fix common syntax issues
        content = this.fixCommonSyntaxIssues(content)
        
        // Write back the fixed content
        fs.writeFileSync(mainAppPath, content, 'utf-8')
        
        console.log('✅ Auto-fix completed successfully')
        return true
      }
    } catch (error) {
      console.error('❌ Auto-fix failed:', error)
      return false
    }
    
    return false
  }

  private removeNaturalLanguageText(content: string): string {
    // Remove block comments
    content = content.replace(/\/\*[\s\S]*?\*\//g, '')
    
    // Remove line comments
    content = content.replace(/\/\/.*$/gm, '')
    
    // Remove Japanese brackets and parentheses with content
    content = content.replace(/【.*?】/g, '')
    content = content.replace(/（.*?）/g, '')
    
    // Remove common explanation patterns
    content = content.replace(/説明|解説|コメント|Comment|Explanation/g, '')
    
    return content
  }

  private fixCommonSyntaxIssues(content: string): string {
    // Fix missing semicolons
    content = content.replace(/(\w+)\s*\n/g, '$1;\n')
    
    // Fix spacing around operators
    content = content.replace(/([a-zA-Z0-9_$])=([a-zA-Z0-9_$])/g, '$1 = $2')
    
    // Fix proper indentation (basic)
    const lines = content.split('\n')
    let indentLevel = 0
    const fixedLines = lines.map(line => {
      const trimmed = line.trim()
      if (trimmed.includes('}')) indentLevel--
      const indentedLine = '  '.repeat(Math.max(0, indentLevel)) + trimmed
      if (trimmed.includes('{')) indentLevel++
      return indentedLine
    })
    
    return fixedLines.join('\n')
  }
}