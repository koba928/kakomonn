'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

export default function DebugStoragePage() {
  const { user, isLoggedIn, loading, session } = useAuth()
  const [storageKeys, setStorageKeys] = useState<string[]>([])
  const [storageData, setStorageData] = useState<Record<string, any>>({})
  const [currentSession, setCurrentSession] = useState<any>(null)

  useEffect(() => {
    // LocalStorageの全キーを取得
    const keys = Object.keys(localStorage)
    setStorageKeys(keys)

    // 各キーの値を取得
    const data: Record<string, any> = {}
    keys.forEach(key => {
      try {
        const value = localStorage.getItem(key)
        if (value) {
          data[key] = value.length > 100 ? value.substring(0, 100) + '...' : value
          // JSONとして解析を試みる
          try {
            const parsed = JSON.parse(value)
            data[key + '_parsed'] = parsed
          } catch {}
        }
      } catch (error) {
        data[key] = `Error reading: ${error}`
      }
    })
    setStorageData(data)

    // 現在のセッションを直接確認
    checkCurrentSession()
  }, [])

  const checkCurrentSession = async () => {
    const { data, error } = await supabase.auth.getSession()
    setCurrentSession({ data, error })
  }

  const refreshSession = async () => {
    const { data, error } = await supabase.auth.refreshSession()
    if (error) {
      console.error('セッションリフレッシュエラー:', error)
    } else {
      console.log('セッションリフレッシュ成功:', data)
      window.location.reload()
    }
  }

  const clearAuthStorage = () => {
    // Supabase関連のストレージをクリア
    const authKeys = Object.keys(localStorage).filter(key => 
      key.includes('supabase') || key.includes('auth')
    )
    authKeys.forEach(key => localStorage.removeItem(key))
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">ストレージデバッグ</h1>

        {/* 認証状態 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">認証状態 (useAuth)</h2>
          <div className="space-y-2 text-sm">
            <p><strong>ローディング中:</strong> {loading ? 'はい' : 'いいえ'}</p>
            <p><strong>ログイン済み:</strong> {isLoggedIn ? 'はい' : 'いいえ'}</p>
            <p><strong>セッション:</strong> {session ? 'あり' : 'なし'}</p>
            <p><strong>ユーザーID:</strong> {user?.id || 'なし'}</p>
            <p><strong>メール:</strong> {user?.email || 'なし'}</p>
          </div>
        </div>

        {/* 直接セッション確認 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Supabase直接セッション</h2>
          <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
            {JSON.stringify(currentSession, null, 2)}
          </pre>
          <div className="mt-4 space-x-2">
            <button
              onClick={checkCurrentSession}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              セッション再確認
            </button>
            <button
              onClick={refreshSession}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              セッションリフレッシュ
            </button>
            <button
              onClick={clearAuthStorage}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              認証ストレージクリア
            </button>
          </div>
        </div>

        {/* LocalStorageキー一覧 */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">LocalStorage キー一覧</h2>
          <div className="space-y-2">
            {storageKeys.map(key => (
              <div key={key} className="border-b pb-2">
                <p className="font-medium text-sm">{key}</p>
                <p className="text-xs text-gray-600">
                  値: {storageData[key]}
                </p>
                {storageData[key + '_parsed'] && (
                  <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-auto">
                    {JSON.stringify(storageData[key + '_parsed'], null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}