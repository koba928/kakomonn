'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useUser } from '@/contexts/UserContext'

interface UserStats {
  postsCount: number
  commentsCount: number
  likesCount: number
  bookmarksCount: number
  downloadsCount: number
}

interface UserPost {
  id: string
  title: string
  content: string
  course: string
  university: string
  faculty: string
  createdAt: string
  commentCount: number
  likeCount: number
  downloadCount?: number
}

const mockUserStats: UserStats = {
  postsCount: 12,
  commentsCount: 45,
  likesCount: 234,
  bookmarksCount: 18,
  downloadsCount: 89
}

const mockUserPosts: UserPost[] = [
  {
    id: '1',
    title: 'マクロ経済学 2024年期末試験について',
    content: '来週のマクロ経済学の期末試験、過去問と傾向が似てるかな？IS-LMモデルは確実に出そうだけど...',
    course: 'マクロ経済学',
    university: '東京大学',
    faculty: '経済学部',
    createdAt: '2024-01-15',
    commentCount: 12,
    likeCount: 34,
    downloadCount: 8
  },
  {
    id: '2',
    title: '微積分学I 田中教授の過去問共有',
    content: '田中教授の微積分、毎年似たような問題が出てます。2023年の過去問をアップしたので参考にどうぞ！',
    course: '微積分学I',
    university: '東京大学',
    faculty: '工学部',
    createdAt: '2024-01-14',
    commentCount: 8,
    likeCount: 56,
    downloadCount: 23
  },
  {
    id: '3',
    title: '線形代数 固有値の求め方まとめ',
    content: '線形代数の固有値・固有ベクトルの計算方法をまとめました。特に3×3行列の効率的な解法を紹介します。',
    course: '線形代数II',
    university: '東京大学',
    faculty: '理学部',
    createdAt: '2024-01-10',
    commentCount: 15,
    likeCount: 78,
    downloadCount: 45
  }
]

export default function ProfilePage() {
  const { user, isLoggedIn } = useUser()
  const [selectedTab, setSelectedTab] = useState<'posts' | 'comments' | 'likes' | 'bookmarks'>('posts')

  if (!isLoggedIn || !user) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white text-center py-16">
            <div className="max-w-sm mx-auto px-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                ログインが必要です
              </h3>
              <p className="text-gray-600 mb-6">
                プロフィールを表示するにはログインしてください
              </p>
              <Link 
                href="/register/step-by-step"
                className="inline-flex items-center bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700 transition-colors"
              >
                ログイン・新規登録
              </Link>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Twitter-style header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center h-14">
            <Link href="/threads" className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors mr-8">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-sm text-gray-500">{mockUserStats.postsCount}件の投稿</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Profile header */}
        <div className="bg-white">
          {/* Cover photo area */}
          <div className="h-48 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"></div>
          
          {/* Profile info */}
          <div className="px-4 pb-4">
            <div className="flex justify-between items-start -mt-16">
              <div className="w-32 h-32 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 border-4 border-white flex items-center justify-center">
                <span className="text-white font-bold text-4xl">
                  {user.name.charAt(0)}
                </span>
              </div>
              <button className="mt-16 px-4 py-2 border border-gray-300 rounded-full font-medium hover:bg-gray-50 transition-colors">
                プロフィール編集
              </button>
            </div>
            
            <div className="mt-4">
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-500 mb-3">@{user.name.toLowerCase().replace(/\s+/g, '')}</p>
              
              <div className="mb-4">
                <div className="flex items-center text-gray-600 mb-2">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0a2 2 0 002-2v-4m-2 4a2 2 0 01-2 2M5 3v18m14-8h-2" />
                  </svg>
                  <span>{user.university} {user.faculty}</span>
                </div>
                <div className="flex items-center text-gray-600 mb-2">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>{user.department} {user.year}年生</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2v-8a2 2 0 00-2-2z" />
                  </svg>
                  <span>参加日: {new Date(user.createdAt).toLocaleDateString('ja-JP')}</span>
                </div>
              </div>
              
              {/* Stats */}
              <div className="flex space-x-6">
                <div className="text-center">
                  <div className="font-bold text-gray-900">{mockUserStats.postsCount}</div>
                  <div className="text-sm text-gray-500">投稿</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900">{mockUserStats.commentsCount}</div>
                  <div className="text-sm text-gray-500">コメント</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900">{mockUserStats.likesCount}</div>
                  <div className="text-sm text-gray-500">いいね</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900">{mockUserStats.downloadsCount}</div>
                  <div className="text-sm text-gray-500">DL</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200 sticky top-14 z-40">
          <div className="flex">
            <button
              onClick={() => setSelectedTab('posts')}
              className={`flex-1 text-center py-4 text-sm font-medium transition-colors relative ${
                selectedTab === 'posts' 
                  ? 'text-gray-900' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              投稿
              {selectedTab === 'posts' && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-indigo-500 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setSelectedTab('comments')}
              className={`flex-1 text-center py-4 text-sm font-medium transition-colors relative ${
                selectedTab === 'comments' 
                  ? 'text-gray-900' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              コメント
              {selectedTab === 'comments' && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-indigo-500 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setSelectedTab('likes')}
              className={`flex-1 text-center py-4 text-sm font-medium transition-colors relative ${
                selectedTab === 'likes' 
                  ? 'text-gray-900' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              いいね
              {selectedTab === 'likes' && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-indigo-500 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setSelectedTab('bookmarks')}
              className={`flex-1 text-center py-4 text-sm font-medium transition-colors relative ${
                selectedTab === 'bookmarks' 
                  ? 'text-gray-900' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              保存済み
              {selectedTab === 'bookmarks' && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-indigo-500 rounded-full" />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div>
          {selectedTab === 'posts' && (
            <div>
              {mockUserPosts.map((post) => (
                <div key={post.id} className="bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors">
                  <Link href={`/threads/${post.id}`}>
                    <div className="p-4 cursor-pointer">
                      <div className="flex space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                          <span className="text-white font-bold">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-gray-900">{user.name}</span>
                            <span className="text-gray-500">·</span>
                            <span className="text-gray-500 text-sm">{post.createdAt}</span>
                          </div>
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-1 mt-1 mb-2">
                            <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                              {post.university}
                            </span>
                            <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                              {post.faculty}
                            </span>
                            <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs">
                              {post.course}
                            </span>
                          </div>
                          
                          <h3 className="font-bold text-gray-900 mb-2">
                            {post.title}
                          </h3>
                          
                          <div className="text-gray-700 mb-3 whitespace-pre-line">
                            {post.content.length > 150 
                              ? `${post.content.substring(0, 150)}...` 
                              : post.content
                            }
                          </div>
                          
                          {/* Stats */}
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              <span>{post.commentCount}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              <span>{post.likeCount}</span>
                            </div>
                            {post.downloadCount && (
                              <div className="flex items-center space-x-1">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m-7 4h14a2 2 0 002-2V9a2 2 0 00-2-2M5 3v4M3 5h4" />
                                </svg>
                                <span>{post.downloadCount}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
          
          {selectedTab === 'comments' && (
            <div className="bg-white text-center py-16">
              <div className="max-w-sm mx-auto px-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  コメント履歴
                </h3>
                <p className="text-gray-600">
                  あなたが投稿したコメントがここに表示されます
                </p>
              </div>
            </div>
          )}
          
          {selectedTab === 'likes' && (
            <div className="bg-white text-center py-16">
              <div className="max-w-sm mx-auto px-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  いいねした投稿
                </h3>
                <p className="text-gray-600">
                  いいねした投稿がここに表示されます
                </p>
              </div>
            </div>
          )}
          
          {selectedTab === 'bookmarks' && (
            <div className="bg-white text-center py-16">
              <div className="max-w-sm mx-auto px-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  保存した投稿
                </h3>
                <p className="text-gray-600">
                  ブックマークした投稿がここに表示されます
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}