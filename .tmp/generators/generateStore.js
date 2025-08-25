/**
 * MATURA Store Generator
 * 状態管理ファイルを自動生成
 */

const GeminiClient = require('../core/geminiClient').default
const FileManager = require('../core/fileManager').default

class StoreGenerator {
  constructor(userInput, geminiApiKey) {
    this.userInput = userInput
    this.gemini = new GeminiClient(geminiApiKey)
    this.fileManager = new FileManager()
  }

  async generate() {
    console.log('🗄️ [Store Generator] Starting store generation...')
    console.log(`💡 User Input: ${this.userInput}`)

    try {
      // Build prompt
      const prompt = this.buildStorePrompt(this.userInput)
      
      // Call Gemini API
      const response = await this.gemini.generate(prompt)
      
      if (!response.success) {
        throw new Error(`Gemini API failed: ${response.error}`)
      }

      // Save store file
      const storeResult = this.fileManager.saveToLib('store/useAppStore.ts', response.content)
      if (!storeResult.success) {
        throw new Error(`Failed to save store: ${storeResult.error}`)
      }

      // Generate additional store utilities
      await this.generateStoreUtils()

      console.log('✅ [Store Generator] Store generation completed!')
      return {
        success: true,
        files: [storeResult.filePath],
        content: response.content
      }

    } catch (error) {
      console.error('💥 [Store Generator] Generation failed:', error)
      return {
        success: false,
        error: error.message,
        files: []
      }
    }
  }

  buildStorePrompt(userInput) {
    return `
Create a complete Zustand store for an app based on this user input:

USER INPUT: "${userInput}"

Requirements:
1. Use Zustand with TypeScript
2. Include devtools and persist middleware
3. Analyze the user input and create appropriate state structure
4. Add proper interfaces and types
5. Include CRUD operations for main entities
6. Add loading states and error handling
7. Include proper TypeScript typing throughout

Store Features:
- State properties based on the app requirements
- Actions for all main operations
- Async operations where needed
- Error handling
- Loading states
- Reset functionality

Return ONLY the complete TypeScript Zustand store code.
Include all necessary imports and make it production-ready.

Generate the store now:
`
  }

  async generateStoreUtils() {
    try {
      // Generate store types
      const typesPrompt = `
Create TypeScript interfaces and types for the app store based on: "${this.userInput}"

Requirements:
- Export all interfaces
- Proper TypeScript typing
- Include entity types and store types
- Add utility types if needed

Return ONLY the TypeScript interface definitions:
`

      const typesResponse = await this.gemini.generate(typesPrompt)
      if (typesResponse.success) {
        this.fileManager.saveToLib('store/types.ts', typesResponse.content)
      }

      // Generate store selectors
      const selectorsPrompt = `
Create Zustand selectors for the app store based on: "${this.userInput}"

Requirements:
- Create optimized selectors
- TypeScript typed
- Performance optimized
- Export all selectors

Return ONLY the selector functions:
`

      const selectorsResponse = await this.gemini.generate(selectorsPrompt)
      if (selectorsResponse.success) {
        this.fileManager.saveToLib('store/selectors.ts', selectorsResponse.content)
      }

    } catch (error) {
      console.warn('⚠️ [Store Generator] Utils generation failed:', error)
    }
  }
}

module.exports = StoreGenerator