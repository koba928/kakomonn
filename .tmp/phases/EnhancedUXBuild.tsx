'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Lightbulb, Users, Package, Zap, TrendingUp, ArrowRight, 
  RefreshCw, Code2, Layers, Palette, Type, MousePointer,
  CheckCircle, Play, Eye, Settings
} from 'lucide-react'
import { useMatura } from '@/components/providers/MaturaProvider'
import { ProcessingSpinner } from '@/components/shared/LoadingSpinner'
import PreviewButton from '@/components/shared/PreviewButton'

export default function EnhancedUXBuild() {
  const { state, actions } = useMatura()
  const [activeSection, setActiveSection] = useState<'overview' | 'structure' | 'components' | 'implementation'>('overview')
  const [isGenerating, setIsGenerating] = useState(false)

  // 統合UX生成の自動実行
  useEffect(() => {
    if (state.insights && state.selectedUIStyle && !state.unifiedUXDesign && !isGenerating) {
      generateUnifiedUXDesign()
    }
  }, [state.insights, state.selectedUIStyle])

  const generateUnifiedUXDesign = async () => {
    setIsGenerating(true)
    try {
      const unifiedDesign = await actions.generateUnifiedUX()
      console.log('✅ Unified UX Design generated:', unifiedDesign)
    } catch (error) {
      console.error('❌ Failed to generate unified UX:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleNext = () => {
    actions.nextPhase()
  }

  // 構造化されたアイデアの表示
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

  if (isGenerating) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto px-4"
      >
        <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
          <ProcessingSpinner />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8"
          >
            <h3 className="text-2xl font-bold text-gray-800 mb-4">
              統合UX設計を生成中...
            </h3>
            <p className="text-gray-600 mb-2">
              「{state.insights?.vision}」と「{state.selectedUIStyle?.name}」スタイルを統合しています
            </p>
            <p className="text-gray-500 text-sm">
              機能的なコンポーネントと実装ガイドを含む包括的なUX設計を作成中です
            </p>
          </motion.div>
        </div>
      </motion.div>
    )
  }

  if (!state.unifiedUXDesign) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-6xl mx-auto px-4"
      >
        <div className="bg-white rounded-2xl shadow-lg p-16 text-center">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            UX設計の生成に失敗しました
          </h3>
          <button
            onClick={generateUnifiedUXDesign}
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
            再生成
          </button>
        </div>
      </motion.div>
    )
  }

  const { unifiedUXDesign } = state

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4"
    >
      {/* ヘッダー：構造化されたアイデアの可視化 */}
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8"
      >
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold mb-2">
                🎯 統合UX設計が完成しました
              </h2>
              <p className="text-indigo-100 text-lg">
                「{unifiedUXDesign.concept.vision}」を実現する包括的な設計
              </p>
            </div>
            <PreviewButton 
              data={unifiedUXDesign} 
              title="統合UX設計"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            />
          </div>

          {/* 5つの構造要素のタブ */}
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(structuredIdea).map(([key, item]) => {
              const Icon = item.icon
              return (
                <button
                  key={key}
                  onClick={() => setActiveSection('overview')}
                  className="p-3 rounded-lg transition-all transform bg-white/10 hover:bg-white/20"
                >
                  <Icon className="w-5 h-5 mx-auto mb-1" />
                  <div className="text-xs font-medium">{item.label.split(' - ')[0]}</div>
                </button>
              )
            })}
          </div>
        </div>

        {/* アクティブな構造要素の詳細 */}
        <div className="p-6 bg-gray-50">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0">
              <Lightbulb className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">統合設計概要</h3>
              <p className="text-gray-700">
                {unifiedUXDesign.concept.vision}を{unifiedUXDesign.designStyle.name}スタイルで実現し、
                {unifiedUXDesign.concept.target}に{unifiedUXDesign.concept.value}を提供する設計です。
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* セクション切り替えタブ */}
      <div className="mb-8">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'overview', label: '概要', icon: Eye },
            { id: 'structure', label: 'サイト構造', icon: Layers },
            { id: 'components', label: '機能コンポーネント', icon: Code2 },
            { id: 'implementation', label: '実装ガイド', icon: Settings }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id as any)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all
                ${activeSection === id 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-800'
                }
              `}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* セクションコンテンツ */}
      <AnimatePresence mode="wait">
        {activeSection === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* デザインスタイル情報 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <Palette className="w-8 h-8" />
                  選択されたデザインスタイル
                </h3>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-4">
                      {unifiedUXDesign.designStyle.name}
                    </h4>
                    <p className="text-gray-700 mb-4">
                      {state.selectedUIStyle?.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {unifiedUXDesign.designStyle.personality.map((trait, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="font-semibold text-gray-800 mb-3">カラーパレット</h5>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(unifiedUXDesign.designStyle.colors).map(([name, color]) => (
                        <div key={name} className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-lg border border-gray-200"
                            style={{ backgroundColor: color }}
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-800 capitalize">{name}</div>
                            <div className="text-xs text-gray-500">{color}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeSection === 'structure' && (
          <motion.div
            key="structure"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* サイトアーキテクチャ */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <Layers className="w-8 h-8" />
                  サイト構造設計
                </h3>
              </div>
              <div className="p-8 space-y-8">
                {/* トップページ設計 */}
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4">
                    トップページの役割
                  </h4>
                  <div className="bg-blue-50 rounded-xl p-6">
                    <p className="text-blue-900 font-medium mb-4">
                      {unifiedUXDesign.structure.siteArchitecture.topPage.purpose}
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {unifiedUXDesign.structure.siteArchitecture.topPage.elements.map((element, i) => (
                        <div key={i} className="bg-white rounded-lg p-3 text-center shadow-sm">
                          <span className="text-blue-700 font-medium text-sm">{element}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 主要機能の設計 */}
                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4">主要機能の画面設計</h4>
                  <div className="grid gap-4">
                    {unifiedUXDesign.structure.siteArchitecture.mainFeatures.map((feature, i) => (
                      <motion.div
                        key={i}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.1 * i }}
                        className="bg-gray-50 rounded-xl p-6 border border-gray-200"
                      >
                        <h5 className="font-bold text-gray-900 mb-2">{feature.name}</h5>
                        <p className="text-gray-700 text-sm mb-3">{feature.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h6 className="text-sm font-semibold text-gray-600 mb-2">UI要素</h6>
                            <div className="flex flex-wrap gap-2">
                              {feature.uiElements.map((ui, j) => (
                                <span key={j} className="px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700 border border-gray-300">
                                  {ui}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h6 className="text-sm font-semibold text-gray-600 mb-2">ユーザーインタラクション</h6>
                            <div className="flex flex-wrap gap-2">
                              {feature.userInteractions.map((interaction, j) => (
                                <span key={j} className="px-3 py-1 bg-green-100 rounded-full text-xs font-medium text-green-700">
                                  {interaction}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeSection === 'components' && (
          <motion.div
            key="components"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* 機能コンポーネント */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <Code2 className="w-8 h-8" />
                  実行可能な機能コンポーネント
                </h3>
              </div>
              <div className="p-8">
                <div className="grid gap-6">
                  {unifiedUXDesign.structure.functionalComponents.map((component, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1 * i }}
                      className="border-2 border-green-200 rounded-xl p-6 hover:border-green-400 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xl font-bold text-gray-900">{component.name}</h4>
                        <div className="flex items-center gap-2">
                          <Play className="w-5 h-5 text-green-600" />
                          <span className="text-sm text-green-600 font-medium">実行可能</span>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-4">{component.purpose}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h5 className="text-sm font-semibold text-gray-600 mb-2">Props</h5>
                          <div className="space-y-1">
                            {Object.entries(component.props).map(([prop, type]) => (
                              <div key={prop} className="text-sm">
                                <span className="font-mono text-purple-600">{prop}</span>
                                <span className="text-gray-500">: {String(type)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h5 className="text-sm font-semibold text-gray-600 mb-2">Events</h5>
                          <div className="space-y-1">
                            {component.events.map((event, j) => (
                              <div key={j} className="text-sm font-mono text-blue-600">
                                {event}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h5 className="text-sm font-semibold text-gray-600 mb-2">State</h5>
                          <div className="space-y-1">
                            {Object.entries(component.state).map(([state, value]) => (
                              <div key={state} className="text-sm">
                                <span className="font-mono text-orange-600">{state}</span>
                                <span className="text-gray-500">: {JSON.stringify(value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeSection === 'implementation' && (
          <motion.div
            key="implementation"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* 実装ガイド */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <Settings className="w-8 h-8" />
                  実装ガイド
                </h3>
              </div>
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-4">推奨技術スタック</h4>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm font-semibold text-gray-600">Framework:</span>
                        <span className="ml-2 text-gray-800">{unifiedUXDesign.implementation.recommendedFramework}</span>
                      </div>
                      <div>
                        <span className="text-sm font-semibold text-gray-600">Libraries:</span>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {unifiedUXDesign.implementation.keyLibraries.map((lib, i) => (
                            <span key={i} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-xs">
                              {lib}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-4">ファイル構造</h4>
                    <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm">
                      {unifiedUXDesign.implementation.fileStructure.map((file, i) => (
                        <div key={i} className="text-gray-700">
                          📁 {file}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-bold text-gray-900 mb-4">データフロー</h4>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-blue-800">{unifiedUXDesign.implementation.dataFlow}</p>
                  </div>
                </div>

                {unifiedUXDesign.implementation.apiRequirements.length > 0 && (
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-4">API要件</h4>
                    <div className="grid gap-3">
                      {unifiedUXDesign.implementation.apiRequirements.map((api, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                          <CheckCircle className="w-5 h-5 text-green-600" />
                          <span className="text-green-800">{api}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Next フェーズへの導線 */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-8 text-white text-center mt-8"
      >
        <h3 className="text-3xl font-bold mb-4">
          🎉 統合UX設計が完成しました！
        </h3>
        <p className="text-xl mb-2">
          {unifiedUXDesign.concept.target}のための{unifiedUXDesign.designStyle.name}スタイルの
        </p>
        <p className="text-2xl font-bold mb-6">
          「{unifiedUXDesign.concept.vision}」実現設計
        </p>
        <p className="text-indigo-100 mb-8 max-w-2xl mx-auto">
          この包括的な設計をもとに、実際に動作するコードを自動生成します。
          機能的なコンポーネントと実装ガイドが含まれているため、
          即座に開発を開始できます。
        </p>
        <button
          onClick={handleNext}
          className="inline-flex items-center gap-3 px-10 py-5 bg-white text-indigo-600 rounded-xl font-bold text-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all"
        >
          <Code2 className="w-7 h-7" />
          コード生成を開始
          <ArrowRight className="w-7 h-7" />
        </button>
        <p className="text-indigo-200 text-sm mt-4">
          統合UX設計に基づく高品質なコードを生成します
        </p>
      </motion.div>
    </motion.div>
  )
}