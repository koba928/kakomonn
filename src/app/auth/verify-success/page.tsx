'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { APP_CONFIG } from '@/constants/app'

export default function VerifySuccessPage() {
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/login')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Header */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            認証が完了しました！
          </h1>
          
          <p className="text-gray-600 mb-8">
            メールアドレスの認証が完了しました。<br />
            ログイン画面からサービスをご利用ください。
          </p>

          {/* Auto redirect message */}
          <p className="text-sm text-gray-500 mb-6">
            {countdown}秒後にログイン画面に移動します...
          </p>

          {/* Progress bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${((5 - countdown) / 5) * 100}%` }}
            ></div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Link
              href="/login"
              className="block w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              今すぐログイン
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}