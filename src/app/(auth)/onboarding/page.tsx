'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { AnimatedButton } from '@/components/ui/MicroInteractions'
import { VirtualizedAutocompleteSelect } from '@/components/ui/VirtualizedAutocompleteSelect'
import { universityDataDetailed } from '@/data/universityDataDetailed'

export default function OnboardingPage() {
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  
  const [faculty, setFaculty] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Get Nagoya University faculties
  const nagoyaUniversity = universityDataDetailed.find(u => u.name === '名古屋大学')
  const facultyOptions = nagoyaUniversity?.faculties.map(f => ({
    value: f.name,
    label: f.name
  })) || []

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        router.push('/auth/email')
        return
      }

      // Check if profile already exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      if (profile) {
        // Profile already exists, redirect to main app
        router.push('/search')
        return
      }

      setIsCheckingAuth(false)
    }

    checkAuth()
  }, [supabase, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/profile/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ faculty })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error)
        return
      }

      // Success - redirect to search page
      router.push('/search')

    } catch (error) {
      console.error('Profile completion error:', error)
      setError('エラーが発生しました。もう一度お試しください。')
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingAuth) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">認証状態を確認中...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              プロフィール登録
            </h1>
            <p className="text-gray-600">
              名古屋大学での所属学部を選択してください
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="faculty" className="block text-sm font-medium text-gray-700 mb-2">
                学部 <span className="text-red-500">*</span>
              </label>
              <VirtualizedAutocompleteSelect
                options={facultyOptions}
                value={faculty}
                onChange={setFaculty}
                placeholder="学部を選択してください"
              />
              <p className="text-xs text-gray-500 mt-1">
                所属する学部を選択してください
              </p>
            </div>

            {/* University Display */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <span className="font-medium">大学：</span>名古屋大学（固定）
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !faculty}
              className={`
                w-full px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg rounded-xl
                min-h-[48px] sm:min-h-[56px]
                bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700
                text-white font-medium
                transition-all duration-200
                hover:scale-105 active:scale-95
                disabled:opacity-50 disabled:cursor-not-allowed
                disabled:hover:scale-100
                ${isLoading || !faculty ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                  登録中...
                </div>
              ) : (
                '登録を完了'
              )}
            </button>
          </form>

          {/* Info */}
          <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
            <p className="text-xs text-indigo-700">
              この情報は後から変更することはできません。<br />
              正確な情報を入力してください。
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}