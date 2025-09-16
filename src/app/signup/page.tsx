'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { APP_CONFIG } from '@/constants/app'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isAuthenticatedUser, setIsAuthenticatedUser] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  // 認証状態をチェック
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // 認証済みユーザー - プロフィール確認
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single()

        if (profile) {
          // プロフィール既存 → ホームへ
          router.push('/')
          return
        } else {
          // 認証済みだがプロフィールなし → フォーム表示
          setIsAuthenticatedUser(true)
          setEmail(user.email || '')
        }
      }
    } catch (error) {
      console.error('認証状態確認エラー:', error)
    } finally {
      setCheckingAuth(false)
    }
  }

  const handleInitialSignup = async (e: React.FormEvent) => {
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
          emailRedirectTo: 'https://kakomonn.vercel.app/auth/callback'
        }
      })

      if (error) {
        console.error('❌ 新規登録エラー:', error)
        
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
      router.push('/signup/confirm')

    } catch (error: any) {
      setError(error.message || '登録中にエラーが発生しました')
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileCompletion = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const formData = new FormData(e.currentTarget)
      const university = formData.get('university') as string
      const faculty = formData.get('faculty') as string
      const year = formData.get('year') as string

      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('認証が必要です')
      }

      const { error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          university,
          faculty,
          year
        })

      if (error) throw error

      console.log('✅ プロフィール作成完了 → ホームへ')
      router.push('/')
      
    } catch (error: any) {
      setError(error.message || '登録に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">認証状態を確認中...</p>
        </div>
      </main>
    )
  }

  if (isAuthenticatedUser) {
    // 認証済みユーザーのプロフィール作成フォーム
    return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                メール認証完了！
              </h1>
              <p className="text-gray-600">
                プロフィールを登録してサービスを開始しましょう
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
                {error}
              </div>
            )}

            <form onSubmit={handleProfileCompletion} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  メールアドレス
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>

              <div>
                <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2">
                  大学
                </label>
                <input
                  id="university"
                  name="university"
                  type="text"
                  value="名古屋大学"
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>

              <div>
                <label htmlFor="faculty" className="block text-sm font-medium text-gray-700 mb-2">
                  学部
                </label>
                <select
                  id="faculty"
                  name="faculty"
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">学部を選択してください</option>
                  <option value="文学部">文学部</option>
                  <option value="教育学部">教育学部</option>
                  <option value="法学部">法学部</option>
                  <option value="経済学部">経済学部</option>
                  <option value="情報学部">情報学部</option>
                  <option value="理学部">理学部</option>
                  <option value="医学部">医学部</option>
                  <option value="工学部">工学部</option>
                  <option value="農学部">農学部</option>
                </select>
              </div>

              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                  学年
                </label>
                <select
                  id="year"
                  name="year"
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">学年を選択してください</option>
                  <option value="1年">1年</option>
                  <option value="2年">2年</option>
                  <option value="3年">3年</option>
                  <option value="4年">4年</option>
                  <option value="大学院生">大学院生</option>
                </select>
              </div>

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
                  '登録を完了'
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    )
  }

  // 初回ユーザーの新規登録フォーム
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100">
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
              メールアドレスとパスワードで登録
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleInitialSignup} className="space-y-6">
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

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                パスワード
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
                '新規登録'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              既にアカウントをお持ちの方は
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