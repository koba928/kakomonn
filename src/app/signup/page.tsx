'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { APP_CONFIG } from '@/constants/app'
import { supabase } from '@/lib/supabase'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      setError('メールアドレスとパスワードを入力してください')
      return
    }

    if (password.length < 8) {
      setError('パスワードは8文字以上で入力してください')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      console.log('🚀 新規登録開始:', { email })
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            university: '名古屋大学'
          },
          emailRedirectTo: `${window.location.origin}/auth/verify-success`
        }
      })

      if (error) {
        console.error('❌ 新規登録エラー:', error)
        
        // エラーメッセージを日本語化
        if (error.message.includes('Database error saving new user')) {
          throw new Error('データベースエラーが発生しました。しばらく待ってから再度お試しください。')
        } else if (error.message.includes('User already registered')) {
          throw new Error('このメールアドレスは既に登録されています。')
        } else if (error.message.includes('Password should be at least')) {
          throw new Error('パスワードは8文字以上で入力してください。')
        } else {
          throw error
        }
      }

      console.log('✅ 新規登録成功 → 確認画面へ')
      // 成功したら確認画面へ
      router.push('/signup/confirm')

    } catch (error: any) {
      setError(error.message || '登録中にエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <Link 
              href="/" 
              className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 inline-block"
            >
              {APP_CONFIG.name}
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              新規登録
            </h1>
            <p className="text-gray-600">
              アカウントを作成して始めましょう
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                メールアドレス
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                パスワード（8文字以上）
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={8}
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-12 disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.05 6.05M9.878 9.878a3 3 0 013.242-3.242m4.242 4.242L19.95 19.95M14.121 14.121a3 3 0 01-4.242-4.242" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                isLoading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 hover:scale-105 active:scale-95'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  登録中...
                </div>
              ) : (
                '登録する'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              すでにアカウントをお持ちの方は
              <Link href="/login" className="text-indigo-600 hover:text-indigo-500 font-medium ml-1">
                ログイン
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}