'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatedButton } from '@/components/ui/MicroInteractions'

export default function RegisterPage() {
  const router = useRouter()
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null)

  const registerMethods = [
    {
      id: 'email',
      title: 'メールアドレスで登録',
      description: 'メールアドレスとパスワードで新規登録',
      icon: '📧',
      href: '/register/step-by-step',
      popular: true
    },
    {
      id: 'google',
      title: 'Googleで登録',
      description: 'Googleアカウントで簡単登録',
      icon: '🌐',
      href: '/auth/google',
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
            会員登録
          </h1>
          <p className="text-gray-600">
            過去問の共有プラットフォームへようこそ
          </p>
          <p className="text-sm text-gray-500 mt-2">
            既にアカウントをお持ちの方は
            <Link href="/auth/method-select" className="text-indigo-600 hover:underline ml-1">
              ログイン
            </Link>
          </p>
        </div>

        {/* 登録方法選択 */}
        <div className="space-y-3 mb-8">
          {registerMethods.map((method) => (
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
            <Link href={registerMethods.find(m => m.id === selectedMethod)?.href || '#'}>
              <AnimatedButton 
                variant="primary" 
                size="lg" 
                className="w-full"
                aria-label="選択した方法で登録"
              >
                登録を続ける
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

        {/* 利用規約 */}
        <div className="mt-6 text-center text-xs text-gray-500">
          登録することで、
          <Link href="/terms" className="text-indigo-600 hover:underline mx-1">
            利用規約
          </Link>
          と
          <Link href="/privacy" className="text-indigo-600 hover:underline mx-1">
            プライバシーポリシー
          </Link>
          に同意したものとします
        </div>
      </div>
    </main>
  )
}