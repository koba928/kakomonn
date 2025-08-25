'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Lightbulb, Target, Star, Heart, ArrowRight, RefreshCw, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import PreviewButton from '@/components/shared/PreviewButton'
import { ProcessingSpinner } from '@/components/shared/LoadingSpinner'
import { useMatura } from '@/components/providers/MaturaProvider'
import { useChatOptimized } from '@/hooks/useChatOptimized'
import { Insight } from '@/lib/types'

function InsightRefineFinal() {
  console.log('💥💥💥 FINAL VERSION - WORKING CODE! 💥💥💥')
  
  const { state, actions } = useMatura()
  const chatOptimized = useChatOptimized()
  const [insights, setInsights] = useState<Insight | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // 確実に動作する洞察生成関数
  const executeGeneration = useCallback(async () => {
    console.log('🎯 executeGeneration開始!')
    
    if (isProcessing || chatOptimized.isLoading) {
      console.log('❌ 処理中のためスキップ')
      return
    }
    
    const conversations = state.conversations || []
    if (conversations.length === 0) {
      console.log('❌ 会話データなし')
      return
    }
    
    setIsProcessing(true)
    console.log('✅ 処理開始 - API呼び出し')
    
    try {
      const conversationText = conversations
        .filter(conv => conv && conv.content && conv.content.trim())
        .map(conv => `${conv.role}: ${conv.content.trim()}`)
        .join('\n\n')
      
      const prompt = `以下の対話から洞察を抽出し、JSON形式で回答してください。

対話:
${conversationText}

JSON形式:
{
  "vision": "ビジョン",
  "target": "ターゲット",
  "features": ["機能1", "機能2", "機能3"],
  "value": "価値",
  "motivation": "動機"
}`

      const result = await chatOptimized.sendMessage(
        prompt,
        [],
        'InsightRefine'
      )
      
      console.log('📨 API結果:', { result, hasResult: !!result })
      
      if (result && typeof result === 'string') {
        try {
          let jsonString = result.trim()
          const match = jsonString.match(/\{[^]*\}/)
          if (match) jsonString = match[0]
          
          const parsed = JSON.parse(jsonString)
          console.log('✅ 解析成功:', parsed)
          
          setInsights(parsed)
          actions.setInsights(parsed)
          
        } catch (e) {
          console.error('❌ JSON解析失敗:', e)
        }
      }
      
    } catch (error) {
      console.error('❌ 生成エラー:', error)
    } finally {
      setIsProcessing(false)
    }
  }, [state.conversations, chatOptimized, actions, isProcessing])

  // 初回自動実行
  useEffect(() => {
    console.log('🔄 初回チェック')
    
    const hasConversations = state.conversations && state.conversations.length > 0
    const noInsights = !insights
    const notProcessing = !isProcessing && !chatOptimized.isLoading
    
    console.log('🎯 条件:', { hasConversations, noInsights, notProcessing })
    
    if (hasConversations && noInsights && notProcessing) {
      console.log('🚀 自動実行!')
      setTimeout(() => executeGeneration(), 500)
    }
  }, [state.conversations, insights, executeGeneration, isProcessing, chatOptimized.isLoading])

  const handleManualExecution = () => {
    console.log('🔧 手動実行')
    setInsights(null)
    executeGeneration()
  }

  const handleNext = () => {
    if (insights) {
      actions.setInsights(insights)
      actions.nextPhase()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Lightbulb className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold mb-2">InsightRefine - 洞察の精製 ⚡️最終版</h2>
                <p className="text-white/90">
                  あなたの対話から重要な洞察を抽出します
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {/* 手動実行ボタン */}
              <button
                onClick={handleManualExecution}
                disabled={isProcessing || chatOptimized.isLoading}
                className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 rounded-lg transition-colors text-white disabled:opacity-50"
              >
                🎯 実行
              </button>
              
              {(isProcessing || chatOptimized.isLoading) && (
                <button
                  onClick={chatOptimized.cancelRequest}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-white"
                >
                  <X className="w-4 h-4" />
                  停止
                </button>
              )}
              
              <PreviewButton 
                data={insights} 
                title="洞察データ"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              />
            </div>
          </div>
        </div>

        {/* コンテンツ */}
        <div className="p-8">
          {chatOptimized.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{chatOptimized.error}</p>
            </div>
          )}
          
          {(isProcessing || chatOptimized.isLoading) ? (
            <div className="text-center py-16">
              <ProcessingSpinner />
              <p className="mt-4 text-gray-600">対話内容を分析しています...</p>
            </div>
          ) : insights ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* ビジョン */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-900">ビジョン</h3>
                </div>
                <p className="text-blue-800 text-lg leading-relaxed">{insights.vision}</p>
              </div>

              {/* ターゲット */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-green-900">ターゲットユーザー</h3>
                </div>
                <p className="text-green-800 text-lg leading-relaxed">{insights.target}</p>
              </div>

              {/* 機能 */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-purple-900">主要機能</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {insights.features?.map((feature, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg border border-purple-200 text-purple-800">
                      • {feature}
                    </div>
                  ))}
                </div>
              </div>

              {/* 価値 */}
              <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-lg border border-red-100">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-red-900">提供価値</h3>
                </div>
                <p className="text-red-800 text-lg leading-relaxed">{insights.value}</p>
              </div>

              {/* 動機 */}
              {insights.motivation && (
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-lg border border-gray-100">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">作りたい理由</h3>
                  <p className="text-gray-800 text-lg leading-relaxed">{insights.motivation}</p>
                </div>
              )}

              {/* 次へボタン */}
              <div className="text-center pt-4">
                <button
                  onClick={handleNext}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-matura-primary to-matura-secondary text-white rounded-lg font-medium transition-all hover:shadow-lg transform hover:scale-105"
                >
                  UIデザインを選択する
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-600 mb-4">洞察を生成する準備ができました</p>
              <button
                onClick={handleManualExecution}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                🎯 洞察を生成する
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default InsightRefineFinal