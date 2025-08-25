/**
 * MATURA API Mock Generation Engine
 * モックAPIエンドポイントを自動生成
 */

import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

interface ApiMockGenerationOptions {
  appIdea: string
  apiType?: 'rest' | 'graphql'
  responseDelay?: number
  includeErrorScenarios?: boolean
  apiKey?: string
}

export class ApiMockGenerator {
  private projectRoot: string
  private apiKey: string | null

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot
    this.apiKey = process.env.GEMINI_API_KEY || null
  }

  /**
   * Gemini APIを呼び出してAPI Mock生成
   */
  private async callGeminiAPI(prompt: string): Promise<string> {
    if (!this.apiKey) {
      console.log('⚠️ GEMINI_API_KEY not found, using enhanced fallback generation')
      return this.generateEnhancedFallbackApiMock()
    }

    try {
      console.log('🔥 Calling Gemini API for API Mock generation...')
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 4096,
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

      console.log('✅ Gemini API Mock generation successful')
      return this.extractCodeFromResponse(generatedContent)

    } catch (error) {
      console.warn('⚠️ Gemini API call failed:', error)
      return this.generateEnhancedFallbackApiMock()
    }
  }

  /**
   * レスポンスからTypeScriptコードを抽出
   */
  private extractCodeFromResponse(response: string): string {
    const codeBlockRegex = /```(?:typescript|tsx|ts)?\\n([\\s\\S]*?)\\n```/g
    const matches = response.match(codeBlockRegex)
    
    if (matches && matches.length > 0) {
      const code = matches[0].replace(/```(?:typescript|tsx|ts)?\\n?/g, '').replace(/\\n```$/g, '')
      return code.trim()
    }

    return response.trim()
  }

  /**
   * 高度なフォールバックAPI Mock生成
   */
  private generateEnhancedFallbackApiMock(): string {
    return `/**
 * MATURA Generated API Mock - 扶養控除計算API
 * 自動生成されたモックAPIエンドポイント
 */

import { NextRequest, NextResponse } from 'next/server'

// ===== 型定義 =====

export interface FuyouCheckRequest {
  income: number
  dependentCount: number
  dependents?: Array<{
    name: string
    age: number
    relationship: '配偶者' | '子' | '親' | 'その他'
    income: number
  }>
  taxYear?: number
  source?: string
  timestamp?: string
}

export interface FuyouCheckResponse {
  success: boolean
  requestId: string
  calculatedAt: string
  
  // 入力データ
  input: {
    income: number
    dependentCount: number
    taxYear: number
  }
  
  // 計算結果
  calculation: {
    basicDeduction: number // 基礎控除
    dependentDeduction: number // 扶養控除
    spouseDeduction: number // 配偶者控除
    totalDeduction: number // 総控除額
    taxableIncome: number // 課税所得
    estimatedTax: number // 推定税額
    estimatedSavings: number // 推定節税額
  }
  
  // 調整後の値
  adjustedIncome: number
  remainingLimit: number
  
  // 詳細分析
  analysis: {
    optimizationSuggestions: string[]
    riskFactors: string[]
    complianceNotes: string[]
  }
  
  // API情報
  apiInfo: {
    version: string
    processingTime: number
    nextUpdate?: string
  }
  
  // エラー情報（失敗時）
  error?: {
    code: string
    message: string
    details?: any
  }
}

// ===== 計算ユーティリティ関数 =====

/**
 * 基礎控除額を計算
 */
function calculateBasicDeduction(income: number, taxYear: number = 2024): number {
  // 令和4年度以降の基礎控除
  if (income <= 24000000) {
    return 480000 // 48万円
  } else if (income <= 24500000) {
    return 320000 // 32万円
  } else if (income <= 25000000) {
    return 160000 // 16万円
  }
  return 0 // 2500万円超は基礎控除なし
}

/**
 * 扶養控除額を計算
 */
function calculateDependentDeduction(dependentCount: number, dependents: any[] = []): number {
  if (dependentCount === 0) return 0
  
  let totalDeduction = 0
  
  // 実際の扶養者情報がある場合
  if (dependents.length > 0) {
    dependents.forEach(dependent => {
      let deduction = 380000 // 基本控除額38万円
      
      // 特定扶養親族（19歳以上23歳未満）
      if (dependent.age >= 19 && dependent.age < 23) {
        deduction = 630000 // 63万円
      }
      // 老人扶養親族（70歳以上）
      else if (dependent.age >= 70) {
        deduction = 480000 // 48万円
      }
      
      totalDeduction += deduction
    })
  } else {
    // 扶養者数のみの場合（平均的な控除額で計算）
    totalDeduction = dependentCount * 380000
  }
  
  return totalDeduction
}

/**
 * 配偶者控除額を計算
 */
function calculateSpouseDeduction(income: number, dependents: any[] = []): number {
  const spouse = dependents.find(d => d.relationship === '配偶者')
  if (!spouse || spouse.income > 1030000) {
    return 0 // 配偶者控除なし
  }
  
  // 所得に応じた配偶者控除額
  if (income <= 9000000) {
    return spouse.age >= 70 ? 480000 : 380000
  } else if (income <= 9500000) {
    return spouse.age >= 70 ? 320000 : 260000
  } else if (income <= 10000000) {
    return spouse.age >= 70 ? 160000 : 130000
  }
  
  return 0
}

/**
 * 課税所得と推定税額を計算
 */
function calculateTaxDetails(income: number, totalDeduction: number) {
  const taxableIncome = Math.max(0, income - totalDeduction)
  
  // 簡易的な累進税率計算（所得税のみ）
  let estimatedTax = 0
  
  if (taxableIncome <= 1950000) {
    estimatedTax = taxableIncome * 0.05
  } else if (taxableIncome <= 3300000) {
    estimatedTax = 97500 + (taxableIncome - 1950000) * 0.1
  } else if (taxableIncome <= 6950000) {
    estimatedTax = 232500 + (taxableIncome - 3300000) * 0.2
  } else if (taxableIncome <= 9000000) {
    estimatedTax = 962500 + (taxableIncome - 6950000) * 0.23
  } else if (taxableIncome <= 18000000) {
    estimatedTax = 1434000 + (taxableIncome - 9000000) * 0.33
  } else {
    estimatedTax = 4404000 + (taxableIncome - 18000000) * 0.4
  }
  
  return { taxableIncome, estimatedTax }
}

/**
 * 最適化提案を生成
 */
function generateOptimizationSuggestions(income: number, dependentCount: number, calculation: any): string[] {
  const suggestions: string[] = []
  
  // 収入別提案
  if (income >= 8000000) {
    suggestions.push('高所得者向け：iDeCo（個人型確定拠出年金）の活用を検討')
    suggestions.push('ふるさと納税の上限額を最大限活用')
  }
  
  if (income >= 5000000) {
    suggestions.push('医療費控除：年間10万円超の医療費がある場合は申告')
    suggestions.push('住宅ローン控除の適用状況を確認')
  }
  
  // 扶養者数別提案
  if (dependentCount === 0) {
    suggestions.push('結婚・出産により扶養者が増える場合の控除額をシミュレーション')
  } else if (dependentCount >= 3) {
    suggestions.push('多子世帯向け：教育費の非課税制度の活用を検討')
  }
  
  // 節税額別提案
  if (calculation.estimatedSavings > 100000) {
    suggestions.push('年間10万円以上の節税効果：税理士への相談を推奨')
  }
  
  return suggestions
}

// ===== メインAPI関数 =====

export async function POST(request: NextRequest): Promise<NextResponse> {
  const startTime = Date.now()
  const requestId = \`req_\${Date.now()}_\${Math.random().toString(36).substring(2, 11)}\`
  
  console.log(\`📡 [API Mock] Processing request \${requestId}\`)
  
  try {
    // リクエストデータの解析
    const requestData: FuyouCheckRequest = await request.json()
    
    console.log('📋 [API Mock] Request data:', {
      income: requestData.income,
      dependentCount: requestData.dependentCount,
      source: requestData.source
    })
    
    // 入力検証
    if (!requestData.income || requestData.income < 0) {
      console.warn('⚠️ [API Mock] Invalid income value')
      return NextResponse.json({
        success: false,
        requestId,
        calculatedAt: new Date().toISOString(),
        error: {
          code: 'INVALID_INCOME',
          message: '収入額が正しくありません',
          details: { income: requestData.income }
        }
      }, { status: 400 })
    }
    
    if (requestData.dependentCount < 0) {
      console.warn('⚠️ [API Mock] Invalid dependent count')
      return NextResponse.json({
        success: false,
        requestId,
        calculatedAt: new Date().toISOString(),
        error: {
          code: 'INVALID_DEPENDENT_COUNT',
          message: '扶養者数が正しくありません',
          details: { dependentCount: requestData.dependentCount }
        }
      }, { status: 400 })
    }
    
    // API処理遅延をシミュレーション（300-1200ms）
    const processingDelay = Math.random() * 900 + 300
    await new Promise(resolve => setTimeout(resolve, processingDelay))
    
    // 税額計算実行
    const taxYear = requestData.taxYear || new Date().getFullYear()
    const basicDeduction = calculateBasicDeduction(requestData.income, taxYear)
    const dependentDeduction = calculateDependentDeduction(
      requestData.dependentCount, 
      requestData.dependents
    )
    const spouseDeduction = calculateSpouseDeduction(
      requestData.income, 
      requestData.dependents
    )
    
    const totalDeduction = basicDeduction + dependentDeduction + spouseDeduction
    const { taxableIncome, estimatedTax } = calculateTaxDetails(requestData.income, totalDeduction)
    
    // 調整後収入の計算（±5%のランダム調整をシミュレーション）
    const adjustmentFactor = 0.95 + Math.random() * 0.1 // 0.95-1.05
    const adjustedIncome = Math.round(requestData.income * adjustmentFactor)
    
    // 節税額の計算
    const estimatedSavings = totalDeduction * 0.2 // 概算20%の税率で計算
    
    // 残り控除可能額の計算
    const maxDeductionLimit = requestData.income * 0.4 // 収入の40%を上限と仮定
    const remainingLimit = Math.max(0, maxDeductionLimit - totalDeduction)
    
    // 計算結果オブジェクト
    const calculation = {
      basicDeduction,
      dependentDeduction,
      spouseDeduction,
      totalDeduction,
      taxableIncome,
      estimatedTax,
      estimatedSavings
    }
    
    // 分析結果の生成
    const analysis = {
      optimizationSuggestions: generateOptimizationSuggestions(
        requestData.income, 
        requestData.dependentCount, 
        calculation
      ),
      riskFactors: [
        '税制改正による控除額の変更可能性',
        '扶養者の収入変動による控除対象外リスク',
        '申告漏れによる追徴課税リスク'
      ],
      complianceNotes: [
        '本計算は概算値です。正確な申告は税理士にご相談ください',
        '扶養控除の適用には所得制限があります',
        '年末調整または確定申告が必要です'
      ]
    }
    
    const processingTime = Date.now() - startTime
    
    // 成功レスポンス
    const response: FuyouCheckResponse = {
      success: true,
      requestId,
      calculatedAt: new Date().toISOString(),
      
      input: {
        income: requestData.income,
        dependentCount: requestData.dependentCount,
        taxYear
      },
      
      calculation,
      
      adjustedIncome,
      remainingLimit,
      
      analysis,
      
      apiInfo: {
        version: '1.0.0',
        processingTime,
        nextUpdate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24時間後
      }
    }
    
    console.log('✅ [API Mock] Calculation completed successfully')
    console.log(\`📊 [API Mock] Results: Tax=¥\${estimatedTax.toLocaleString()}, Savings=¥\${estimatedSavings.toLocaleString()}\`)
    console.log(\`⏱️ [API Mock] Processing time: \${processingTime}ms\`)
    
    return NextResponse.json(response)
    
  } catch (error) {
    const processingTime = Date.now() - startTime
    
    console.error('💥 [API Mock] Processing failed:', error)
    
    // エラーレスポンス
    return NextResponse.json({
      success: false,
      requestId,
      calculatedAt: new Date().toISOString(),
      error: {
        code: 'INTERNAL_ERROR',
        message: '内部処理エラーが発生しました',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      apiInfo: {
        version: '1.0.0',
        processingTime
      }
    }, { status: 500 })
  }
}

// ===== GET エンドポイント（ヘルスチェック用） =====

export async function GET(): Promise<NextResponse> {
  console.log('🏥 [API Mock] Health check requested')
  
  return NextResponse.json({
    status: 'healthy',
    service: 'MATURA 扶養控除計算API Mock',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      'POST /api/fuyouCheck': '扶養控除計算',
      'GET /api/fuyouCheck': 'ヘルスチェック'
    },
    documentation: {
      requestSchema: 'FuyouCheckRequest',
      responseSchema: 'FuyouCheckResponse',
      examples: '/api/fuyouCheck/examples'
    }
  })
}

export default { POST, GET }`
  }

  /**
   * API Mock生成プロンプトを構築
   */
  private buildApiMockPrompt(appIdea: string, options: ApiMockGenerationOptions): string {
    const { apiType = 'rest', responseDelay = 500, includeErrorScenarios = true } = options

    return `
Generate a complete Next.js 14 App Router API endpoint for the following application:

APPLICATION IDEA: ${appIdea}

REQUIREMENTS:
1. Create appropriate API endpoints using NextRequest and NextResponse
2. Analyze the app idea and determine necessary endpoints
3. Accept appropriate request data based on the application
4. Return well-structured responses with TypeScript interfaces
5. Include realistic processing delays and comprehensive error handling

DYNAMIC API STRUCTURE:
- Analyze the application idea and create appropriate endpoints
- Design request interfaces that match the app's data needs
- Create response interfaces with relevant data structures
- Include appropriate business logic and calculations
- Add validation and error handling

CORE FUNCTIONALITY:
- Implement real business logic based on the app idea
- Include data processing and transformations
- Add appropriate calculations or algorithms
- Include mock data generation where needed
- Provide meaningful response data

ADVANCED FEATURES:
- Request validation with detailed error messages
- Processing delay simulation (300-1200ms)
- Comprehensive console logging with emoji prefixes
- GET endpoint for health checks and documentation
- Error scenarios with proper HTTP status codes
- Detailed analysis with optimization suggestions

CONSOLE LOGGING:
- Log all requests with request ID and key parameters
- Track processing time and calculation results
- Include emoji prefixes for easy debugging
- Log validation errors and processing failures

OUTPUT REQUIREMENTS:
- Return ONLY the complete TypeScript API route code
- Include all necessary imports and type definitions
- Add comprehensive JSDoc comments
- Handle all edge cases and error scenarios
- Make it production-ready with proper error handling

Generate the complete API endpoint now:
`
  }

  /**
   * API Mock生成メイン実行関数
   */
  async generateApiMock(options: ApiMockGenerationOptions): Promise<string> {
    console.log('🚀 Starting API Mock generation...')
    console.log(`📋 Options: ${JSON.stringify(options)}`)
    console.log(`💡 App Idea: ${options.appIdea}`)

    try {
      // プロンプト構築
      const prompt = this.buildApiMockPrompt(options.appIdea, options)
      
      // Gemini API呼び出し
      const generatedCode = await this.callGeminiAPI(prompt)
      
      // ファイル保存
      const outputPath = this.saveGeneratedApiMock(generatedCode)
      
      console.log('✅ API Mock generation completed successfully!')
      console.log(`📁 Generated file: ${outputPath}`)
      
      return outputPath

    } catch (error) {
      console.error('💥 API Mock generation failed:', error)
      throw error
    }
  }

  /**
   * 生成されたAPI Mockをファイルに保存
   */
  private saveGeneratedApiMock(code: string): string {
    const outputDir = join(this.projectRoot, 'app', 'api', 'fuyouCheck')
    const outputPath = join(outputDir, 'route.ts')

    // ディレクトリ確認・作成
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true })
    }

    // ファイル保存
    writeFileSync(outputPath, code, 'utf8')
    
    console.log(`💾 Saved generated API Mock to: ${outputPath}`)
    return outputPath
  }

  /**
   * 生成結果の検証
   */
  async validateGeneratedApiMock(filePath: string): Promise<boolean> {
    try {
      console.log('🔍 Validating generated API Mock...')
      
      if (!existsSync(filePath)) {
        throw new Error(`Generated file not found: ${filePath}`)
      }

      const content = readFileSync(filePath, 'utf8')
      
      const requiredElements = [
        'export async function POST',
        'NextRequest',
        'NextResponse',
        'FuyouCheckRequest',
        'FuyouCheckResponse',
        'console.log',
        'calculateBasicDeduction',
        'calculateDependentDeduction'
      ]

      const missingElements = requiredElements.filter(element => !content.includes(element))
      
      if (missingElements.length > 0) {
        console.warn('⚠️ API Mock validation warnings:', missingElements)
      } else {
        console.log('✅ API Mock validation passed')
      }

      return missingElements.length === 0

    } catch (error) {
      console.error('💥 API Mock validation failed:', error)
      return false
    }
  }
}

/**
 * エクスポート関数
 */
export async function generateApiMock(options: ApiMockGenerationOptions): Promise<string> {
  const generator = new ApiMockGenerator()
  return await generator.generateApiMock(options)
}

export default ApiMockGenerator