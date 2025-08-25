'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { 
  Lightbulb, Users, Package, Zap, TrendingUp, 
  ArrowRight, RefreshCw, Smartphone, Monitor, 
  Globe, Layout, Palette, Type, Navigation,
  MousePointer, Sparkles, Code2, Heart
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import PreviewButton from '@/components/shared/PreviewButton'
import { ProcessingSpinner } from '@/components/shared/LoadingSpinner'
import { useMatura } from '@/components/providers/MaturaProvider'
import { useChatOptimized } from '@/hooks/useChatOptimized'

interface UXStructure {
  // 構造化されたアイデアから導かれるUX設計
  siteArchitecture: {
    topPage: { purpose: string; elements: string[] }
    mainFeatures: { name: string; description: string; uiElements: string[] }[]
    userFlow: string[]
  }
  designSystem: {
    layout: string
    colorUsage: { primary: string; secondary: string; accent: string; usage: string }
    typography: { heading: string; body: string; accent: string }
    spacing: string
    interactions: string[]
  }
  keyScreens: {
    name: string
    purpose: string
    components: string[]
    userAction: string
  }[]
}

export default function UXBuild() {
  const { state, actions } = useMatura()
  const chatOptimized = useChatOptimized()
  const [uxStructure, setUxStructure] = useState<UXStructure | null>(null)
  const [activeSection, setActiveSection] = useState<'why' | 'who' | 'what' | 'how' | 'impact'>('why')

  const generateUXStructure = useCallback(async () => {
    try {
      // 構造化されたアイデアとUIスタイルから最適なUX構造を生成
      const prompt = `
以下の構造化されたアイデアとUIスタイルから、最適なWebアプリケーションのUX構造を設計してください。

【構造化されたアイデア】
- Why (ビジョン): ${state.insights?.vision}
- Who (ターゲット): ${state.insights?.target}
- What (主要機能): ${state.insights?.features?.join(', ')}
- How (提供価値): ${state.insights?.value}
- Impact (期待効果): ${state.insights?.motivation}

【選択されたUIスタイル】
- スタイル名: ${state.selectedUIStyle?.name}
- カテゴリ: ${state.selectedUIStyle?.category}
- 特徴: ${state.selectedUIStyle?.personality?.join(', ')}
- カラー: Primary(${state.selectedUIStyle?.colors.primary}), Secondary(${state.selectedUIStyle?.colors.secondary})

以下のJSON形式で出力してください：
{
  "siteArchitecture": {
    "topPage": {
      "purpose": "トップページの目的",
      "elements": ["ヒーローセクション", "価値提案", "CTA"]
    },
    "mainFeatures": [
      {
        "name": "機能名",
        "description": "説明",
        "uiElements": ["ボタン", "フォーム", "カード"]
      }
    ],
    "userFlow": ["ステップ1", "ステップ2", "ステップ3"]
  },
  "designSystem": {
    "layout": "レイアウトパターン",
    "colorUsage": {
      "primary": "プライマリカラーの使用箇所",
      "secondary": "セカンダリカラーの使用箇所",
      "accent": "アクセントカラーの使用箇所",
      "usage": "色の使い方の指針"
    },
    "typography": {
      "heading": "見出しのスタイル",
      "body": "本文のスタイル",
      "accent": "強調テキストのスタイル"
    },
    "spacing": "余白の取り方",
    "interactions": ["ホバー効果", "トランジション", "アニメーション"]
  },
  "keyScreens": [
    {
      "name": "画面名",
      "purpose": "画面の目的",
      "components": ["コンポーネント1", "コンポーネント2"],
      "userAction": "ユーザーが行うアクション"
    }
  ]
}
`

      const response = await chatOptimized.sendMessage(
        prompt,
        [],
        'UXBuild',
        {
          timeout: 45000,
          requestStructureExtraction: true,
          onError: (error) => {
            console.error('❌ UX構造生成エラー:', error)
            // AbortErrorの場合はUI状態をリセット
            if (error.includes('aborted') || error.includes('abort')) {
              console.log('🚫 UX Build request was aborted, not showing error to user')
              return
            }
          }
        }
      )

      if (response) {
        try {
          const parsed = JSON.parse(response)
          setUxStructure(parsed)
          actions.setUXDesign(parsed as any)
        } catch (error) {
          console.error('Failed to parse UX structure:', error)
          // フォールバックデータを使用
          createFallbackStructure()
        }
      }
    } catch (error) {
      console.error('UX structure generation error:', error)
      // ユーザーの意図的なキャンセルの場合はフォールバック作成しない
      if (error instanceof Error && error.name === 'AbortError') {
        console.log('🚫 Request was intentionally aborted, not creating fallback')
        return
      }
      createFallbackStructure()
    }
  }, [state.insights, state.selectedUIStyle, chatOptimized, actions])

  useEffect(() => {
    // 少し遅延を入れて、状態が確実に更新されるのを待つ
    const timer = setTimeout(() => {
      if (state.insights && state.selectedUIStyle && !uxStructure && !chatOptimized.isLoading) {
        console.log('🎯 Auto-triggering UX structure generation:', {
          hasInsights: !!state.insights,
          hasUIStyle: !!state.selectedUIStyle,
          hasUXStructure: !!uxStructure,
          isLoading: chatOptimized.isLoading
        })
        generateUXStructure()
      }
    }, 100)
    
    return () => clearTimeout(timer)
  }, [state.insights, state.selectedUIStyle, uxStructure, chatOptimized.isLoading])

  const createFallbackStructure = () => {
    const fallback: UXStructure = {
      siteArchitecture: {
        topPage: {
          purpose: `${state.insights?.vision || 'ビジョン'}を実現するエントリーポイント`,
          elements: ['ヒーローセクション', '価値提案', 'CTAボタン', '機能紹介']
        },
        mainFeatures: state.insights?.features?.slice(0, 3).map(feature => ({
          name: feature,
          description: `${state.insights?.target}のための${feature}機能`,
          uiElements: ['入力フォーム', 'アクションボタン', '結果表示エリア']
        })) || [],
        userFlow: ['トップページ訪問', '価値を理解', '機能を試す', '結果を確認', '継続利用']
      },
      designSystem: {
        layout: state.selectedUIStyle?.spacing === 'comfortable' ? 'カード型レイアウト' : 'グリッドレイアウト',
        colorUsage: {
          primary: 'CTAボタン、重要なアクション',
          secondary: 'サブアクション、リンク',
          accent: '通知、成功メッセージ',
          usage: `${state.selectedUIStyle?.name}スタイルに基づく統一感のある配色`
        },
        typography: {
          heading: state.selectedUIStyle?.category === 'minimal' ? 'シンプルで読みやすい' : 'インパクトのある',
          body: '可読性重視',
          accent: '重要箇所の強調'
        },
        spacing: state.selectedUIStyle?.spacing || 'balanced',
        interactions: ['スムーズなホバー効果', 'フェードトランジション', 'マイクロアニメーション']
      },
      keyScreens: [
        {
          name: 'ランディングページ',
          purpose: '価値提案と信頼構築',
          components: ['ヒーロー', 'ベネフィット', 'ソーシャルプルーフ'],
          userAction: 'サービスを理解して試す'
        }
      ]
    }
    setUxStructure(fallback)
    actions.setUXDesign(fallback as any)
  }

  const structuredIdea = {
    why: { 
      icon: Lightbulb, 
      label: 'Why - なぜ必要か', 
      content: state.insights?.vision,
      color: 'from-amber-500 to-orange-500'
    },
    who: { 
      icon: Users, 
      label: 'Who - 誰のために', 
      content: state.insights?.target,
      color: 'from-blue-500 to-cyan-500'
    },
    what: { 
      icon: Package, 
      label: 'What - 何を提供', 
      content: state.insights?.features?.join('、'),
      color: 'from-purple-500 to-pink-500'
    },
    how: { 
      icon: Zap, 
      label: 'How - どう実現', 
      content: state.insights?.value,
      color: 'from-green-500 to-emerald-500'
    },
    impact: { 
      icon: TrendingUp, 
      label: 'Impact - 期待効果', 
      content: state.insights?.motivation,
      color: 'from-red-500 to-rose-500'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4"
    >
      {/* ヘッダー：あなたのアプリがどうなるか */}
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 rounded-2xl shadow-xl overflow-hidden mb-8 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="relative z-10 p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6"
            >
              <Sparkles className="w-10 h-10 text-yellow-300" />
            </motion.div>
            <h2 className="text-4xl font-bold mb-4 text-white">
              あなたのアプリはこうなります
            </h2>
            <p className="text-xl text-indigo-100 max-w-3xl mx-auto leading-relaxed">
              <span className="font-bold text-yellow-300">{state.selectedUIStyle?.name}スタイル</span>で
              <span className="font-bold text-cyan-300">{state.insights?.target}</span>のための
              <span className="font-bold text-pink-300">{state.insights?.vision}</span>を実現
            </p>
          </div>

          {/* アイデアの要素をビジュアルに表示 */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {Object.entries(structuredIdea).map(([key, item]) => {
              const Icon = item.icon
              const isActive = activeSection === key
              return (
                <motion.button
                  key={key}
                  onClick={() => setActiveSection(key as any)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`
                    relative p-4 rounded-xl transition-all
                    ${isActive 
                      ? 'bg-white text-indigo-900 shadow-2xl' 
                      : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm'
                    }
                  `}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-xl opacity-20"
                    />
                  )}
                  <div className="relative z-10">
                    <Icon className="w-8 h-8 mx-auto mb-2" />
                    <div className="text-sm font-bold">{item.label.split(' - ')[0]}</div>
                    <div className="text-xs opacity-80 mt-1">{item.label.split(' - ')[1]}</div>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>

        {/* アクティブな要素の詳細をわかりやすく表示 */}
        <div className="p-8 bg-gradient-to-b from-gray-50 to-white">
          <AnimatePresence mode="wait">
            {Object.entries(structuredIdea).map(([key, item]) => {
              if (activeSection !== key) return null
              const Icon = item.icon
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="text-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${item.color} flex items-center justify-center mx-auto mb-4 shadow-lg`}
                  >
                    <Icon className="w-10 h-10 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.label}</h3>
                  <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">{item.content}</p>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* メインコンテンツ */}
      {chatOptimized.isLoading ? (
        <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
          <ProcessingSpinner />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <p className="text-gray-600 text-lg">構造化されたアイデアからUXを設計中...</p>
            <p className="text-gray-500 mt-2">
              {state.selectedUIStyle?.name}スタイルに最適化しています
            </p>
          </motion.div>
        </div>
      ) : uxStructure ? (
        <div className="space-y-8">
          {/* 実際の画面構成をビジュアルに */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-3xl font-bold mb-2">🖥️ こんな画面構成になります</h3>
                  <p className="text-blue-100 text-lg">実際のユーザーが見る画面の流れ</p>
                </div>
                <Monitor className="w-16 h-16 text-blue-200" />
              </div>
            </div>
            <div className="p-8">
              {/* 最初に見る画面 */}
              <div className="mb-10">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-8 border-2 border-blue-200">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900">最初に見る画面（トップページ）</h4>
                      <p className="text-gray-600">訪問者が最初に目にする、大切な入り口</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
                    <p className="text-gray-800 text-lg font-medium mb-4">
                      💡 {uxStructure.siteArchitecture.topPage.purpose}
                    </p>
                    <p className="text-gray-600 mb-6">
                      ユーザーは<span className="font-bold text-blue-600">数秒で判断</span>します。
                      だから、一目で価値が伝わる構成にしています。
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {uxStructure.siteArchitecture.topPage.elements.map((element, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * i }}
                          className="flex items-center gap-3 bg-blue-50 rounded-lg p-4"
                        >
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold">{i + 1}</span>
                          </div>
                          <div>
                            <p className="font-bold text-blue-900">{element}</p>
                            <p className="text-sm text-gray-600">
                              {element === 'ヒーローセクション' ? '最初に目に入る大きなビジュアル' :
                               element === '価値提案' ? 'なぜこのサービスが必要か' :
                               element === 'CTAボタン' ? '次のアクションへの誘導' :
                               element === '機能紹介' ? '何ができるかを簡潔に' :
                               '重要な情報'}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* それぞれの機能画面 */}
              <div className="mb-10">
                <h4 className="text-2xl font-bold text-gray-900 mb-6 text-center">各機能の画面イメージ</h4>
                <div className="grid md:grid-cols-2 gap-6">
                  {uxStructure.siteArchitecture.mainFeatures.map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 * i }}
                      className="bg-gradient-to-br from-gray-50 to-white rounded-xl border-2 border-gray-200 overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      <div className="bg-gradient-to-r from-gray-700 to-gray-800 text-white p-4">
                        <h5 className="font-bold text-lg flex items-center gap-2">
                          <Smartphone className="w-5 h-5" />
                          {feature.name}
                        </h5>
                      </div>
                      <div className="p-6">
                        <p className="text-gray-700 mb-4 leading-relaxed">{feature.description}</p>
                        <div className="bg-gray-100 rounded-lg p-4">
                          <p className="text-sm font-semibold text-gray-600 mb-3">この画面に含まれるパーツ：</p>
                          <div className="space-y-2">
                            {feature.uiElements.map((ui, j) => (
                              <div key={j} className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                                <span className="text-sm text-gray-700">
                                  {ui}
                                  <span className="text-gray-500 ml-2">
                                    {ui === '入力フォーム' ? '- ユーザーが情報を入力' :
                                     ui === 'アクションボタン' ? '- 処理を実行' :
                                     ui === '結果表示エリア' ? '- 結果をわかりやすく表示' :
                                     ''}
                                  </span>
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* ユーザーの操作の流れ */}
              <div className="bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl p-8">
                <h4 className="text-2xl font-bold text-gray-900 mb-6 text-center">使う人の体験ストーリー</h4>
                <div className="relative">
                  <div className="absolute left-8 top-12 bottom-0 w-1 bg-blue-300" />
                  <div className="space-y-6">
                    {uxStructure.siteArchitecture.userFlow.map((step, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * i }}
                        className="flex items-center gap-4"
                      >
                        <div className="relative z-10 w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                          {i + 1}
                        </div>
                        <div className="flex-1 bg-white rounded-xl p-6 shadow-md">
                          <p className="font-bold text-gray-900 text-lg">{step}</p>
                          <p className="text-gray-600 text-sm mt-1">
                            {i === 0 ? 'まずはここから始まります' :
                             i === uxStructure.siteArchitecture.userFlow.length - 1 ? '目標達成！' :
                             'スムーズに次のステップへ'}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 見た目と操作感の特徴 */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8">
              <div className="text-center">
                <Heart className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-3xl font-bold mb-2">見た目と操作感の特徴</h3>
                <p className="text-purple-100 text-lg">
                  {state.selectedUIStyle?.name}スタイルがもたらす、特別な体験
                </p>
              </div>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 画面を開いたときの印象 */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-purple-200 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Layout className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl text-purple-900">画面を開いた瞬間の印象</h4>
                      <p className="text-sm text-purple-600">ユーザーが最初に感じること</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <p className="text-gray-800 text-lg leading-relaxed mb-4">
                      {uxStructure.designSystem.layout === 'カード型レイアウト' 
                        ? '「わかりやすい！」と感じる、整理された情報配置'
                        : uxStructure.designSystem.layout === 'グリッドレイアウト'
                        ? '「プロっぽい！」と感じる、洗練されたデザイン'
                        : '「使いやすそう！」と感じる、親しみやすいデザイン'
                      }
                    </p>
                    <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-lg">
                      <Sparkles className="w-6 h-6 text-purple-600" />
                      <div>
                        <p className="font-semibold text-purple-900">
                          {state.selectedUIStyle?.spacing === 'comfortable' ? '余白たっぷり' : 'コンパクト設計'}
                        </p>
                        <p className="text-sm text-purple-700">
                          {state.selectedUIStyle?.spacing === 'comfortable' 
                            ? '目が疲れにくく、長時間使っても快適' 
                            : '一画面でたくさんの情報を確認できる'}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* 色が伝える印象 */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-8 border-2 border-pink-200 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Palette className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl text-pink-900">色が伝えるメッセージ</h4>
                      <p className="text-sm text-pink-600">色には意味があります</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-xl shadow-md" style={{ backgroundColor: state.selectedUIStyle?.colors.primary }} />
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 text-lg">メインカラー</p>
                          <p className="text-gray-600">ブランドの顔となる色</p>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          <span className="font-semibold">使われる場所：</span><br/>
                          重要なボタン、メニュー、見出し、アイコンなど<br/>
                          <span className="text-pink-600 font-medium">ユーザーに「ここが大事！」と伝える色です</span>
                        </p>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-xl shadow-md" style={{ backgroundColor: state.selectedUIStyle?.colors.secondary }} />
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 text-lg">サブカラー</p>
                          <p className="text-gray-600">全体を調和させる色</p>
                        </div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-700 leading-relaxed">
                          <span className="font-semibold">使われる場所：</span><br/>
                          背景、境界線、補助的な要素など<br/>
                          <span className="text-purple-600 font-medium">画面全体に統一感を生み出す色です</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* 文字の見やすさ */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-8 border-2 border-orange-200 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <Type className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl text-orange-900">文字の見やすさ設計</h4>
                      <p className="text-sm text-orange-600">読みやすさは使いやすさ</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="space-y-4">
                      <div className="p-4 bg-orange-50 rounded-lg">
                        <p className="font-bold text-2xl text-gray-900 mb-2">見出しの文字</p>
                        <p className="text-gray-700">
                          {uxStructure.designSystem.typography.heading === 'シンプルで読みやすい'
                            ? '清潔感のある書体で、情報がスッと頭に入ります'
                            : 'インパクトのある書体で、大事な情報が一目でわかります'
                          }
                        </p>
                      </div>
                      <div className="p-4 bg-yellow-50 rounded-lg">
                        <p className="text-base leading-relaxed text-gray-800">
                          本文の文字はこんな感じです。適度な大きさと行間で、
                          長い文章でも疲れずに読めるよう工夫しています。
                          {state.selectedUIStyle?.category === 'minimal' 
                            ? 'シンプルで洗練された印象を大切にしています。' 
                            : '親しみやすく、読みやすい文字設定です。'}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* 触って楽しい操作感 */}
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 border-2 border-teal-200 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <MousePointer className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl text-teal-900">触って楽しい操作感</h4>
                      <p className="text-sm text-teal-600">使うたびに気持ちいい</p>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <p className="text-gray-800 mb-6 text-lg">
                      細部にまでこだわった、心地よい操作体験
                    </p>
                    <div className="grid gap-3">
                      {uxStructure.designSystem.interactions.map((interaction, i) => (
                        <motion.div 
                          key={i} 
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * i }}
                          className="flex items-center gap-4 p-4 bg-teal-50 rounded-lg"
                        >
                          <div className="w-12 h-12 bg-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ repeat: Infinity, duration: 2, delay: i * 0.5 }}
                            >
                              {i === 0 ? <MousePointer className="w-6 h-6 text-white" /> :
                               i === 1 ? <Navigation className="w-6 h-6 text-white" /> :
                               <Sparkles className="w-6 h-6 text-white" />}
                            </motion.div>
                          </div>
                          <div>
                            <p className="font-semibold text-teal-900">
                              {interaction === 'スムーズなホバー効果' ? 'カーソルを合わせると' :
                               interaction === 'フェードトランジション' ? '画面が切り替わるとき' :
                               interaction === 'マイクロアニメーション' ? 'ボタンを押したとき' :
                               interaction}
                            </p>
                            <p className="text-sm text-teal-700">
                              {interaction === 'スムーズなホバー効果' ? 'ふわっと色が変わって、押せる場所がわかります' :
                               interaction === 'フェードトランジション' ? 'スムーズに切り替わって、目に優しい' :
                               interaction === 'マイクロアニメーション' ? 'ちょっとした動きで、操作した実感が得られます' :
                               interaction}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* まとめ：全体の印象 */}
              <div className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />
                <div className="relative z-10">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Sparkles className="w-8 h-8 text-yellow-300" />
                    <h5 className="font-bold text-2xl">完成するアプリの全体像</h5>
                    <Sparkles className="w-8 h-8 text-yellow-300" />
                  </div>
                  <p className="text-xl leading-relaxed text-center max-w-3xl mx-auto">
                    <span className="font-bold text-yellow-300">{state.selectedUIStyle?.name}スタイル</span>の特徴を活かして、
                    <span className="font-bold text-cyan-300">{state.insights?.target}</span>が
                    「{state.insights?.vision}」を実感できる、
                    <span className="font-bold">統一感のある美しいデザイン</span>に仕上がります。
                  </p>
                  <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                      <p className="text-yellow-300 font-bold mb-1">見た目</p>
                      <p className="text-sm">プロフェッショナル</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                      <p className="text-cyan-300 font-bold mb-1">操作性</p>
                      <p className="text-sm">直感的でスムーズ</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
                      <p className="text-pink-300 font-bold mb-1">体験</p>
                      <p className="text-sm">心地よく楽しい</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 実際の画面例 */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-8">
              <div className="text-center">
                <Smartphone className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-3xl font-bold mb-2">実際の画面イメージ</h3>
                <p className="text-green-100 text-lg">こんな画面が完成します</p>
              </div>
            </div>
            <div className="p-8">
              {uxStructure.keyScreens.map((screen, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * i }}
                  className="mb-8"
                >
                  <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-8 border-2 border-green-200">
                    <div className="text-center mb-8">
                      <h4 className="text-3xl font-bold text-gray-900 mb-3">{screen.name}</h4>
                      <p className="text-xl text-gray-700">{screen.purpose}</p>
                    </div>
                    
                    {/* 画面のモックアップ風表示 */}
                    <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
                      <div className="bg-gray-100 rounded-lg p-6 mb-6">
                        <div className="h-20 bg-gradient-to-r from-gray-300 to-gray-400 rounded-lg mb-4 animate-pulse" />
                        <div className="grid grid-cols-3 gap-4">
                          {screen.components.slice(0, 3).map((comp, j) => (
                            <div key={j} className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                              <div className="h-4 bg-gray-300 rounded mb-2" />
                              <p className="text-center text-sm text-gray-600">{comp}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white rounded-lg p-6 text-center">
                        <p className="text-lg font-semibold mb-2">ユーザーはここで：</p>
                        <p className="text-xl">{screen.userAction}</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <Layout className="w-5 h-5 text-green-600" />
                          この画面の構成要素
                        </h5>
                        <div className="space-y-3">
                          {screen.components.map((comp, j) => (
                            <div key={j} className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-green-600 font-bold text-sm">{j + 1}</span>
                              </div>
                              <div>
                                <p className="font-semibold text-gray-800">{comp}</p>
                                <p className="text-sm text-gray-600">
                                  {comp.includes('ヒーロー') ? 'ユーザーの目を引く大きなビジュアル' :
                                   comp.includes('ベネフィット') ? 'サービスの価値をわかりやすく説明' :
                                   comp.includes('フォーム') ? 'ユーザーが情報を入力する場所' :
                                   comp.includes('ボタン') ? '次のアクションへ誘導' :
                                   '重要な情報を表示'}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-xl p-6 shadow-sm">
                        <h5 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <MousePointer className="w-5 h-5 text-teal-600" />
                          この画面での体験
                        </h5>
                        <div className="bg-gradient-to-br from-teal-50 to-green-50 rounded-lg p-6">
                          <p className="text-gray-800 leading-relaxed">
                            {screen.name === 'ランディングページ' 
                              ? `最初の印象が大切。${state.selectedUIStyle?.name}スタイルで、訪問者の心をつかみます。` 
                              : `使いやすさを第一に。${state.insights?.target}が迷わず操作できる設計です。`}
                          </p>
                          <div className="mt-4 flex items-center gap-2 text-sm text-teal-700">
                            <Sparkles className="w-4 h-4" />
                            <span>スムーズな操作で、目的達成まで導きます</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* コード生成への導線（よりわかりやすく） */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl" />
            <div className="absolute inset-0 bg-black/20" />
            <motion.div
              animate={{ 
                background: [
                  'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                  'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
                  'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)'
                ]
              }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute inset-0"
            />
            
            <div className="relative z-10 p-12 text-white text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.5 }}
              >
                <Sparkles className="w-24 h-24 mx-auto mb-6 text-yellow-300" />
              </motion.div>
              
              <h3 className="text-4xl font-bold mb-6">
                準備完了！コードを生成しましょう
              </h3>
              
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 max-w-3xl mx-auto mb-8">
                <h4 className="text-2xl font-bold mb-4">これから生成されるもの：</h4>
                <div className="grid md:grid-cols-3 gap-4 text-left">
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-yellow-300 font-bold mb-2">📄 HTML</div>
                    <p className="text-sm">画面の構造</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-cyan-300 font-bold mb-2">🎨 CSS</div>
                    <p className="text-sm">見た目のデザイン</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-pink-300 font-bold mb-2">⚡ JavaScript</div>
                    <p className="text-sm">動きと機能</p>
                  </div>
                </div>
                <p className="mt-6 text-lg">
                  <span className="font-bold text-yellow-300">{state.selectedUIStyle?.name}スタイル</span>で
                  <span className="font-bold text-cyan-300">{state.insights?.target}</span>のための
                  <span className="font-bold text-pink-300">「{state.insights?.vision}」</span>を実現する
                  <span className="font-bold">完全に動作するWebアプリ</span>が完成します！
                </p>
              </div>
              
              <motion.button
                onClick={() => actions.nextPhase()}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-4 px-12 py-6 bg-white text-indigo-600 rounded-2xl font-bold text-2xl shadow-2xl hover:shadow-3xl transition-all"
              >
                <Code2 className="w-8 h-8" />
                いますぐコード生成！
                <ArrowRight className="w-8 h-8" />
              </motion.button>
              
              <p className="text-indigo-200 text-lg mt-6">
                ⏱️ 約30秒で、すぐに使えるコードが完成します
              </p>
            </div>
          </motion.div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
          <p className="text-red-600 mb-4">UX構造の生成に失敗しました</p>
          <button
            onClick={generateUXStructure}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            再生成
          </button>
        </div>
      )}
    </motion.div>
  )
}