'use client'

import Link from 'next/link'
import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { AnimatedButton } from '@/components/ui/MicroInteractions'
import { AcademicInfoSelector, AcademicInfo } from '@/components/ui/AcademicInfoSelector'
import { VirtualizedAutocompleteSelect } from '@/components/ui/VirtualizedAutocompleteSelect'

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

// Future interfaces for new sections
/*
interface Course {
  id: string
  name: string
  professor: string
  university: string
  faculty: string
  department: string
  credits: number
  difficulty: number // 1-5
  workload: number // 1-5
  overall: number // 1-5
  reviewCount: number
  isEasy: boolean
  tags: string[]
  description?: string
}

interface PastExam {
  id: string
  courseName: string
  professor: string
  year: number
  semester: 'spring' | 'fall' | 'summer'
  examType: 'midterm' | 'final' | 'quiz' | 'assignment'
  university: string
  faculty: string
  department: string
  uploadedBy: string
  uploadedAt: string
  downloadCount: number
  difficulty: number
  helpful: number
  tags: string[]
}

interface LivePost {
  id: string
  content: string
  author: string
  university: string
  faculty: string
  department: string
  course?: string
  urgency: 'low' | 'medium' | 'high'
  type: 'test_info' | 'attendance' | 'homework' | 'general'
  createdAt: string
  likes: number
  replies: number
  isAnonymous: boolean
}
*/

type MainSection = 'specialized' | 'general'
type UniversityStep = 'university' | 'faculty' | 'department' | 'year' | 'penname'

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

// Mock data for future implementation
// const mockCourses: Course[] = []
// const mockPastExams: PastExam[] = []
// const mockLivePosts: LivePost[] = []

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
  { name: '統計学', count: 76, category: '統計' }
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
  const [activeSection, setActiveSection] = useState<MainSection>('specialized')
  const [query, setQuery] = useState('')
  const [selectedTab, setSelectedTab] = useState<'all' | 'threads' | 'users' | 'courses'>('all')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)
  const [showUniversityModal, setShowUniversityModal] = useState(false)
  const [currentUniversityStep, setCurrentUniversityStep] = useState<UniversityStep>('university')
  const [academicInfo, setAcademicInfo] = useState<AcademicInfo>({
    university: '',
    faculty: '',
    department: ''
  })
  const [year, setYear] = useState('')
  const [penName, setPenName] = useState('')
  const [isCompletingSetup, setIsCompletingSetup] = useState(false)

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      setQuery(q)
      handleSearch(q)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  useEffect(() => {
    // Load user information from localStorage
    const savedUserInfo = localStorage.getItem('kakomonn_user')
    const guestUniversityInfo = localStorage.getItem('kakomonn_guest_university')
    
    if (savedUserInfo) {
      try {
        const parsed = JSON.parse(savedUserInfo)
        setUserInfo(parsed)
      } catch (error) {
        console.error('Failed to parse user info:', error)
        setShowUniversityModal(true)
      }
    } else if (guestUniversityInfo) {
      try {
        const parsed = JSON.parse(guestUniversityInfo)
        setUserInfo({
          ...parsed,
          penName: 'ゲストユーザー',
          isLoggedIn: false,
          completedAt: new Date().toISOString()
        })
      } catch (error) {
        console.error('Failed to parse guest university info:', error)
        setShowUniversityModal(true)
      }
    } else {
      // No user info found, show university selection modal
      setShowUniversityModal(true)
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

  const handleAcademicInfoChange = (newInfo: AcademicInfo) => {
    setAcademicInfo(newInfo)
  }

  const handleUniversityNext = () => {
    switch (currentUniversityStep) {
      case 'university':
        if (academicInfo.university) setCurrentUniversityStep('faculty')
        break
      case 'faculty':
        if (academicInfo.faculty) setCurrentUniversityStep('department')
        break
      case 'department':
        if (academicInfo.department) setCurrentUniversityStep('year')
        break
      case 'year':
        setCurrentUniversityStep('penname')
        break
      case 'penname':
        handleUniversityComplete()
        break
    }
  }

  const handleUniversityBack = () => {
    switch (currentUniversityStep) {
      case 'faculty':
        setCurrentUniversityStep('university')
        break
      case 'department':
        setCurrentUniversityStep('faculty')
        break
      case 'year':
        setCurrentUniversityStep('department')
        break
      case 'penname':
        setCurrentUniversityStep('year')
        break
    }
  }

  const handleUniversityComplete = async () => {
    setIsCompletingSetup(true)

    const tempUniversityInfo = {
      university: academicInfo.university,
      faculty: academicInfo.faculty,
      department: academicInfo.department,
      year: year
    }

    const guestUserInfo = {
      ...academicInfo,
      year: year || '未設定',
      penName: penName || 'ゲストユーザー',
      isLoggedIn: false,
      completedAt: new Date().toISOString()
    }

    localStorage.setItem('kakomonn_guest_university', JSON.stringify(tempUniversityInfo))
    
    setTimeout(() => {
      setUserInfo(guestUserInfo)
      setShowUniversityModal(false)
      setIsCompletingSetup(false)
    }, 1500)
  }

  const canProceedUniversity = () => {
    switch (currentUniversityStep) {
      case 'university':
        return !!academicInfo.university
      case 'faculty':
        return !!academicInfo.faculty
      case 'department':
        return !!academicInfo.department
      case 'year':
        return !!year
      case 'penname':
        return true // ペンネームは任意
      default:
        return false
    }
  }

  const getUniversityStepNumber = () => {
    const stepMap: Record<UniversityStep, number> = {
      university: 1,
      faculty: 2,
      department: 3,
      year: 4,
      penname: 5
    }
    return stepMap[currentUniversityStep]
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

  const getUniversitySpecificSubjects = () => {
    const universitySubjects = {
      '東京大学': {
        specialized: [
          { subject: '線形代数学', icon: '📐', count: '68' },
          { subject: '解析学', icon: '📊', count: '45' },
          { subject: '物理学', icon: '🔬', count: '52' },
          { subject: '化学', icon: '🧪', count: '38' },
          { subject: '生物学', icon: '🧬', count: '29' },
          { subject: '経済原論', icon: '💹', count: '34' },
          { subject: '憲法', icon: '⚖️', count: '41' },
          { subject: '哲学', icon: '🤔', count: '25' }
        ]
      },
      '早稲田大学': {
        specialized: [
          { subject: 'マクロ経済学', icon: '📈', count: '55' },
          { subject: 'ミクロ経済学', icon: '📉', count: '48' },
          { subject: '商学概論', icon: '💼', count: '42' },
          { subject: '経営学原理', icon: '📋', count: '39' },
          { subject: '統計学', icon: '📊', count: '33' },
          { subject: '国際関係論', icon: '🌍', count: '28' },
          { subject: '社会学', icon: '👥', count: '24' },
          { subject: '心理学', icon: '🧠', count: '31' }
        ]
      },
      '東京工業大学': {
        specialized: [
          { subject: '線形代数', icon: '🔢', count: '72' },
          { subject: '微積分学', icon: '📐', count: '65' },
          { subject: 'プログラミング', icon: '💻', count: '58' },
          { subject: 'データ構造', icon: '🗂️', count: '44' },
          { subject: '物理学実験', icon: '⚗️', count: '37' },
          { subject: '化学実験', icon: '🧪', count: '32' },
          { subject: '機械工学', icon: '⚙️', count: '29' },
          { subject: '電子工学', icon: '🔌', count: '26' }
        ]
      }
    }

    return universitySubjects[userInfo?.university] || {
      specialized: [
        { subject: '線形代数', icon: '📊', count: '45' },
        { subject: 'マクロ経済学', icon: '💹', count: '32' },
        { subject: '有機化学', icon: '🧪', count: '28' },
        { subject: 'データ構造', icon: '💻', count: '38' },
        { subject: '統計学', icon: '📈', count: '24' },
        { subject: '国際関係論', icon: '🌍', count: '19' },
        { subject: '機械学習', icon: '🤖', count: '41' },
        { subject: '会計学', icon: '📊', count: '26' }
      ]
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* University Selection Modal */}
      {showUniversityModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            {/* ヘッダー */}
            <div className="text-center mb-6">
              <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                KakoMoNN
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                大学情報を入力
              </h1>
              <p className="text-gray-600 text-sm">
                あなたに最適化された情報を表示するために入力してください
              </p>
            </div>

            {/* メインコンテンツ */}
            <div className="space-y-6">
              {currentUniversityStep === 'year' ? (
                <div className="space-y-4">
                  {/* ステップインジケーター */}
                  <div className="flex justify-center mb-4">
                    <div className="flex space-x-2">
                      {Array.from({ length: 5 }, (_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            i + 1 <= getUniversityStepNumber() ? 'bg-indigo-600' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="text-center">
                    {academicInfo.university && academicInfo.faculty && academicInfo.department && (
                      <span className="text-sm text-indigo-600 font-medium">
                        {academicInfo.university} • {academicInfo.faculty} • {academicInfo.department}
                      </span>
                    )}
                    <h2 className="text-lg font-bold text-gray-900 mb-2">学年を選択してください</h2>
                    <p className="text-gray-600 text-sm">現在の学年を教えてください</p>
                  </div>

                  <VirtualizedAutocompleteSelect
                    options={[
                      { value: '1年生', label: '1年生' },
                      { value: '2年生', label: '2年生' },
                      { value: '3年生', label: '3年生' },
                      { value: '4年生', label: '4年生' },
                      { value: '大学院生', label: '大学院生' },
                      { value: 'その他', label: 'その他' }
                    ]}
                    value={year}
                    onChange={setYear}
                    placeholder="学年を選択してください"
                  />
                </div>
              ) : currentUniversityStep === 'penname' ? (
                <div className="space-y-4">
                  {/* ステップインジケーター */}
                  <div className="flex justify-center mb-4">
                    <div className="flex space-x-2">
                      {Array.from({ length: 5 }, (_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            i + 1 <= getUniversityStepNumber() ? 'bg-indigo-600' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="text-center">
                    <h2 className="text-lg font-bold text-gray-900 mb-2">ペンネームを設定（任意）</h2>
                    <p className="text-gray-600 text-sm">投稿時に表示される名前です。後から変更できます</p>
                  </div>

                  <div>
                    <label htmlFor="penname" className="block text-sm font-medium text-gray-700 mb-2">
                      ペンネーム（任意）
                    </label>
                    <input
                      id="penname"
                      type="text"
                      value={penName}
                      onChange={(e) => setPenName(e.target.value)}
                      placeholder="例: 工学太郎、理系さん"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      maxLength={20}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      {penName ? `${penName.length}/20文字` : '空欄の場合は「ゲストユーザー」として表示されます'}
                    </p>
                  </div>

                  {/* プレビュー */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">プロフィールプレビュー</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><strong>表示名:</strong> {penName || 'ゲストユーザー'}</p>
                      <p><strong>所属:</strong> {academicInfo.university} {academicInfo.faculty} {academicInfo.department}</p>
                      <p><strong>学年:</strong> {year}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <AcademicInfoSelector
                  value={academicInfo}
                  onChange={handleAcademicInfoChange}
                  currentStep={currentUniversityStep as 'university' | 'faculty' | 'department'}
                  showSteps={true}
                />
              )}

              {/* ナビゲーションボタン */}
              <div className="flex gap-3">
                {currentUniversityStep !== 'university' && (
                  <AnimatedButton
                    variant="secondary"
                    size="lg"
                    onClick={handleUniversityBack}
                    className="flex-1"
                    aria-label="前の手順に戻る"
                  >
                    戻る
                  </AnimatedButton>
                )}
                
                <AnimatedButton
                  variant="primary"
                  size="lg"
                  onClick={handleUniversityNext}
                  disabled={!canProceedUniversity() || isCompletingSetup}
                  className={currentUniversityStep === 'university' ? 'w-full' : 'flex-1'}
                  aria-label={currentUniversityStep === 'penname' ? '完了' : '次の手順に進む'}
                >
                  {isCompletingSetup ? '完了中...' : currentUniversityStep === 'penname' ? '完了' : '次へ'}
                </AnimatedButton>
              </div>

              {/* 進捗情報 */}
              <div className="text-center text-sm text-gray-500">
                {getUniversityStepNumber()}/5 完了 
                {currentUniversityStep === 'penname' && (
                  <span className="text-indigo-600 ml-2">もう少しです！</span>
                )}
              </div>
            </div>

            {/* デモ情報 */}
            <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-700">
                この情報は過去問の最適化のみに使用され、いつでも変更可能です
              </p>
            </div>
          </div>
        </div>
      )}
      
      
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
                  👤 {userInfo.penName || 'ゲストユーザー'} ({userInfo.university})
                </div>
              </Link>
            )}
            <div className="text-sm text-gray-500">
              {query && `"${query}" の検索結果 - ${activeSection === 'specialized' ? '学部専門科目' : '全学共通科目'}`}
            </div>
          </div>
        </div>

        {/* Main Value Proposition */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-6 px-8 rounded-2xl shadow-lg mb-6">
            <h2 className="text-2xl font-bold mb-2">📝 過去問データベース</h2>
            <p className="text-lg opacity-90">あなたの学部に合わせた過去問を簡単検索</p>
          </div>
          
          {userInfo && (
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6 max-w-2xl mx-auto">
              <div className="flex items-center justify-center space-x-2">
                <span className="text-indigo-600">🏫</span>
                <span className="text-indigo-800 font-medium">{userInfo.university} {userInfo.faculty}</span>
                <span className="text-indigo-600">の情報を優先表示中</span>
              </div>
            </div>
          )}
          
          <div className="flex justify-center mb-6">
            <div className="flex bg-white rounded-xl shadow-sm border border-gray-200 p-1 max-w-2xl">
              {[
                { key: 'specialized', label: '🎓 学部専門科目', desc: 'メジャーの専門科目' },
                { key: 'general', label: '🌍 全学共通科目', desc: '教養・言語科目' }
              ].map(section => (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key as MainSection)}
                  className={`flex-1 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeSection === section.key
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-base mb-1">{section.label}</div>
                    <div className="text-xs opacity-80">{section.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>


        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(query)}
                placeholder={
                  activeSection === 'specialized' 
                    ? `${userInfo?.faculty || '学部'}の専門科目を検索... (例: 線形代数、マクロ経済学)` 
                    : "全学共通科目を検索... (例: 英語コミュニケーション、体育実技)"
                }
                className="w-full px-4 py-4 pl-12 text-lg border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            
            {/* Sample searches based on active section */}
            <div className="mt-3">
              <div className="text-sm text-gray-500 mb-2">
                {activeSection === 'specialized' ? `${userInfo?.faculty || '学部'}の人気科目:` : '人気の全学共通科目:'}
              </div>
              <div className="flex flex-wrap gap-2 justify-center">
                {activeSection === 'specialized' ? [
                  '線形代数', 'マクロ経済学', '有機化学', 'データ構造', '統計学', '国際関係論'
                ].map(term => (
                  <button
                    key={term}
                    onClick={() => {
                      setQuery(term)
                      handleSearch(term)
                    }}
                    className="px-3 py-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-full text-sm transition-colors font-medium"
                  >
                    {term}
                  </button>
                )) : [
                  '英語コミュニケーション', '体育実技', '数学基礎', '物理学実験', '情報リテラシー', '哲学概論'
                ].map(term => (
                  <button
                    key={term}
                    onClick={() => {
                      setQuery(term)
                      handleSearch(term)
                    }}
                    className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded-full text-sm transition-colors font-medium"
                  >
                    {term}
                  </button>
                ))}
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
            {/* Search Results */}
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

            {/* Faculty Specialized Section */}
            {activeSection === 'specialized' && !query && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
                  <div className="text-center">
                    <div className="text-indigo-600 text-5xl mb-4">🎓</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">学部専門科目</h2>
                    <p className="text-gray-600 mb-6">
                      {userInfo ? `${userInfo.faculty} ${userInfo.department}` : 'あなたの学部'}の専門科目の過去問を検索
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                      {getUniversitySpecificSubjects().specialized.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setQuery(item.subject)
                            handleSearch(item.subject)
                          }}
                          className="bg-white p-4 rounded-lg border border-gray-200 hover:border-indigo-300 hover:shadow-md transition-all group"
                        >
                          <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</div>
                          <div className="text-sm font-medium text-gray-900 mb-1">{item.subject}</div>
                          <div className="text-xs text-gray-500">{item.count}件の過去問</div>
                        </button>
                      ))}
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      お探しの科目が見つからない場合は、上の検索ボックスで直接検索してください
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* General Education Section */}
            {activeSection === 'general' && !query && (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
                  <div className="text-center">
                    <div className="text-green-600 text-5xl mb-4">🌍</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">全学共通科目</h2>
                    <p className="text-gray-600 mb-6">
                      教養科目・言語科目・基礎科目の過去問を検索
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-white p-6 rounded-xl border border-gray-200">
                        <div className="text-blue-600 text-3xl mb-3">💬</div>
                        <h3 className="font-bold text-gray-900 mb-3">言語科目</h3>
                        <div className="space-y-2">
                          {[
                            '英語コミュニケーション',
                            '中国語',
                            'ドイツ語',
                            'フランス語'
                          ].map(subject => (
                            <button
                              key={subject}
                              onClick={() => {
                                setQuery(subject)
                                handleSearch(subject)
                              }}
                              className="w-full text-sm py-2 px-3 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
                            >
                              {subject}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-white p-6 rounded-xl border border-gray-200">
                        <div className="text-purple-600 text-3xl mb-3">🧠</div>
                        <h3 className="font-bold text-gray-900 mb-3">教養科目</h3>
                        <div className="space-y-2">
                          {[
                            '哲学概論',
                            '心理学入門',
                            '文学史',
                            '社会学概論'
                          ].map(subject => (
                            <button
                              key={subject}
                              onClick={() => {
                                setQuery(subject)
                                handleSearch(subject)
                              }}
                              className="w-full text-sm py-2 px-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors"
                            >
                              {subject}
                            </button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="bg-white p-6 rounded-xl border border-gray-200">
                        <div className="text-orange-600 text-3xl mb-3">🏃</div>
                        <h3 className="font-bold text-gray-900 mb-3">基礎・実技科目</h3>
                        <div className="space-y-2">
                          {[
                            '体育実技',
                            '情報リテラシー',
                            '数学基礎',
                            '物理学実験'
                          ].map(subject => (
                            <button
                              key={subject}
                              onClick={() => {
                                setQuery(subject)
                                handleSearch(subject)
                              }}
                              className="w-full text-sm py-2 px-3 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg transition-colors"
                            >
                              {subject}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      お探しの科目が見つからない場合は、上の検索ボックスで直接検索してください
                    </div>
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