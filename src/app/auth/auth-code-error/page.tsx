'use client'

import Link from 'next/link'
import { APP_CONFIG } from '@/constants/app'

export default function AuthCodeErrorPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md text-center">
        {/* ヘッダー */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 inline-block"
          >
            {APP_CONFIG.name}
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            認証エラー
          </h1>
          <p className="text-gray-600">
            メール認証リンクに問題がありました
          </p>
        </div>

        {/* エラー内容 */}
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                認証に失敗しました
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>以下の原因が考えられます：</p>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  <li>認証リンクの有効期限が切れている</li>
                  <li>認証リンクが正しくない</li>
                  <li>認証リンクが既に使用済み</li>
                  <li>ブラウザのCookieが無効になっている</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* 対処法 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <h3 className="text-sm font-medium text-blue-800 mb-2">
            対処法
          </h3>
          <div className="text-sm text-blue-700 space-y-2">
            <p>1. 再度新規登録を行ってください</p>
            <p>2. 送信されたメール内の最新のリンクをクリックしてください</p>
            <p>3. ブラウザのCookieを有効にしてから再試行してください</p>
          </div>
        </div>

        {/* アクション */}
        <div className="space-y-4">
          <Link
            href="/signup"
            className="w-full inline-flex justify-center items-center px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors"
          >
            再度新規登録する
          </Link>
          
          <Link
            href="/auth/email"
            className="w-full inline-flex justify-center items-center px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
          >
            ログイン画面に戻る
          </Link>
        </div>

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
    </main>
  )
}