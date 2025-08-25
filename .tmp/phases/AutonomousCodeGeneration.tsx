'use client'

import React, { useState, useCallback, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  Pause, 
  Square, 
  Settings, 
  Code, 
  TestTube, 
  Shield, 
  Rocket, 
  Download, 
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Clock,
  Cpu,
  Database,
  GitBranch,
  Layers,
  Monitor,
  Zap
} from 'lucide-react'
import { Insight, UIStyle, UnifiedUXDesign } from '@/lib/types'

interface AutonomousCodeGenerationProps {
  insight: Insight
  uiStyle: UIStyle
  uxDesign?: UnifiedUXDesign
  onComplete?: (result: GenerationResult) => void
}

interface GenerationResult {
  success: boolean
  files: Record<string, string>
  dependencies: string[]
  metrics: {
    generationTime: number
    linesGenerated: number
    testsGenerated: number
    componentCount: number
    typeErrors: number
    lintErrors: number
  }
  deploymentInfo?: {
    readyForDeploy: boolean
    buildSuccessful: boolean
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

interface GenerationOptions {
  includeTests: boolean
  includeDocs: boolean
  installDependencies: boolean
  runLinting: boolean
  runTypeCheck: boolean
  selfCorrect: boolean
  maxIterations: number
  deploymentReady: boolean
}

const stageIcons: Record<string, React.ReactNode> = {
  initialization: <Cpu className="w-4 h-4" />,
  environment: <Layers className="w-4 h-4" />,
  dependencies: <Database className="w-4 h-4" />,
  generation: <Code className="w-4 h-4" />,
  structure: <GitBranch className="w-4 h-4" />,
  testing: <TestTube className="w-4 h-4" />,
  quality: <Shield className="w-4 h-4" />,
  installation: <Download className="w-4 h-4" />,
  verification: <CheckCircle className="w-4 h-4" />,
  deployment: <Rocket className="w-4 h-4" />,
  complete: <Zap className="w-4 h-4" />,
  error: <AlertCircle className="w-4 h-4" />
}

export default function AutonomousCodeGeneration({
  insight,
  uiStyle,
  uxDesign,
  onComplete
}: AutonomousCodeGenerationProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStage, setCurrentStage] = useState('')
  const [currentMessage, setCurrentMessage] = useState('')
  const [logs, setLogs] = useState<ProgressUpdate[]>([])
  const [result, setResult] = useState<GenerationResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [options, setOptions] = useState<GenerationOptions>({
    includeTests: true,
    includeDocs: false,
    installDependencies: true,
    runLinting: true,
    runTypeCheck: true,
    selfCorrect: true,
    maxIterations: 3,
    deploymentReady: true
  })

  const abortControllerRef = useRef<AbortController | null>(null)
  const eventSourceRef = useRef<EventSource | null>(null)

  const startGeneration = useCallback(async () => {
    if (isGenerating) return

    try {
      setIsGenerating(true)
      setIsPaused(false)
      setProgress(0)
      setCurrentStage('')
      setCurrentMessage('')
      setLogs([])
      setResult(null)
      setError(null)

      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController()

      // Prepare request data
      const requestData = {
        insights: insight,
        uiStyle: uiStyle,
        uxDesign: uxDesign,
        options: options
      }

      console.log('Starting autonomous generation with:', requestData)

      // Create EventSource for server-sent events
      const eventSource = new EventSource('/api/autonomous-generate', {
        withCredentials: false
      })

      eventSourceRef.current = eventSource

      // Send initial request
      const response = await fetch('/api/autonomous-generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
        signal: abortControllerRef.current.signal
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      // Handle streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) {
        throw new Error('Response body is not readable')
      }

      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        
        // Process complete messages
        const lines = buffer.split('\n')
        buffer = lines.pop() || '' // Keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6)) as ProgressUpdate
              
              setLogs(prev => [...prev, data])
              setProgress(data.progress)
              setCurrentStage(data.stage)
              setCurrentMessage(data.message)

              if (data.type === 'complete') {
                setResult(data.details)
                onComplete?.(data.details)
                setIsGenerating(false)
              } else if (data.type === 'error') {
                setError(data.details.error)
                setIsGenerating(false)
              }
            } catch (parseError) {
              console.error('Failed to parse SSE data:', parseError)
            }
          }
        }
      }

    } catch (err: any) {
      if (err.name === 'AbortError') {
        setCurrentMessage('生成がキャンセルされました')
      } else {
        setError(err.message || '予期しないエラーが発生しました')
      }
      setIsGenerating(false)
    }
  }, [insight, uiStyle, uxDesign, options, onComplete, isGenerating])

  const pauseGeneration = useCallback(() => {
    setIsPaused(true)
    // Note: Actual pausing would require server-side support
  }, [])

  const resumeGeneration = useCallback(() => {
    setIsPaused(false)
    // Note: Actual resuming would require server-side support
  }, [])

  const stopGeneration = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }
    setIsGenerating(false)
    setIsPaused(false)
    setCurrentMessage('生成が停止されました')
  }, [])

  const downloadResult = useCallback(() => {
    if (!result || !result.files) return

    // Create a zip-like structure (simplified as JSON for now)
    const resultData = {
      files: result.files,
      dependencies: result.dependencies,
      metrics: result.metrics,
      timestamp: new Date().toISOString()
    }

    const dataStr = JSON.stringify(resultData, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `generated-app-${Date.now()}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }, [result])

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'complete': return 'bg-green-500'
      case 'error': return 'bg-red-500'
      case 'generation': return 'bg-blue-500'
      case 'quality': return 'bg-purple-500'
      case 'testing': return 'bg-yellow-500'
      case 'deployment': return 'bg-green-400'
      default: return 'bg-gray-500'
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            自律コード生成システム
          </CardTitle>
          <CardDescription>
            高品質なプロダクションレベルのコードを自動生成し、テスト・品質チェック・デプロイメント準備まで一括で実行します
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{insight.features.length}</div>
              <div className="text-sm text-gray-600">実装予定機能</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{uiStyle.name}</div>
              <div className="text-sm text-gray-600">UIスタイル</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">100%</div>
              <div className="text-sm text-gray-600">自動化率</div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              onClick={startGeneration}
              disabled={isGenerating}
              className="flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              自律生成開始
            </Button>
            
            {isGenerating && !isPaused && (
              <Button
                onClick={pauseGeneration}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Pause className="w-4 h-4" />
                一時停止
              </Button>
            )}
            
            {isGenerating && isPaused && (
              <Button
                onClick={resumeGeneration}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Play className="w-4 h-4" />
                再開
              </Button>
            )}
            
            {isGenerating && (
              <Button
                onClick={stopGeneration}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <Square className="w-4 h-4" />
                停止
              </Button>
            )}

            {result && (
              <Button
                onClick={downloadResult}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                結果をダウンロード
              </Button>
            )}
          </div>

          {/* Progress */}
          {isGenerating && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{currentMessage}</span>
                <span className="text-sm text-gray-500">{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
              {currentStage && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {stageIcons[currentStage]}
                  <span>現在のステージ: {currentStage}</span>
                </div>
              )}
            </div>
          )}

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle className="w-4 h-4" />
                <span className="font-medium">エラーが発生しました</span>
              </div>
              <p className="text-red-600 mt-1">{error}</p>
            </motion.div>
          )}

          {/* Success Display */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border border-green-200 rounded-lg p-4"
            >
              <div className="flex items-center gap-2 text-green-700 mb-2">
                <CheckCircle className="w-4 h-4" />
                <span className="font-medium">生成完了！</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">生成時間</div>
                  <div className="font-semibold">{(result.metrics.generationTime / 1000).toFixed(1)}秒</div>
                </div>
                <div>
                  <div className="text-gray-600">生成行数</div>
                  <div className="font-semibold">{result.metrics.linesGenerated.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-gray-600">コンポーネント数</div>
                  <div className="font-semibold">{result.metrics.componentCount}</div>
                </div>
                <div>
                  <div className="text-gray-600">テスト数</div>
                  <div className="font-semibold">{result.metrics.testsGenerated}</div>
                </div>
              </div>
              {result.deploymentInfo?.readyForDeploy && (
                <div className="mt-2 flex items-center gap-2 text-green-700">
                  <Rocket className="w-4 h-4" />
                  <span>Vercelデプロイメント準備完了</span>
                </div>
              )}
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Tabs */}
      <Tabs defaultValue="options" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="options">生成オプション</TabsTrigger>
          <TabsTrigger value="logs">実行ログ</TabsTrigger>
          <TabsTrigger value="result">生成結果</TabsTrigger>
          <TabsTrigger value="preview">プレビュー</TabsTrigger>
        </TabsList>

        <TabsContent value="options" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                生成オプション設定
              </CardTitle>
              <CardDescription>
                自律コード生成の詳細設定を行います
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-gray-700">基本設定</h4>
                  
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.includeTests}
                      onChange={(e) => setOptions(prev => ({ ...prev, includeTests: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">テストコード生成</span>
                    <Badge variant="secondary">推奨</Badge>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.includeDocs}
                      onChange={(e) => setOptions(prev => ({ ...prev, includeDocs: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">ドキュメント生成</span>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.installDependencies}
                      onChange={(e) => setOptions(prev => ({ ...prev, installDependencies: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">依存関係自動インストール</span>
                    <Badge variant="secondary">推奨</Badge>
                  </label>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-sm text-gray-700">品質管理</h4>
                  
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.runLinting}
                      onChange={(e) => setOptions(prev => ({ ...prev, runLinting: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">ESLintチェック</span>
                    <Badge variant="secondary">推奨</Badge>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.runTypeCheck}
                      onChange={(e) => setOptions(prev => ({ ...prev, runTypeCheck: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">TypeScript型チェック</span>
                    <Badge variant="secondary">推奨</Badge>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.selfCorrect}
                      onChange={(e) => setOptions(prev => ({ ...prev, selfCorrect: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">自動エラー修正</span>
                    <Badge variant="secondary">推奨</Badge>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.deploymentReady}
                      onChange={(e) => setOptions(prev => ({ ...prev, deploymentReady: e.target.checked }))}
                      className="rounded"
                    />
                    <span className="text-sm">デプロイメント準備</span>
                    <Badge variant="secondary">推奨</Badge>
                  </label>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  最大修正試行回数: {options.maxIterations}
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={options.maxIterations}
                  onChange={(e) => setOptions(prev => ({ ...prev, maxIterations: parseInt(e.target.value) }))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>高速 (1回)</span>
                  <span>バランス (3回)</span>
                  <span>高品質 (5回)</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-4 h-4" />
                実行ログ
              </CardTitle>
              <CardDescription>
                生成プロセスの詳細なログを確認できます
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-96 w-full">
                <div className="space-y-2">
                  <AnimatePresence>
                    {logs.map((log, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className={`p-1 rounded ${getStageColor(log.stage)} text-white flex-shrink-0`}>
                          {stageIcons[log.stage] || <Clock className="w-3 h-3" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">{log.message}</p>
                            <span className="text-xs text-gray-500">
                              {new Date(log.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          {log.details && (
                            <div className="mt-1 text-xs text-gray-600">
                              <pre className="whitespace-pre-wrap">
                                {JSON.stringify(log.details, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {logs.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      生成を開始するとログが表示されます
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="result" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                生成結果
              </CardTitle>
              <CardDescription>
                生成されたファイルと詳細な統計情報
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{Object.keys(result.files).length}</div>
                      <div className="text-sm text-blue-800">生成ファイル数</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{result.dependencies.length}</div>
                      <div className="text-sm text-green-800">依存関係</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{result.metrics.componentCount}</div>
                      <div className="text-sm text-purple-800">コンポーネント</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{result.metrics.testsGenerated}</div>
                      <div className="text-sm text-yellow-800">テスト</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">生成ファイル一覧</h4>
                    <div className="max-h-64 overflow-y-auto border rounded">
                      {Object.entries(result.files).map(([path, content]) => (
                        <div key={path} className="p-2 border-b last:border-b-0">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-mono">{path}</span>
                            <span className="text-xs text-gray-500">
                              {content.split('\n').length} lines
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">依存関係</h4>
                    <div className="flex flex-wrap gap-1">
                      {result.dependencies.map((dep) => (
                        <Badge key={dep} variant="outline" className="text-xs">
                          {dep}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  生成完了後に結果が表示されます
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                プレビュー
              </CardTitle>
              <CardDescription>
                生成されたアプリケーションのプレビュー
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-4">
                  <div className="bg-gray-100 rounded-lg p-4">
                    <h4 className="font-medium mb-2">アプリケーション概要</h4>
                    <p className="text-sm text-gray-600">{insight.vision}</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">次のステップ</h4>
                    <ol className="text-sm space-y-1">
                      <li>1. 生成されたファイルをダウンロード</li>
                      <li>2. プロジェクトフォルダに配置</li>
                      <li>3. <code className="bg-white px-1 rounded">npm install</code> で依存関係をインストール</li>
                      <li>4. <code className="bg-white px-1 rounded">npm run dev</code> で開発サーバーを起動</li>
                      <li>5. Vercelにデプロイして本番環境へ</li>
                    </ol>
                  </div>

                  {result.deploymentInfo?.readyForDeploy && (
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center gap-2 text-green-700 mb-2">
                        <Rocket className="w-4 h-4" />
                        <span className="font-medium">デプロイメント準備完了</span>
                      </div>
                      <p className="text-sm text-green-600">
                        生成されたアプリケーションはVercelへの即座デプロイに対応しています
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  生成完了後にプレビューが表示されます
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}