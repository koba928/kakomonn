'use client'

import Link from 'next/link'
import { useState } from 'react'

interface Thread {
  id: string
  title: string
  content: string
  author: string
  course: string
  university: string
  faculty: string
  createdAt: string
  commentCount: number
  examYear?: number
}

const mockThreads: Thread[] = [
  {
    id: '1',
    title: 'マクロ経済学 2024年期末試験について',
    content: '来週のマクロ経済学の期末試験、過去問と傾向が似てるかな？IS-LMモデルは確実に出そうだけど...',
    author: '経済3年',
    course: 'マクロ経済学',
    university: '東京大学',
    faculty: '経済学部',
    createdAt: '2024-01-15',
    commentCount: 12,
    examYear: 2024
  },
  {
    id: '2',
    title: '微積分学I 田中教授の過去問共有',
    content: '田中教授の微積分、毎年似たような問題が出てます。2023年の過去問をアップしたので参考にどうぞ！',
    author: '工学2年',
    course: '微積分学I',
    university: '東京大学',
    faculty: '工学部',
    createdAt: '2024-01-14',
    commentCount: 8,
    examYear: 2023
  },
  {
    id: '3',
    title: '憲法 レポート課題のヒント教えて',
    content: '憲法のレポート課題「基本的人権について」で悩んでます。どの判例を中心に書けばいいでしょうか？',
    author: '法学1年',
    course: '憲法',
    university: '早稲田大学',
    faculty: '法学部',
    createdAt: '2024-01-13',
    commentCount: 15
  },
  {
    id: '4',
    title: '有機化学 実験レポートの書き方',
    content: '有機化学の実験レポート、考察の部分をどう書けばいいか分からない...過去のレポートを参考にしたいです。',
    author: '理学2年',
    course: '有機化学実験',
    university: '京都大学',
    faculty: '理学部',
    createdAt: '2024-01-12',
    commentCount: 6
  }
]

export default function ThreadsPage() {
  const [selectedUniversity, setSelectedUniversity] = useState('')
  const [selectedFaculty, setSelectedFaculty] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredThreads = mockThreads.filter(thread => {
    const matchesUniversity = !selectedUniversity || thread.university === selectedUniversity
    const matchesFaculty = !selectedFaculty || thread.faculty === selectedFaculty
    const matchesSearch = !searchQuery || 
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.course.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesUniversity && matchesFaculty && matchesSearch
  })

  const universities = [...new Set(mockThreads.map(t => t.university))]
  const faculties = [...new Set(mockThreads.map(t => t.faculty))]

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                過去問<span className="text-indigo-600">hub</span>
              </h1>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link 
                href="/upload" 
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                勉強記録を投稿
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            スレッド一覧
          </h2>
          <p className="text-gray-600">
            大学生の勉強記録と情報交換の場です
          </p>
        </div>

        {/* フィルター */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold mb-4">検索・フィルター</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                大学
              </label>
              <select
                value={selectedUniversity}
                onChange={(e) => setSelectedUniversity(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">すべての大学</option>
                {universities.map(uni => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                学部
              </label>
              <select
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">すべての学部</option>
                {faculties.map(fac => (
                  <option key={fac} value={fac}>{fac}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                キーワード検索
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="授業名、タイトルで検索..."
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* スレッド一覧 */}
        <div className="space-y-4">
          {filteredThreads.map((thread) => (
            <Link key={thread.id} href={`/threads/${thread.id}`}>
              <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      {thread.university}
                    </span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      {thread.faculty}
                    </span>
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                      {thread.course}
                    </span>
                    {thread.examYear && (
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                        {thread.examYear}年度
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    {thread.createdAt}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {thread.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {thread.content}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span>{thread.author}</span>
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span>{thread.commentCount}件のコメント</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      いいね
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredThreads.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.034 0-3.9.785-5.291 2.291M12 9a7.96 7.96 0 00-5.657 2.343" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              該当するスレッドが見つかりません
            </h3>
            <p className="text-gray-600">
              検索条件を変更するか、新しいスレッドを作成してください。
            </p>
          </div>
        )}
      </div>
    </main>
  )
}