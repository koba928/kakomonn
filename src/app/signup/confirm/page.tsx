'use client'

import Link from 'next/link'

export default function SignupConfirmPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100 text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">📩</span>
          </div>

          {/* Header */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            認証メールを送信しました
          </h1>
          
          <p className="text-gray-600 mb-8">
            登録いただいたメールアドレスに認証メールを送信しました。<br />
            メール内のリンクをクリックして、登録を完了してください。
          </p>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-left">
            <h3 className="text-sm font-medium text-blue-800 mb-2">
              メールが届かない場合
            </h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 迷惑メールフォルダをご確認ください</li>
              <li>• メールアドレスが正しいか確認してください</li>
              <li>• 数分待ってから再度お試しください</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <Link
              href="/login"
              className="block w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors text-center"
            >
              ログイン画面へ
            </Link>
            
            <Link
              href="/"
              className="block text-sm text-gray-500 hover:text-gray-700"
            >
              ホームに戻る
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}