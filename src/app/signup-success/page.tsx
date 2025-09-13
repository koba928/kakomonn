'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { APP_CONFIG } from '@/constants/app'

export default function SignupSuccessPage() {
  const { user, session, loading } = useAuth()
  const router = useRouter()
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    // 認証されていない場合はサインアップに戻る
    if (!loading && !session) {
      router.push('/signup')
      return
    }

    // 認証済みの場合、3秒後にオンボーディングへ
    if (!loading && session && user) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer)
            router.push('/onboarding')
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [loading, session, user, router])

  // ローディング中
  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">認証状態を確認中...</p>
        </div>
      </main>
    )
  }

  // 未認証の場合（リダイレクト中）
  if (!session) {
    return null
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Header */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            🎉 メール認証完了！
          </h1>
          
          <div className="space-y-3 mb-8">
            <p className="text-gray-700">
              <strong>{user?.email}</strong>
            </p>
            <p className="text-gray-600">
              メール認証が完了しました。<br/>
              {APP_CONFIG.name}へようこそ！
            </p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-green-800 mb-2">
                ✅ 新規登録が完了しました
              </h3>
              <p className="text-sm text-green-700">
                続いて学部と学年を選択して、過去問の利用を開始しましょう
              </p>
            </div>
          </div>

          {/* Countdown */}
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-3">
              {countdown}秒後に学部・学年選択画面に移動します
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${((3 - countdown) / 3) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Link
              href="/onboarding"
              className="w-full inline-flex justify-center items-center px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              今すぐ学部・学年を選択
            </Link>
            
            <Link
              href="/search"
              className="w-full inline-flex justify-center items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              とりあえず過去問を見る
            </Link>
          </div>

          {/* Welcome Message */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              🎓 名古屋大学生専用プラットフォーム
            </h3>
            <p className="text-sm text-blue-700">
              学部・学年を設定すると、より関連性の高い過去問や情報をご利用いただけます
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}