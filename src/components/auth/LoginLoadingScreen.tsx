'use client'

import { useEffect, useState } from 'react'

interface LoginLoadingScreenProps {
  message?: string
  subMessage?: string
}

export default function LoginLoadingScreen({ 
  message = 'ログイン中...', 
  subMessage = 'しばらくお待ちください' 
}: LoginLoadingScreenProps) {
  const [dots, setDots] = useState('')
  
  // アニメーション用ドット更新
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : `${prev  }.`)
    }, 500)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-600/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-600/20 rounded-full blur-3xl animate-float animation-delay-2000"></div>
      </div>

      <div className="relative z-10 text-center px-4">
        {/* Logo */}
        <div className="mb-8">
          <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            KakoMoNN
          </div>
        </div>

        {/* Loading Animation */}
        <div className="mb-8">
          <div className="relative">
            {/* Outer ring */}
            <div className="w-20 h-20 mx-auto border-4 border-gray-200 rounded-full"></div>
            {/* Spinning ring */}
            <div className="absolute inset-0 w-20 h-20 mx-auto border-4 border-transparent border-t-indigo-600 rounded-full animate-spin"></div>
            {/* Inner pulse */}
            <div className="absolute inset-4 w-12 h-12 mx-auto bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full animate-pulse opacity-20"></div>
          </div>
        </div>

        {/* Messages */}
        <div className="space-y-3">
          <h1 className="text-2xl font-bold text-gray-900">
            {message}
            <span className="text-indigo-600">{dots}</span>
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            {subMessage}
          </p>
        </div>

        {/* Progress indicators */}
        <div className="mt-8 space-y-4">
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce animation-delay-200"></div>
            <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce animation-delay-400"></div>
          </div>
          
          <div className="text-sm text-gray-500">
            認証処理を実行中です
          </div>
        </div>

        {/* Tips */}
        <div className="mt-12 p-4 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg max-w-md mx-auto">
          <div className="text-sm text-gray-600">
            <p className="font-medium text-indigo-600 mb-2">💡 ヒント</p>
            <p>ログイン後は、あなたの大学・学部に最適化された過去問が表示されます</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// 様々なログイン状態に対応した専用メッセージ
export const LoginMessages = {
  EMAIL_VERIFICATION: {
    message: 'メール認証中',
    subMessage: 'メール内のリンクをクリックしてください'
  },
  PROCESSING: {
    message: 'ログイン処理中',
    subMessage: 'アカウント情報を確認しています'
  },
  REDIRECTING: {
    message: 'リダイレクト中',
    subMessage: 'まもなくメインページに移動します'
  },
  PROFILE_LOADING: {
    message: 'プロフィール読み込み中',
    subMessage: 'あなた専用の情報を準備しています'
  }
}