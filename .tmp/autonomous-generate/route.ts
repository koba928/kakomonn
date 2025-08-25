import { NextRequest, NextResponse } from 'next/server'
import { AutonomousEngine } from '@/lib/core/autonomousEngine'

interface AutonomousGenerateRequest {
  userInput: string
  reuseSimilar?: boolean
  options?: {
    maxRetries?: number
    includeTests?: boolean
    includeDocs?: boolean
    deploymentReady?: boolean
    outputPath?: string
  }
}

interface ProgressUpdate {
  type: 'progress' | 'complete' | 'error'
  stage: string
  message: string
  progress: number
  details?: any
  timestamp: string
}

// Rate limiting
const requestCounts = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 * 5 // 5 minutes
const MAX_REQUESTS_PER_WINDOW = 2 // 2 requests per 5 minutes for heavy operations

function getRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const record = requestCounts.get(ip)
  
  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 }
  }
  
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0 }
  }
  
  record.count++
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - record.count }
}

function createProgressStream(
  userInput: string,
  reuseSimilar: boolean,
  options: any
) {
  const encoder = new TextEncoder()
  
  return new ReadableStream({
    async start(controller) {
      try {
        console.log('[autonomous-generate] Starting autonomous MATURA generation system')
        
        // Create progress update helper
        const sendProgress = (stage: string, message: string, progress: number, details?: any) => {
          const update: ProgressUpdate = {
            type: 'progress',
            stage,
            message,
            progress,
            details,
            timestamp: new Date().toISOString()
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(update)}\n\n`))
        }

        // Initialize the autonomous engine
        sendProgress('initialization', '🚀 MATURA自律生成システムを初期化中...', 5)
        
        const engine = new AutonomousEngine()
        const startTime = Date.now()

        // Stage 1: Idea Analysis
        sendProgress('analysis', '🧠 アイデア分析・分類中...', 15, {
          stage: 'idea_analysis',
          description: 'ユーザー入力を解析し、適切なアプリタイプと機能を特定',
          userInput: userInput.slice(0, 100) + '...'
        })
        
        // Stage 2: Structure Reuse Check
        if (reuseSimilar) {
          sendProgress('reuse', '🔍 類似構造の検索・再利用可能性チェック中...', 25, {
            stage: 'structure_reuse',
            description: '過去の生成履歴から類似プロジェクトを検索'
          })
          
          const reusableStructure = await engine.reuseStructure(userInput)
          
          if (reusableStructure) {
            sendProgress('adapting', '♻️ 類似構造を発見、現在のリクエストに適応中...', 35, {
              stage: 'structure_adaptation',
              description: '既存構造をベースに効率的な生成を実行'
            })
          }
        }

        // Stage 3: High-Quality Generation
        sendProgress('generation', '🎨 高品質アプリケーション生成中...', 45, {
          stage: 'app_generation',
          description: 'shadcn/ui、TypeScript、Zustandを使用した本格的アプリ生成',
          maxRetries: options?.maxRetries || 3
        })
        
        // Start the actual generation
        const result = await engine.generateApplication(userInput, options?.maxRetries || 3)
        
        if (!result.success) {
          throw new Error(result.errors.join(', '))
        }

        // Stage 4: File Generation
        sendProgress('files', '📁 ファイル構造とコンポーネント生成中...', 65, {
          stage: 'file_generation',
          description: 'UI、Store、API、Handlersの完全なファイル構造を生成',
          fileCount: Object.keys(result.files).length
        })

        // Stage 5: Validation & Quality Check
        sendProgress('validation', '✅ コード品質検証・自動修正中...', 80, {
          stage: 'validation',
          description: 'TypeScript型チェック、自然言語除去、構文検証',
          validationResult: result.validationResult
        })

        // Stage 6: File Writing
        sendProgress('writing', '💾 ファイル書き込み・保存中...', 90, {
          stage: 'file_writing',
          description: '生成されたファイルをプロジェクトに保存',
          outputPath: 'app/generated-app/'
        })

        // Stage 7: History Save
        sendProgress('history', '📚 生成履歴保存中...', 95, {
          stage: 'history_save',
          description: '今回の生成結果を履歴に保存（将来の再利用のため）'
        })
        
        await engine.saveGenerationHistory(result.structure)

        const generationTime = Date.now() - startTime

        // Final completion
        const completionUpdate: ProgressUpdate = {
          type: 'complete',
          stage: 'complete',
          message: '🎉 MATURA自律生成が完了しました！',
          progress: 100,
          details: {
            success: true,
            result: {
              mainPage: result.files['app/generated-app/page.tsx'],
              written: true,
              path: 'app/generated-app/page.tsx',
              validated: true,
              timestamp: new Date().toISOString(),
              appType: result.structure.design.title,
              features: result.structure.design.features.map(f => f.name),
              allFiles: Object.keys(result.files),
              generationPhases: result.structure.generationPlan.map(p => p.phase)
            },
            structure: result.structure,
            validationResult: result.validationResult,
            generationTime,
            stats: {
              totalFiles: Object.keys(result.files).length,
              phases: result.structure.generationPlan.length,
              features: result.structure.design.features.length,
              apiEndpoints: result.structure.design.apiEndpoints.length,
              validationErrors: result.validationResult?.errors?.length || 0,
              validationWarnings: result.validationResult?.warnings?.length || 0
            }
          },
          timestamp: new Date().toISOString()
        }

        controller.enqueue(encoder.encode(`data: ${JSON.stringify(completionUpdate)}\n\n`))
        controller.close()

      } catch (error: any) {
        console.error('[autonomous-generate] Error:', error)
        
        const errorUpdate: ProgressUpdate = {
          type: 'error',
          stage: 'error',
          message: '❌ MATURA自律生成中にエラーが発生しました',
          progress: 0,
          details: {
            error: error.message || '不明なエラー',
            stack: error.stack,
            timestamp: new Date().toISOString()
          },
          timestamp: new Date().toISOString()
        }
        
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(errorUpdate)}\n\n`))
        controller.close()
      }
    }
  })
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  try {
    console.log('[autonomous-generate] Request started at:', new Date().toISOString())
    
    // Get client IP for rate limiting
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    
    // Check rate limit
    const rateLimit = getRateLimit(ip)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'レート制限に達しました。自律コード生成は高負荷な処理のため、5分間に2回までに制限されています。',
          retryAfter: RATE_LIMIT_WINDOW / 1000
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': MAX_REQUESTS_PER_WINDOW.toString(),
            'X-RateLimit-Remaining': '0',
            'Retry-After': (RATE_LIMIT_WINDOW / 1000).toString()
          }
        }
      )
    }

    // Parse request body
    const body = await request.json() as AutonomousGenerateRequest

    // Validate request
    if (!body.userInput) {
      return NextResponse.json(
        { error: 'ユーザー入力が必要です' },
        { status: 400 }
      )
    }

    console.log('[autonomous-generate] Starting MATURA autonomous generation for:', {
      userInput: body.userInput.slice(0, 100) + '...',
      reuseSimilar: body.reuseSimilar,
      options: body.options
    })

    // Create progress stream
    const stream = createProgressStream(
      body.userInput,
      body.reuseSimilar || true,
      body.options
    )

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'X-RateLimit-Limit': MAX_REQUESTS_PER_WINDOW.toString(),
        'X-RateLimit-Remaining': rateLimit.remaining.toString(),
      },
    })

  } catch (error) {
    const responseTime = Date.now() - startTime
    console.error('[autonomous-generate] Unexpected error:', error)
    
    return NextResponse.json(
      { 
        error: '自律コード生成中に予期しないエラーが発生しました。',
        details: error instanceof Error ? error.message : 'Unknown error',
        responseTime
      },
      { status: 500 }
    )
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

// Health check and history endpoint
export async function GET() {
  try {
    const engine = new AutonomousEngine()
    const history = await engine.getGenerationHistory()
    const hasGeminiKey = !!process.env.GEMINI_API_KEY
    
    return NextResponse.json({
      status: 'ok',
      service: 'matura-autonomous-generator',
      version: '3.0.0',
      capabilities: [
        'autonomous-idea-analysis',
        'dynamic-app-generation',
        'structure-reuse-optimization',
        'multi-phase-generation',
        'self-validation-correction',
        'shadcn-ui-zustand-integration',
        'typescript-safety',
        'production-ready-output'
      ],
      geminiApiKeyConfigured: hasGeminiKey,
      rateLimit: {
        window: RATE_LIMIT_WINDOW,
        maxRequests: MAX_REQUESTS_PER_WINDOW
      },
      history: {
        totalGenerations: history.length,
        recentGenerations: history.slice(-5).map(h => ({
          timestamp: h.meta.generatedAt,
          userInput: h.meta.userInput.slice(0, 50) + '...',
          appType: h.design.title,
          featureCount: h.design.features.length
        }))
      },
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json(
      { 
        error: 'Health check failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}