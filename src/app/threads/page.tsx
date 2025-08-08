'use client'

import Link from 'next/link'
import { useState, useMemo } from 'react'
import { universityDataDetailed } from '@/data/universityDataDetailed'

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
  deviationValue?: number
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
  },
  {
    id: '5',
    title: '国際経営論 期末試験の出題範囲について',
    content: '国際経営論の期末試験、教科書の何章まで出るんでしょうか？過去問見る限りケーススタディが重要そうですが...',
    author: '商学3年',
    course: '国際経営論',
    university: '慶應義塾大学',
    faculty: '商学部',
    createdAt: '2024-01-11',
    commentCount: 9,
    examYear: 2024
  },
  {
    id: '6',
    title: '線形代数 固有値の求め方教えて',
    content: '線形代数の固有値・固有ベクトルの計算で詰まってます。特に3×3行列の場合の効率的な解法があれば...',
    author: '理工2年',
    course: '線形代数II',
    university: '早稲田大学',
    faculty: '理工学部',
    createdAt: '2024-01-10',
    commentCount: 7
  },
  {
    id: '7',
    title: '社会政策論 レポート課題のテーマ相談',
    content: '社会政策論のレポート、「現代日本の社会保障制度」について書こうと思うのですが、どの角度から切り込むべき？',
    author: '社会1年',
    course: '社会政策論',
    university: '一橋大学',
    faculty: '社会学部',
    createdAt: '2024-01-09',
    commentCount: 11
  },
  {
    id: '8',
    title: '細胞生物学 顕微鏡観察のコツ',
    content: '細胞生物学の実習で顕微鏡観察がうまくいかない...細胞分裂の各段階を見分けるポイントを教えてください！',
    author: '医学1年',
    course: '細胞生物学実習',
    university: '大阪大学',
    faculty: '医学部',
    createdAt: '2024-01-08',
    commentCount: 5
  },
  {
    id: '9',
    title: '刑法総論 構成要件該当性の判断',
    content: '刑法総論で構成要件該当性の判断に苦戦中。具体的な事例問題での当てはめ方のコツがあれば教えてください。',
    author: '法学2年',
    course: '刑法総論',
    university: '名古屋大学',
    faculty: '法学部',
    createdAt: '2024-01-07',
    commentCount: 13
  },
  {
    id: '10',
    title: '電磁気学 マクスウェル方程式の理解',
    content: 'マクスウェル方程式の物理的意味がいまいち掴めない...数式は覚えたけど、現象との対応が難しいです。',
    author: '物理3年',
    course: '電磁気学II',
    university: '東北大学',
    faculty: '理学部',
    createdAt: '2024-01-06',
    commentCount: 8,
    examYear: 2023
  }
]

export default function ThreadsPage() {
  const [selectedUniversity, setSelectedUniversity] = useState('')
  const [selectedFaculty, setSelectedFaculty] = useState('')
  // const [selectedDepartment, setSelectedDepartment] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTab, setSelectedTab] = useState<'for-you' | 'following' | 'trending'>('for-you')
  const [showFilters, setShowFilters] = useState(false)

  // 大学選択に基づいて利用可能な学部を取得
  const availableFaculties = useMemo(() => {
    if (!selectedUniversity) return []
    const university = universityDataDetailed.find(u => u.name === selectedUniversity)
    return university?.faculties || []
  }, [selectedUniversity])

  // 学部選択に基づいて利用可能な学科を取得
  // const availableDepartments = useMemo(() => {
  //   if (!selectedUniversity || !selectedFaculty) return []
  //   const university = universityDataDetailed.find(u => u.name === selectedUniversity)
  //   if (!university) return []
  //   const faculty = university.faculties.find(f => f.name === selectedFaculty)
  //   return faculty?.departments || []
  // }, [selectedUniversity, selectedFaculty])

  const filteredThreads = mockThreads.filter(thread => {
    const matchesUniversity = !selectedUniversity || thread.university === selectedUniversity
    const matchesFaculty = !selectedFaculty || thread.faculty === selectedFaculty
    const matchesSearch = !searchQuery || 
      thread.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
      thread.faculty.toLowerCase().includes(searchQuery.toLowerCase())
    
    return matchesUniversity && matchesFaculty && matchesSearch
  })

  // 全ての大学リスト（universityDataDetailedから取得）
  const universities = universityDataDetailed.map(u => u.name)
  // モックデータから現在利用可能な学部（後でDBから取得する想定）
  const allFaculties = [...new Set(mockThreads.map(t => t.faculty))]

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Twitter-style header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center h-14">
            <Link href="/" className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors mr-8">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">ホーム</h1>
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-2xl mx-auto">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setSelectedTab('for-you')}
              className={`flex-1 text-center py-4 text-sm font-medium transition-colors relative ${
                selectedTab === 'for-you' 
                  ? 'text-gray-900' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              おすすめ
              {selectedTab === 'for-you' && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-indigo-500 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setSelectedTab('following')}
              className={`flex-1 text-center py-4 text-sm font-medium transition-colors relative ${
                selectedTab === 'following' 
                  ? 'text-gray-900' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              フォロー中
              {selectedTab === 'following' && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-indigo-500 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setSelectedTab('trending')}
              className={`flex-1 text-center py-4 text-sm font-medium transition-colors relative ${
                selectedTab === 'trending' 
                  ? 'text-gray-900' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              トレンド
              {selectedTab === 'trending' && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-indigo-500 rounded-full" />
              )}
            </button>
          </div>
        </div>

        {/* Filter panel */}
        {showFilters && (
          <div className="max-w-2xl mx-auto px-4 py-4 border-b border-gray-200 bg-white">
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="授業名、大学名で検索..."
                  className="w-full p-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={selectedUniversity}
                  onChange={(e) => {
                    setSelectedUniversity(e.target.value)
                    setSelectedFaculty('')
                  }}
                  className="p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                >
                  <option value="">すべての大学</option>
                  {universities.map(uni => (
                    <option key={uni} value={uni}>{uni}</option>
                  ))}
                </select>
                
                <select
                  value={selectedFaculty}
                  onChange={(e) => setSelectedFaculty(e.target.value)}
                  disabled={!selectedUniversity}
                  className="p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm disabled:opacity-50"
                >
                  <option value="">すべての学部</option>
                  {selectedUniversity && availableFaculties.length > 0 ? (
                    availableFaculties.map(faculty => (
                      <option key={faculty.id} value={faculty.name}>{faculty.name}</option>
                    ))
                  ) : selectedUniversity ? (
                    allFaculties.filter(fac => 
                      mockThreads.some(thread => thread.university === selectedUniversity && thread.faculty === fac)
                    ).map(fac => (
                      <option key={fac} value={fac}>{fac}</option>
                    ))
                  ) : null}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Tweet compose area */}
        <div className="bg-white border-b border-gray-200">
          <div className="p-4">
            <div className="flex space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">匿</span>
              </div>
              <div className="flex-1">
                <Link href="/upload">
                  <div className="w-full p-4 text-xl text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                    今何を勉強していますか？
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div>
          {filteredThreads.map((thread) => (
            <div key={thread.id} className="bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors">
              <Link href={`/threads/${thread.id}`}>
                <div className="p-4 cursor-pointer">
                  <div className="flex space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {thread.author.charAt(0)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-gray-900">{thread.author}</span>
                        <span className="text-gray-500">·</span>
                        <span className="text-gray-500 text-sm">{thread.createdAt}</span>
                      </div>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mt-1 mb-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                          {thread.university}
                        </span>
                        <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-full text-xs">
                          {thread.faculty}
                        </span>
                        <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-xs">
                          {thread.course}
                        </span>
                        {thread.examYear && (
                          <span className="bg-orange-100 text-orange-800 px-2 py-0.5 rounded-full text-xs">
                            {thread.examYear}年度
                          </span>
                        )}
                      </div>
                      
                      <h3 className="font-bold text-gray-900 mb-2">
                        {thread.title}
                      </h3>
                      
                      <div className="text-gray-700 mb-3 whitespace-pre-line">
                        {thread.content.length > 150 
                          ? `${thread.content.substring(0, 150)}...` 
                          : thread.content
                        }
                      </div>
                      
                      {/* Engagement actions */}
                      <div className="flex items-center justify-between max-w-md mt-3">
                        <button 
                          onClick={(e) => e.preventDefault()}
                          className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors group"
                        >
                          <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </div>
                          <span className="text-sm">{thread.commentCount}</span>
                        </button>
                        
                        <button 
                          onClick={(e) => e.preventDefault()}
                          className="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition-colors group"
                        >
                          <div className="p-2 rounded-full group-hover:bg-green-50 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                          </div>
                          <span className="text-sm">23</span>
                        </button>
                        
                        <button 
                          onClick={(e) => e.preventDefault()}
                          className="flex items-center space-x-2 text-gray-500 hover:text-red-600 transition-colors group"
                        >
                          <div className="p-2 rounded-full group-hover:bg-red-50 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </div>
                          <span className="text-sm">89</span>
                        </button>
                        
                        <button 
                          onClick={(e) => e.preventDefault()}
                          className="flex items-center space-x-2 text-gray-500 hover:text-indigo-600 transition-colors group"
                        >
                          <div className="p-2 rounded-full group-hover:bg-indigo-50 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                          </div>
                        </button>
                        
                        <button 
                          onClick={(e) => e.preventDefault()}
                          className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors group"
                        >
                          <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                            </svg>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredThreads.length === 0 && (
          <div className="bg-white text-center py-16">
            <div className="max-w-sm mx-auto px-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                該当するスレッドがありません
              </h3>
              <p className="text-gray-600 mb-6">
                検索条件を変更するか、新しいスレッドを作成してみませんか？
              </p>
              <Link 
                href="/upload"
                className="inline-flex items-center bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700 transition-colors"
              >
                投稿する
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Floating action button */}
      <Link 
        href="/upload"
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors z-40"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </Link>
    </main>
  )
}