'use client'

import Link from 'next/link'
import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useSearchParams } from 'next/navigation'
import LoginLoadingScreen, { LoginMessages } from '@/components/auth/LoginLoadingScreen'

function EmailAuthPageContent() {
  const { signIn, isAuthenticating, authStep } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [redirectUrl, setRedirectUrl] = useState('/search')

  useEffect(() => {
    const redirect = searchParams.get('redirect')
    if (redirect) {
      setRedirectUrl(redirect)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    
    setIsLoading(true)
    
    try {
      const result = await signIn(email, password)
      if (result.error) {
        console.error('ログインエラー:', result.error)
        setError((result.error as any).message || 'ログインに失敗しました')
        setIsLoading(false)
      } else {
        // ユーザー情報を確認
        const userInfo = result.user
        console.log('ログイン成功 - ユーザー情報:', userInfo)
        
        // ログイン成功後は直接指定されたページへリダイレクト
        console.log('ログイン成功 - 指定されたページへリダイレクト:', redirectUrl)
        setTimeout(() => {
          router.push(redirectUrl)
        }, 1500)
      }
    } catch (err: any) {
      console.error('認証エラー:', err)
      setError(err.message || '認証に失敗しました')
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = () => {
    if (!email || !password) return false
    return email.includes('@') && password.length >= 6
  }

  // ログイン中画面を表示
  if (isAuthenticating) {
    const messageConfig = (() => {
      switch (authStep) {
        case 'signing-in':
          return LoginMessages.PROCESSING
        case 'profile-loading':
          return LoginMessages.PROFILE_LOADING
        case 'redirecting':
          return LoginMessages.REDIRECTING
        default:
          return LoginMessages.PROCESSING
      }
    })()
    
    return <LoginLoadingScreen {...messageConfig} />
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
            ログイン
          </h1>
          <p className="text-gray-600">
            メールアドレスとパスワードでログイン
          </p>
          <p className="text-sm text-gray-500 mt-2">
            アカウントをお持ちでない方は
            <Link href="/register" className="text-indigo-600 hover:underline ml-1">
              新規登録
            </Link>
          </p>
        </div>


        {/* エラーメッセージ */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {/* 認証フォーム */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              メールアドレス <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@university.ac.jp"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              パスワード <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6文字以上"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent pr-12"
                required
                minLength={6}
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
            className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
              (!isFormValid() || isLoading)
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
            disabled={!isFormValid() || isLoading}
          >
            {isLoading ? 'ログイン中...' : 'ログイン'}
          </button>
        </form>

        {/* フッター */}
        <div className="mt-8 text-center">
          <Link 
            href="/" 
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← ホームに戻る
          </Link>
        </div>

      </div>
      {/* セーフエリアスペーサ */}
      <div className="h-4" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} />
    </main>
  )
}

export default function EmailAuthPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </main>
    }>
      <EmailAuthPageContent />
    </Suspense>
  )
}