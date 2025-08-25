'use client'

import { useState } from 'react'
import { Rocket, Globe, Link2, CheckCircle, Share2, Star, DollarSign, BarChart3 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import PreviewButton from '@/components/shared/PreviewButton'
import { useMatura } from '@/components/providers/MaturaProvider'
import { generateDummyURL } from '@/lib/utils'

export default function ReleaseBoard() {
  const { state, actions, history } = useMatura()
  const [releaseUrl, setReleaseUrl] = useState('')
  const [isReleasing, setIsReleasing] = useState(false)
  const [releaseOptions, setReleaseOptions] = useState({
    vercel: true,
    analytics: false,
    monetization: false,
    seo: true
  })
  const [showCelebration, setShowCelebration] = useState(false)

  const handleRelease = async () => {
    setIsReleasing(true)
    
    // リリース処理のシミュレーション
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const dummyUrl = generateDummyURL()
    setReleaseUrl(dummyUrl)
    
    const releaseInfo = {
      url: dummyUrl,
      timestamp: new Date().toISOString(),
      platform: 'Vercel',
      features: state.insights?.features || [],
      monetization: releaseOptions.monetization ? {
        type: 'ads' as const,
        revenue_model: 'AdSense integration'
      } : undefined
    }
    
    actions.setReleaseInfo(releaseInfo)
    
    // 履歴に保存
    history.addToHistory({
      phase: 'ReleaseBoard',
      data: releaseInfo,
      conversations: state.conversations
    })
    
    setIsReleasing(false)
    setShowCelebration(true)
  }

  const handleOptionChange = (option: string) => {
    setReleaseOptions(prev => ({
      ...prev,
      [option]: !prev[option as keyof typeof prev]
    }))
  }

  const handleRestart = () => {
    actions.resetState()
  }

  const shareProject = () => {
    if (navigator.share && releaseUrl) {
      navigator.share({
        title: state.insights?.vision || 'MATURAで作成したアプリ',
        text: state.insights?.value || '素晴らしいアプリを作成しました！',
        url: releaseUrl,
      })
    } else {
      // フォールバック: URLをクリップボードにコピー
      navigator.clipboard.writeText(releaseUrl)
      alert('URLをクリップボードにコピーしました！')
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
        <div className="bg-gradient-to-r from-red-500 to-pink-500 p-6 text-white">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Rocket className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold mb-2">ReleaseBoard - 世界へリリース</h2>
                <p className="text-white/90">
                  あなたのアプリを世界中の人々に届けましょう
                </p>
              </div>
            </div>
            <PreviewButton 
              data={state.releaseInfo} 
              title="リリース情報"
              className="bg-white/20 hover:bg-white/30 text-white border-white/30"
            />
          </div>
        </div>

        {/* コンテンツ */}
        <div className="p-8">
          {!releaseUrl ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* プロジェクト概要 */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
                <h3 className="text-xl font-bold text-blue-900 mb-3">プロジェクト概要</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-blue-800">
                  <div>
                    <p className="font-medium">プロジェクト名</p>
                    <p className="text-lg">{state.insights?.vision || 'Webアプリケーション'}</p>
                  </div>
                  <div>
                    <p className="font-medium">ターゲット</p>
                    <p className="text-lg">{state.insights?.target || '一般ユーザー'}</p>
                  </div>
                  <div>
                    <p className="font-medium">主要機能数</p>
                    <p className="text-lg">{state.insights?.features?.length || 0}個</p>
                  </div>
                  <div>
                    <p className="font-medium">選択デザイン</p>
                    <p className="text-lg">{state.selectedUI?.name || 'カスタム'}</p>
                  </div>
                </div>
              </div>

              {/* リリースオプション */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-900">リリースオプション</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Vercel デプロイ */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={releaseOptions.vercel}
                        onChange={() => handleOptionChange('vercel')}
                        className="w-5 h-5 text-matura-primary"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <Globe className="w-5 h-5 text-green-500" />
                          <span className="font-medium">Vercel で即座に公開</span>
                        </div>
                        <p className="text-sm text-gray-600">高速CDNで世界中にデプロイ</p>
                      </div>
                    </label>
                  </div>

                  {/* Analytics */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={releaseOptions.analytics}
                        onChange={() => handleOptionChange('analytics')}
                        className="w-5 h-5 text-matura-primary"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <BarChart3 className="w-5 h-5 text-blue-500" />
                          <span className="font-medium">Google Analytics 連携</span>
                        </div>
                        <p className="text-sm text-gray-600">ユーザー行動を分析</p>
                      </div>
                    </label>
                  </div>

                  {/* SEO最適化 */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={releaseOptions.seo}
                        onChange={() => handleOptionChange('seo')}
                        className="w-5 h-5 text-matura-primary"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-500" />
                          <span className="font-medium">SEO最適化</span>
                        </div>
                        <p className="text-sm text-gray-600">検索エンジン対応</p>
                      </div>
                    </label>
                  </div>

                  {/* 収益化 */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={releaseOptions.monetization}
                        onChange={() => handleOptionChange('monetization')}
                        className="w-5 h-5 text-matura-primary"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-green-500" />
                          <span className="font-medium">広告収益化（AdSense）</span>
                        </div>
                        <p className="text-sm text-gray-600">収益を得る仕組みを追加</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* リリースボタン */}
              <div className="text-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleRelease}
                  disabled={isReleasing}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-medium transition-all hover:shadow-lg disabled:opacity-50"
                >
                  {isReleasing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      世界に公開中...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-5 h-5" />
                      世界にリリースする
                    </>
                  )}
                </motion.button>
                
                {isReleasing && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 space-y-2"
                  >
                    <p className="text-gray-600">デプロイ処理中...</p>
                    <div className="w-64 mx-auto bg-gray-200 rounded-full h-2">
                      <motion.div
                        className="bg-red-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 3 }}
                      />
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ) : (
            /* リリース完了画面 */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              {/* 成功メッセージ */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.6 }}
                  className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CheckCircle className="w-12 h-12 text-white" />
                </motion.div>
                
                <motion.h3
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-bold text-green-800 mb-2"
                >
                  🎉 公開完了！
                </motion.h3>
                
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl text-gray-600 mb-6"
                >
                  あなたのアプリが世界中からアクセス可能になりました
                </motion.p>
              </div>

              {/* URL表示 */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border border-green-200"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Link2 className="w-6 h-6 text-green-600" />
                  <h4 className="text-lg font-bold text-green-900">公開URL</h4>
                </div>
                <div className="bg-white p-4 rounded-lg border border-green-200 break-all">
                  <a 
                    href={releaseUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-matura-primary hover:text-matura-secondary font-mono text-sm"
                  >
                    {releaseUrl}
                  </a>
                </div>
              </motion.div>

              {/* 統計情報 */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
              >
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {state.conversations.length}
                  </div>
                  <div className="text-sm text-blue-800">対話数</div>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {state.insights?.features?.length || 0}
                  </div>
                  <div className="text-sm text-purple-800">実装機能</div>
                </div>
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">
                    100%
                  </div>
                  <div className="text-sm text-green-800">完成度</div>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {Math.floor(Math.random() * 30) + 10}分
                  </div>
                  <div className="text-sm text-orange-800">所要時間</div>
                </div>
              </motion.div>

              {/* アクションボタン */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <button
                  onClick={shareProject}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                  プロジェクトをシェア
                </button>
                
                <a
                  href={releaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Globe className="w-5 h-5" />
                  アプリを確認
                </a>
                
                <button
                  onClick={handleRestart}
                  className="flex items-center gap-2 px-6 py-3 bg-matura-primary text-white rounded-lg hover:bg-matura-secondary transition-colors"
                >
                  <Rocket className="w-5 h-5" />
                  新しいアプリを作る
                </button>
              </motion.div>

              {/* お祝いメッセージ */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center bg-gradient-to-r from-pink-50 to-rose-50 p-6 rounded-lg border border-pink-100"
              >
                <h4 className="text-xl font-bold text-pink-900 mb-2">
                  おめでとうございます！
                </h4>
                <p className="text-pink-800">
                  MATURAと一緒に、アイデアから実際のWebアプリケーションまで完成させました。
                  あなたの創造力とMATURAのAI技術が組み合わさって、素晴らしい結果を生み出しました！
                </p>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>

      {/* 花火エフェクト */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50"
          >
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: window.innerHeight,
                }}
                animate={{
                  y: Math.random() * window.innerHeight,
                  x: Math.random() * window.innerWidth,
                }}
                transition={{
                  duration: Math.random() * 2 + 1,
                  repeat: 3,
                  repeatType: "reverse",
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}