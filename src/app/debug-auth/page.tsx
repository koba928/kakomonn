'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

export default function DebugAuthPage() {
  const { user, isLoggedIn, loading, session } = useAuth()
  const [localStorageData, setLocalStorageData] = useState<any>(null)
  const [supabaseSession, setSupabaseSession] = useState<any>(null)

  useEffect(() => {
    // LocalStorage データを取得
    const userData = localStorage.getItem('kakomonn_user')
    const supabaseSession = localStorage.getItem('sb-lomqnabnvzufgdzlwblg-auth-token')
    
    setLocalStorageData({
      kakomonn_user: userData ? JSON.parse(userData) : null,
      supabase_session: supabaseSession ? JSON.parse(supabaseSession) : null
    })

    // Supabaseセッションを直接確認
    const checkSession = async () => {
      const { data, error } = await supabase.auth.getSession()
      setSupabaseSession({ data, error })
    }

    checkSession()
  }, [])

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'fd.18t.2705@s.thers.ac.jp',
      password: 'your-password' // 実際のパスワードに変更
    })
    
    console.log('ログイン結果:', { data, error })
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    console.log('ログアウト結果:', { error })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p>認証状態読み込み中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">認証状態デバッグ</h1>
        
        <div className="grid gap-6">
          {/* useAuth情報 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">useAuth状態</h2>
            <div className="space-y-2">
              <p><strong>ローディング中:</strong> {loading ? 'はい' : 'いいえ'}</p>
              <p><strong>ログイン済み:</strong> {isLoggedIn ? 'はい' : 'いいえ'}</p>
              <p><strong>ユーザー情報:</strong></p>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(user, null, 2)}
              </pre>
              <p><strong>セッション情報:</strong></p>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
          </div>

          {/* LocalStorage情報 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">LocalStorage情報</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(localStorageData, null, 2)}
            </pre>
          </div>

          {/* Supabaseセッション情報 */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Supabase直接セッション</h2>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(supabaseSession, null, 2)}
            </pre>
          </div>

          {/* 操作ボタン */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">操作</h2>
            <div className="space-x-4">
              <button
                onClick={handleLogin}
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              >
                テストログイン
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}