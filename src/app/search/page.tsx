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
type SpecializedStep = 'category' | 'subject'
type SpecializedCategory = 'department' | 'other'
type GeneralStep = 'genre' | 'subject'
type GeneralGenre = 'language' | 'liberal' | 'other'

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
  const [activeSection, setActiveSection] = useState<MainSection | null>(null)
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
  
  // New state for step-by-step flow
  const [specializedStep, setSpecializedStep] = useState<SpecializedStep>('category')
  const [specializedCategory, setSpecializedCategory] = useState<SpecializedCategory | null>(null)
  const [generalStep, setGeneralStep] = useState<GeneralStep>('genre')
  const [generalGenre, setGeneralGenre] = useState<GeneralGenre | null>(null)
  const [subjectSearchQuery, setSubjectSearchQuery] = useState('')

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

  const getSubjectsByCategory = () => {
    const subjectData = {
      specialized: {
        department: [
          { subject: '線形代数学', icon: '📐', count: '68' },
          { subject: '解析学', icon: '📊', count: '45' },
          { subject: 'マクロ経済学', icon: '📈', count: '55' },
          { subject: 'ミクロ経済学', icon: '📉', count: '48' },
          { subject: '有機化学', icon: '🧪', count: '38' },
          { subject: 'データ構造', icon: '🗂️', count: '44' },
          { subject: '物理学', icon: '🔬', count: '52' },
          { subject: '機械工学', icon: '⚙️', count: '29' },
          { subject: '経営学原理', icon: '📋', count: '39' },
          { subject: '憲法', icon: '⚖️', count: '41' },
          { subject: '統計学', icon: '📊', count: '33' },
          { subject: 'プログラミング', icon: '💻', count: '58' }
        ],
        other: [
          { subject: '生物学', icon: '🧬', count: '29' },
          { subject: '化学実験', icon: '🧪', count: '32' },
          { subject: '電子工学', icon: '🔌', count: '26' },
          { subject: '社会学', icon: '👥', count: '24' },
          { subject: '心理学', icon: '🧠', count: '31' },
          { subject: '哲学', icon: '🤔', count: '25' },
          { subject: '機械学習', icon: '🤖', count: '41' },
          { subject: '国際関係論', icon: '🌍', count: '28' }
        ]
      },
      general: {
        language: [
          { subject: '英語コミュニケーション', icon: '🇺🇸', count: '89' },
          { subject: '中国語', icon: '🇨🇳', count: '45' },
          { subject: 'ドイツ語', icon: '🇩🇪', count: '32' },
          { subject: 'フランス語', icon: '🇫🇷', count: '28' },
          { subject: 'スペイン語', icon: '🇪🇸', count: '22' },
          { subject: '日本語(留学生向け)', icon: '🇯🇵', count: '18' },
          { subject: 'TOEFL対策', icon: '📝', count: '34' },
          { subject: '英語読解', icon: '📚', count: '56' }
        ],
        liberal: [
          { subject: '哲学概論', icon: '🤔', count: '42' },
          { subject: '心理学入門', icon: '🧠', count: '67' },
          { subject: '文学史', icon: '📖', count: '38' },
          { subject: '社会学概論', icon: '👥', count: '51' },
          { subject: '日本史', icon: '🏛️', count: '45' },
          { subject: '世界史', icon: '🌍', count: '39' },
          { subject: '政治学', icon: '🏛️', count: '33' },
          { subject: '経済学入門', icon: '💰', count: '48' }
        ],
        other: [
          { subject: '体育実技', icon: '🏃', count: '76' },
          { subject: '情報リテラシー', icon: '💻', count: '84' },
          { subject: '数学基礎', icon: '🔢', count: '63' },
          { subject: '物理学実験', icon: '⚗️', count: '41' },
          { subject: '生物学実験', icon: '🧬', count: '29' },
          { subject: '化学実験', icon: '🧪', count: '35' },
          { subject: '地学', icon: '🌍', count: '22' },
          { subject: '環境科学', icon: '🌱', count: '27' }
        ]
      }
    }
    return subjectData
  }

  const resetFlow = () => {
    setActiveSection(null)
    setSpecializedStep('category')
    setSpecializedCategory(null)
    setGeneralStep('genre')
    setGeneralGenre(null)
    setSubjectSearchQuery('')
  }

  const handleSectionSelect = (section: MainSection) => {
    setActiveSection(section)
    if (section === 'specialized') {
      setSpecializedStep('category')
      setSpecializedCategory(null)
    } else {
      setGeneralStep('genre')
      setGeneralGenre(null)
    }
  }

  const handleSpecializedCategorySelect = (category: SpecializedCategory) => {
    setSpecializedCategory(category)
    setSpecializedStep('subject')
  }

  const handleGeneralGenreSelect = (genre: GeneralGenre) => {
    setGeneralGenre(genre)
    setGeneralStep('subject')
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
              {query ? (
                `"${query}" の検索結果${activeSection ? ` - ${activeSection === 'specialized' ? '学部専門科目' : '全学共通科目'}` : ''}`
              ) : activeSection ? (
                activeSection === 'specialized' 
                  ? `学部専門科目${specializedCategory ? ` > ${specializedCategory === 'department' ? '学科専門' : 'その他'}` : ''}`
                  : `全学共通科目${generalGenre ? ` > ${generalGenre === 'language' ? '言語科目' : generalGenre === 'liberal' ? '教養科目' : 'その他'}` : ''}`
              ) : (
                'カテゴリを選択してください'
              )}
            </div>
          </div>
        </div>

        {/* Main Selection Interface - Fullscreen */}
        <div className="min-h-[calc(100vh-120px)] flex flex-col justify-center">
          <div className="text-center mb-8 sm:mb-12">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 sm:py-6 px-6 sm:px-8 rounded-2xl shadow-lg mb-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-2">📝 過去問データベース</h2>
              <p className="text-sm sm:text-lg opacity-90">あなたの学部に合わせた過去問を簡単検索</p>
            </div>
            
            {userInfo && (
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3 sm:p-4 mb-6 max-w-2xl mx-auto">
                <div className="flex items-center justify-center space-x-2 text-sm sm:text-base">
                  <span className="text-indigo-600">🏫</span>
                  <span className="text-indigo-800 font-medium">{userInfo.university} {userInfo.faculty}</span>
                  <span className="text-indigo-600 hidden sm:inline">の情報を優先表示中</span>
                </div>
              </div>
            )}
          </div>
          
          {/* Step-by-step Flow - Centered and Fullscreen */}
          <div className="flex-1 flex items-center justify-center px-4 sm:px-6">
            <div className="max-w-4xl w-full">
              {/* Step 1: Main Section Selection */}
              {!activeSection && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 text-center">まず、カテゴリを選択してください</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <button
                      onClick={() => handleSectionSelect('specialized')}
                      className="group p-6 sm:p-8 bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl hover:from-indigo-100 hover:to-purple-100 hover:shadow-md transition-all duration-200"
                    >
                      <div className="text-center">
                        <div className="text-4xl sm:text-5xl mb-4 group-hover:scale-110 transition-transform">🎓</div>
                        <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">学部専門科目</h4>
                        <p className="text-sm sm:text-base text-gray-600">メジャーの専門的な科目</p>
                        <p className="text-xs sm:text-sm text-indigo-600 mt-2 font-medium">学科専門 / その他</p>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => handleSectionSelect('general')}
                      className="group p-6 sm:p-8 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl hover:from-green-100 hover:to-emerald-100 hover:shadow-md transition-all duration-200"
                    >
                      <div className="text-center">
                        <div className="text-4xl sm:text-5xl mb-4 group-hover:scale-110 transition-transform">🌍</div>
                        <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">全学共通科目</h4>
                        <p className="text-sm sm:text-base text-gray-600">教養・言語・基礎科目</p>
                        <p className="text-xs sm:text-sm text-green-600 mt-2 font-medium">言語 / 教養 / その他</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Specialized Category Selection */}
              {activeSection === 'specialized' && specializedStep === 'category' && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-sm text-indigo-600 font-medium">学部専門科目</span>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">専門分野を選択してください</h3>
                    </div>
                    <button
                      onClick={resetFlow}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                    >
                      <span className="hidden sm:inline">← 戻る</span>
                      <span className="sm:hidden">←</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <button
                      onClick={() => handleSpecializedCategorySelect('department')}
                      className="group p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-indigo-100 hover:shadow-md transition-all duration-200"
                    >
                      <div className="text-center">
                        <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform">🏛️</div>
                        <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">学科専門</h4>
                        <p className="text-sm sm:text-base text-gray-600">学科に直接関連する専門科目</p>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => handleSpecializedCategorySelect('other')}
                      className="group p-6 sm:p-8 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl hover:from-purple-100 hover:to-pink-100 hover:shadow-md transition-all duration-200"
                    >
                      <div className="text-center">
                        <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform">📚</div>
                        <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">その他</h4>
                        <p className="text-sm sm:text-base text-gray-600">関連する専門分野の科目</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: General Genre Selection */}
              {activeSection === 'general' && generalStep === 'genre' && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-sm text-green-600 font-medium">全学共通科目</span>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">ジャンルを選択してください</h3>
                    </div>
                    <button
                      onClick={resetFlow}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                    >
                      <span className="hidden sm:inline">← 戻る</span>
                      <span className="sm:hidden">←</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <button
                      onClick={() => handleGeneralGenreSelect('language')}
                      className="group p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-cyan-100 hover:shadow-md transition-all duration-200"
                    >
                      <div className="text-center">
                        <div className="text-3xl sm:text-4xl mb-3 group-hover:scale-110 transition-transform">💬</div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">言語科目</h4>
                        <p className="text-sm text-gray-600">外国語・コミュニケーション</p>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => handleGeneralGenreSelect('liberal')}
                      className="group p-6 bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-xl hover:from-purple-100 hover:to-violet-100 hover:shadow-md transition-all duration-200"
                    >
                      <div className="text-center">
                        <div className="text-3xl sm:text-4xl mb-3 group-hover:scale-110 transition-transform">🧠</div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">教養科目</h4>
                        <p className="text-sm text-gray-600">人文・社会・自然科学</p>
                      </div>
                    </button>
                    
                    <button
                      onClick={() => handleGeneralGenreSelect('other')}
                      className="group p-6 bg-gradient-to-br from-orange-50 to-red-50 border border-orange-200 rounded-xl hover:from-orange-100 hover:to-red-100 hover:shadow-md transition-all duration-200"
                    >
                      <div className="text-center">
                        <div className="text-3xl sm:text-4xl mb-3 group-hover:scale-110 transition-transform">🏃</div>
                        <h4 className="text-lg font-bold text-gray-900 mb-2">その他</h4>
                        <p className="text-sm text-gray-600">実技・基礎・実験科目</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}
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