'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'

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

  useEffect(() => {
    // Load user information from localStorage
    const savedUserInfo = localStorage.getItem('kakomonn_user')
    console.log('🔍 ExamDetailHeader - localStorage userInfo:', savedUserInfo)
    console.log('🔍 ExamDetailHeader - useAuth状態:', { isLoggedIn, hasUser: !!user })
    
    if (savedUserInfo) {
      try {
        const parsed = JSON.parse(savedUserInfo)
        console.log('👤 ExamDetailHeader - parsed userInfo:', parsed)
        setUserInfo(parsed)
      } catch (error) {
        console.error('Failed to parse user info:', error)
      }
    } else if (user) {
      // localStorageにない場合は、useAuthのユーザー情報から生成
      console.log('📝 ExamDetailHeader - useAuthからユーザー情報生成')
      const userInfoFromAuth = {
        university: user.university,
        faculty: user.faculty,
        department: user.department,
        year: user.year.toString(),
        penName: user.pen_name,
        isLoggedIn: true,
        completedAt: new Date().toISOString()
      }
      setUserInfo(userInfoFromAuth)
      
      // localStorageにも保存
      localStorage.setItem('kakomonn_user', JSON.stringify(userInfoFromAuth))
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
          {userInfo ? (
            <Link href="/profile">
              <div className="text-sm text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors cursor-pointer flex items-center space-x-2">
                <span>👤</span>
                <span className="font-medium">{userInfo.penName || 'ゲストユーザー'}</span>
                <span className="text-xs text-indigo-500">({userInfo.university})</span>
              </div>
            </Link>
          ) : (
            <div className="text-sm text-gray-500 px-3 py-1.5">
              読み込み中...
            </div>
          )}
        </div>
      </div>
    </div>
  )
}