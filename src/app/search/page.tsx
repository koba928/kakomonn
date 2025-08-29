'use client'

import Link from 'next/link'
import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { AnimatedButton } from '@/components/ui/MicroInteractions'
import { AcademicInfoSelector, AcademicInfo } from '@/components/ui/AcademicInfoSelector'
import { VirtualizedAutocompleteSelect } from '@/components/ui/VirtualizedAutocompleteSelect'
import { api } from '@/services/api'
import { useAuth } from '@/hooks/useAuth'

// 過去問検索結果の型定義
interface PastExam {
  id: string
  title: string
  course_name: string
  professor: string
  university: string
  faculty: string
  department: string
  year: number
  semester: string
  exam_type: string
  file_url: string
  file_name: string
  uploaded_by: string
  download_count: number
  difficulty: number
  helpful_count: number
  tags: string[]
  created_at: string
  updated_at: string
}

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

// interface LivePost {
//   id: string
//   content: string
//   author: string
//   university: string
//   faculty: string
//   department: string
//   course?: string
//   urgency: 'low' | 'medium' | 'high'
//   type: 'test_info' | 'attendance' | 'homework' | 'general'
//   createdAt: string
//   likes: number
//   replies: number
//   isAnonymous: boolean
// }
*/

type MainSection = 'subject' | 'professor'
type UniversityStep = 'university' | 'faculty' | 'department' | 'year' | 'penname'
type SubjectStep = 'type' | 'search'
type SubjectType = 'specialized' | 'general'
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
  const { user, isLoggedIn } = useAuth()
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
  const [isLoadingProfile, setIsLoadingProfile] = useState(true)
  
  // New state for step-by-step flow
  const [subjectStep, setSubjectStep] = useState<SubjectStep>('type')
  const [subjectType, setSubjectType] = useState<SubjectType | null>(null)
  
  // Professor search flow state
  const [professorStep, setProfessorStep] = useState<ProfessorStep>('search')
  const [professorQuery, setProfessorQuery] = useState('')
  const [selectedProfessor, setSelectedProfessor] = useState<string | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  
  // 検索機能の状態管理
  const [searchResults, setSearchResults] = useState<PastExam[]>([])
  const [searchFilters] = useState<SearchFilters>({})
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    try {
      setIsSearching(true)
      console.log('検索開始:', searchQuery)
      
      // 検索フィルターを構築
      const filters: SearchFilters = {
        ...searchFilters
      }

      // 現在のセクションに応じて検索パラメータを設定
      if (activeSection === 'professor') {
        filters.professor = searchQuery
      } else if (activeSection === 'subject') {
        filters.course = searchQuery
      } else {
        // デフォルトは授業名検索
        filters.course = searchQuery
      }

      // ユーザー情報があれば大学・学部でフィルタリング
      if (userInfo) {
        filters.university = userInfo.university
        filters.faculty = userInfo.faculty
      }
      
      // APIを使用して過去問を検索
      const results = await api.pastExams.getAll(filters)
      setSearchResults(results)
      
      console.log('検索結果:', results)
    } catch (error) {
      console.error('検索エラー:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }, [searchFilters, activeSection, userInfo])

  // ログインユーザーのプロファイル情報を読み込む
  useEffect(() => {
    const loadUserProfile = async () => {
      if (!isLoggedIn || !user) {
        setIsLoadingProfile(false)
        return
      }

      try {
        const profile = await api.users.getById(user.id)
        console.log('プロファイル取得結果:', profile)
        
        if (profile) {
          // 既存のプロファイル情報がある場合は自動的に設定
          setAcademicInfo({
            university: profile.university,
            faculty: profile.faculty,
            department: profile.department
          })
          setYear(profile.year.toString() + '年生')
          setPenName(profile.pen_name)
          
          // ユーザー情報を設定して、モーダルを表示しない
          const userInfoData = {
            university: profile.university,
            faculty: profile.faculty,
            department: profile.department,
            year: profile.year.toString() + '年生',
            penName: profile.pen_name,
            isLoggedIn: true,
            completedAt: new Date().toISOString()
          }
          
          setUserInfo(userInfoData)
          
          // LocalStorageにも保存
          localStorage.setItem('kakomonn_user', JSON.stringify(userInfoData))
          
          // ログインユーザーは常にモーダルを非表示にする（重複入力防止）
          console.log('ログインユーザーのため、大学情報モーダルを非表示にします')
          setShowUniversityModal(false)
        } else {
          // プロファイルがない場合でもログインユーザーはモーダルを表示しない
          console.log('プロファイルなしでもログインユーザーのためモーダル非表示')
          setShowUniversityModal(false)
        }
      } catch (error) {
        console.error('Failed to load user profile:', error)
        // エラーがあってもログインユーザーはモーダルを表示しない
        console.log('エラーでもログインユーザーのためモーダル非表示')
        setShowUniversityModal(false)
      } finally {
        setIsLoadingProfile(false)
      }
    }

    loadUserProfile()
  }, [isLoggedIn, user])

  useEffect(() => {
    const q = searchParams.get('q')
    if (q) {
      setQuery(q)
      handleSearch(q)
    }
  }, [searchParams, handleSearch])

  useEffect(() => {
    // ログインユーザーの場合はモーダルを非表示にしてプロファイルロード完了まで待つ
    if (isLoggedIn) {
      console.log('ログインユーザーのためモーダル非表示＆プロファイルロード完了まで待機')
      setShowUniversityModal(false)
      return
    }
    
    // ゲストユーザーの場合のみlocalStorageから情報を読み込み
    console.log('ゲストユーザーのlocalStorage情報を確認')
    const savedUserInfo = localStorage.getItem('kakomonn_user')
    const guestUniversityInfo = localStorage.getItem('kakomonn_guest_university')
    
    if (savedUserInfo) {
      try {
        const parsed = JSON.parse(savedUserInfo)
        console.log('localStorage からユーザー情報復元:', parsed)
        setUserInfo(parsed)
      } catch (error) {
        console.error('Failed to parse user info:', error)
        setShowUniversityModal(true)
      }
    } else if (guestUniversityInfo) {
      try {
        const parsed = JSON.parse(guestUniversityInfo)
        console.log('localStorage からゲスト大学情報復元:', parsed)
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
      // ゲストでも情報がない場合のみモーダル表示
      console.log('ゲストユーザーで大学情報なし - モーダル表示')
      setShowUniversityModal(true)
    }
  }, [isLoggedIn])

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

    try {
      // ログインユーザーの場合はデータベースに保存
      if (isLoggedIn && user) {
        const yearNumber = parseInt(year.replace('年生', ''))
        const profileData = {
          id: user.id,
          email: user.email || '',
          name: user.name || user.email.split('@')[0] || '',
          university: academicInfo.university,
          faculty: academicInfo.faculty,
          department: academicInfo.department,
          year: yearNumber,
          pen_name: penName || 'ゲストユーザー'
        }

        await api.users.upsert(profileData)
        
        // 成功したらユーザー情報を設定
        const userInfo = {
          ...academicInfo,
          year: year,
          penName: penName || 'ゲストユーザー',
          isLoggedIn: true,
          completedAt: new Date().toISOString()
        }
        
        localStorage.setItem('kakomonn_user', JSON.stringify(userInfo))
        setUserInfo(userInfo)
      } else {
        // ゲストユーザーの場合はローカルストレージに保存
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
        setUserInfo(guestUserInfo)
      }
      
      setTimeout(() => {
        setShowUniversityModal(false)
        setIsCompletingSetup(false)
      }, 1500)
    } catch (error) {
      console.error('Failed to save user profile:', error)
      alert('プロファイルの保存に失敗しました。もう一度お試しください。')
      setIsCompletingSetup(false)
    }
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
    setSubjectStep('type')
    setSubjectType(null)
    setProfessorStep('search')
    setProfessorQuery('')
    setSelectedProfessor(null)
    setSelectedCourse(null)
  }

  const handleSectionSelect = (section: MainSection) => {
    setActiveSection(section)
    if (section === 'subject') {
      setSubjectStep('type')
      setSubjectType(null)
    } else if (section === 'professor') {
      setProfessorStep('search')
      setProfessorQuery('')
      setSelectedProfessor(null)
      setSelectedCourse(null)
    }
  }

  const handleSubjectTypeSelect = (type: SubjectType) => {
    setSubjectType(type)
    setSubjectStep('search')
  }


  // 検索結果を表示するコンポーネント
  const renderSearchResults = () => {
    if (isSearching) {
      return (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-2 text-gray-600">検索中...</span>
        </div>
      )
    }

    if (searchResults.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">検索結果が見つかりませんでした</h3>
          <p className="text-gray-500 mb-4">
            &ldquo;{query}&rdquo; に関する過去問は見つかりませんでした
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
            <h4 className="font-medium text-blue-900 mb-2">検索のコツ</h4>
            <ul className="text-sm text-blue-700 text-left space-y-1">
              <li>• 授業名の一部で検索してみてください</li>
              <li>• 教授名での検索も試してみてください</li>
              <li>• 略語ではなく正式名称で検索してみてください</li>
            </ul>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">検索結果 ({searchResults.length}件)</h3>
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
          {searchResults.map((exam) => (
            <a 
              key={exam.id} 
              href={`/exams/${exam.id}`}
              className="bg-white rounded-lg shadow-md p-3 sm:p-4 border border-gray-200 hover:shadow-lg hover:border-indigo-300 transition-all cursor-pointer group block"
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900 truncate group-hover:text-indigo-700 transition-colors">{exam.title}</h4>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {exam.year}年
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{exam.course_name}</p>
              <p className="text-sm text-gray-500 mb-3">{exam.professor}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{exam.university} {exam.faculty}</span>
                <div className="flex items-center space-x-2">
                  <span>📥 {exam.download_count || 0}</span>
                </div>
              </div>
              <div className="mt-3 text-sm text-indigo-600 group-hover:text-indigo-800 transition-colors">
                クリックして詳細を表示 →
              </div>
            </a>
          ))}
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen gradient-bg-hero relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-purple-600/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-cyan-600/20 rounded-full blur-3xl animate-float animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-pink-400/10 to-purple-600/10 rounded-full blur-3xl animate-breath"></div>
      </div>
      {/* University Selection Modal */}
      {showUniversityModal && !isLoadingProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm sm:max-w-md w-full p-4 sm:p-6">
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
                    <p className="mt-1 text-sm text-gray-500">
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
              <p className="text-sm text-yellow-700">
                この情報は過去問の最適化のみに使用され、いつでも変更可能です
              </p>
            </div>
          </div>
        </div>
      )}
      
      
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-4">
        {/* Header - モバイル圧縮版 */}
        <div className="flex items-center justify-between mb-3 sm:mb-6">
          <Link 
            href="/" 
            className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          >
            KakoMoNN
          </Link>
          <div className="flex items-center space-x-2 sm:space-x-4">
            {userInfo && (
              <Link href="/profile">
                <div className="text-sm text-indigo-600 bg-indigo-50 px-2 py-1 sm:px-3 rounded-full hover:bg-indigo-100 transition-colors cursor-pointer">
                  <span className="hidden sm:inline">👤 {userInfo.penName || 'ゲストユーザー'} ({userInfo.university})</span>
                  <span className="sm:hidden">👤 {userInfo.university}</span>
                </div>
              </Link>
            )}
            <div className="text-sm text-gray-500 hidden md:block">
              {query ? (
                `"${query}" の検索結果${activeSection ? ` - ${activeSection === 'subject' ? '授業検索' : '教授検索'}` : ''}`
              ) : activeSection ? (
                activeSection === 'subject' 
                  ? `授業検索${subjectType ? ` > ${subjectType === 'specialized' ? '専門科目' : '一般科目'}` : ''}`
                  : '教授検索'
              ) : (
                'カテゴリを選択してください'
              )}
            </div>
          </div>
        </div>

        {!query ? (
          /* BEFORE SEARCH: モバイル一画面対応の検索レイアウト */
          <div className="min-h-[calc(100vh-80px)] animate-fade-in">
            <div className="w-full max-w-4xl mx-auto">
              {/* Top Info Bar - 超コンパクト */}
              <div className="flex flex-col sm:flex-row justify-between items-center py-2 sm:py-4 mb-4 sm:mb-8 border-b border-gray-100">
                {/* Left: Welcome message */}
                <div className="text-center sm:text-left mb-2 sm:mb-0">
                  <h1 className="text-base sm:text-lg font-semibold text-gray-900">
                    過去問検索
                  </h1>
                  <p className="text-sm text-gray-500 hidden sm:block">
                    検索方法を選んでください
                  </p>
                </div>
                
                {/* Right: User Info - モバイルで縮小 */}
                {userInfo && (
                  <div className="flex items-center space-x-1.5 bg-gray-50 rounded-lg px-2 py-1.5 sm:px-3 sm:py-2">
                    <div className="w-4 h-4 sm:w-6 sm:h-6 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-md flex items-center justify-center">
                      <span className="text-xs text-white">🏫</span>
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-medium text-gray-900">{userInfo.university}</p>
                      <p className="text-sm text-gray-500 hidden sm:block">{userInfo.faculty}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Main Search Selection - モバイル最適化 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 px-2 sm:px-0">
                {/* Professor Search Card - モバイル圧縮版 */}
                <button 
                  className="group cursor-pointer transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                  onClick={() => handleSectionSelect('professor')}
                  aria-label="教授名で検索を開始する"
                >
                  <div className="bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-4 sm:p-6 text-center h-full relative overflow-hidden shadow-lg group-hover:shadow-xl group-hover:border-orange-300 transition-all duration-300">
                    <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs font-bold px-1.5 py-0.5 rounded shadow-lg">
                      推奨
                    </div>
                    <div className="mb-4">
                      <div className="text-4xl sm:text-5xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                        👨‍🏫
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                        教授名で検索
                      </h2>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                        教授名から授業を特定<br />
                        <span className="font-semibold text-orange-600">最も確実で高速</span>
                      </p>
                    </div>
                    <div className="inline-flex items-center bg-orange-500 text-white px-3 py-2 sm:px-6 sm:py-3 rounded-full font-bold group-hover:bg-orange-600 transition-colors shadow-lg text-sm">
                      検索開始
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </button>

                {/* Subject Search Card - モバイル圧縮版 */}
                <button 
                  className="group cursor-pointer transform transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  onClick={() => handleSectionSelect('subject')}
                  aria-label="授業名で検索を開始する"
                >
                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl p-4 sm:p-6 text-center h-full relative overflow-hidden shadow-lg group-hover:shadow-xl group-hover:border-indigo-300 transition-all duration-300">
                    <div className="mb-4">
                      <div className="text-4xl sm:text-5xl mb-2 sm:mb-3 group-hover:scale-110 transition-transform duration-300">
                        📚
                      </div>
                      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                        授業名で検索
                      </h2>
                      <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                        科目名から過去問を<br />
                        <span className="font-semibold text-indigo-600">直接検索</span>
                      </p>
                    </div>
                    <div className="inline-flex items-center bg-indigo-500 text-white px-3 py-2 sm:px-6 sm:py-3 rounded-full font-bold group-hover:bg-indigo-600 transition-colors shadow-lg text-sm">
                      検索開始
                      <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* AFTER SEARCH: Split Layout with Smooth Animation */
          <div className="flex gap-6 min-h-[calc(100vh-140px)] animate-fade-in">
            {/* Left Sidebar - Compact Filters */}
            <div className="w-72 flex-shrink-0">
              <div className="sticky top-4">
                {/* Header with Back Button */}
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl p-5 mb-5 shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-lg font-bold">📝 過去問検索</h2>
                      <p className="text-sm opacity-90">&ldquo;{query}&rdquo;</p>
                    </div>
                    <button
                      onClick={() => {
                        setQuery('')
                        setSearchResults([])
                      }}
                      className="text-white/80 hover:text-white hover:bg-white/10 rounded-lg p-2 transition-colors"
                      aria-label="検索をリセット"
                    >
                      ✕
                    </button>
                  </div>
                  
                  {userInfo && (
                    <div className="text-xs opacity-80">
                      {userInfo.university} {userInfo.faculty}
                    </div>
                  )}
                </div>
                
                {/* Quick Filter Options */}
                <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl shadow-xl p-3 space-y-2">
                  <h3 className="font-semibold text-gray-900 text-sm">新しい検索</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setQuery('')
                        handleSectionSelect('professor')
                      }}
                      className="w-full p-2 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors text-left text-sm"
                    >
                      👨‍🏫 教授名で検索
                    </button>
                    <button
                      onClick={() => {
                        setQuery('')
                        handleSectionSelect('subject')
                      }}
                      className="w-full p-2 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors text-left text-sm"
                    >
                      📚 授業検索
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Side - Search Results */}
            <div className="flex-1 min-w-0">
              <div className="bg-white/70 backdrop-blur-sm border border-white/50 rounded-2xl shadow-xl overflow-hidden h-full">
                {/* Results Header */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-5 py-3 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">検索結果</h3>
                      <p className="text-gray-600 mt-1">&ldquo;{query}&rdquo; の結果を表示中</p>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>ライブ</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Results Content */}
                <div className="p-3 sm:p-5 h-[calc(100vh-200px)] sm:h-[calc(100vh-260px)] overflow-y-auto">
                  {renderSearchResults()}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step-by-Step Content - Compact Overlay Style */}
        {activeSection && (
          <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-3" onClick={resetFlow}>
            <div className="glass-strong rounded-3xl p-4 sm:p-5 md:p-6 max-w-sm sm:max-w-2xl md:max-w-3xl w-full max-h-[85vh] overflow-y-auto animate-fade-in" onClick={(e) => e.stopPropagation()}>
                    
                    {/* Header with breadcrumb */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex-1">
                        {/* Breadcrumb */}
                        <div className="flex items-center space-x-2 text-sm mb-4">
                          <span className="text-gray-400">検索方法選択</span>
                          <span className="text-gray-400">→</span>
                          <span className={
                            activeSection === 'professor' ? 'text-orange-600 font-medium' :
                            activeSection === 'subject' ? 'text-indigo-600 font-medium' :
                            'text-green-600 font-medium'
                          }>
                            {activeSection === 'professor' ? '教授名検索' :
                             activeSection === 'subject' ? '授業検索' : 'その他'}
                          </span>
                          {/* Additional breadcrumb for deeper navigation */}
                          {activeSection === 'professor' && professorStep !== 'search' && (
                            <>
                              <span className="text-gray-400">→</span>
                              <span className="text-blue-600 font-medium">
                                {professorStep === 'courses' ? selectedProfessor :
                                 professorStep === 'years' ? selectedCourse : ''}
                              </span>
                            </>
                          )}
                        </div>
                        
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                          {activeSection === 'professor' && professorStep === 'search' && '教授名を入力'}
                          {activeSection === 'professor' && professorStep === 'courses' && '授業を選択'}
                          {activeSection === 'professor' && professorStep === 'years' && '年度を選択'}
                          {activeSection === 'subject' && subjectStep === 'type' && '科目タイプを選択'}
                          {activeSection === 'subject' && subjectStep === 'search' && '検索を実行'}
                        </h2>
                        
                        {activeSection === 'professor' && professorStep === 'search' && userInfo && (
                          <p className="text-gray-600 mt-2">{userInfo.university} {userInfo.faculty}</p>
                        )}
                      </div>
                      
                      <button
                        onClick={resetFlow}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-lg hover:bg-gray-100 flex-shrink-0"
                      >
                        ✕
                      </button>
                    </div>

                    {/* Content Area */}
                    <div className="space-y-6">
                      
                      {/* Professor Search Flow */}
                      {activeSection === 'professor' && professorStep === 'search' && (
                        <>
                          {/* Search Input */}
                          <div className="relative">
                            <input
                              type="text"
                              value={professorQuery}
                              onChange={(e) => setProfessorQuery(e.target.value)}
                              placeholder="教授名を入力... (例: 田中)"
                              className="w-full px-4 py-3 pl-12 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm"
                              autoFocus
                            />
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                            </div>
                          </div>

                          {/* Direct Professor Search Button */}
                          {professorQuery.trim() && (
                            <button
                              onClick={() => {
                                setQuery(professorQuery)
                                handleSearch(professorQuery)
                              }}
                              className="w-full p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl"
                            >
                              <div className="flex items-center justify-center space-x-3">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <span className="font-semibold">「{professorQuery}」で過去問を検索</span>
                              </div>
                            </button>
                          )}

                          {/* Professor Results */}
                          {professorQuery && userInfo ? (
                            <div className="grid gap-3 max-h-96 overflow-y-auto">
                              {getAllProfessorsForUser(userInfo.university, userInfo.faculty)
                                .filter(prof => prof.professor.toLowerCase().includes(professorQuery.toLowerCase()))
                                .map((prof, index) => (
                                  <button
                                    key={index}
                                    onClick={() => {
                                      setSelectedProfessor(prof.professor)
                                      setProfessorStep('courses')
                                    }}
                                    className="p-4 bg-orange-50 border border-orange-200 rounded-xl hover:bg-orange-100 hover:shadow-md transition-all text-left group"
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center space-x-3">
                                        <div className="text-xl">👨‍🏫</div>
                                        <div className="min-w-0 flex-1">
                                          <h4 className="font-bold text-gray-900">{prof.professor} 教授</h4>
                                          <p className="text-sm text-gray-600">
                                            {prof.courses.length}授業 • {prof.courses.reduce((total, course) => total + course.years.length, 0)}年分
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </button>
                                ))}
                              
                              {getAllProfessorsForUser(userInfo.university, userInfo.faculty)
                                .filter(prof => prof.professor.toLowerCase().includes(professorQuery.toLowerCase())).length === 0 && (
                                <div className="text-center py-8">
                                  <div className="text-3xl mb-3">😔</div>
                                  <p className="text-gray-500">「{professorQuery}」が見つかりません</p>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <div className="text-6xl mb-4">🔍</div>
                              <p className="text-gray-600">教授名を入力してください</p>
                            </div>
                          )}
                        </>
                      )}

                      {/* Course Selection */}
                      {activeSection === 'professor' && professorStep === 'courses' && selectedProfessor && userInfo && (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                          {getAllProfessorsForUser(userInfo.university, userInfo.faculty)
                            .find(prof => prof.professor === selectedProfessor)
                            ?.courses.map((course, index) => (
                              <button
                                key={index}
                                onClick={() => {
                                  setSelectedCourse(course.name)
                                  setProfessorStep('years')
                                }}
                                className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-indigo-100 hover:shadow-lg transition-all text-center group"
                              >
                                <div className="text-3xl mb-3">📖</div>
                                <h4 className="font-bold text-gray-900 mb-2">{course.name}</h4>
                                <p className="text-sm text-gray-600 mb-2">{course.years.length}年分</p>
                                <p className="text-xs text-blue-600 font-medium">
                                  {course.years.join('年, ')}年
                                </p>
                              </button>
                            ))}
                        </div>
                      )}

                      {/* Year Selection */}
                      {activeSection === 'professor' && professorStep === 'years' && selectedProfessor && selectedCourse && userInfo && (
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
                                  resetFlow() // Close modal after search
                                }}
                                className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl hover:from-green-100 hover:to-emerald-100 hover:shadow-lg transition-all text-center"
                              >
                                <div className="text-2xl mb-2">📅</div>
                                <h4 className="font-bold text-gray-900 mb-1">{year}年</h4>
                                <p className="text-xs text-green-600">検索実行</p>
                              </button>
                            )) || []
                          })()}
                        </div>
                      )}

                      {/* Subject Type Selection */}
                      {activeSection === 'subject' && subjectStep === 'type' && (
                        <div className="grid gap-4">
                          <button
                            onClick={() => handleSubjectTypeSelect('specialized')}
                            className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl hover:from-blue-100 hover:to-indigo-100 hover:shadow-lg transition-all text-left group"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="text-3xl">🎓</div>
                              <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">専門科目</h3>
                                <p className="text-gray-600">学部・学科の専門科目を検索</p>
                              </div>
                            </div>
                          </button>
                          
                          <button
                            onClick={() => handleSubjectTypeSelect('general')}
                            className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl hover:from-green-100 hover:to-emerald-100 hover:shadow-lg transition-all text-left group"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="text-3xl">🌍</div>
                              <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">一般科目</h3>
                                <p className="text-gray-600">全学共通・教養科目を検索</p>
                              </div>
                            </div>
                          </button>
                        </div>
                      )}

                      {/* Subject Search Input */}
                      {activeSection === 'subject' && subjectStep === 'search' && (
                        <div className="space-y-6">
                          <div className="text-center mb-6">
                            <div className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full mb-3">
                              {subjectType === 'specialized' ? '🎓 専門科目' : '🌍 一般科目'}
                            </div>
                            <p className="text-gray-600">
                              {subjectType === 'specialized' 
                                ? '学部・学科の専門科目名を入力してください' 
                                : '全学共通・教養科目名を入力してください'
                              }
                            </p>
                          </div>
                          
                          <div className="relative">
                            <input
                              type="text"
                              value={query}
                              onChange={(e) => setQuery(e.target.value)}
                              placeholder={subjectType === 'specialized' 
                                ? "例: 線形代数学、マクロ経済学、データ構造とアルゴリズム" 
                                : "例: 英語、体育、情報リテラシー"
                              }
                              className="w-full px-4 py-3 pl-12 text-lg border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                              autoFocus
                              onKeyPress={(e) => {
                                if (e.key === 'Enter' && query.trim()) {
                                  handleSearch(query)
                                }
                              }}
                            />
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                            </div>
                          </div>

                          {query.trim() && (
                            <button
                              onClick={() => {
                                handleSearch(query)
                                resetFlow() // Close modal after search
                              }}
                              className="w-full p-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl"
                            >
                              <div className="flex items-center justify-center space-x-3">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <span className="font-semibold">「{query}」を検索</span>
                              </div>
                            </button>
                          )}

                          {userInfo && (
                            <div className="bg-gray-50 rounded-lg p-4">
                              <h4 className="text-sm font-medium text-gray-900 mb-2">検索範囲</h4>
                              <div className="text-sm text-gray-600">
                                <p>{userInfo.university} {userInfo.faculty} {userInfo.department}</p>
                                <p className="text-xs mt-1">
                                  {subjectType === 'specialized' 
                                    ? '専門科目として検索します' 
                                    : '一般科目として検索します'
                                  }
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Navigation Buttons */}
                      {activeSection === 'subject' && subjectStep === 'search' && (
                        <div className="flex justify-between pt-6 border-t border-gray-200">
                          <button
                            onClick={() => setSubjectStep('type')}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors flex items-center space-x-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>戻る</span>
                          </button>
                        </div>
                      )}

                      {/* Navigation Buttons */}
                      {activeSection === 'professor' && professorStep !== 'search' && (
                        <div className="flex justify-between pt-6 border-t border-gray-200">
                          <button
                            onClick={() => {
                              if (professorStep === 'courses') setProfessorStep('search')
                              else if (professorStep === 'years') setProfessorStep('courses')
                            }}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors flex items-center space-x-2"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            <span>戻る</span>
                          </button>
                        </div>
                      )}
                      
                    </div>
              {/* iOS Safari等のセーフエリア対応スペーサ */}
              <div className="h-4" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} />
            </div>
          </div>
        )}

      </div>
      {/* モバイルの安全領域余白 */}
      <div className="h-[24px] sm:h-0" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} />
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