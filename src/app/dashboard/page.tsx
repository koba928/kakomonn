'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { APP_CONFIG } from '@/constants/app'
import { supabase } from '@/lib/supabase'

interface UserProfile {
  id: string
  email: string
  faculty?: string
  year?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        router.push('/login')
        return
      }

      // プロフィール情報を取得
      const { data: profile } = await supabase
        .from('profiles')
        .select('faculty, year')
        .eq('id', user.id)
        .single()

      setUser({
        id: user.id,
        email: user.email || '',
        faculty: profile?.faculty,
        year: profile?.year
      })
    } catch (error) {
      console.error('User check error:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </main>
    )
  }

  if (!user) {
    return null // リダイレクト中
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {APP_CONFIG.name}
            </h1>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ダッシュボード
          </h2>
          <p className="text-gray-600 mb-6">
            ようこそ、{APP_CONFIG.name}へ！
          </p>
          
          {user.faculty && user.year && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-indigo-800 mb-2">
                プロフィール情報
              </h3>
              <div className="text-sm text-indigo-700">
                <p>学部: {user.faculty}</p>
                <p>学年: {user.year}</p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="bg-indigo-100 rounded-lg p-3 mr-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">過去問を検索</h3>
                <p className="text-gray-600 text-sm">科目や教員名で過去問を探す</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/search')}
              className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              検索する
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="bg-green-100 rounded-lg p-3 mr-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">過去問を投稿</h3>
                <p className="text-gray-600 text-sm">新しい過去問を共有する</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/upload')}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              投稿する
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center mb-4">
              <div className="bg-purple-100 rounded-lg p-3 mr-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">プロフィール</h3>
                <p className="text-gray-600 text-sm">アカウント情報を管理</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/profile')}
              className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              設定
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            最近の活動
          </h3>
          <div className="text-center py-8 text-gray-500">
            まだ活動履歴がありません
          </div>
        </div>
      </main>
    </div>
  )
}