'use client'

import { useState, useEffect, useCallback } from 'react'
import { Lightbulb, Target, Star, Heart, ArrowRight, RefreshCw, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import PreviewButton from '@/components/shared/PreviewButton'
import { ProcessingSpinner } from '@/components/shared/LoadingSpinner'
import { useMatura } from '@/components/providers/MaturaProvider'
import { useChatOptimized } from '@/hooks/useChatOptimized'
import { Insight } from '@/lib/types'

export default function InsightRefine() {
  const { state, actions } = useMatura()
  const chatOptimized = useChatOptimized()
  const [insights, setInsights] = useState<Insight | null>(null)

  const generateInsights = useCallback(async () => {
    try {
      console.log('🚀 generateInsights called, starting validation...')
      
      // より厳密なデータ検証
      if (!state.conversations || 
          !Array.isArray(state.conversations) || 
          state.conversations.length === 0) {
        console.warn('❌ conversations が空または無効のため、洞察生成をスキップします')
        return
      }

      // 有効なコンテンツがあるconversationが存在するかチェック
      const validConversations = state.conversations.filter(conv => 
        conv && conv.content && typeof conv.content === 'string' && conv.content.trim() !== ''
      )

      if (validConversations.length === 0) {
        console.warn('❌ 有効なconversationが見つからないため、洞察生成をスキップします')
        return
      }

      console.log('✅ 洞察生成を開始:', { 
        totalConversations: state.conversations.length,
        validConversations: validConversations.length,
        isLoadingBefore: chatOptimized.isLoading,
        firstConversation: validConversations[0]?.content?.substring(0, 100)
      })

      const structuredData = await chatOptimized.generateStructuredData(
        state.conversations,
        'InsightRefine',
        {
          onError: (error) => {
            console.error('❌ 洞察生成エラー:', error)
            // AbortErrorの場合はUI状態をリセット
            if (error.includes('aborted') || error.includes('abort')) {
              console.log('🚫 Request was aborted, not showing error to user')
              // 中止された場合は実行フラグをリセット
              setHasExecuted(false)
              return
            }
          },
          timeout: 45000 // 45 second timeout for structured data generation
        }
      )
      
      console.log('📊 generateStructuredData結果:', {
        hasData: !!structuredData,
        dataType: typeof structuredData,
        dataKeys: structuredData ? Object.keys(structuredData) : null
      })
      
      if (structuredData) {
        console.log('✅ 洞察データを設定中...')
        setInsights(structuredData)
        actions.setInsights(structuredData)
        console.log('✅ 洞察データ設定完了')
      } else {
        console.warn('❌ generateStructuredDataがnullを返しました')
      }
    } catch (error) {
      console.error('💥 洞察生成エラー:', error)
      // ユーザーの意図的なキャンセルの場合はエラー表示しない
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('🚫 Request was intentionally aborted, not showing error')
        // 中止された場合は実行フラグをリセット
        setHasExecuted(false)
        return
      }
    }
  }, [state.conversations, chatOptimized, actions])

  // 初回実行フラグを追加
  const [hasExecuted, setHasExecuted] = useState(false)

  useEffect(() => {
    // データが変わった場合のみ実行フラグをリセット
    if (state.conversations && state.conversations.length > 0 && hasExecuted && !insights) {
      setHasExecuted(false)
    }
  }, [state.conversations])

  useEffect(() => {
    // 洞察生成の条件をチェック
    const hasValidConversations = state.conversations && 
                                  Array.isArray(state.conversations) && 
                                  state.conversations.length > 0 &&
                                  state.conversations.some(conv => conv.content && conv.content.trim() !== '')
    
    console.log('🔍 InsightRefine useEffect triggered:', {
      hasValidConversations,
      conversationsLength: state.conversations?.length || 0,
      hasInsights: !!insights,
      isLoading: chatOptimized.isLoading,
      hasExecuted
    })
    
    // 条件: 有効な会話があり、洞察がなく、ローディング中でなく、まだ実行していない場合
    if (hasValidConversations && !insights && !chatOptimized.isLoading && !hasExecuted) {
      console.log('✅ 自動洞察生成を開始:', { 
        conversationsCount: state.conversations.length,
        hasInsights: !!insights,
        isLoading: chatOptimized.isLoading 
      })
      
      setHasExecuted(true)
      generateInsights()
    }
  }, [insights, hasExecuted]) // chatOptimized.isLoadingを除去して無限ループを防ぐ

  // Cleanup on unmount - cancel any ongoing requests
  useEffect(() => {
    return () => {
      // cleanup関数を呼ぶが、エラーは無視
      try {
        chatOptimized.cleanup()
      } catch (error) {
        // cleanup時のエラーは無視
      }
    }
  }, [])

  const handleNext = () => {
    if (insights) {
      actions.setInsights(insights)
      actions.nextPhase()
    }
  }

  const handleRegenerate = () => {
    setInsights(null)
    setHasExecuted(false)
    // 少し遅延を入れてuseEffectが適切に実行されるようにする
    setTimeout(() => {
      if (!hasExecuted) {
        setHasExecuted(true)
        generateInsights()
      }
    }, 50)
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
                <h2 className="text-2xl font-bold mb-2">InsightRefine - 洞察の精製</h2>
                <p className="text-white/90">
                  あなたの対話から重要な洞察を抽出します
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {chatOptimized.isLoading && (
                <button
                  onClick={chatOptimized.cancelRequest}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-white"
                >
                  <X className="w-4 h-4" />
                  キャンセル
                </button>
              )}
              {insights && !chatOptimized.isLoading && (
                <button
                  onClick={handleRegenerate}
                  disabled={chatOptimized.isLoading}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors disabled:opacity-50"
                >
                  <RefreshCw className="w-4 h-4" />
                  再生成
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
          {/* エラー表示 */}
          {chatOptimized.error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex justify-between items-center">
                <p className="text-red-600">{chatOptimized.error}</p>
                <button
                  onClick={chatOptimized.clearError}
                  className="text-red-400 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          
          {chatOptimized.isLoading ? (
            <div className="text-center py-16">
              <ProcessingSpinner />
              <div className="mt-8 space-y-2">
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-gray-600"
                >
                  対話内容を分析しています...
                </motion.p>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="text-gray-500 text-sm"
                >
                  ビジョンとターゲットを特定中
                </motion.p>
              </div>
            </div>
          ) : insights ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* ビジョン */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-blue-900">ビジョン</h3>
                </div>
                <p className="text-blue-800 text-lg leading-relaxed">
                  {insights.vision}
                </p>
              </motion.div>

              {/* ターゲットユーザー */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-100"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-green-900">ターゲットユーザー</h3>
                </div>
                <p className="text-green-800 text-lg leading-relaxed">
                  {insights.target}
                </p>
              </motion.div>

              {/* 主要機能 */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-100"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-purple-900">主要機能</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {insights.features?.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="bg-white p-3 rounded-lg border border-purple-200 text-purple-800"
                    >
                      • {feature}
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* 提供価値 */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-lg border border-red-100"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                    <Heart className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-red-900">提供価値</h3>
                </div>
                <p className="text-red-800 text-lg leading-relaxed">
                  {insights.value}
                </p>
              </motion.div>

              {/* 動機 */}
              {insights.motivation && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-r from-gray-50 to-slate-50 p-6 rounded-lg border border-gray-100"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-3">作りたい理由</h3>
                  <p className="text-gray-800 text-lg leading-relaxed">
                    {insights.motivation}
                  </p>
                </motion.div>
              )}

              {/* 次へボタン */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center pt-4"
              >
                <button
                  onClick={handleNext}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-matura-primary to-matura-secondary text-white rounded-lg font-medium transition-all hover:shadow-lg transform hover:scale-105"
                >
                  UIデザインを選択する
                  <ArrowRight className="w-5 h-5" />
                </button>
              </motion.div>
            </motion.div>
          ) : !insights && !chatOptimized.isLoading ? (
            <div className="text-center py-16">
              {/* より詳細な状態判定でUI分岐 */}
              {(() => {
                // conversationsが完全に未定義または空
                if (!state.conversations || state.conversations.length === 0) {
                  return (
                    <div>
                      <p className="text-gray-600 mb-4">対話データを読み込み中...</p>
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-matura-primary mx-auto"></div>
                    </div>
                  )
                }
                
                // conversationsは存在するが有効なコンテンツがない
                const hasValidContent = state.conversations.some(conv => 
                  conv && conv.content && conv.content.trim() !== ''
                )
                
                if (!hasValidContent) {
                  return (
                    <div>
                      <p className="text-yellow-600 mb-4">有効な対話データが見つかりません</p>
                      <p className="text-gray-500 text-sm mb-4">
                        まず前のフェーズでしっかりと対話を行ってください
                      </p>
                      <button
                        onClick={handleRegenerate}
                        disabled={chatOptimized.isLoading}
                        className="px-6 py-2 bg-matura-primary text-white rounded-lg hover:bg-matura-secondary transition-colors disabled:opacity-50"
                      >
                        再試行
                      </button>
                    </div>
                  )
                }
                
                // 有効なデータはあるが生成に失敗した
                return (
                  <div>
                    <p className="text-red-600 mb-4">洞察の生成に失敗しました</p>
                    <button
                      onClick={handleRegenerate}
                      disabled={chatOptimized.isLoading}
                      className="px-6 py-2 bg-matura-primary text-white rounded-lg hover:bg-matura-secondary transition-colors disabled:opacity-50"
                    >
                      再試行
                    </button>
                  </div>
                )
              })()}
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  )
}