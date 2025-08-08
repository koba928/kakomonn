'use client'

import Link from 'next/link'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

interface SearchResult {
  id: string
  type: 'thread' | 'user' | 'course'
  title: string
  content?: string
  author?: string
  course?: string
  university?: string
  faculty?: string
  createdAt?: string
  commentCount?: number
  likeCount?: number
}

const mockResults: SearchResult[] = [
  {
    id: '1',
    type: 'thread',
    title: 'マクロ経済学 2024年期末試験について',
    content: '来週のマクロ経済学の期末試験、過去問と傾向が似てるかな？IS-LMモデルは確実に出そうだけど...',
    author: '経済3年',
    course: 'マクロ経済学',
    university: '東京大学',
    faculty: '経済学部',
    createdAt: '2024-01-15',
    commentCount: 12,
    likeCount: 8
  },
  {
    id: '2',
    type: 'user',
    title: '田中教授',
    university: '早稲田大学',
    faculty: '商学部'
  },
  {
    id: '3',
    type: 'course',
    title: 'データ構造とアルゴリズム',
    university: '東京工業大学',
    faculty: '情報理工学院'
  }
]

const mockTrendingTopics = [
  { name: 'マクロ経済学', count: 234, category: '経済' },
  { name: '線形代数', count: 187, category: '数学' },
  { name: '有機化学', count: 156, category: '化学' },
  { name: 'データベース', count: 143, category: '情報' },
  { name: '国際関係論', count: 132, category: '政治' },
  { name: '心理学概論', count: 118, category: '心理' },
  { name: '機械学習', count: 109, category: '情報' },
  { name: '日本史', count: 98, category: '歴史' },
  { name: '憲法', count: 87, category: '法学' },
  { name: '統計学', count: 76, category: '統計' },
  { name: '微積分', count: 65, category: '数学' },
  { name: '刑法', count: 54, category: '法学' },
  { name: '物理化学', count: 43, category: '化学' }
]

interface UserInfo {
  university: string
  faculty: string
  department: string
  year: string
  penName: string
  isLoggedIn: boolean
  completedAt: string
}

function SearchPageClient() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState('')
  const [selectedTab, setSelectedTab] = useState<'all' | 'threads' | 'users' | 'courses'>('all')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      setQuery(q)
      handleSearch(q)
    }
  }, [searchParams])

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
  }, [])

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      let filtered = mockResults.filter(result => 
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.course?.toLowerCase().includes(searchQuery.toLowerCase())
      )

      // Prioritize results from user's university if logged in
      if (userInfo) {
        filtered = filtered.sort((a, b) => {
          const aMatchesUniversity = a.university === userInfo.university
          const bMatchesUniversity = b.university === userInfo.university
          const aMatchesFaculty = a.faculty === userInfo.faculty
          const bMatchesFaculty = b.faculty === userInfo.faculty

          // Same university results first
          if (aMatchesUniversity && !bMatchesUniversity) return -1
          if (!aMatchesUniversity && bMatchesUniversity) return 1
          
          // Within same university, prioritize same faculty
          if (aMatchesUniversity && bMatchesUniversity) {
            if (aMatchesFaculty && !bMatchesFaculty) return -1
            if (!aMatchesFaculty && bMatchesFaculty) return 1
          }

          return 0
        })
      }

      setResults(filtered)
      setIsLoading(false)
    }, 500)
  }

  const getTabResults = () => {
    if (selectedTab === 'all') return results
    return results.filter(result => {
      if (selectedTab === 'threads') return result.type === 'thread'
      if (selectedTab === 'users') return result.type === 'user'
      if (selectedTab === 'courses') return result.type === 'course'
      return true
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/" 
            className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          >
            KakoMoNN
          </Link>
          <div className="flex items-center space-x-4">
            {userInfo && (
              <Link href="/profile">
                <div className="text-sm text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full hover:bg-indigo-100 transition-colors cursor-pointer">
                  👤 {userInfo.penName || '匿名ユーザー'} ({userInfo.university})
                </div>
              </Link>
            )}
            <div className="text-sm text-gray-500">
              {query && `"${query}" の検索結果`}
            </div>
          </div>
        </div>

        {/* Personalized Welcome Message */}
        {userInfo && !query && (
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-8">
            <h3 className="text-lg font-semibold text-indigo-900 mb-2">
              こんにちは、{userInfo.penName || '匿名ユーザー'}さん！
            </h3>
            <p className="text-indigo-700 text-sm">
              {userInfo.university} {userInfo.faculty} {userInfo.department} {userInfo.year}の情報を優先的に表示します。
            </p>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
                placeholder="過去問、授業、教授を検索..."
                className="w-full px-4 py-4 pl-12 text-lg border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <button
                onClick={() => handleSearch(query)}
                disabled={isLoading}
                className="px-8 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? '検索中...' : '検索'}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {query && (
              <>
                {/* Tabs */}
                <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 mb-6">
                  {[
                    { key: 'all', label: 'すべて', count: results.length },
                    { key: 'threads', label: 'スレッド', count: results.filter(r => r.type === 'thread').length },
                    { key: 'users', label: 'ユーザー', count: results.filter(r => r.type === 'user').length },
                    { key: 'courses', label: '授業', count: results.filter(r => r.type === 'course').length }
                  ].map(tab => (
                    <button
                      key={tab.key}
                      onClick={() => setSelectedTab(tab.key as any)}
                      className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        selectedTab === tab.key
                          ? 'bg-white text-indigo-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {tab.label} ({tab.count})
                    </button>
                  ))}
                </div>

                {/* Results */}
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">検索中...</p>
                    </div>
                  ) : getTabResults().length > 0 ? (
                    getTabResults().map(result => (
                      <div key={result.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                result.type === 'thread' ? 'bg-blue-100 text-blue-700' :
                                result.type === 'user' ? 'bg-green-100 text-green-700' :
                                'bg-purple-100 text-purple-700'
                              }`}>
                                {result.type === 'thread' ? 'スレッド' :
                                 result.type === 'user' ? 'ユーザー' : '授業'}
                              </span>
                              
                              {/* University match indicator */}
                              {userInfo && result.university === userInfo.university && (
                                <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-700 font-medium">
                                  🏫 同じ大学
                                </span>
                              )}
                              
                              {/* Faculty match indicator */}
                              {userInfo && result.university === userInfo.university && result.faculty === userInfo.faculty && (
                                <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700 font-medium">
                                  📚 同じ学部
                                </span>
                              )}

                              {result.university && (
                                <span className={`text-sm ${
                                  userInfo && result.university === userInfo.university 
                                    ? 'text-indigo-600 font-medium' 
                                    : 'text-gray-500'
                                }`}>
                                  {result.university}
                                </span>
                              )}
                              {result.faculty && (
                                <span className={`text-sm ${
                                  userInfo && result.faculty === userInfo.faculty 
                                    ? 'text-purple-600 font-medium' 
                                    : 'text-gray-500'
                                }`}>
                                  • {result.faculty}
                                </span>
                              )}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              <Link href={result.type === 'thread' ? `/threads/${result.id}` : '#'} className="hover:text-indigo-600 transition-colors">
                                {result.title}
                              </Link>
                            </h3>
                            {result.content && (
                              <p className="text-gray-600 mb-3 line-clamp-2">{result.content}</p>
                            )}
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              {result.author && <span>投稿者: {result.author}</span>}
                              {result.course && <span>授業: {result.course}</span>}
                              {result.createdAt && <span>{result.createdAt}</span>}
                              {result.commentCount !== undefined && (
                                <span>💬 {result.commentCount}</span>
                              )}
                              {result.likeCount !== undefined && (
                                <span>❤️ {result.likeCount}</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-600">検索結果が見つかりませんでした。</p>
                      <p className="text-sm text-gray-500 mt-1">別のキーワードで検索してみてください。</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {!query && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">何をお探しですか？</h2>
                <p className="text-gray-600 mb-8">過去問、授業情報、教授について検索できます</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-indigo-600 text-3xl mb-4">📝</div>
                    <h3 className="font-semibold text-gray-900 mb-2">過去問・試験情報</h3>
                    <p className="text-sm text-gray-600">過去の試験問題や傾向を検索</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-purple-600 text-3xl mb-4">📚</div>
                    <h3 className="font-semibold text-gray-900 mb-2">授業・講義情報</h3>
                    <p className="text-sm text-gray-600">授業の内容や評価を検索</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="text-green-600 text-3xl mb-4">👨‍🏫</div>
                    <h3 className="font-semibold text-gray-900 mb-2">教授・講師情報</h3>
                    <p className="text-sm text-gray-600">教授の授業スタイルや評価を検索</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* User Profile Section */}
            {userInfo && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">プロフィール</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">表示名:</span>
                    <span className="font-medium">{userInfo.penName || '匿名ユーザー'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">大学:</span>
                    <span className="font-medium">{userInfo.university}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">学部:</span>
                    <span className="font-medium">{userInfo.faculty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">学科:</span>
                    <span className="font-medium">{userInfo.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">学年:</span>
                    <span className="font-medium">{userInfo.year}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">
                {userInfo ? `${userInfo.university}で人気のトピック` : '人気のトピック'}
              </h3>
              <div className="space-y-3">
                {mockTrendingTopics.map((topic, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <button 
                      onClick={() => {
                        setQuery(topic.name)
                        handleSearch(topic.name)
                      }}
                      className="text-sm text-indigo-600 hover:text-indigo-800 font-medium text-left"
                    >
                      {topic.name}
                    </button>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                        {topic.category}
                      </span>
                      <span className="text-xs text-gray-500">{topic.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">検索のコツ</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• 具体的な授業名を入力してみましょう</p>
                <p>• 大学名と組み合わせると絞り込めます</p>
                <p>• 教授の名前でも検索できます</p>
                <p>• 「過去問」「試験」などのキーワードも有効です</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <SearchPageClient />
    </Suspense>
  )
}