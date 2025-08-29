'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'

interface UserInfo {
  university: string
  faculty: string
  department: string
  year: string
  penName: string
  isLoggedIn: boolean
  completedAt: string
}

export default function ExamDetailHeader() {
  const { user, isLoggedIn } = useAuth()
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Load user information from localStorage
    const savedUserInfo = localStorage.getItem('kakomonn_user')
    if (savedUserInfo) {
      try {
        const parsed = JSON.parse(savedUserInfo)
        setUserInfo(parsed)
      } catch (error) {
        console.error('Failed to parse user info:', error)
      }
    }
  }, [isLoggedIn, user])

  return (
    <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center flex-1">
            <Link 
              href="/search" 
              className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors mr-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">過去問詳細</h1>
          </div>
          
          {/* User Info */}
          {userInfo && (
            <button
              onClick={() => {
                console.log('プロフィールリンククリック')
                router.push('/profile')
              }}
              className="text-sm text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors cursor-pointer flex items-center space-x-2"
            >
              <span>👤</span>
              <span className="font-medium">{userInfo.penName || 'ゲストユーザー'}</span>
              <span className="text-xs text-indigo-500">({userInfo.university})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}