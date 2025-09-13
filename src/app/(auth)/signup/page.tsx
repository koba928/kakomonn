'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [emailSent, setEmailSent] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [devOtp, setDevOtp] = useState<string | null>(null)

  // クールダウンタイマー
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1)
      }, 1000)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [resendCooldown])

  // メールドメインチェック
  const isValidNagoyaEmail = (email: string) => {
    const validDomains = ['s.thers.ac.jp', 'nagoya-u.ac.jp', 'i.nagoya-u.ac.jp']
    return validDomains.some(domain => email.endsWith('@' + domain))
  }

  const sendConfirmationEmail = async () => {
    if (!email) {
      setMessage({ type: 'error', text: 'メールアドレスを入力してください' })
      return
    }

    if (!isValidNagoyaEmail(email)) {
      setMessage({ type: 'error', text: '名古屋大学のメールアドレスのみご利用いただけます' })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email,
          devMode: process.env.NODE_ENV === 'development' // 開発モードでOTPを表示
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setMessage({ type: 'error', text: data.error })
        return
      }

      setMessage({ 
        type: 'success', 
        text: data.isResend 
          ? '新しい認証メールを送信しました。前回のメールが届かなかった場合は、受信トレイとスパムフォルダをご確認ください。'
          : '確認メールを送信しました。届かない場合は迷惑メールをご確認ください'
      })
      setEmailSent(true)
      setResendCooldown(60) // 1分クールダウン
      
      // 開発モード用のOTP表示
      if (data.otp) {
        setDevOtp(data.otp)
      }

    } catch (error) {
      console.error('Signup error:', error)
      setMessage({ type: 'error', text: 'エラーが発生しました。もう一度お試しください。' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await sendConfirmationEmail()
  }

  const handleResend = async () => {
    if (resendCooldown > 0) return
    setDevOtp(null) // 前回のOTPをクリア
    await sendConfirmationEmail()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              過去問hubに参加
            </h1>
            <p className="text-gray-600">
              名古屋大学生専用の過去問共有プラットフォーム
            </p>
          </div>

          {!emailSent ? (
            /* 初回メール送信フォーム */
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  大学メールアドレス
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.name@s.thers.ac.jp"
                  required
                  disabled={isLoading}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  @s.thers.ac.jp、@nagoya-u.ac.jp、@i.nagoya-u.ac.jp のいずれかのメールアドレス
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !email}
                className={`
                  w-full px-6 py-3 text-base rounded-xl
                  min-h-[48px]
                  bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700
                  text-white font-medium
                  transition-all duration-200
                  hover:scale-105 active:scale-95
                  disabled:opacity-50 disabled:cursor-not-allowed
                  disabled:hover:scale-100
                `}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    送信中...
                  </div>
                ) : (
                  '確認メールを送信'
                )}
              </button>
            </form>
          ) : (
            /* メール送信後の状態 */
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  確認メールを送信しました
                </h2>
                <p className="text-gray-600 text-sm">
                  <strong>{email}</strong> 宛にメールを送信しました。<br/>
                  メール内のリンクをクリックして登録を完了してください。
                </p>
              </div>

              {/* 案内 */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-sm font-medium text-blue-800 mb-2">
                  メールが届かない場合
                </h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• 迷惑メール・スパムフォルダをご確認ください</li>
                  <li>• メールアドレスに間違いがないかご確認ください</li>
                  <li>• 数分経ってから再送信をお試しください</li>
                </ul>
              </div>

              {/* 開発用OTP表示 */}
              {devOtp && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-yellow-800 mb-2">
                    🔧 開発モード: OTPコード
                  </h3>
                  <div className="text-lg font-mono text-yellow-900 bg-white p-3 rounded border text-center">
                    {devOtp}
                  </div>
                  <p className="text-xs text-yellow-700 mt-2">
                    メールが届かない場合は、<a href="/auth/verify-otp" className="underline font-medium">OTP認証画面</a>で上記コードを入力してください。
                  </p>
                </div>
              )}

              {/* 再送ボタン */}
              <button
                onClick={handleResend}
                disabled={isLoading || resendCooldown > 0}
                className={`
                  w-full px-6 py-3 text-base rounded-xl
                  min-h-[48px]
                  ${resendCooldown > 0 
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                    : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                  }
                  font-medium transition-all duration-200
                `}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-700 mr-2" />
                    再送信中...
                  </div>
                ) : resendCooldown > 0 ? (
                  `再送信まで ${resendCooldown}秒`
                ) : (
                  '確認メールを再送信'
                )}
              </button>

              {/* メールアドレス変更 */}
              <div className="text-center">
                <button
                  onClick={() => {
                    setEmailSent(false)
                    setEmail('')
                    setMessage(null)
                    setResendCooldown(0)
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700 underline"
                >
                  メールアドレスを変更する
                </button>
              </div>
            </div>
          )}

          {/* Message */}
          {message && (
            <div className={`mt-4 p-4 rounded-lg text-sm ${
              message.type === 'error' 
                ? 'bg-red-50 text-red-800 border border-red-200' 
                : 'bg-green-50 text-green-800 border border-green-200'
            }`}>
              {message.text}
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              既に登録済みでパスワードをお持ちの方は{' '}
              <Link href="/auth/email" className="text-indigo-600 hover:text-indigo-500 font-medium">
                ログイン画面
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}