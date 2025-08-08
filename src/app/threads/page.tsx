'use client'

import Link from 'next/link'
import { useState, useMemo, useEffect } from 'react'
import { universityDataDetailed } from '@/data/universityDataDetailed'
import { api } from '@/services/api'
import { useAuthContext } from '@/components/providers/AuthProvider'

interface Thread {
  id: string
  title: string
  content: string
  author_id: string
  course: string
  university: string
  faculty: string
  department: string
  exam_year?: number
  created_at: string
  updated_at: string
  users?: {
    name: string
    pen_name: string
  }
}

export default function ThreadsPage() {
  const { user } = useAuthContext()
  const [selectedUniversity, setSelectedUniversity] = useState('')
  const [selectedFaculty, setSelectedFaculty] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [threads, setThreads] = useState<Thread[]>([])
  const [loading, setLoading] = useState(true)

  // スレッドデータを取得
  useEffect(() => {
    const fetchThreads = async () => {
      try {
        setLoading(true)
        const filters: any = {}
        
        if (selectedUniversity) filters.university = selectedUniversity
        if (selectedFaculty) filters.faculty = selectedFaculty
        if (searchQuery) filters.course = searchQuery

        const data = await api.threads.getAll(filters)
        setThreads(data)
      } catch (error) {
        console.error('スレッド取得エラー:', error)
        // エラー時はモックデータを表示
        setThreads([
          {
            id: '1',
            title: 'マクロ経済学 2024年期末試験について',
            content: '来週のマクロ経済学の期末試験、過去問と傾向が似てるかな？IS-LMモデルは確実に出そうだけど...',
            author_id: 'user1',
            course: 'マクロ経済学',
            university: '東京大学',
            faculty: '経済学部',
            department: '経済学科',
            created_at: '2024-01-15T00:00:00Z',
            updated_at: '2024-01-15T00:00:00Z',
            users: {
              name: '経済3年',
              pen_name: '経済3年'
            }
          }
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchThreads()
  }, [selectedUniversity, selectedFaculty, searchQuery])

  // 大学選択に基づいて利用可能な学部を取得
  const availableFaculties = useMemo(() => {
    if (!selectedUniversity) return []
    const university = universityDataDetailed.find(u => u.name === selectedUniversity)
    return university?.faculties || []
  }, [selectedUniversity])

  // 全ての大学リスト（universityDataDetailedから取得）
  const universities = universityDataDetailed.map(u => u.name)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">スレッドを読み込み中...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">スレッド一覧</h1>
              <p className="text-gray-600">大学生の質問・相談・情報交換</p>
            </div>
            
            {user && (
              <Link 
                href="/upload"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <span>新規投稿</span>
              </Link>
            )}
          </div>
        </header>

        {/* フィルター */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 大学選択 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">大学</label>
              <select
                value={selectedUniversity}
                onChange={(e) => {
                  setSelectedUniversity(e.target.value)
                  setSelectedFaculty('')
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">全ての大学</option>
                {universities.map((university) => (
                  <option key={university} value={university}>
                    {university}
                  </option>
                ))}
              </select>
            </div>

            {/* 学部選択 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">学部</label>
              <select
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={!selectedUniversity}
              >
                <option value="">全ての学部</option>
                {availableFaculties.map((faculty) => (
                  <option key={faculty.name} value={faculty.name}>
                    {faculty.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 検索 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">検索</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="科目名で検索..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* スレッド一覧 */}
        <div className="space-y-4">
          {threads.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">該当するスレッドが見つかりません</p>
              {user && (
                <Link 
                  href="/upload"
                  className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  最初の投稿を作成
                </Link>
              )}
            </div>
          ) : (
            threads.map((thread) => (
              <article key={thread.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      <Link href={`/threads/${thread.id}`} className="hover:text-indigo-600 transition-colors">
                        {thread.title}
                      </Link>
                    </h2>
                    <p className="text-gray-600 mb-3 line-clamp-2">{thread.content}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                      {thread.users?.pen_name || '匿名ユーザー'}
                    </span>
                    <span>{thread.university} {thread.faculty}</span>
                    <span>{thread.course}</span>
                    {thread.exam_year && <span>{thread.exam_year}年度</span>}
                  </div>
                  <time dateTime={thread.created_at}>{formatDate(thread.created_at)}</time>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </main>
  )
}