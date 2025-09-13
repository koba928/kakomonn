'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { universityDataDetailed } from '@/data/universityDataDetailed'
import { APP_CONFIG } from '@/constants/app'

export default function OnboardingPage() {
  const { user, session, loading } = useAuth()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [selectedFaculty, setSelectedFaculty] = useState('')
  const [selectedYear, setSelectedYear] = useState('')

  // Get Nagoya University faculties
  const nagoyaUniversity = useMemo(() => {
    return universityDataDetailed.find(u => u.name === '名古屋大学')
  }, [])

  useEffect(() => {
    console.log('🎯 オンボーディング画面アクセス:', {
      loading,
      hasSession: !!session,
      hasUser: !!user,
      faculty: user?.faculty,
      year: user?.year
    })

    // Check authentication status
    if (!loading && !session) {
      console.log('❌ 未認証 → サインアップにリダイレクト')
      router.push('/signup')
      return
    }

    // Check if profile is already completed
    if (!loading && user && user.faculty && user.faculty !== '未設定' && user.year && user.year !== '未設定') {
      console.log('✅ プロフィール完成済み → 検索画面にリダイレクト')
      router.push('/search')
      return
    }

    if (!loading && session && user) {
      console.log('⏳ オンボーディング開始準備完了')
    }
  }, [loading, session, user, router])

  const handleSubmit = async () => {
    if (isSubmitting || !selectedFaculty || !selectedYear) return
    
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/profile/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          faculty: selectedFaculty,
          year: selectedYear
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'プロフィールの更新に失敗しました')
        return
      }

      // Success - redirect to search page
      router.push('/search')
      
    } catch (error) {
      console.error('Profile completion error:', error)
      setError('ネットワークエラーが発生しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading while checking auth
  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">認証状態を確認中...</p>
        </div>
      </main>
    )
  }

  // Redirect if not authenticated
  if (!session) {
    return null
  }

  if (!nagoyaUniversity) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">名古屋大学のデータが見つかりません</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* ヘッダー */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-indigo-600 bg-clip-text text-transparent mb-4">
              {APP_CONFIG.name}
            </h1>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ようこそ、名古屋大学へ！
            </h2>
            <p className="text-gray-600">
              所属学部と学年を選択してください
            </p>
          </div>

          {/* エラーメッセージ */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm mb-6 max-w-md mx-auto">
              {error}
            </div>
          )}

          {/* 学部・学年選択 */}
          <div className="bg-white/90 backdrop-blur-sm p-8 sm:p-12 rounded-2xl shadow-xl border border-gray-100">
            <div className="text-center mb-8">
              <span className="text-sm text-indigo-600 font-medium">名古屋大学</span>
              <h3 className="text-xl font-bold text-gray-900 mb-2">学部・学年を選択</h3>
              <p className="text-gray-600">学部と学年を選択すると、その学部の過去問や掲示板にアクセスできます</p>
            </div>
            
            {/* 学部選択 */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">学部</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {nagoyaUniversity.faculties.map(faculty => (
                  <button
                    key={faculty.id}
                    onClick={() => setSelectedFaculty(faculty.name)}
                    disabled={isSubmitting}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left hover:shadow-md ${
                      selectedFaculty === faculty.name 
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-900' 
                        : 'border-gray-200 bg-white hover:border-indigo-300'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <h5 className="font-semibold mb-1">{faculty.name}</h5>
                    <p className="text-sm text-gray-600">{faculty.departments.length}学科</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 学年選択 */}
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">学年</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {['1年', '2年', '3年', '4年'].map(year => (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    disabled={isSubmitting}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-center font-medium ${
                      selectedYear === year 
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-900' 
                        : 'border-gray-200 bg-white hover:border-indigo-300'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>

            {/* 完了ボタン */}
            <div className="text-center">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || !selectedFaculty || !selectedYear}
                className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 ${
                  selectedFaculty && selectedYear && !isSubmitting
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 active:scale-95'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    設定中...
                  </div>
                ) : (
                  'プロフィール設定を完了'
                )}
              </button>
            </div>

            {/* 注意事項 */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    プロフィール設定について
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc list-inside space-y-1">
                      <li>後から学部・学年は変更できます</li>
                      <li>学部に関係なく全ての過去問を閲覧可能です</li>
                      <li>選択した学部の掲示板が優先表示されます</li>
                      <li>学年情報は統計目的でのみ使用されます</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}