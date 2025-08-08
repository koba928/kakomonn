'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()
  const [message, setMessage] = useState('認証を処理中...')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('認証コールバックエラー:', error)
          setMessage('認証エラーが発生しました')
          setTimeout(() => router.push('/auth/email'), 3000)
          return
        }

        if (data.session) {
          console.log('認証成功:', data.session)
          setMessage('認証が完了しました。リダイレクト中...')
          setTimeout(() => router.push('/search'), 2000)
        } else {
          console.log('セッションが見つかりません')
          setMessage('セッションが見つかりません')
          setTimeout(() => router.push('/auth/email'), 3000)
        }
      } catch (error) {
        console.error('認証コールバック処理エラー:', error)
        setMessage('認証処理中にエラーが発生しました')
        setTimeout(() => router.push('/auth/email'), 3000)
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <h1 className="text-xl font-semibold text-gray-900 mb-2">認証処理中</h1>
        <p className="text-gray-600">{message}</p>
      </div>
    </main>
  )
}
