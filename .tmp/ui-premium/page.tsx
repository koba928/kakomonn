'use client'

import React, { useState } from 'react'
// Old UI style components removed - using new Card-based UI selection
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Sparkles, Check, Download, Code, Palette } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function UIPremiumPage() {
  const [selectedStyle, setSelectedStyle] = useState<any | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleStyleSelected = (style: any) => {
    setSelectedStyle(style)
    setShowResult(true)
    console.log('🎨 Premium UI Style Selected:', style)
  }

  const handleReset = () => {
    setSelectedStyle(null)
    setShowResult(false)
  }

  if (showResult && selectedStyle) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50">
        <div className="max-w-6xl mx-auto p-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-800">Premium Selection Complete</span>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-emerald-700 to-blue-700 bg-clip-text text-transparent mb-4">
              素晴らしい選択です！
            </h1>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              <span className="font-semibold text-emerald-600">{selectedStyle.name}</span> スタイルで
              あなたのアプリケーションを美しく構築していきます
            </p>
          </motion.div>

          {/* Main Result Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-12"
          >
            <Card className="overflow-hidden border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-3xl font-bold mb-2">
                      {selectedStyle.name}
                    </CardTitle>
                    <p className="text-emerald-100 text-lg">
                      {selectedStyle.description}
                    </p>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Style Preview */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Palette className="w-5 h-5 text-blue-600" />
                      スタイルプレビュー
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-6">
                      <div className="max-w-sm mx-auto">
                        {/* Mini preview would go here */}
                        <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-500 text-sm">Style Preview</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Style Details */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">デザインの特徴</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedStyle.personality.map((trait) => (
                          <span
                            key={trait}
                            className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm rounded-full font-medium"
                          >
                            {trait}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">カラーパレット</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {Object.entries(selectedStyle.colors)
                          .filter(([key]) => ['primary', 'secondary', 'accent'].includes(key))
                          .map(([key, color]) => (
                          <div key={key} className="text-center">
                            <div
                              className="w-full h-16 rounded-xl border-2 border-white shadow-lg mb-2"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-sm font-medium text-gray-700 capitalize">{key}</span>
                            <div className="text-xs text-gray-500 font-mono">{color}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">技術仕様</h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>カテゴリー:</span>
                          <span className="font-medium text-gray-900 capitalize">{selectedStyle.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>スペーシング:</span>
                          <span className="font-medium text-gray-900">{selectedStyle.spacing}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>タイポグラフィ:</span>
                          <span className="font-medium text-gray-900">
                            {typeof selectedStyle.typography === 'object' && selectedStyle.typography !== null 
                              ? (selectedStyle.typography.heading || 'カスタム設定')
                              : String(selectedStyle.typography || 'デフォルト')
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* JSON Output */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-blue-600" />
                  選択データ（開発者向け）
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-xs font-mono">
                    {JSON.stringify(selectedStyle, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
              className="px-8"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              別のスタイルを選択
            </Button>
            
            <Button
              size="lg"
              className="px-8 bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              このスタイルでMATURAを開始
            </Button>
            
            <Link href="/">
              <Button variant="outline" size="lg" className="px-8">
                メインページに戻る
              </Button>
            </Link>
          </motion.div>

          {/* Debug Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 text-center text-sm text-gray-500"
          >
            <p>選択時刻: {new Date().toLocaleString()}</p>
            <p>スタイルID: {selectedStyle.id}</p>
            <p>プレミアムUIスタイルセレクター v1.0</p>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Back to Home */}
      <div className="absolute top-6 left-6 z-50">
        <Link href="/">
          <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur">
            <ArrowLeft className="w-4 h-4 mr-2" />
            ホーム
          </Button>
        </Link>
      </div>

      {/* Premium Badge */}
      <div className="absolute top-6 right-6 z-50">
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
          <Sparkles className="w-4 h-4 inline mr-1" />
          Premium UI Templates
        </div>
      </div>

      {/* Main UI Selection */}
      <div className="text-center p-12">
        <p className="text-gray-500">This page is deprecated. Use the new UI selection in the main application flow.</p>
      </div>
    </div>
  )
}