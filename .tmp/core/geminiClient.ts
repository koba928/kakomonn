/**
 * MATURA Gemini API Client
 * Gemini APIとの通信を管理
 */

export interface GeminiResponse {
  success: boolean
  content: string
  error?: string
}

export class GeminiClient {
  private apiKey: string
  private baseURL: string = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.GEMINI_API_KEY || ''
    if (!this.apiKey) {
      throw new Error('GEMINI_API_KEY is required')
    }
  }

  async generate(prompt: string, retries: number = 3): Promise<GeminiResponse> {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`🔥 [Gemini] API call attempt ${attempt}/${retries}`)
        
        const response = await fetch(`${this.baseURL}?key=${this.apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.3,
              maxOutputTokens: 8192,
              topP: 0.8,
              topK: 10
            }
          })
        })

        if (!response.ok) {
          throw new Error(`Gemini API error: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
        
        if (!content) {
          throw new Error('Empty response from Gemini API')
        }

        console.log(`✅ [Gemini] API call successful (${content.length} chars)`)
        
        return {
          success: true,
          content: this.extractCode(content)
        }

      } catch (error) {
        console.warn(`⚠️ [Gemini] Attempt ${attempt} failed:`, error)
        
        if (attempt === retries) {
          return {
            success: false,
            content: '',
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
      }
    }

    return {
      success: false,
      content: '',
      error: 'All retry attempts failed'
    }
  }

  private extractCode(response: string): string {
    // Extract code from markdown code blocks
    const codeBlockRegex = /```(?:typescript|tsx|ts|javascript|jsx|js)?\n([\s\S]*?)\n```/g
    const matches = response.match(codeBlockRegex)
    
    if (matches && matches.length > 0) {
      return matches[0]
        .replace(/```(?:typescript|tsx|ts|javascript|jsx|js)?\n?/g, '')
        .replace(/\n```$/g, '')
        .trim()
    }

    // If no code blocks found, return the whole response
    return response.trim()
  }
}

export default GeminiClient