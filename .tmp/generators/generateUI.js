/**
 * MATURA UI Generator
 * UIコンポーネントを自動生成
 */

const GeminiClient = require('../core/geminiClient').default
const FileManager = require('../core/fileManager').default

class UIGenerator {
  constructor(userInput, geminiApiKey) {
    this.userInput = userInput
    this.gemini = new GeminiClient(geminiApiKey)
    this.fileManager = new FileManager()
  }

  async generate() {
    console.log('🎨 [UI Generator] Starting UI generation...')
    console.log(`💡 User Input: ${this.userInput}`)

    try {
      // Build prompt
      const prompt = this.buildUIPrompt(this.userInput)
      
      // Call Gemini API
      const response = await this.gemini.generate(prompt)
      
      if (!response.success) {
        throw new Error(`Gemini API failed: ${response.error}`)
      }

      // Save main page
      const mainPageResult = this.fileManager.saveToApp('page.tsx', response.content)
      if (!mainPageResult.success) {
        throw new Error(`Failed to save main page: ${mainPageResult.error}`)
      }

      // Generate additional components
      await this.generateComponents()

      console.log('✅ [UI Generator] UI generation completed!')
      return {
        success: true,
        files: [mainPageResult.filePath],
        content: response.content
      }

    } catch (error) {
      console.error('💥 [UI Generator] Generation failed:', error)
      return {
        success: false,
        error: error.message,
        files: []
      }
    }
  }

  buildUIPrompt(userInput) {
    return `
Create a complete Next.js 14 App Router page component based on this user input:

USER INPUT: "${userInput}"

Requirements:
1. Use 'use client' directive
2. Create a modern, responsive React component
3. Use Tailwind CSS for styling
4. Include appropriate sections (Hero, Features, CTA, etc.)
5. Add proper TypeScript types
6. Include interactive elements with onClick handlers
7. Use modern UI patterns and good UX

Structure:
- Hero section with compelling headline
- Feature cards or sections
- Call-to-action buttons
- Responsive design
- Professional styling

Return ONLY the complete TypeScript React component code.
Make it production-ready and visually appealing.

Generate the page.tsx component now:
`
  }

  async generateComponents() {
    try {
      // Generate Hero component
      const heroPrompt = `
Create a Hero component for the app based on: "${this.userInput}"

Requirements:
- TypeScript React component
- Modern gradient design
- Responsive layout
- Call-to-action button
- Professional typography

Return ONLY the component code:
`

      const heroResponse = await this.gemini.generate(heroPrompt)
      if (heroResponse.success) {
        this.fileManager.saveToApp('components/Hero.tsx', heroResponse.content)
      }

      // Generate Features component
      const featuresPrompt = `
Create a Features component for the app based on: "${this.userInput}"

Requirements:
- TypeScript React component
- Grid layout with feature cards
- Icons and descriptions
- Responsive design
- Tailwind CSS styling

Return ONLY the component code:
`

      const featuresResponse = await this.gemini.generate(featuresPrompt)
      if (featuresResponse.success) {
        this.fileManager.saveToApp('components/Features.tsx', featuresResponse.content)
      }

    } catch (error) {
      console.warn('⚠️ [UI Generator] Component generation failed:', error)
    }
  }
}

module.exports = UIGenerator