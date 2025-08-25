'use client'

import React from 'react'
import AutonomousCodeGeneration from '@/components/phases/AutonomousCodeGeneration'
import { Insight, UIStyle } from '@/lib/types'

export default function AutonomousDemoPage() {
  // デモ用のテストデータ
  const demoInsight: Insight = {
    vision: '学習効率を最大化するAI搭載学習管理システム',
    target: '大学生、社会人学習者、資格取得を目指す人',
    features: [
      'AI学習プラン生成',
      '進捗トラッキング',
      'スマート復習システム',
      '学習コミュニティ',
      'パフォーマンス分析'
    ],
    value: '個人の学習スタイルに合わせた最適化された学習体験を提供',
    motivation: 'AI技術を活用して個人に最適化された学習環境を実現'
  }

  const demoUIStyle: UIStyle = {
    id: 'modern-educational',
    name: 'Modern Educational',
    description: '清潔で学習に集中できるモダンなデザイン',
    category: 'modern',
    colors: {
      primary: '#3B82F6',
      secondary: '#8B5CF6',
      accent: '#10B981',
      background: '#FFFFFF',
      text: '#1F2937'
    },
    typography: {
      heading: 'Inter',
      body: 'Inter'
    },
    spacing: 'comfortable',
    personality: ['clean', 'professional', 'innovative']
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            MATURA 自律コード生成システム v2.0
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            高品質なプロダクションレベルのコードを自動生成し、テスト・品質チェック・デプロイメント準備まで一括で実行します。
            人間の介入なしに、最後まで自律的に動作します。
          </p>
        </div>

        <AutonomousCodeGeneration
          insight={demoInsight}
          uiStyle={demoUIStyle}
          onComplete={(result) => {
            console.log('Generation completed:', result)
          }}
        />
      </div>
    </div>
  )
}