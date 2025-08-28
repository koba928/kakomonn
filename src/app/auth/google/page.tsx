'use client'

import Link from 'next/link'
import { useState } from 'react'
import { AnimatedButton } from '@/components/ui/MicroInteractions'

export default function GoogleAuthPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    
    // デモ用：Google認証をシミュレート
    setTimeout(() => {
      setIsLoading(false)
      // 新規登録ページに遷移
      window.location.href = '/register/step-by-step'
    }, 2000)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <Link 
            href="/" 
            className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 inline-block"
          >
            KakoMoNN
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Googleでログイン
          </h1>
          <p className="text-gray-600">
            Googleアカウントを使って簡単にログインできます
          </p>
        </div>

        {/* Google認証ボタン */}
        <div className="space-y-4">
          <AnimatedButton
            variant="secondary"
            size="lg"
            className="w-full border-2 border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            aria-label="Googleでログイン"
          >
            <div className="flex items-center justify-center space-x-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="font-medium text-gray-700">
                {isLoading ? 'ログイン中...' : 'Googleでログイン'}
              </span>
            </div>
          </AnimatedButton>
        </div>

        {/* 利点説明 */}
        <div className="mt-8 space-y-3">
          <h3 className="text-sm font-medium text-gray-900 text-center">Googleログインの利点</h3>
          <div className="space-y-2">
            {[
              { icon: '🔐', text: '安全で信頼できる認証' },
              { icon: '⚡', text: 'ワンクリックで簡単ログイン' },
              { icon: '🔄', text: 'パスワード管理不要' }
            ].map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3 text-sm text-gray-600">
                <span aria-hidden="true">{benefit.icon}</span>
                <span>{benefit.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* フッター */}
        <div className="mt-8 text-center">
          <Link 
            href="/auth/method-select" 
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← 認証方法を変更
          </Link>
        </div>

        {/* プライバシー情報 */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-800 mb-2">🛡️ プライバシー保護</h4>
          <p className="text-xs text-blue-700 leading-relaxed">
            KakoMoNNはあなたのGoogleアカウント情報を最小限のアクセス権限でのみ使用し、
            個人情報の保護に努めています。
          </p>
        </div>

        {/* デモ情報 */}
        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">🚧 デモモード</h4>
          <p className="text-xs text-yellow-700">
            現在はデモ版です。実際のGoogle認証は行われません。
            ボタンを押すと自動的に新規登録ページに進みます。
          </p>
        </div>
      </div>
    </main>
  )
}