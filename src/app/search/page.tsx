'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
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
    likeCount: 34
  },
  {
    id: '2',
    type: 'thread',
    title: '微積分学I 田中教授の過去問共有',
    content: '田中教授の微積分、毎年似たような問題が出てます。2023年の過去問をアップしたので参考にどうぞ！',
    author: '工学2年',
    course: '微積分学I',
    university: '東京大学',
    faculty: '工学部',
    createdAt: '2024-01-14',
    commentCount: 8,
    likeCount: 56
  },
  {
    id: '3',
    type: 'course',
    title: 'マクロ経済学',
    content: '東京大学経済学部の人気科目。IS-LMモデル、AD-ASモデルなどを学習。',
    university: '東京大学',
    faculty: '経済学部'
  },
  {
    id: '4',
    type: 'user',
    title: '経済3年',
    content: '東京大学経済学部3年生。マクロ経済学、統計学が専門。',
    university: '東京大学',
    faculty: '経済学部'
  }
]

const trendingTopics = [
  { name: 'マクロ経済学', count: 156, category: '経済学' },
  { name: '線形代数', count: 132, category: '数学' },
  { name: '有機化学', count: 98, category: '化学' },
  { name: '憲法', count: 87, category: '法学' },
  { name: '統計学', count: 76, category: '統計' },
  { name: '微積分', count: 65, category: '数学' },
  { name: '刑法', count: 54, category: '法学' },
  { name: '物理化学', count: 43, category: '化学' }
]

export default function SearchPage() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState('')
  const [selectedTab, setSelectedTab] = useState<'all' | 'threads' | 'users' | 'courses'>('all')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      setQuery(q)
      handleSearch(q)
    }
  }, [searchParams])

  const handleSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const filteredResults = mockResults.filter(result => 
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.content?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.course?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.university?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setResults(filteredResults)
      setIsLoading(false)
    }, 500)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSearch(query)
  }

  const filteredResults = results.filter(result => {
    if (selectedTab === 'all') return true
    if (selectedTab === 'threads') return result.type === 'thread'
    if (selectedTab === 'users') return result.type === 'user'
    if (selectedTab === 'courses') return result.type === 'course'
    return true
  })

  const renderResult = (result: SearchResult) => {
    if (result.type === 'thread') {
      return (
        <Link key={result.id} href={`/threads/${result.id}`}>
          <div className="bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors p-4 cursor-pointer">
            <div className="flex space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold">
                  {result.author?.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-gray-900">{result.author}</span>
                  <span className="text-gray-500">·</span>
                  <span className="text-gray-500 text-sm">{result.createdAt}</span>
                </div>
                
                <div className="flex flex-wrap gap-1 mt-1 mb-2">
                  <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                    {result.university}
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                    {result.faculty}
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs">
                    {result.course}
                  </span>
                </div>
                
                <h3 className="font-bold text-gray-900 mb-2">
                  {result.title}
                </h3>
                
                <div className="text-gray-700 mb-3">
                  {result.content}
                </div>
                
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>{result.commentCount}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                    <span>{result.likeCount}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Link>
      )
    }

    if (result.type === 'user') {
      return (
        <div key={result.id} className="bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors p-4 cursor-pointer">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {result.title.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-gray-900">{result.title}</span>
                <div className="flex items-center text-gray-500">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-600 text-sm">{result.content}</p>
              <div className="flex space-x-2 mt-1">
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {result.university}
                </span>
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {result.faculty}
                </span>
              </div>
            </div>
            <button className="px-4 py-2 border border-gray-300 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
              フォロー
            </button>
          </div>
        </div>
      )
    }

    if (result.type === 'course') {
      return (
        <div key={result.id} className="bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors p-4 cursor-pointer">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-1">{result.title}</h3>
              <p className="text-gray-600 text-sm mb-2">{result.content}</p>
              <div className="flex space-x-2">
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {result.university}
                </span>
                <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                  {result.faculty}
                </span>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center h-14">
            <Link href="/threads" className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors mr-3">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            
            <form onSubmit={handleSubmit} className="flex-1 max-w-lg">
              <div className="relative">
                <input
                  type="text"
                  value={query}
                  onChange={handleInputChange}
                  placeholder="過去問、科目、大学を検索"
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 border-none rounded-full focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500"
                  autoFocus
                />
                <svg className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>
          </div>

          {/* Tabs */}
          {query && (
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setSelectedTab('all')}
                className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                  selectedTab === 'all' 
                    ? 'text-gray-900' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                すべて
                {selectedTab === 'all' && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-indigo-500 rounded-full" />
                )}
              </button>
              <button
                onClick={() => setSelectedTab('threads')}
                className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                  selectedTab === 'threads' 
                    ? 'text-gray-900' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                投稿
                {selectedTab === 'threads' && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-indigo-500 rounded-full" />
                )}
              </button>
              <button
                onClick={() => setSelectedTab('users')}
                className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                  selectedTab === 'users' 
                    ? 'text-gray-900' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                ユーザー
                {selectedTab === 'users' && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-indigo-500 rounded-full" />
                )}
              </button>
              <button
                onClick={() => setSelectedTab('courses')}
                className={`px-4 py-3 text-sm font-medium transition-colors relative ${
                  selectedTab === 'courses' 
                    ? 'text-gray-900' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                科目
                {selectedTab === 'courses' && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-indigo-500 rounded-full" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Search results */}
        {query ? (
          <div>
            {isLoading ? (
              <div className="bg-white text-center py-16">
                <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-gray-600">検索中...</p>
              </div>
            ) : filteredResults.length > 0 ? (
              <div>
                {filteredResults.map(renderResult)}
              </div>
            ) : (
              <div className="bg-white text-center py-16">
                <div className="max-w-sm mx-auto px-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    検索結果が見つかりません
                  </h3>
                  <p className="text-gray-600 mb-6">
                    「{query}」に関連する結果が見つかりませんでした。<br />
                    別のキーワードで検索してみてください。
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Default content - trending topics */
          <div>
            <div className="bg-white">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">トレンド</h2>
              </div>
              {trendingTopics.map((topic, index) => (
                <button
                  key={topic.name}
                  onClick={() => {
                    setQuery(topic.name)
                    handleSearch(topic.name)
                  }}
                  className="w-full p-4 border-b border-gray-200 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">{index + 1}位 · {topic.category} · トレンド</div>
                      <div className="font-bold text-gray-900">{topic.name}</div>
                      <div className="text-sm text-gray-500">{topic.count}件の投稿</div>
                    </div>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>

            {/* Recent searches placeholder */}
            <div className="bg-white mt-4">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">最近の検索</h2>
              </div>
              <div className="p-4 text-center text-gray-500">
                <p>検索履歴がありません</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}