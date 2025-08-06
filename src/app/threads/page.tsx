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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 relative">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>

      <nav className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-gray-200 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center group">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-indigo-600 bg-clip-text text-transparent group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-200">
                過去問<span className="text-indigo-600">hub</span>
              </h1>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link 
                href="/upload" 
                className="group bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                勉強記録を投稿
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            {filteredThreads.length}件のスレッドが見つかりました
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-indigo-800 to-indigo-600 bg-clip-text text-transparent">
            スレッド一覧
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            大学生の勉強記録と情報交換の場です。気になるトピックをチェックして、みんなで学び合いましょう。
          </p>
        </div>

        {/* フィルター */}
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">検索・フィルター</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                大学
              </label>
              <select
                value={selectedUniversity}
                onChange={(e) => setSelectedUniversity(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white hover:border-indigo-200"
              >
                <option value="">すべての大学</option>
                {universities.map(uni => (
                  <option key={uni} value={uni}>{uni}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                学部
              </label>
              <select
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white hover:border-indigo-200"
              >
                <option value="">すべての学部</option>
                {faculties.map(fac => (
                  <option key={fac} value={fac}>{fac}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                キーワード検索
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="授業名、タイトルで検索..."
                  className="w-full p-3 pl-10 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white hover:border-indigo-200"
                />
                <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* スレッド一覧 */}
        <div className="space-y-6">
          {filteredThreads.map((thread) => (
            <Link key={thread.id} href={`/threads/${thread.id}`}>
              <div className="group bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 text-sm">
                    <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-medium">
                      {thread.university}
                    </span>
                    <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-3 py-1.5 rounded-full text-xs font-medium">
                      {thread.faculty}
                    </span>
                    <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-medium">
                      {thread.course}
                    </span>
                    {thread.examYear && (
                      <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1.5 rounded-full text-xs font-medium">
                        {thread.examYear}年度
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">
                    {thread.createdAt}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                  {thread.title}
                </h3>
                
                <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                  {thread.content}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          {thread.author.charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium">{thread.author}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-500">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span className="font-medium">{thread.commentCount}件のコメント</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button className="text-indigo-600 hover:text-indigo-800 flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="font-medium">いいね</span>
                    </button>
                    <div className="flex items-center gap-1 text-indigo-600 group-hover:translate-x-1 transition-transform">
                      <span className="font-medium">詳細を見る</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredThreads.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white/90 backdrop-blur-sm p-12 rounded-3xl shadow-lg border border-gray-100 max-w-md mx-auto">
              <div className="bg-gradient-to-br from-gray-100 to-gray-200 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.034 0-3.9.785-5.291 2.291M12 9a7.96 7.96 0 00-5.657 2.343" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                該当するスレッドが見つかりません
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                検索条件を変更するか、新しいスレッドを作成してください。
              </p>
              <Link 
                href="/upload"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                新しいスレッドを作成
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </main>
  )
}