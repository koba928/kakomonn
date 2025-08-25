'use client'

import { useState } from 'react'
import { ArrowRight, Palette, CheckCircle, Zap, RotateCcw } from 'lucide-react'
import { motion } from 'framer-motion'
import { useMatura } from '@/components/providers/MaturaProvider'
import { UIStyleSelector } from '@/components/design-proposals/UIStyleSelector'
import DynamicUISelector from '@/components/shared/DynamicUISelector'
import type { DesignProposal } from '@/lib/prompts/design-generator'
import type { UIStyle, DynamicUIGeneration } from '@/lib/types'

export default function SketchView() {
  const { state, actions } = useMatura()
  const [selectionMode, setSelectionMode] = useState<'dynamic' | 'template'>('dynamic')
  
  // ユーザーのアイデアを取得（InsightRefineフェーズから）
  const userIdea = state.insights?.vision || "革新的なアプリケーション"
  
  // グローバル状態でUI選択完了をチェック
  const uiSelected = !!state.selectedUIStyle
  const selectedDesign = state.selectedUIStyle

  // 動的UI選択のハンドラ
  const handleDynamicUISelected = (selectedStyle: UIStyle, dynamicGeneration: DynamicUIGeneration) => {
    actions.setSelectedUIStyle(selectedStyle)
    actions.setDynamicUIGeneration(dynamicGeneration)
    
    // 2秒後に自動的に次のフェーズに進む
    setTimeout(() => {
      actions.nextPhase()
    }, 2000)
  }

  // テンプレートUI選択のハンドラ（既存）
  const handleDesignSelected = (design: DesignProposal) => {
    // MATURAの状態管理に保存
    actions.setSelectedUIStyle({
      id: design.id,
      name: design.heading,
      description: design.subDescription,
      category: 'modern',
      colors: {
        primary: design.colorScheme.primary,
        secondary: design.colorScheme.secondary,
        accent: design.colorScheme.primary,
        background: design.colorScheme.background,
        text: '#1f2937'
      },
      typography: {
        heading: 'font-bold tracking-tight',
        body: 'font-medium leading-relaxed'
      },
      spacing: 'comfortable',
      personality: design.tags
    })
    
    // 2秒後に次のフェーズに進む
    setTimeout(() => {
      actions.nextPhase()
    }, 2000)
  }

  // UIが選択済みの場合は完了画面を表示
  if (uiSelected && selectedDesign) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto text-center"
      >
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-12 border border-green-200">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-10 h-10 text-white" />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            UIスタイルが選択されました！
          </h2>
          
          <div className="bg-white rounded-lg p-6 shadow-sm border max-w-2xl mx-auto mb-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {selectedDesign.name}
            </h3>
            <p className="text-gray-600 mb-4">
              {selectedDesign.description}
            </p>
            
            {/* 選択されたスタイル情報 */}
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <span className="bg-gray-100 px-3 py-1 rounded-full">
                {selectedDesign.category}
              </span>
              <div className="flex gap-1">
                {Object.values(selectedDesign.colors).slice(0, 3).map((color, index) => (
                  <div
                    key={index}
                    className="w-5 h-5 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
          
          <p className="text-lg text-gray-600">
            次のステップに自動で進みます...
          </p>
        </div>
      </motion.div>
    )
  }

  // UI選択画面を表示
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-7xl mx-auto"
    >
      {!uiSelected && (
        <>
          {/* 選択モード切り替え */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mr-8">UIスタイルを選択</h2>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setSelectionMode('dynamic')}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all
                    ${selectionMode === 'dynamic' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                    }
                  `}
                >
                  <Zap className="w-4 h-4" />
                  AI生成（推奨）
                </button>
                <button
                  onClick={() => setSelectionMode('template')}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all
                    ${selectionMode === 'template' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                    }
                  `}
                >
                  <Palette className="w-4 h-4" />
                  テンプレート
                </button>
              </div>
            </div>
            
            <div className="text-center mb-8">
              {selectionMode === 'dynamic' ? (
                <p className="text-gray-600">
                  あなたのアイデア「{userIdea}」に最適化されたUIスタイルを生成します
                </p>
              ) : (
                <p className="text-gray-600">
                  事前に用意されたテンプレートから選択できます
                </p>
              )}
            </div>
          </div>

          {/* 動的UI選択またはテンプレート選択 */}
          {selectionMode === 'dynamic' && state.insights ? (
            <DynamicUISelector
              insight={state.insights}
              onUISelected={handleDynamicUISelected}
            />
          ) : (
            <UIStyleSelector
              userIdea={userIdea}
              onDesignSelected={handleDesignSelected}
              isSelectionComplete={uiSelected}
            />
          )}
        </>
      )}
    </motion.div>
  )
}