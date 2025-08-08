'use client'

import Link from 'next/link'
import { useState } from 'react'
import { AnimatedButton } from '@/components/ui/MicroInteractions'

export default function PhoneAuthPage() {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [verificationCode, setVerificationCode] = useState('')
  const [step, setStep] = useState<'phone' | 'verify'>('phone')
  const [isLoading, setIsLoading] = useState(false)

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // デモ用：実際のSMS送信をシミュレート
    setTimeout(() => {
      setIsLoading(false)
      setStep('verify')
    }, 1500)
  }

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    // デモ用：認証コード検証をシミュレート
    setTimeout(() => {
      setIsLoading(false)
      // 大学情報入力ページに遷移
      window.location.href = '/auth/university-info'
    }, 1500)
  }

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '')
    if (numbers.length <= 3) return numbers
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhoneNumber(formatted)
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
            {step === 'phone' ? '電話番号認証' : '認証コード入力'}
          </h1>
          <p className="text-gray-600">
            {step === 'phone' 
              ? '電話番号を入力してSMSで認証コードを受け取ります'
              : `${phoneNumber}にSMSで認証コードを送信しました`
            }
          </p>
        </div>

        {/* 認証フォーム */}
        {step === 'phone' ? (
          <form onSubmit={handleSendCode} className="space-y-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                電話番号 <span className="text-red-500">*</span>
              </label>
              <input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder="090-1234-5678"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
                maxLength={13}
              />
              <p className="mt-1 text-xs text-gray-500">
                日本国内の電話番号を入力してください
              </p>
            </div>

            <AnimatedButton
              variant="primary"
              size="lg"
              className="w-full"
              disabled={phoneNumber.length < 13 || isLoading}
              aria-label="認証コードを送信"
            >
              {isLoading ? '送信中...' : '認証コードを送信'}
            </AnimatedButton>
          </form>
        ) : (
          <form onSubmit={handleVerifyCode} className="space-y-6">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                認証コード <span className="text-red-500">*</span>
              </label>
              <input
                id="code"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value.replace(/[^\d]/g, '').slice(0, 6))}
                placeholder="123456"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-center text-2xl tracking-widest"
                required
                maxLength={6}
              />
              <p className="mt-1 text-xs text-gray-500">
                6桁の認証コードを入力してください
              </p>
            </div>

            <AnimatedButton
              variant="primary"
              size="lg"
              className="w-full"
              disabled={verificationCode.length !== 6 || isLoading}
              aria-label="認証コードを確認"
            >
              {isLoading ? '確認中...' : '確認する'}
            </AnimatedButton>

            <button
              type="button"
              onClick={() => setStep('phone')}
              className="w-full text-sm text-gray-500 hover:text-gray-700"
            >
              ← 電話番号を変更する
            </button>
          </form>
        )}

        {/* フッター */}
        <div className="mt-8 text-center">
          <Link 
            href="/auth/method-select" 
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← 認証方法を変更
          </Link>
        </div>

        {/* デモ情報 */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">🚧 デモモード</h4>
          <p className="text-xs text-yellow-700">
            現在はデモ版です。実際のSMSは送信されません。任意の6桁の数字を入力して続行してください。
          </p>
        </div>
      </div>
    </main>
  )
}