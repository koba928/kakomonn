'use client'

import { useState } from 'react'
import { ArrowRight, Eye, Palette, Layout, Type, Zap, CheckCircle, Code2, Download } from 'lucide-react'
import { useMatura } from '@/components/providers/MaturaProvider'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'

export default function CodePlayground() {
  const { state, actions } = useMatura()
  const [currentSection, setCurrentSection] = useState<'overview' | 'preview' | 'details'>('overview')

  // データが不足している場合の警告表示
  const hasRequiredData = state.insights && state.selectedUIStyle
  
  // 実際のMaturaデータを使用
  const conversationSummary = {
    why: state.insights?.vision || "学生のアルバイト収入を効率的に管理し、目標達成をサポートするため",
    who: state.insights?.target || "大学生・専門学校生（18-25歳）、アルバイトをしている学生", 
    what: state.insights?.description || "時給計算、シフト管理、収入目標設定、支出記録ができるWebアプリ",
    messageCount: 0
  }

  // 選択されたUIスタイルデータを使用
  const selectedUIStyle = {
    name: state.selectedUIStyle?.name || "Modern & Clean",
    primaryColor: state.selectedUIStyle?.primaryColor || "#3B82F6",
    accentColor: state.selectedUIStyle?.accentColor || "#10B981",
    cardStyle: state.selectedUIStyle?.cardStyle || "rounded-lg shadow-sm",
    theme: state.selectedUIStyle?.description || "明るく親しみやすい配色"
  }

  // UXデザインデータを使用
  const uxDesign = state.uxDesign || state.unifiedUXDesign

  const uxPoints = [
    { 
      category: "レイアウト", 
      points: (uxDesign?.structure?.designSystem?.layout ? [uxDesign.structure.designSystem.layout] : null) || [
        "直感的なダッシュボード構成", 
        "モバイルファーストデザイン", 
        "重要情報の視覚的優先度"
      ] 
    },
    { 
      category: "配色", 
      points: (uxDesign?.structure?.designSystem?.colorUsage ? [uxDesign.structure.designSystem.colorUsage.usage] : null) || [
        "ブルー系をメインカラーに採用", 
        "グリーンをアクセントカラーに", 
        "高いコントラストで読みやすさ重視"
      ] 
    },
    { 
      category: "ナビゲーション", 
      points: (uxDesign?.navigation ? [uxDesign.navigation] : null) || [
        "タブベースの直感的な操作", 
        "パンくずリストで現在位置を明示", 
        "ワンクリックでメイン機能にアクセス"
      ] 
    },
    { 
      category: "タイポグラフィ", 
      points: (uxDesign?.structure?.designSystem?.typography ? [uxDesign.structure.designSystem.typography.heading, uxDesign.structure.designSystem.typography.body] : null) || [
        "見出しは太めのフォントで視認性向上", 
        "本文は読みやすいサイズと行間", 
        "重要な数値は大きく強調表示"
      ] 
    },
    { 
      category: "アニメーション", 
      points: (uxDesign?.animations ? [uxDesign.animations] : null) || [
        "スムーズなページ遷移", 
        "ホバー時の軽やかなフィードバック", 
        "データ更新時の自然な変化"
      ] 
    }
  ]

  const [isGeneratingCode, setIsGeneratingCode] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [generationMessage, setGenerationMessage] = useState('')
  const [generatedCode, setGeneratedCode] = useState<string | null>(null)
  const [generationType, setGenerationType] = useState<'html' | 'modern'>('modern')

  const generateCode = async () => {
    try {
      console.log('[CodePlayground] ========== Starting generateCode ==========')
      console.log('[CodePlayground] State insights:', state.insights)
      console.log('[CodePlayground] State selectedUIStyle:', state.selectedUIStyle)
      console.log('[CodePlayground] Generation type:', generationType)

      if (!state.insights || !state.selectedUIStyle) {
        console.error('[CodePlayground] Missing required data')
        setGenerationMessage('❌ 洞察とUIスタイルが必要です')
        setIsGeneratingCode(false)
        return
      }

      console.log('[CodePlayground] Setting loading state...')
      setIsGeneratingCode(true)
      setGenerationProgress(0)
      setGenerationMessage('コード生成を開始中...')

      console.log('[CodePlayground] Preparing request body...')
      
      // UX構築フェーズのデータも取得
      let uxStructure = null
      if (state.uxDesign) {
        // もしuxDesignがUXStructure形式の場合はそのまま使用
        if (state.uxDesign.siteArchitecture || state.uxDesign.designSystem || state.uxDesign.keyScreens) {
          uxStructure = state.uxDesign
        }
      }
      
      // unifiedUXDesignからも試してみる
      if (!uxStructure && state.unifiedUXDesign?.structure) {
        uxStructure = {
          siteArchitecture: state.unifiedUXDesign.structure.siteArchitecture,
          designSystem: state.unifiedUXDesign.structure.designSystem,
          keyScreens: state.unifiedUXDesign.structure.keyScreens || []
        }
      }
      
      console.log('[CodePlayground] UX構築データ:', uxStructure)
      
      const requestBody = {
        insights: state.insights,
        uiStyle: state.selectedUIStyle,
        uxDesign: state.uxDesign || state.unifiedUXDesign,
        selectedTopPageDesign: state.selectedTopPageDesign,
        uxStructure: uxStructure,  // 🚀 UX構築データを追加
        mode: 'standard'
      }
      console.log('[CodePlayground] Request body:', JSON.stringify(requestBody, null, 2))

      console.log('[CodePlayground] Calling API...', generationType)
      const apiEndpoint = generationType === 'modern' ? '/api/generate-modern-app' : '/api/gemini-generate'
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      console.log('[CodePlayground] Response received:', {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('[CodePlayground] Error response:', errorText)
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`)
      }

      if (!response.body) {
        console.error('[CodePlayground] No response body')
        throw new Error('レスポンスボディが取得できません')
      }

      console.log('[CodePlayground] Starting to read stream...')
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            console.log('[CodePlayground] Stream reading completed')
            break
          }

          const chunk = decoder.decode(value, { stream: true })
          buffer += chunk
          console.log('[CodePlayground] Received chunk length:', chunk.length)
          
          // Process complete lines from buffer
          const lines = buffer.split('\n')
          buffer = lines.pop() || '' // Keep the last incomplete line in buffer

          for (const line of lines) {
            if (line.trim() && line.startsWith('data: ')) {
              try {
                const dataStr = line.slice(6).trim()
                if (dataStr) {
                  console.log('[CodePlayground] Parsing data:', dataStr.substring(0, 100))
                  const data = JSON.parse(dataStr)
                  console.log('[CodePlayground] Parsed data:', data)
                  
                  // 新しいAPI形式に対応
                  if (data.progress !== undefined) {
                    console.log('[CodePlayground] Progress update:', data.progress, data.message)
                    setGenerationProgress(data.progress)
                    setGenerationMessage(data.message || '')
                    
                    // 生成完了の場合
                    if (data.progress === 100 && data.code) {
                      console.log('[CodePlayground] Generation complete, code length:', data.code?.length || 0)
                      
                      if (!data.code || data.code.length === 0) {
                        throw new Error('生成されたコードが空です')
                      }
                      
                      setGeneratedCode(data.code)
                      setGenerationMessage('生成完了！')
                      
                      // 生成されたコードをstateに保存
                      if (actions.setGeneratedCode) {
                        actions.setGeneratedCode({
                          html: data.code,
                          fullHtml: data.code, // フルHTMLとして保存
                          generationType: data.generationType || 'ux-enhanced',
                          features: data.features || [],
                          generatedAt: new Date().toISOString(),
                          isComplete: true
                        })
                      }
                      break // Exit the loop on completion
                    }
                  } else if (data.error) {
                    console.error('[CodePlayground] Error from stream:', data.error)
                    throw new Error(data.error || '生成エラー')
                  }
                }
              } catch (parseError) {
                console.warn('[CodePlayground] JSONパースエラー:', parseError, 'for line:', line.substring(0, 100))
                // Continue processing other lines even if one fails
              }
            }
          }
        }
      } finally {
        // Always release the reader
        reader.releaseLock()
      }
    } catch (error) {
      console.error('[CodePlayground] ========== ERROR in generateCode ==========')
      console.error('[CodePlayground] Error type:', typeof error)
      console.error('[CodePlayground] Error:', error)
      console.error('[CodePlayground] Error stack:', error instanceof Error ? error.stack : 'No stack')
      
      setGenerationMessage(`❌ エラー: ${error instanceof Error ? error.message : '不明なエラー'}`)
      setGeneratedCode(null) // エラー時は生成コードをクリア
      setGenerationProgress(0)
      
      // 再生成ボタンを表示するためのヘルパー（UIで活用可能）
      console.log('[CodePlayground] エラーが発生しました。再生成を試してください。')
    } finally {
      console.log('[CodePlayground] ========== Finishing generateCode ==========')
      setIsGeneratingCode(false)
    }
  }

  const downloadCode = () => {
    if (!generatedCode) return
    
    if (generationType === 'modern') {
      // Reactアプリの場合は、HTMLプレビューファイルをダウンロード
      const htmlPreview = state.generatedCode?.htmlPreview || `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${state.insights?.appName || 'App'}</title>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
${generatedCode}
    </script>
</body>
</html>`
      const blob = new Blob([htmlPreview], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${state.insights?.appName || 'app'}_react.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } else {
      // 通常のHTMLファイルの場合
      const blob = new Blob([generatedCode], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${state.insights?.appName || 'app'}.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    }
  }

  const handleNext = () => {
    // 次のフェーズ（ReleaseBoard）に遷移
    actions.nextPhase()
  }

  // 対話の要約を生成
  const getConversationSummary = () => {
    const conversations = state.conversations
    
    // 最新の対話から重要な情報を抽出
    const recentMessages = conversations.slice(-10)
    const userMessages = recentMessages.filter(msg => msg.role === 'user')
    
    return {
      why: state.insights?.vision || conversationSummary.why,
      who: state.insights?.target || conversationSummary.who,
      what: state.insights?.description || conversationSummary.what,
      messageCount: conversations.length
    }
  }

  const summary = getConversationSummary()

  // データが不足している場合の表示
  if (!hasRequiredData) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            前のフェーズを完了してください
          </h3>
          <p className="text-yellow-700 mb-4">
            UX構築を開始するには、洞察精製とUI選択を完了する必要があります。
          </p>
          <div className="text-sm text-yellow-600">
            <p>必要なステップ:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>フェーズ 1: 自由対話</li>
              <li>フェーズ 2: 洞察精製</li>
              <li>フェーズ 3: UI選択</li>
              <li>フェーズ 4: UX構築</li>
            </ul>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* ヘッダー */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-4">
          <Eye className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">UX構築完了</h1>
            <p className="text-gray-600">設計されたユーザー体験の最終確認</p>
            {summary.messageCount && (
              <p className="text-sm text-gray-500">対話数: {summary.messageCount}回</p>
            )}
          </div>
        </div>
        
        {/* タブナビゲーション */}
        <div className="flex gap-4 border-b border-gray-200">
          <button 
            onClick={() => setCurrentSection('overview')}
            className={`pb-2 px-1 font-medium border-b-2 transition-colors ${
              currentSection === 'overview' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            概要
          </button>
          <button 
            onClick={() => setCurrentSection('preview')}
            className={`pb-2 px-1 font-medium border-b-2 transition-colors ${
              currentSection === 'preview' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            プレビュー
          </button>
          <button 
            onClick={() => setCurrentSection('details')}
            className={`pb-2 px-1 font-medium border-b-2 transition-colors ${
              currentSection === 'details' 
                ? 'border-blue-600 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            UX詳細
          </button>
        </div>
      </div>

      {/* コンテンツエリア */}
      {currentSection === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 対話結果要約 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              対話結果要約
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Why（なぜ）</h3>
                <p className="text-gray-600 text-sm">{summary.why}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Who（誰が）</h3>
                <p className="text-gray-600 text-sm">{summary.who}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-700 mb-2">What（何を）</h3>
                <p className="text-gray-600 text-sm">{summary.what}</p>
              </div>
              {state.insights?.features && state.insights.features.length > 0 && (
                <div>
                  <h3 className="font-medium text-gray-700 mb-2">主要機能</h3>
                  <ul className="text-gray-600 text-sm space-y-1">
                    {state.insights.features.slice(0, 3).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* 選択されたUIスタイル */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Palette className="w-5 h-5 text-blue-600" />
              選択されたUIスタイル
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: selectedUIStyle.primaryColor }}
                />
                <span className="text-sm text-gray-600">プライマリカラー</span>
              </div>
              <div className="flex items-center gap-3">
                <div 
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: selectedUIStyle.accentColor }}
                />
                <span className="text-sm text-gray-600">アクセントカラー</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">テーマ: </span>
                <span className="text-gray-600 text-sm">{selectedUIStyle.theme}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">スタイル: </span>
                <span className="text-gray-600 text-sm">{selectedUIStyle.name}</span>
              </div>
              {state.selectedTopPageDesign && (
                <div>
                  <span className="font-medium text-gray-700">レイアウト: </span>
                  <span className="text-gray-600 text-sm">{state.selectedTopPageDesign.name}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {currentSection === 'preview' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Layout className="w-5 h-5 text-blue-600" />
            UIプレビュー
          </h2>
          <div className="bg-gray-50 rounded-lg p-6">
            {/* 簡易プレビュー */}
            <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* ヘッダー */}
              <div 
                className="p-4 text-white"
                style={{ backgroundColor: selectedUIStyle.primaryColor }}
              >
                <h3 className="font-bold">{state.insights?.appName || "アプリケーション"}</h3>
                <p className="text-sm opacity-90">
                  {state.insights?.vision?.substring(0, 30) || "目標達成をサポート"}...
                </p>
              </div>
              
              {/* コンテンツ */}
              <div className="p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">進捗状況</span>
                  <span className="font-semibold text-gray-900">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="h-2 rounded-full"
                    style={{ 
                      backgroundColor: selectedUIStyle.accentColor,
                      width: '75%'
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <div className="bg-gray-50 rounded p-2 text-center">
                    <div className="text-sm text-gray-600">機能A</div>
                    <div className="font-semibold">実装済み</div>
                  </div>
                  <div className="bg-gray-50 rounded p-2 text-center">
                    <div className="text-sm text-gray-600">機能B</div>
                    <div className="font-semibold">準備中</div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-center text-gray-500 text-sm mt-4">
              実際のアプリケーションプレビュー
            </p>
          </div>
        </div>
      )}

      {currentSection === 'details' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Zap className="w-5 h-5 text-blue-600" />
            UX構築ポイント
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uxPoints.map((section, index) => (
              <div key={index} className="space-y-3">
                <h3 className="font-medium text-gray-900 flex items-center gap-2">
                  {section.category === 'レイアウト' && <Layout className="w-4 h-4 text-blue-600" />}
                  {section.category === '配色' && <Palette className="w-4 h-4 text-blue-600" />}
                  {section.category === 'ナビゲーション' && <ArrowRight className="w-4 h-4 text-blue-600" />}
                  {section.category === 'タイポグラフィ' && <Type className="w-4 h-4 text-blue-600" />}
                  {section.category === 'アニメーション' && <Zap className="w-4 h-4 text-blue-600" />}
                  {section.category}
                </h3>
                <ul className="space-y-2">
                  {section.points.map((point, pointIndex) => (
                    <li key={pointIndex} className="text-sm text-gray-600 flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* コード生成セクション */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <h3 className="text-xl font-bold mb-2">🚀 コード生成</h3>
          <p className="text-purple-100">
            設計されたUXを実際のWebアプリケーションコードに変換します
          </p>
        </div>
        
        <div className="p-6">
          {!isGeneratingCode && !generatedCode && (
            <div className="space-y-6">
              {/* 生成タイプ選択 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">生成タイプを選択</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div 
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      generationType === 'modern' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setGenerationType('modern')}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <input 
                        type="radio" 
                        checked={generationType === 'modern'} 
                        onChange={() => setGenerationType('modern')}
                        className="text-blue-600"
                      />
                      <h5 className="font-bold text-gray-900">⚡ モダンReactアプリ</h5>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">推奨</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      React + TypeScript + Tailwind CSS
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>✅ 完全な CRUD 操作</li>
                      <li>✅ 型安全な開発体験</li>
                      <li>✅ 高度なデータ永続化</li>
                      <li>✅ ダッシュボード & 分析</li>
                      <li>✅ コンポーネント分割</li>
                    </ul>
                  </div>
                  
                  <div 
                    className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                      generationType === 'html' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setGenerationType('html')}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <input 
                        type="radio" 
                        checked={generationType === 'html'} 
                        onChange={() => setGenerationType('html')}
                        className="text-blue-600"
                      />
                      <h5 className="font-bold text-gray-900">📄 シンプルHTML</h5>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      単一HTMLファイル
                    </p>
                    <ul className="text-xs text-gray-500 space-y-1">
                      <li>✅ 即座にブラウザで実行</li>
                      <li>✅ セットアップ不要</li>
                      <li>✅ 軽量でシンプル</li>
                      <li>⚠️ 基本的な機能のみ</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-600 mb-6">
                  {generationType === 'modern' 
                    ? 'プロダクションレベルのReactアプリケーションを生成します' 
                    : 'Gemini AIを使用して、完全に動作するHTMLアプリケーションを生成します'
                  }
                </p>
                {generationMessage && generationMessage.startsWith('❌') && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-700 font-medium mb-2">{generationMessage}</p>
                    <button
                      onClick={() => {
                        setGenerationMessage('')
                        generateCode()
                      }}
                      className="text-sm bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                    >
                      再生成を試す
                    </button>
                  </div>
                )}
                <button
                  onClick={generateCode}
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  <Code2 className="w-5 h-5" />
                  {generationType === 'modern' ? 'Reactアプリを生成' : 'HTMLファイルを生成'}
                </button>
              </div>
            </div>
          )}
          
          {isGeneratingCode && (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                <span className="text-gray-700 font-medium">{generationMessage}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${generationProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-500">{generationProgress}% 完了</p>
            </div>
          )}
          
          {generatedCode && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-green-800">生成完了！</h4>
                </div>
                <p className="text-green-700 text-sm">
                  完全に動作するWebアプリケーションが生成されました
                </p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">
                  {generationType === 'modern' ? '生成されたReactアプリケーション' : '生成されたHTMLコード'}
                </h4>
                <div className="bg-white border rounded-lg p-4 max-h-64 overflow-y-auto">
                  <pre className="text-xs text-gray-600 whitespace-pre-wrap">
                    {generatedCode.substring(0, 500)}...
                  </pre>
                </div>
                {generationType === 'modern' && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-2">📁 プロジェクト構成</h5>
                    <div className="text-sm text-blue-700 grid grid-cols-2 gap-1">
                      <div>• package.json</div>
                      <div>• src/types/index.ts</div>
                      <div>• src/stores/index.ts</div>
                      <div>• src/db/index.ts</div>
                      <div>• src/components/</div>
                      <div>• src/pages/</div>
                      <div>• src/App.tsx</div>
                      <div>• tailwind.config.js</div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={downloadCode}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  {generationType === 'modern' ? 'プロジェクトをダウンロード' : 'HTMLファイルをダウンロード'}
                </button>
                
                {generationType === 'html' && (
                  <button
                    onClick={() => {
                      const blob = new Blob([generatedCode], { type: 'text/html' })
                      const url = URL.createObjectURL(blob)
                      window.open(url, '_blank')
                      setTimeout(() => URL.revokeObjectURL(url), 100)
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    プレビュー表示
                  </button>
                )}
                
                {generationType === 'modern' && (
                  <button
                    onClick={() => {
                      try {
                        // プレビュー用HTMLを取得（state.generatedCodeから優先的に取得）
                        let htmlContent = ''
                        
                        if (state.generatedCode?.htmlPreview) {
                          console.log('[CodePlayground] Using htmlPreview from state')
                          htmlContent = state.generatedCode.htmlPreview
                        } else if (generatedCode) {
                          console.log('[CodePlayground] Creating preview from generated code')
                          // Reactコードを実行可能なHTMLでラップ
                          htmlContent = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${state.insights?.appName || 'App'} - プレビュー</title>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <div id="root"></div>
    <script type="text/babel">
${generatedCode}
    </script>
</body>
</html>`
                        } else {
                          throw new Error('プレビュー用のコードがありません')
                        }
                        
                        console.log('[CodePlayground] Preview HTML length:', htmlContent.length)
                        const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' })
                        const url = URL.createObjectURL(blob)
                        window.open(url, '_blank')
                        setTimeout(() => URL.revokeObjectURL(url), 1000)
                      } catch (error) {
                        console.error('[CodePlayground] Preview error:', error)
                        alert('プレビューの表示に失敗しました。コードを再生成してください。')
                      }
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    アプリをプレビュー
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 次のフェーズへのボタン */}
      {generatedCode && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-gray-900">コード生成完了</h3>
              <p className="text-sm text-gray-600">生成されたアプリをデプロイして世界に公開しましょう</p>
              <p className="text-xs text-gray-500 mt-1">
                次のフェーズ: リリース準備（{state.currentPhase + 1}/6）
              </p>
            </div>
            <button
              onClick={handleNext}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              リリース準備へ進む
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
      </div>
    </ErrorBoundary>
  )
}