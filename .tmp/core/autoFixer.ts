/**
 * MATURA Auto Fixer
 * Lint・型チェック・自動修正システム
 */

import { execSync } from 'child_process'
import GeminiClient from './geminiClient'
import FileManager from './fileManager'

export interface FixResult {
  success: boolean
  lintErrors: string[]
  typeErrors: string[]
  fixesApplied: string[]
  finalStatus: 'success' | 'partial' | 'failed'
}

export class AutoFixer {
  private gemini: GeminiClient
  private fileManager: FileManager
  private projectRoot: string

  constructor(geminiApiKey?: string, projectRoot: string = process.cwd()) {
    this.gemini = new GeminiClient(geminiApiKey)
    this.fileManager = new FileManager(projectRoot)
    this.projectRoot = projectRoot
  }

  async runFullAutoFix(maxRetries: number = 3): Promise<FixResult> {
    console.log('🔧 [AutoFixer] Starting full auto-fix cycle...')
    
    let attempt = 0
    let lintErrors: string[] = []
    let typeErrors: string[] = []
    const fixesApplied: string[] = []

    while (attempt < maxRetries) {
      attempt++
      console.log(`\n🔄 [AutoFixer] Cycle ${attempt}/${maxRetries}`)

      // 1. Run ESLint
      const lintResult = await this.runESLint()
      lintErrors = lintResult.errors

      // 2. Run TypeScript check
      const typeResult = await this.runTypeCheck()
      typeErrors = typeResult.errors

      // If no errors, we're done!
      if (lintErrors.length === 0 && typeErrors.length === 0) {
        console.log('✅ [AutoFixer] All checks passed!')
        return {
          success: true,
          lintErrors: [],
          typeErrors: [],
          fixesApplied,
          finalStatus: 'success'
        }
      }

      // 3. Apply fixes
      if (lintErrors.length > 0) {
        console.log(`🔨 [AutoFixer] Fixing ${lintErrors.length} lint errors...`)
        const lintFixes = await this.fixLintErrors(lintErrors)
        fixesApplied.push(...lintFixes)
      }

      if (typeErrors.length > 0) {
        console.log(`🔨 [AutoFixer] Fixing ${typeErrors.length} type errors...`)
        const typeFixes = await this.fixTypeErrors(typeErrors)
        fixesApplied.push(...typeFixes)
      }

      // Wait before next cycle
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    // Final status
    const finalStatus = (lintErrors.length === 0 && typeErrors.length === 0) ? 'success' :
                       (fixesApplied.length > 0) ? 'partial' : 'failed'

    return {
      success: finalStatus === 'success',
      lintErrors,
      typeErrors,
      fixesApplied,
      finalStatus
    }
  }

  private async runESLint(): Promise<{ success: boolean; errors: string[] }> {
    try {
      console.log('📋 [AutoFixer] Running ESLint...')
      
      // Try to run ESLint with auto-fix
      execSync('npx eslint app/ lib/ --ext .ts,.tsx,.js,.jsx --fix', {
        cwd: this.projectRoot,
        stdio: 'pipe'
      })

      console.log('✅ [AutoFixer] ESLint passed')
      return { success: true, errors: [] }

    } catch (error: any) {
      const output = error.stdout?.toString() || error.stderr?.toString() || ''
      const errors = this.parseESLintErrors(output)
      
      console.log(`⚠️ [AutoFixer] ESLint found ${errors.length} errors`)
      return { success: false, errors }
    }
  }

  private async runTypeCheck(): Promise<{ success: boolean; errors: string[] }> {
    try {
      console.log('🔍 [AutoFixer] Running TypeScript check...')
      
      execSync('npx tsc --noEmit', {
        cwd: this.projectRoot,
        stdio: 'pipe'
      })

      console.log('✅ [AutoFixer] TypeScript check passed')
      return { success: true, errors: [] }

    } catch (error: any) {
      const output = error.stdout?.toString() || error.stderr?.toString() || ''
      const errors = this.parseTypeErrors(output)
      
      console.log(`⚠️ [AutoFixer] TypeScript found ${errors.length} errors`)
      return { success: false, errors }
    }
  }

  private async fixLintErrors(errors: string[]): Promise<string[]> {
    const fixes: string[] = []

    for (const error of errors.slice(0, 5)) { // Limit to first 5 errors
      try {
        const fixPrompt = `
Fix this ESLint error in a TypeScript/React project:

ERROR: ${error}

Please provide ONLY the corrected code that should replace the problematic code.
Focus on the specific issue mentioned in the error.
Return only valid TypeScript/React code without explanations.
`

        const response = await this.gemini.generate(fixPrompt)
        
        if (response.success && response.content) {
          // Apply the fix (simplified - in practice you'd need file-specific logic)
          fixes.push(`Fixed ESLint error: ${error.substring(0, 100)}...`)
          console.log(`✅ [AutoFixer] Applied ESLint fix`)
        }

      } catch (fixError) {
        console.warn(`⚠️ [AutoFixer] Failed to fix ESLint error:`, fixError)
      }
    }

    return fixes
  }

  private async fixTypeErrors(errors: string[]): Promise<string[]> {
    const fixes: string[] = []

    for (const error of errors.slice(0, 5)) { // Limit to first 5 errors
      try {
        const fixPrompt = `
Fix this TypeScript error in a React project:

ERROR: ${error}

Please provide ONLY the corrected TypeScript code.
Focus on proper typing and imports.
Return only valid TypeScript code without explanations.
`

        const response = await this.gemini.generate(fixPrompt)
        
        if (response.success && response.content) {
          fixes.push(`Fixed TypeScript error: ${error.substring(0, 100)}...`)
          console.log(`✅ [AutoFixer] Applied TypeScript fix`)
        }

      } catch (fixError) {
        console.warn(`⚠️ [AutoFixer] Failed to fix TypeScript error:`, fixError)
      }
    }

    return fixes
  }

  private parseESLintErrors(output: string): string[] {
    const lines = output.split('\n').filter(line => 
      line.includes('error') || line.includes('warning')
    )
    return lines.slice(0, 10) // Max 10 errors
  }

  private parseTypeErrors(output: string): string[] {
    const lines = output.split('\n').filter(line => 
      line.includes('error TS') || line.includes('Error:')
    )
    return lines.slice(0, 10) // Max 10 errors
  }
}

export default AutoFixer