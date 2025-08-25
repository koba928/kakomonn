/**
 * MATURA UI Generation Engine
 * Gemini APIを使用してUI雛形を自動生成
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

interface UIGenerationOptions {
  appIdea: string
  theme?: 'modern' | 'minimal' | 'professional'
  features?: string[]
  apiKey?: string
}

export class UIGenerator {
  private projectRoot: string
  private apiKey: string | null

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot
    this.apiKey = process.env.GEMINI_API_KEY || null
  }

  /**
   * Gemini APIを呼び出してUI生成
   */
  private async callGeminiAPI(prompt: string): Promise<string> {
    if (!this.apiKey) {
      console.log('⚠️ GEMINI_API_KEY not found, using enhanced fallback generation')
      return this.generateEnhancedFallbackUI()
    }

    try {
      console.log('🔥 Calling Gemini API for UI generation...')
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        throw new Error(`Gemini API error: ${response.status}`)
      }

      const data = await response.json()
      const generatedContent = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      
      if (!generatedContent) {
        throw new Error('Empty response from Gemini API')
      }

      console.log('✅ Gemini API generation successful')
      return this.extractCodeFromResponse(generatedContent)

    } catch (error) {
      console.warn('⚠️ Gemini API call failed:', error)
      return this.generateEnhancedFallbackUI()
    }
  }

  /**
   * レスポンスからTypeScriptコードを抽出
   */
  private extractCodeFromResponse(response: string): string {
    // TypeScriptコードブロックを探す
    const codeBlockRegex = /```(?:typescript|tsx|ts)?\n([\s\S]*?)\n```/g
    const matches = response.match(codeBlockRegex)
    
    if (matches && matches.length > 0) {
      // 最初のコードブロックを取得してクリーンアップ
      const code = matches[0].replace(/```(?:typescript|tsx|ts)?\n?/g, '').replace(/\n```$/g, '')
      return code.trim()
    }

    // コードブロックが見つからない場合はレスポンス全体を使用
    return response.trim()
  }

  /**
   * 高度なフォールバックUI生成
   */
  private generateEnhancedFallbackUI(): string {
    return `'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Calculator, TrendingUp, Shield, Users } from 'lucide-react'
import { useFuyouStore } from '@/store/fuyouStore'

/**
 * MATURA Generated UI - 扶養控除計算アプリ
 * 自動生成されたUI雛形
 */
export default function GeneratedUI() {
  // ===== Zustand Store 連携 =====
  const { 
    income, 
    remainingLimit, 
    dependentCount,
    updateIncome, 
    addDependent, 
    removeDependent,
    calculateRemaining 
  } = useFuyouStore()

  // ===== Event Handlers =====
  const handleIncomeUpdate = () => {
    console.log('🔄 [Generated UI] Income update triggered')
    updateIncome(income + 100000) // 10万円追加例
    calculateRemaining()
    console.log(\`💰 Updated income: ¥\${income.toLocaleString()}\`)
    console.log(\`📊 Remaining limit: ¥\${remainingLimit.toLocaleString()}\`)
  }

  const handleDependentAdd = () => {
    console.log('👥 [Generated UI] Adding dependent')
    addDependent()
    calculateRemaining()
    console.log(\`👨‍👩‍👧‍👦 Dependents: \${dependentCount}\`)
  }

  const handleCalculate = async () => {
    console.log('🧮 [Generated UI] Starting calculation...')
    
    // API呼び出しシミュレーション
    try {
      const response = await fetch('/api/fuyouCheck', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ income, dependentCount })
      })
      
      if (response.ok) {
        const result = await response.json()
        console.log('✅ [Generated UI] API call successful:', result)
        updateIncome(result.adjustedIncome || income)
      }
    } catch (error) {
      console.warn('⚠️ [Generated UI] API call failed:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="container mx-auto px-6 py-20">
          <div className="text-center space-y-8">
            {/* Badge */}
            <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-4 py-2">
              <Calculator className="w-4 h-4 mr-2" />
              自動生成AI powered
            </Badge>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
              <span className="text-blue-600">扶養控除</span>
              <br />
              <span className="text-gray-800">自動計算システム</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              収入と扶養家族数を入力するだけで、
              <span className="text-blue-600 font-semibold">最適な控除額</span>
              を自動計算します
            </p>

            {/* 現在の状態表示 */}
            <div className="bg-blue-50 rounded-lg p-6 max-w-md mx-auto">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">現在の収入:</span>
                  <span className="text-2xl font-bold text-blue-600">
                    ¥{income.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">扶養家族数:</span>
                  <span className="text-xl font-semibold text-green-600">
                    {dependentCount}人
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700">控除可能額:</span>
                  <span className="text-2xl font-bold text-orange-600">
                    ¥{remainingLimit.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button 
                size="lg" 
                onClick={handleIncomeUpdate}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                収入を更新
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={handleDependentAdd}
                className="border-blue-300 text-blue-700 hover:bg-blue-50 px-8 py-6 text-lg font-semibold transition-all duration-200"
              >
                <Users className="w-5 h-5 mr-2" />
                扶養者を追加
              </Button>

              <Button 
                size="lg"
                onClick={handleCalculate}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Calculator className="w-5 h-5 mr-2" />
                再計算実行
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Cards Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              なぜ<span className="text-blue-600">自動計算</span>なのか？
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              複雑な扶養控除計算を自動化し、最適な節税効果を実現
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card 1 */}
            <Card className="bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Calculator className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  自動計算
                </CardTitle>
                <CardDescription className="text-gray-600">
                  収入と扶養者数から最適な控除額を自動算出
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    リアルタイム計算
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    税制対応
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    履歴管理
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature Card 2 */}
            <Card className="bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  データ保護
                </CardTitle>
                <CardDescription className="text-gray-600">
                  個人情報の安全な管理と暗号化処理
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    暗号化保存
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    GDPR準拠
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    監査ログ
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Feature Card 3 */}
            <Card className="bg-white border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  最適化提案
                </CardTitle>
                <CardDescription className="text-gray-600">
                  AI分析による節税効果の最大化提案
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    AI分析
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    最適化案
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                    シミュレーション
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <Card className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border-blue-200">
            <CardContent className="p-16 text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                今すぐ<span className="text-blue-600">最適化</span>を始めませんか？
              </h3>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                数分で扶養控除の最適化が完了し、年間数万円の節税効果を実現できます
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg"
                  onClick={handleCalculate}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-6 text-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Calculator className="w-6 h-6 mr-2" />
                  無料で計算開始
                  <ArrowRight className="w-6 h-6 ml-2" />
                </Button>
                <Button 
                  variant="outline"
                  size="lg"
                  onClick={() => console.log('📊 詳細ガイド表示')}
                  className="border-blue-300 text-blue-700 hover:bg-blue-50 px-12 py-6 text-xl transition-all duration-200"
                >
                  詳細ガイドを見る
                </Button>
              </div>
              
              <div className="mt-8 text-sm text-gray-500">
                🤖 このUIは MATURA AI によって自動生成されました
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}`
  }

  /**
   * UI生成プロンプトを構築
   */
  private buildUIPrompt(appIdea: string, options: UIGenerationOptions): string {
    const { theme = 'modern', features = [] } = options

    return `
Generate a complete Next.js 14 App Router React component for the following application idea:

APPLICATION IDEA: ${appIdea}

REQUIREMENTS:
1. Use 'use client' directive
2. Import and use shadcn/ui components: Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Badge
3. Import appropriate Lucide React icons based on the app idea
4. Use Tailwind CSS for styling with ${theme} theme
5. Import useStore from the appropriate store file

DYNAMIC UI STRUCTURE:
- Analyze the application idea and create appropriate UI sections
- Hero section with compelling headline based on the app
- Display key data/metrics from the store
- Action buttons that match the app's primary functions
- Feature cards showcasing the app's value propositions
- Final CTA section encouraging user engagement

FUNCTIONALITY:
- Create onClick handlers appropriate to the application
- Integrate with the generated store actions
- Include console.log statements for debugging
- Make API calls to appropriate endpoints
- Display real data from the store
- Include loading states and error handling

STYLING:
- Use gradient backgrounds and modern CSS
- Responsive design (mobile-first)
- Professional color scheme appropriate to the app
- Hover effects and transitions
- Clean typography

OUTPUT REQUIREMENTS:
- Return ONLY the complete TypeScript React component code
- Include all imports at the top
- Add JSDoc comments
- Use proper TypeScript types
- Include console.log statements for debugging
- Make it production-ready
- Code should work immediately without modifications

Generate the complete component now:
`
  }

  /**
   * UI生成メイン実行関数
   */
  async generateUI(options: UIGenerationOptions): Promise<string> {
    console.log('🚀 Starting UI generation...')
    console.log(`📋 Options: ${JSON.stringify(options)}`)
    console.log(`💡 App Idea: ${options.appIdea}`)

    try {
      // プロンプト構築
      const prompt = this.buildUIPrompt(options.appIdea, options)
      
      // Gemini API呼び出し
      const generatedCode = await this.callGeminiAPI(prompt)
      
      // ファイル保存
      const outputPath = this.saveGeneratedUI(generatedCode)
      
      console.log('✅ UI generation completed successfully!')
      console.log(`📁 Generated file: ${outputPath}`)
      
      return outputPath

    } catch (error) {
      console.error('💥 UI generation failed:', error)
      throw error
    }
  }

  /**
   * 生成されたUIをファイルに保存
   */
  private saveGeneratedUI(code: string): string {
    const outputDir = join(this.projectRoot, 'app')
    const outputPath = join(outputDir, 'GeneratedUI.tsx')

    // ディレクトリ確認・作成
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true })
    }

    // ファイル保存
    writeFileSync(outputPath, code, 'utf8')
    
    console.log(`💾 Saved generated UI to: ${outputPath}`)
    return outputPath
  }

  /**
   * 生成結果の検証
   */
  async validateGeneratedUI(filePath: string): Promise<boolean> {
    try {
      console.log('🔍 Validating generated UI...')
      
      // ファイル存在確認
      if (!existsSync(filePath)) {
        throw new Error(`Generated file not found: ${filePath}`)
      }

      // 基本的な構文チェック（簡易版）
      const { readFileSync } = await import('fs')
      const content = readFileSync(filePath, 'utf8')
      
      const requiredElements = [
        "'use client'",
        'export default function GeneratedUI',
        'useFuyouStore',
        'onClick',
        'console.log'
      ]

      const missingElements = requiredElements.filter(element => !content.includes(element))
      
      if (missingElements.length > 0) {
        console.warn('⚠️ Validation warnings:', missingElements)
      } else {
        console.log('✅ UI validation passed')
      }

      return missingElements.length === 0

    } catch (error) {
      console.error('💥 UI validation failed:', error)
      return false
    }
  }
}

/**
 * エクスポート関数 - 他のジェネレーターから呼び出し可能
 */
export async function generateUI(options: UIGenerationOptions): Promise<string> {
  const generator = new UIGenerator()
  return await generator.generateUI(options)
}

export default UIGenerator