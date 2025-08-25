/**
 * MATURA Handlers Generator
 * イベントハンドラーとロジックを自動生成
 */

const GeminiClient = require('../core/geminiClient').default
const FileManager = require('../core/fileManager').default

class HandlersGenerator {
  constructor(userInput, geminiApiKey) {
    this.userInput = userInput
    this.gemini = new GeminiClient(geminiApiKey)
    this.fileManager = new FileManager()
  }

  async generate() {
    console.log('⚡ [Handlers Generator] Starting handlers generation...')
    console.log(`💡 User Input: ${this.userInput}`)

    try {
      // Build prompt
      const prompt = this.buildHandlersPrompt(this.userInput)
      
      // Call Gemini API
      const response = await this.gemini.generate(prompt)
      
      if (!response.success) {
        throw new Error(`Gemini API failed: ${response.error}`)
      }

      // Save handlers file
      const handlersResult = this.fileManager.saveToLib('handlers/useHandlers.ts', response.content)
      if (!handlersResult.success) {
        throw new Error(`Failed to save handlers: ${handlersResult.error}`)
      }

      // Generate additional handler utilities
      await this.generateHandlerUtils()

      console.log('✅ [Handlers Generator] Handlers generation completed!')
      return {
        success: true,
        files: [handlersResult.filePath],
        content: response.content
      }

    } catch (error) {
      console.error('💥 [Handlers Generator] Generation failed:', error)
      return {
        success: false,
        error: error.message,
        files: []
      }
    }
  }

  buildHandlersPrompt(userInput) {
    return `
Create comprehensive event handlers and custom hooks for an app based on this user input:

USER INPUT: "${userInput}"

Requirements:
1. Create custom React hooks for different handler categories
2. Integrate with the app store (useAppStore)
3. Include proper TypeScript typing
4. Add error handling and loading states
5. Include console.log statements for debugging
6. Create handlers for all main operations

Handler Categories:
- CRUD operation handlers
- Form submission handlers
- UI interaction handlers
- API call handlers
- Validation handlers
- State update handlers

Features:
- Proper error handling
- Loading states
- Optimistic updates
- Event handlers (onClick, onSubmit, etc.)
- Custom hooks for reusability
- Integration with store actions

Return ONLY the complete TypeScript custom hooks code.
Include all necessary imports and make it production-ready.

Generate the handlers now:
`
  }

  async generateHandlerUtils() {
    try {
      // Generate validation utilities
      const validationPrompt = `
Create validation utilities for the app based on: "${this.userInput}"

Requirements:
- Form validation functions
- Data validation utilities
- TypeScript typed
- Error message handling

Return ONLY the validation utility functions:
`

      const validationResponse = await this.gemini.generate(validationPrompt)
      if (validationResponse.success) {
        this.fileManager.saveToLib('handlers/validation.ts', validationResponse.content)
      }

      // Generate helper functions
      const helpersPrompt = `
Create helper functions for the app handlers based on: "${this.userInput}"

Requirements:
- Utility functions for common operations
- Data transformation helpers
- TypeScript typed
- Reusable functions

Return ONLY the helper functions:
`

      const helpersResponse = await this.gemini.generate(helpersPrompt)
      if (helpersResponse.success) {
        this.fileManager.saveToLib('handlers/helpers.ts', helpersResponse.content)
      }

    } catch (error) {
      console.warn('⚠️ [Handlers Generator] Utils generation failed:', error)
    }
  }
}

module.exports = HandlersGenerator