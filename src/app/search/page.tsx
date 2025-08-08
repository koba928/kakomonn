'use client'

import Link from 'next/link'
import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { AnimatedButton } from '@/components/ui/MicroInteractions'
import { AcademicInfoSelector, AcademicInfo } from '@/components/ui/AcademicInfoSelector'
import { VirtualizedAutocompleteSelect } from '@/components/ui/VirtualizedAutocompleteSelect'
// import { api } from '@/services/api' // 一時的にコメントアウト

// 過去問検索結果の型定義（検索機能実装時に使用）
// interface PastExam {
//   id: string
//   title: string
//   course_name: string
//   professor: string
//   university: string
//   faculty: string
//   department: string
//   year: number
//   semester: string
//   exam_type: string
//   file_url: string
//   file_name: string
//   uploaded_by: string
//   download_count: number
//   difficulty: number
//   helpful_count: number
//   tags: string[]
//   created_at: string
//   updated_at: string
// }

// 検索フィルターの型定義
interface SearchFilters {
  university?: string
  faculty?: string
  department?: string
  course?: string
  professor?: string
  year?: number
  semester?: string
  examType?: string
  tags?: string[]
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

// interface PastExam {
//   id: string
//   courseName: string
//   professor: string
//   year: number
//   semester: 'spring' | 'fall' | 'summer'
//   examType: 'midterm' | 'final' | 'quiz' | 'assignment'
//   university: string
//   faculty: string
//   department: string
//   uploadedBy: string
//   uploadedAt: string
//   downloadCount: number
//   difficulty: number
//   helpful: number
//   tags: string[]
// }

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

type MainSection = 'specialized' | 'general' | 'professor'
type UniversityStep = 'university' | 'faculty' | 'department' | 'year' | 'penname'
type SpecializedStep = 'category' | 'subject'
type SpecializedCategory = 'department' | 'other'
type GeneralStep = 'genre' | 'subject'
type GeneralGenre = 'language' | 'liberal' | 'other'
type ProfessorStep = 'search' | 'courses' | 'years'


// Mock data for future implementation
// const mockCourses: Course[] = []
// const mockPastExams: PastExam[] = []
// const mockLivePosts: LivePost[] = []


// Mock professor and course data
const mockProfessorData: Record<string, Array<{professor: string, courses: Array<{name: string, years: string[]}>, university: string, faculty: string}>> = {
  '東京大学_経済学部': [
    { professor: '田中経済', courses: [{ name: 'マクロ経済学I', years: ['2024', '2023', '2022'] }, { name: 'ミクロ経済学', years: ['2024', '2023'] }], university: '東京大学', faculty: '経済学部' },
    { professor: '佐藤統計', courses: [{ name: '計量経済学', years: ['2024', '2023', '2022', '2021'] }, { name: '統計学', years: ['2024', '2023'] }], university: '東京大学', faculty: '経済学部' },
    { professor: '山田金融', courses: [{ name: '金融論', years: ['2024', '2023'] }], university: '東京大学', faculty: '経済学部' },
  ],
  '東京大学_工学部': [
    { professor: '鈴木工学', courses: [{ name: '線形代数学', years: ['2024', '2023', '2022'] }, { name: '解析学I', years: ['2024', '2023'] }], university: '東京大学', faculty: '工学部' },
    { professor: '高橋情報', courses: [{ name: 'データ構造とアルゴリズム', years: ['2024', '2023', '2022', '2021'] }], university: '東京大学', faculty: '工学部' },
  ],
  '早稲田大学_商学部': [
    { professor: '中村商学', courses: [{ name: '商学概論', years: ['2024', '2023', '2022'] }, { name: '経営学原理', years: ['2024', '2023'] }], university: '早稲田大学', faculty: '商学部' },
    { professor: '小林マーケ', courses: [{ name: 'マーケティング論', years: ['2024', '2023', '2022'] }], university: '早稲田大学', faculty: '商学部' },
  ]
}

const getAllProfessorsForUser = (university: string, faculty: string) => {
  const key = `${university}_${faculty}`
  return mockProfessorData[key] || []
}

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
  
  // Professor search flow state
  const [professorStep, setProfessorStep] = useState<ProfessorStep>('search')
  const [professorQuery, setProfessorQuery] = useState('')
  const [selectedProfessor, setSelectedProfessor] = useState<string | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  
  // 検索機能の状態管理（一時的にコメントアウト）
  // const [searchResults, setSearchResults] = useState<PastExam[]>([])
  // const [searchFilters] = useState<SearchFilters>({})
  // const [isSearching, setIsSearching] = useState(false)

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      return
    }

    // 一時的にコンソールログのみ
    console.log('検索開始:', searchQuery)
    
    // TODO: 検索機能を実装
    // try {
    //   setIsSearching(true)
    //   const filters: SearchFilters = {
    //     ...searchFilters,
    //     course: searchQuery
    //   }
    //   const results = await api.pastExams.getAll(filters)
    //   setSearchResults(results)
    // } catch (error) {
    //   console.error('検索エラー:', error)
    //   setSearchResults([])
    // } finally {
    //   setIsSearching(false)
    // }
  }, [])

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      setQuery(q)
      handleSearch(q)
    }
  }, [searchParams, handleSearch])

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


  const resetFlow = () => {
    setActiveSection(null)
    setSpecializedStep('category')
    setSpecializedCategory(null)
    setGeneralStep('genre')
    setGeneralGenre(null)
    setProfessorStep('search')
    setProfessorQuery('')
    setSelectedProfessor(null)
    setSelectedCourse(null)
  }

  const handleSectionSelect = (section: MainSection) => {
    setActiveSection(section)
    if (section === 'specialized') {
      setSpecializedStep('category')
      setSpecializedCategory(null)
    } else if (section === 'general') {
      setGeneralStep('genre')
      setGeneralGenre(null)
    } else if (section === 'professor') {
      setProfessorStep('search')
      setProfessorQuery('')
      setSelectedProfessor(null)
      setSelectedCourse(null)
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
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6 text-center">まず、検索方法を選択してください</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
                    <button
                      onClick={() => handleSectionSelect('professor')}
                      className="group p-6 sm:p-8 bg-gradient-to-br from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl hover:from-yellow-100 hover:to-orange-100 hover:shadow-md transition-all duration-200"
                    >
                      <div className="text-center">
                        <div className="text-4xl sm:text-5xl mb-4 group-hover:scale-110 transition-transform">👨‍🏫</div>
                        <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">教授名で検索</h4>
                        <p className="text-sm sm:text-base text-gray-600">教授名から授業を特定</p>
                        <p className="text-xs sm:text-sm text-orange-600 mt-2 font-medium">おすすめ・最速</p>
                      </div>
                    </button>
                    
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

              {/* Professor Search Flow */}
              {activeSection === 'professor' && professorStep === 'search' && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-sm text-orange-600 font-medium">教授名検索</span>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">教授名を入力してください</h3>
                      {userInfo && (
                        <p className="text-sm text-gray-600 mt-1">{userInfo.university} {userInfo.faculty} の教授を検索</p>
                      )}
                    </div>
                    <button
                      onClick={resetFlow}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                    >
                      <span className="hidden sm:inline">← 戻る</span>
                      <span className="sm:hidden">←</span>
                    </button>
                  </div>
                  
                  {/* Professor Search Input */}
                  <div className="mb-6">
                    <div className="relative">
                      <input
                        type="text"
                        value={professorQuery}
                        onChange={(e) => setProfessorQuery(e.target.value)}
                        placeholder="教授名を入力... (例: 田中、佐藤)"
                        className="w-full px-4 py-4 pl-12 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Professor Results */}
                  {professorQuery && userInfo && (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {getAllProfessorsForUser(userInfo.university, userInfo.faculty)
                        .filter(prof => prof.professor.toLowerCase().includes(professorQuery.toLowerCase()))
                        .map((prof, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setSelectedProfessor(prof.professor)
                              setProfessorStep('courses')
                            }}
                            className="w-full p-4 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 hover:shadow-md transition-all text-left"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="text-2xl">👨‍🏫</div>
                              <div>
                                <h4 className="font-bold text-gray-900">{prof.professor} 教授</h4>
                                <p className="text-sm text-gray-600">
                                  {prof.courses.length}つの授業 • {prof.courses.reduce((total, course) => total + course.years.length, 0)}年分の過去問
                                </p>
                                <p className="text-xs text-orange-600 mt-1">
                                  {prof.courses.map(c => c.name).join(', ')}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      
                      {/* No results */}
                      {getAllProfessorsForUser(userInfo.university, userInfo.faculty)
                        .filter(prof => prof.professor.toLowerCase().includes(professorQuery.toLowerCase())).length === 0 && (
                        <div className="text-center py-8">
                          <p className="text-gray-500 mb-2">「{professorQuery}」に該当する教授が見つかりませんでした</p>
                          <p className="text-sm text-gray-400">別の名前で検索してみてください</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Help Text */}
                  {!professorQuery && (
                    <div className="text-center py-8">
                      <div className="text-4xl mb-4">🔍</div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">教授名を入力してください</h4>
                      <p className="text-gray-600 mb-4">姓だけでも検索できます</p>
                      {userInfo && (
                        <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
                          <p className="text-sm text-gray-700">
                            <strong>{userInfo.university} {userInfo.faculty}</strong>の教授を検索します
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Course Selection for Selected Professor */}
              {activeSection === 'professor' && professorStep === 'courses' && selectedProfessor && userInfo && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm text-orange-600 font-medium">教授名検索</span>
                        <span className="text-sm text-gray-400">&gt;</span>
                        <span className="text-sm text-blue-600 font-medium">{selectedProfessor} 教授</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">授業を選択してください</h3>
                    </div>
                    <button
                      onClick={() => setProfessorStep('search')}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                    >
                      <span className="hidden sm:inline">← 戻る</span>
                      <span className="sm:hidden">←</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {getAllProfessorsForUser(userInfo.university, userInfo.faculty)
                      .find(prof => prof.professor === selectedProfessor)
                      ?.courses.map((course, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSelectedCourse(course.name)
                            setProfessorStep('years')
                          }}
                          className="group p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-indigo-100 hover:shadow-md transition-all duration-200 text-left"
                        >
                          <div className="text-center">
                            <div className="text-3xl mb-3 group-hover:scale-110 transition-transform">📖</div>
                            <h4 className="text-lg font-bold text-gray-900 mb-2">{course.name}</h4>
                            <p className="text-sm text-gray-600">{course.years.length}年分の過去問</p>
                            <p className="text-xs text-blue-600 mt-2 font-medium">
                              {course.years.join('年, ')}年
                            </p>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              )}

              {/* Year Selection for Selected Course */}
              {activeSection === 'professor' && professorStep === 'years' && selectedProfessor && selectedCourse && userInfo && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm text-orange-600 font-medium">教授名検索</span>
                        <span className="text-sm text-gray-400">&gt;</span>
                        <span className="text-sm text-blue-600 font-medium">{selectedProfessor}</span>
                        <span className="text-sm text-gray-400">&gt;</span>
                        <span className="text-sm text-green-600 font-medium">{selectedCourse}</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">年度を選択してください</h3>
                    </div>
                    <button
                      onClick={() => setProfessorStep('courses')}
                      className="text-gray-400 hover:text-gray-600 transition-colors p-2"
                    >
                      <span className="hidden sm:inline">← 戻る</span>
                      <span className="sm:hidden">←</span>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {(() => {
                      const selectedProfData = getAllProfessorsForUser(userInfo.university, userInfo.faculty)
                        .find(prof => prof.professor === selectedProfessor)
                      const selectedCourseData = selectedProfData?.courses.find(course => course.name === selectedCourse)
                      
                      return selectedCourseData?.years.map((year, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setQuery(`${selectedCourse} ${selectedProfessor} ${year}年`)
                            handleSearch(`${selectedCourse} ${selectedProfessor} ${year}年`)
                          }}
                          className="group p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl hover:from-green-100 hover:to-emerald-100 hover:shadow-md transition-all duration-200"
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📅</div>
                            <h4 className="text-lg font-bold text-gray-900 mb-1">{year}年</h4>
                            <p className="text-xs text-green-600">過去問を見る</p>
                          </div>
                        </button>
                      )) || []
                    })()}
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