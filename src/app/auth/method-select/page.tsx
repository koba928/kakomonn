'use client'

import Link from 'next/link'
import { useState } from 'react'
import { AnimatedButton } from '@/components/ui/MicroInteractions'

export default function AuthMethodSelectPage() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)

  const authMethods = [
    {
      id: 'phone',
      title: '電話番号',
      description: 'SMS認証で簡単ログイン',
      icon: '📱',
      href: '/auth/phone',
      popular: false
    },
    {
      id: 'google',
      title: 'Google',
      description: 'Googleアカウントでログイン',
      icon: '🌐',
      href: '/auth/google',
      popular: true
    },
    {
      id: 'email',
      title: 'メールアドレス',
      description: 'メール&パスワードでログイン',
      icon: '📧',
      href: '/auth/email',
      popular: false
    }
  ]

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
            ログイン方法を選択
          </h1>
          <p className="text-gray-600">
            あなたに最適な認証方法を選んでください
          </p>
        </div>

        {/* 認証方法選択 */}
        <div className="space-y-3 mb-8">
          {authMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left relative ${
                selectedMethod === method.id
                  ? 'border-indigo-500 bg-indigo-50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              {method.popular && (
                <span className="absolute -top-2 right-4 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                  おすすめ
                </span>
              )}
              
              <div className="flex items-center space-x-4">
                <div className="text-2xl" aria-hidden="true">
                  {method.icon}
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {method.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {method.description}
                  </p>
                </div>

                <div className={`w-5 h-5 rounded-full border-2 transition-colors ${
                  selectedMethod === method.id
                    ? 'border-indigo-500 bg-indigo-500'
                    : 'border-gray-300'
                }`}>
                  {selectedMethod === method.id && (
                    <div className="w-full h-full rounded-full bg-indigo-500 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* 続行ボタン */}
        {selectedMethod && (
          <div className="space-y-4">
            <Link href={authMethods.find(m => m.id === selectedMethod)?.href || '#'}>
              <AnimatedButton 
                variant="primary" 
                size="lg" 
                className="w-full"
                aria-label="選択した方法で続行"
              >
                続行する
              </AnimatedButton>
            </Link>
          </div>
        )}

        {/* フッター */}
        <div className="mt-8 text-center">
          <Link 
            href="/" 
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← ホームに戻る
          </Link>
        </div>

        {/* セキュリティ情報 */}
        <div className="mt-6 bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">🔒 安全な認証</h4>
          <p className="text-xs text-gray-600 leading-relaxed">
            すべての認証方法は業界標準のセキュリティ対策を実装しています。
            個人情報は暗号化され、安全に管理されます。
          </p>
        </div>
      </div>
    </main>
  )
}