'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [debugLink, setDebugLink] = useState<string | null>(null)
  const [devMode, setDevMode] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)
    setDebugLink(null)

    // パスワード確認
    if (password !== confirmPassword) {
      setMessage({ type: 'error', text: 'パスワードが一致しません' })
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setMessage({ type: 'error', text: 'パスワードは6文字以上で入力してください' })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, devMode })
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage({ type: 'error', text: data.error })
        return
      }

      setMessage({ type: 'success', text: data.message })
      
      // Show OTP if in dev mode
      if (data.otp) {
        setMessage({ 
          type: 'success', 
          text: `${data.message}\n\nデバッグ用OTP: ${data.otp}\n\n${data.debugInfo}` 
        })
      }
      
      // Success - redirect to OTP verification
      setTimeout(() => {
        router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}`)
      }, 2000)

    } catch (error) {
      console.error('Signup error:', error)
      setMessage({ type: 'error', text: 'エラーが発生しました。もう一度お試しください。' })
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
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-indigo-600 bg-clip-text text-transparent mb-2">
              名古屋大学専用
            </h1>
            <p className="text-gray-600">過去問hubへようこそ</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                名古屋大学メールアドレス
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your-id@s.thers.ac.jp"
                required
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">
                @s.thers.ac.jp のメールアドレスのみ登録可能です
              </p>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                パスワード
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="6文字以上のパスワード"
                required
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                パスワード確認
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="パスワードを再入力"
                required
                disabled={isLoading}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>
              
            {/* Development Mode Toggle */}
            <div className="mt-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={devMode}
                  onChange={(e) => setDevMode(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-xs text-orange-600">
                  開発モード（任意のメールアドレス可）
                </span>
              </label>
            </div>

            {/* Message */}
            {message && (
              <div className={`p-4 rounded-lg text-sm ${
                message.type === 'success' 
                  ? 'bg-green-50 text-green-800 border border-green-200' 
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}

            {/* Debug link (development only) */}
            {debugLink && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-xs text-yellow-800 mb-2">開発環境用リンク：</p>
                <a 
                  href={debugLink}
                  className="text-xs text-blue-600 hover:text-blue-800 break-all"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {debugLink}
                </a>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !email || !password || !confirmPassword}
              className={`
                w-full px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg rounded-xl
                min-h-[48px] sm:min-h-[56px]
                bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700
                text-white font-medium
                transition-all duration-200
                hover:scale-105 active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed
                disabled:hover:scale-100
                ${isLoading || !email || !password || !confirmPassword ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  アカウント作成中...
                </div>
              ) : (
                'アカウントを作成'
              )}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              既にアカウントをお持ちの方は
            </p>
            <Link
              href="/auth/email"
              className="text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              ログインページへ
            </Link>
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
            <h3 className="text-sm font-medium text-indigo-900 mb-1">登録の流れ</h3>
            <ol className="text-xs text-indigo-700 space-y-1 list-decimal list-inside">
              <li>名大メールアドレスを入力</li>
              <li>確認メールのリンクをクリック</li>
              <li>学部情報を登録して完了</li>
            </ol>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-4">
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← ホームに戻る
          </Link>
        </div>
      </div>
    </main>
  )
}