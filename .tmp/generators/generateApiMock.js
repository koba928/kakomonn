/**
 * MATURA API Mock Generator
 * モックAPIエンドポイントを自動生成
 */

const GeminiClient = require('../core/geminiClient').default
const FileManager = require('../core/fileManager').default

class ApiMockGenerator {
  constructor(userInput, geminiApiKey) {
    this.userInput = userInput
    this.gemini = new GeminiClient(geminiApiKey)
    this.fileManager = new FileManager()
  }

  async generate() {
    console.log('📡 [API Mock Generator] Starting API generation...')
    console.log(`💡 User Input: ${this.userInput}`)

    try {
      // Generate main API endpoints
      await this.generateMainAPI()
      
      // Generate additional endpoints
      await this.generateAdditionalEndpoints()

      console.log('✅ [API Mock Generator] API generation completed!')
      return {
        success: true,
        files: ['app/api/data/route.ts', 'app/api/actions/route.ts'],
        message: 'API endpoints generated successfully'
      }

    } catch (error) {
      console.error('💥 [API Mock Generator] Generation failed:', error)
      return {
        success: false,
        error: error.message,
        files: []
      }
    }
  }

  async generateMainAPI() {
    const prompt = `
Create a complete Next.js 14 App Router API endpoint for an app based on this user input:

USER INPUT: "${this.userInput}"

Requirements:
1. Use NextRequest and NextResponse
2. Handle GET and POST methods
3. Include proper TypeScript interfaces for request/response
4. Add realistic mock data
5. Include error handling
6. Add proper HTTP status codes
7. Include data validation

Features:
- CRUD operations
- Realistic mock data
- Error handling
- Input validation
- Proper response structure
- TypeScript typed

Return ONLY the complete API route file code.
Make it production-ready with proper error handling.

Generate the main API endpoint (/api/data/route.ts):
`

    try {
      const response = await this.gemini.generate(prompt)
      if (response.success) {
        this.fileManager.saveToApp('api/data/route.ts', response.content)
      }
    } catch (error) {
      console.warn('⚠️ [API Mock Generator] Main API generation failed:', error)
    }
  }

  async generateAdditionalEndpoints() {
    // Generate actions endpoint
    const actionsPrompt = `
Create an actions API endpoint for the app based on: "${this.userInput}"

Requirements:
- Handle POST requests for actions
- Include proper validation
- Return appropriate responses
- TypeScript typed
- Error handling

Return ONLY the API route code for /api/actions/route.ts:
`

    try {
      const actionsResponse = await this.gemini.generate(actionsPrompt)
      if (actionsResponse.success) {
        this.fileManager.saveToApp('api/actions/route.ts', actionsResponse.content)
      }

      // Generate upload endpoint if relevant
      const uploadPrompt = `
Create an upload API endpoint if relevant for: "${this.userInput}"

Requirements:
- Handle file uploads if applicable
- Include validation
- Error handling
- TypeScript typed

Return ONLY the API route code for /api/upload/route.ts:
`

      const uploadResponse = await this.gemini.generate(uploadPrompt)
      if (uploadResponse.success && uploadResponse.content.length > 100) {
        this.fileManager.saveToApp('api/upload/route.ts', uploadResponse.content)
      }

    } catch (error) {
      console.warn('⚠️ [API Mock Generator] Additional endpoints generation failed:', error)
    }
  }

  async generateApiUtils() {
    const utilsPrompt = `
Create API utility functions for the app based on: "${this.userInput}"

Requirements:
- Response helpers
- Validation functions
- Error handling utilities
- TypeScript typed

Return ONLY the utility functions:
`

    try {
      const utilsResponse = await this.gemini.generate(utilsPrompt)
      if (utilsResponse.success) {
        this.fileManager.saveToLib('api/utils.ts', utilsResponse.content)
      }
    } catch (error) {
      console.warn('⚠️ [API Mock Generator] Utils generation failed:', error)
    }
  }
}

module.exports = ApiMockGenerator