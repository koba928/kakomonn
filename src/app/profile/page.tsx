'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { AnimatedButton } from '@/components/ui/MicroInteractions'
import { AcademicInfoSelector, AcademicInfo } from '@/components/ui/AcademicInfoSelector'

interface UserInfo {
  university: string
  faculty: string
  department: string
  year: string
  penName: string
  isLoggedIn: boolean
  completedAt: string
}

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedInfo, setEditedInfo] = useState<UserInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Load user information from localStorage
    const savedUserInfo = localStorage.getItem('kakomonn_user')
    if (savedUserInfo) {
      try {
        const parsed = JSON.parse(savedUserInfo)
        setUserInfo(parsed)
        setEditedInfo(parsed)
      } catch (error) {
        console.error('Failed to parse user info:', error)
      }
    }
  }, [])

  const handleAcademicInfoChange = (newInfo: AcademicInfo) => {
    if (editedInfo) {
      setEditedInfo({
        ...editedInfo,
        university: newInfo.university,
        faculty: newInfo.faculty,
        department: newInfo.department
      })
    }
  }

  const handleSaveChanges = async () => {
    if (!editedInfo) return

    setIsLoading(true)

    // デモ用：変更をlocalStorageに保存
    setTimeout(() => {
      localStorage.setItem('kakomonn_user', JSON.stringify(editedInfo))
      setUserInfo(editedInfo)
      setIsEditing(false)
      setIsLoading(false)
    }, 1000)
  }

  const handleLogout = () => {
    localStorage.removeItem('kakomonn_user')
    window.location.href = '/'
  }

  const handleCancelEdit = () => {
    setEditedInfo(userInfo)
    setIsEditing(false)
  }

  // Redirect to home if not logged in
  if (!userInfo && typeof window !== 'undefined') {
    window.location.href = '/'
    return null
  }

  if (!userInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/search" 
            className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          >
            KakoMoNN
          </Link>
          <div className="flex items-center space-x-4">
            <Link 
              href="/search"
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              ← 検索に戻る
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">プロフィール設定</h1>
                {!isEditing && (
                  <AnimatedButton
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    aria-label="プロフィールを編集"
                  >
                    ✏️ 編集
                  </AnimatedButton>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-8">
                  {/* Academic Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">大学情報</h3>
                    <AcademicInfoSelector
                      value={{
                        university: editedInfo?.university || '',
                        faculty: editedInfo?.faculty || '',
                        department: editedInfo?.department || ''
                      }}
                      onChange={handleAcademicInfoChange}
                    />
                  </div>

                  {/* Year Selection */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      学年 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={editedInfo?.year || ''}
                      onChange={(e) => editedInfo && setEditedInfo({ ...editedInfo, year: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">選択してください</option>
                      <option value="1年生">1年生</option>
                      <option value="2年生">2年生</option>
                      <option value="3年生">3年生</option>
                      <option value="4年生">4年生</option>
                      <option value="大学院生">大学院生</option>
                      <option value="その他">その他</option>
                    </select>
                  </div>

                  {/* Pen Name */}
                  <div>
                    <label htmlFor="penname" className="block text-sm font-medium text-gray-700 mb-2">
                      ペンネーム（任意）
                    </label>
                    <input
                      id="penname"
                      type="text"
                      value={editedInfo?.penName || ''}
                      onChange={(e) => editedInfo && setEditedInfo({ ...editedInfo, penName: e.target.value })}
                      placeholder="例: 工学太郎、理系さん"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      maxLength={20}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <AnimatedButton
                      variant="primary"
                      size="lg"
                      onClick={handleSaveChanges}
                      disabled={isLoading}
                      className="flex-1"
                      aria-label="変更を保存"
                    >
                      {isLoading ? '保存中...' : '変更を保存'}
                    </AnimatedButton>
                    <AnimatedButton
                      variant="secondary"
                      size="lg"
                      onClick={handleCancelEdit}
                      disabled={isLoading}
                      className="flex-1"
                      aria-label="キャンセル"
                    >
                      キャンセル
                    </AnimatedButton>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Current Information Display */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">表示名</label>
                      <p className="text-lg text-gray-900">{userInfo.penName || '匿名ユーザー'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">学年</label>
                      <p className="text-lg text-gray-900">{userInfo.year}</p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">大学</label>
                      <p className="text-lg text-gray-900">{userInfo.university}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">学部</label>
                      <p className="text-lg text-gray-900">{userInfo.faculty}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">学科</label>
                      <p className="text-lg text-gray-900">{userInfo.department}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>アカウント作成日: {new Date(userInfo.completedAt).toLocaleDateString('ja-JP')}</span>
                      <span>ID: {userInfo.completedAt.slice(-8)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Account Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">アカウント操作</h3>
              <div className="space-y-3">
                <Link href="/search">
                  <AnimatedButton variant="secondary" size="sm" className="w-full">
                    🔍 検索ページ
                  </AnimatedButton>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                >
                  🚪 ログアウト
                </button>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">💡 プロフィールのメリット</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• あなたの大学の情報が優先表示されます</li>
                <li>• 同じ大学・学部の投稿が見つけやすくなります</li>
                <li>• 関連度の高いトピックが表示されます</li>
                <li>• より快適な検索体験を提供します</li>
              </ul>
            </div>

            {/* Demo Info */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-yellow-800 mb-2">🚧 デモモード</h4>
              <p className="text-xs text-yellow-700">
                現在はデモ版です。情報はブラウザ内にのみ保存されます。
                実際のサービスでは安全なサーバーで管理されます。
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}