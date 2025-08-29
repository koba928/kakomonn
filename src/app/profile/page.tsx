'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { AnimatedButton } from '@/components/ui/MicroInteractions'
import { AcademicInfoSelector, AcademicInfo } from '@/components/ui/AcademicInfoSelector'
import { api } from '@/services/api'
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

interface PastExam {
  id: string
  title: string
  course_name: string
  professor: string
  university: string
  faculty: string
  department: string
  year: number
  semester: string
  exam_type: string
  file_url: string
  file_name: string
  uploaded_by: string
  download_count: number
  difficulty: number
  helpful_count: number
  tags: string[]
  created_at: string
  updated_at: string
}

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedInfo, setEditedInfo] = useState<UserInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [myUploads, setMyUploads] = useState<PastExam[]>([])
  const [isLoadingUploads, setIsLoadingUploads] = useState(true)

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

  useEffect(() => {
    // Load uploaded exams
    const loadMyUploads = async () => {
      if (!user?.id) {
        setIsLoadingUploads(false)
        return
      }
      try {
        setIsLoadingUploads(true)
        const exams = await api.pastExams.getByUserId(user.id)
        setMyUploads(exams)
      } catch (error) {
        console.error('Failed to load uploads:', error)
      } finally {
        setIsLoadingUploads(false)
      }
    }

    loadMyUploads()
  }, [user])

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

  // ローディング中の表示
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">認証状態を確認中...</p>
        </div>
      </div>
    )
  }

  // 認証チェック - userInfoまたはuseAuthのユーザー情報があればOK
  if (!userInfo && !user && typeof window !== 'undefined') {
    console.log('🚫 プロフィールページ: 認証なし - ホームへリダイレクト')
    window.location.href = '/'
    return null
  }

  // userInfoが存在しない場合の対処
  if (!userInfo && user) {
    console.log('📝 プロフィールページ: useAuthから userInfo 生成')
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
    localStorage.setItem('kakomonn_user', JSON.stringify(userInfoFromAuth))
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">ユーザー情報を準備中...</p>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6 md:mb-8">
          <Link 
            href="/search" 
            className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          >
            KakoMoNN
          </Link>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Link 
              href="/search"
              className="text-sm text-gray-500 hover:text-gray-700 min-h-[44px] flex items-center"
              aria-label="検索ページに戻る"
            >
              ← 検索に戻る
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6">
              <div className="flex items-center justify-between mb-4 sm:mb-5 md:mb-6">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">プロフィール設定</h1>
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
                <div className="space-y-4 sm:space-y-6 md:space-y-8">
                  {/* Academic Information */}
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">大学情報</h3>
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
                      className="w-full px-3 py-3 sm:px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[44px] text-base"
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
                      className="w-full px-3 py-3 sm:px-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[44px] text-base"
                      maxLength={20}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
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
                <div className="space-y-4 sm:space-y-5 md:space-y-6">
                  {/* Current Information Display */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">表示名</label>
                      <p className="text-base sm:text-lg text-gray-900">{userInfo?.penName || '匿名ユーザー'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">学年</label>
                      <p className="text-base sm:text-lg text-gray-900">{userInfo?.year}</p>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">大学</label>
                      <p className="text-base sm:text-lg text-gray-900">{userInfo?.university}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">学部</label>
                      <p className="text-base sm:text-lg text-gray-900">{userInfo?.faculty}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">学科</label>
                      <p className="text-base sm:text-lg text-gray-900">{userInfo?.department}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>アカウント作成日: {userInfo?.completedAt ? new Date(userInfo.completedAt).toLocaleDateString('ja-JP') : '未設定'}</span>
                      <span>ID: {userInfo?.completedAt?.slice(-8) || '未設定'}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-4 sm:space-y-5 md:space-y-6">
            {/* Account Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">アカウント操作</h3>
              <div className="space-y-3">
                <Link href="/search">
                  <AnimatedButton variant="secondary" size="sm" className="w-full">
                    🔍 検索ページ
                  </AnimatedButton>
                </Link>
                <Link href="/upload">
                  <AnimatedButton variant="secondary" size="sm" className="w-full">
                    📤 過去問を投稿
                  </AnimatedButton>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors min-h-[44px]"
                  aria-label="ログアウトする"
                >
                  🚪 ログアウト
                </button>
              </div>
            </div>


            {/* Demo Info */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
              <h4 className="text-sm font-medium text-yellow-800 mb-2">🚧 デモモード</h4>
              <p className="text-sm text-yellow-700">
                現在はデモ版です。情報はブラウザ内にのみ保存されます。
                実際のサービスでは安全なサーバーで管理されます。
              </p>
            </div>
          </div>
        </div>

        {/* 投稿した過去問一覧 */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5 md:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-5 md:mb-6">投稿した過去問</h2>
            
            {isLoadingUploads ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
                <span className="text-gray-600">読み込み中...</span>
              </div>
            ) : myUploads.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-3">📝</div>
                <p className="text-gray-600 mb-4">まだ過去問を投稿していません</p>
                <Link href="/upload">
                  <AnimatedButton variant="primary" size="sm">
                    過去問を投稿する
                  </AnimatedButton>
                </Link>
              </div>
            ) : (
              <div className="grid gap-4">
                {myUploads.map((exam) => (
                  <div
                    key={exam.id}
                    className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:bg-gray-100 hover:border-indigo-300 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <Link
                        href={`/exams/${exam.id}`}
                        className="font-medium text-gray-900 hover:text-indigo-700 transition-colors flex-1"
                      >
                        {exam.title}
                      </Link>
                      <div className="flex items-center space-x-2 ml-4">
                        <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded">
                          {exam.year}年
                        </span>
                        <Link
                          href={`/exams/${exam.id}/edit`}
                          className="text-sm text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded transition-colors"
                        >
                          編集
                        </Link>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>📚 {exam.course_name}</p>
                      <p>👨‍🏫 {exam.professor || <span className="text-red-500">未設定</span>}</p>
                      <p>{exam.university} {exam.faculty} {exam.department}</p>
                    </div>
                    <div className="flex items-center justify-between mt-3 text-sm">
                      <div className="flex items-center space-x-4 text-gray-500">
                        <span>📥 {exam.download_count || 0} ダウンロード</span>
                        <span>💭 {exam.helpful_count || 0} コメント</span>
                      </div>
                      <span className="text-gray-400">
                        {new Date(exam.created_at).toLocaleDateString('ja-JP')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}