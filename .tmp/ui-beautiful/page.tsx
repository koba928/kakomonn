'use client'

import React, { useState } from 'react'
// Old UI style components removed - using new Card-based UI selection
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Sparkles, Check, Download, Code, Palette, Crown } from 'lucide-react'
import Link from 'next/link'

export default function UIBeautifulPage() {
  const [selectedStyle, setSelectedStyle] = useState<any | null>(null)
  const [showResult, setShowResult] = useState(false)

  const handleStyleSelected = (style: any) => {
    setSelectedStyle(style)
    setShowResult(true)
    console.log('🎨 Beautiful UI Style Selected:', style)
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
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-blue-100 rounded-full mb-6">
              <Crown className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-800">Beautiful Selection Complete</span>
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-emerald-700 to-blue-700 bg-clip-text text-transparent mb-4">
              素晴らしい選択です！
            </h1>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              <span className="font-semibold text-emerald-600">{selectedStyle.name}</span> スタイルで
              あなたのアプリケーションを美しく構築していきます
            </p>
          </div>

          {/* Main Result Card */}
          <div className="mb-12">
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
                        <div className="text-gray-500 text-sm">Preview not available</div>
                      </div>
                    </div>
                  </div>

                  {/* Style Details */}
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">デザインの特徴</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedStyle.personality.map((trait) => (
                          <Badge
                            key={trait}
                            className="px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 text-sm rounded-full font-medium border-0"
                          >
                            {trait}
                          </Badge>
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
          </div>

          {/* JSON Output */}
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5 text-blue-600" />
                  選択データ（開発者向け）
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap">
                    {JSON.stringify(selectedStyle, null, 2)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
          </div>

          {/* Debug Info */}
          <div className="mt-12 text-center text-sm text-gray-500">
            <p>選択時刻: {new Date().toLocaleString()}</p>
            <p>スタイルID: {selectedStyle.id}</p>
            <p>Beautiful UIスタイルセレクター v2.0</p>
          </div>
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

      {/* Beautiful Badge */}
      <div className="absolute top-6 right-6 z-50">
        <div className="bg-gradient-to-r from-emerald-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
          <Sparkles className="w-4 h-4 inline mr-1" />
          Beautiful UI Templates
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        {/* Navigation */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <h1 className="font-semibold text-gray-900">Beautiful UIスタイル選択</h1>
                  <p className="text-sm text-gray-600">LOVABLEライクな美しいUIデザイン</p>
                </div>
              </div>
              
              {selectedStyle && (
                <Button 
                  onClick={() => setShowResult(true)}
                  className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700"
                >
                  選択を確認
                  <Check className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Main UI Selection */}
        <div className="text-center p-12">
          <p className="text-gray-500">This page is deprecated. Use the new UI selection in the main application flow.</p>
        </div>
      </div>
    </div>
  )
}