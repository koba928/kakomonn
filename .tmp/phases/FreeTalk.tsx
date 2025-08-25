'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, ArrowRight, Sparkles, Wand2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ChatMessage, { WelcomeMessage } from '@/components/shared/ChatMessage'
import PreviewButton from '@/components/shared/PreviewButton'
import { ThinkingSpinner } from '@/components/shared/LoadingSpinner'
import { useMatura } from '@/components/providers/MaturaProvider'
import { useChatOptimized } from '@/hooks/useChatOptimized'
import { sanitizeInput } from '@/lib/utils'

export default function FreeTalk() {
  const { state, actions } = useMatura()
  const chatOptimized = useChatOptimized()
  const [input, setInput] = useState('')
  const [showContinueButton, setShowContinueButton] = useState(false)
  const [showMagicButton, setShowMagicButton] = useState(false)
  const [isExtracting, setIsExtracting] = useState(false)
  const [typingDelay, setTypingDelay] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // 自動スクロール
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [state.conversations, chatOptimized.isLoading])

  // Cleanup only on component unmount
  useEffect(() => {
    return () => {
      chatOptimized.cleanup()
    }
  }, [])

  // 5往復以上で次のフェーズボタンを表示
  useEffect(() => {
    const userMessages = state.conversations.filter(m => m.role === 'user').length
    if (userMessages >= 3) {
      setShowContinueButton(true)
    }
  }, [state.conversations])

  // 🧠 ULTRA THINK: 10メッセージ以上でマジックボタンを表示
  useEffect(() => {
    const totalMessages = state.conversations.length
    console.log('💫 [MAGIC-BUTTON] Total messages:', totalMessages)
    console.log('💫 [MAGIC-BUTTON] Structure extracted:', state.structureExtracted)
    
    if (totalMessages >= 10 && !state.structureExtracted && !showMagicButton) {
      console.log('✨ [MAGIC-BUTTON] Showing magic button!')
      setShowMagicButton(true)
    }
  }, [state.conversations.length, state.structureExtracted, showMagicButton])


  const handleSend = React.useCallback(async () => {
    if (!input.trim() || chatOptimized.isLoading) {
      return
    }

    const sanitizedInput = sanitizeInput(input)
    actions.addMessage(sanitizedInput, 'user', 'FreeTalk')
    setInput('')

    // 🧠 ULTRA THINK: 人間らしい遅延を追加
    setTypingDelay(true)
    setTimeout(() => setTypingDelay(false), 500)

    // Create updated conversations array manually since state might not be updated yet
    const updatedConversations = [
      ...state.conversations,
      {
        id: `temp-${Date.now()}`,
        content: sanitizedInput,
        role: 'user' as const,
        timestamp: new Date(),
        phase: 'FreeTalk'
      }
    ]

    try {
      const result = await chatOptimized.sendMessage(
        sanitizedInput,
        updatedConversations,
        'FreeTalk',
        {
          // 構造抽出のリクエストを含める
          requestStructureExtraction: updatedConversations.length >= 10 && !state.structureExtracted,
          onNewMessage: (response: string, data?: any) => {
            if (!response || typeof response !== 'string' || response.trim().length === 0) {
              return
            }
            
            // 構造抽出結果があれば保存
            if (data?.extractedStructure) {
              console.log('🎯 [STRUCTURE] Extracted structure received:', data.extractedStructure)
              actions.setExtractedStructure(data.extractedStructure)
            }
            
            actions.addMessage(response.trim(), 'assistant', 'FreeTalk')
          },
          onError: (error) => {
            // Error handling without debug logs
          }
        }
      )
      
    } catch (sendError) {
      // Error handled silently
    }
  }, [input, state.conversations, chatOptimized.isLoading, actions.addMessage, actions.setExtractedStructure, state.structureExtracted])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleContinue = () => {
    actions.nextPhase()
  }

  // 🧠 ULTRA THINK: マジックボタンのハンドラー
  const handleMagicButton = React.useCallback(async () => {
    setIsExtracting(true)
    setShowMagicButton(false)
    
    try {
      // 構造抽出を強制実行
      const result = await chatOptimized.sendMessage(
        '🪄 アイデアの整理をお願いします', // マジック文言
        state.conversations,
        'FreeTalk',
        {
          requestStructureExtraction: true,
          onNewMessage: (response: string, data?: any) => {
            if (data?.extractedStructure) {
              console.log('🎯 [MAGIC] Structure extracted:', data.extractedStructure)
              actions.setExtractedStructure(data.extractedStructure)
              
              // 構造抽出後、次のフェーズに進む
              setTimeout(() => {
                actions.nextPhase()
              }, 1500)
            }
            
            // マジックレスポンスを追加
            actions.addMessage('✨ アイデアが整理できました！次のステップに進みましょう', 'assistant', 'FreeTalk')
          },
          onError: (error) => {
            console.error('Magic button error:', error)
            setIsExtracting(false)
          }
        }
      )
    } catch (error) {
      console.error('Magic button failed:', error)
      setIsExtracting(false)
    }
  }, [state.conversations, chatOptimized, actions])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
        {/* ヘッダー */}
        <div className="bg-gradient-to-r from-matura-primary to-matura-secondary p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold mb-2">FreeTalk - 自由対話</h2>
              <p className="text-white/90">
                あなたのアイデアを自由にお話しください。なんでも大丈夫です！
              </p>
            </div>
            <PreviewButton 
              data={state.conversations} 
              title="対話履歴"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            />
          </div>
        </div>

        {/* チャット領域 */}
        <div className="h-[500px] overflow-y-auto p-6 bg-gray-50">
          
          {state.conversations.length === 0 ? (
            <WelcomeMessage />
          ) : (
            <div className="space-y-4">
              {state.conversations.map((message, index) => (
                <ChatMessage key={message.id} message={message} />
              ))}
            </div>
          )}
          
          {/* ローディング・タイピング */}
          {(chatOptimized.isLoading || typingDelay) && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl rounded-bl-md p-4 shadow-sm border border-gray-200">
                {isExtracting ? (
                  <div className="flex items-center gap-2">
                    <Wand2 className="w-5 h-5 animate-spin text-purple-500" />
                    <span className="text-sm text-purple-600">✨ アイデアを整理しています...</span>
                  </div>
                ) : (
                  <ThinkingSpinner />
                )}
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* エラー表示 */}
        {chatOptimized.error && (
          <div className="px-6 py-3 bg-red-50 border-t border-red-100">
            <div className="flex justify-between items-center">
              <p className="text-red-600 text-sm">{chatOptimized.error}</p>
              <button
                onClick={chatOptimized.clearError}
                className="text-red-400 hover:text-red-600 text-sm"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* 入力エリア */}
        <div className="p-6 bg-white border-t border-gray-100">
          <div className="flex gap-3">
            <div className="flex-1">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="アイデアを入力してください...（例：英語学習に特化したToDoアプリを作りたい）"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-matura-primary focus:border-transparent resize-none"
                rows={3}
                disabled={chatOptimized.isLoading}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={!input.trim() || chatOptimized.isLoading}
              className="px-6 py-3 bg-matura-primary text-white rounded-lg font-medium transition-all hover:bg-matura-secondary disabled:opacity-50 disabled:cursor-not-allowed self-end"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          
          {/* 🧠 ULTRA THINK: マジックボタン */}
          <AnimatePresence>
            {showMagicButton && !isExtracting && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                className="mt-6 text-center"
              >
                <motion.button
                  onClick={handleMagicButton}
                  disabled={isExtracting}
                  className="relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ 
                    boxShadow: [
                      "0 4px 20px rgba(147, 51, 234, 0.3)",
                      "0 4px 20px rgba(236, 72, 153, 0.3)",
                      "0 4px 20px rgba(239, 68, 68, 0.3)",
                      "0 4px 20px rgba(147, 51, 234, 0.3)"
                    ]
                  }}
                  transition={{ 
                    boxShadow: { 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    ✨
                  </motion.div>
                  アイデアが形になってきた！作ってみる？
                  <Sparkles className="w-6 h-6" />
                </motion.button>
                <motion.p 
                  className="text-sm text-gray-600 mt-3 font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  🎨 会話から自動でアプリの設計を生成します
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* 次のフェーズボタン */}
          <AnimatePresence>
            {showContinueButton && !showMagicButton && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 text-center"
              >
                <button
                  onClick={handleContinue}
                  className="inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-matura-secondary to-matura-accent text-white rounded-lg font-medium transition-all hover:shadow-lg transform hover:scale-105"
                >
                  洞察を精製する
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  十分に対話ができました！次のステップに進みましょう
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}