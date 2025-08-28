'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { CheckIcon, ArrowRightIcon } from '@/components/icons/IconSystem'
import { useAuth } from '@/hooks/useAuth'
import { VirtualizedAutocompleteSelect } from '@/components/ui/VirtualizedAutocompleteSelect'
import { universityDataDetailed } from '@/data/universityDataDetailed'
import { AnimatedButton } from '@/components/ui/MicroInteractions'
import { useFormErrorHandler } from '@/hooks/useErrorHandler'
import { supabase } from '@/lib/supabase'
// CourseTeacher type definition
interface CourseTeacher {
  id: string
  name: string
  kana?: string
  position?: string
  isMainInstructor?: boolean
  teachingStyle?: string
  difficulty?: string | number
  grading?: string
  attendance?: boolean
  notes?: string
}

type Step = 
  | 'university' 
  | 'faculty' 
  | 'department' 
  | 'courseInfo'
  | 'confirm'
  | 'complete'


const YEAR_OPTIONS = [
  { value: 2024, label: '2024年度（令和6年度）' },
  { value: 2023, label: '2023年度（令和5年度）' },
  { value: 2022, label: '2022年度（令和4年度）' },
  { value: 2021, label: '2021年度（令和3年度）' },
  { value: 2020, label: '2020年度（令和2年度）' },
  { value: 2019, label: '2019年度（令和元年度）' },
  { value: 2018, label: '2018年度（平成30年度）' },
  { value: 2017, label: '2017年度（平成29年度）' },
]

const TERM_OPTIONS = [
  { value: 'spring', label: '春学期' },
  { value: 'fall', label: '秋学期' },
  { value: 'spring1', label: '春1期' },
  { value: 'spring2', label: '春2期' },
  { value: 'fall1', label: '秋1期' },
  { value: 'fall2', label: '秋2期' },
  { value: 'full-year', label: '通年' },
]

const EXAM_TYPE_OPTIONS = [
  { value: 'midterm', label: '中間試験' },
  { value: 'final', label: '期末試験' },
  { value: 'quiz', label: '小テスト' },
  { value: 'report', label: 'レポート' },
  { value: 'other', label: 'その他' },
]



export default function UploadPage() {
  const { user, loading, isLoggedIn, updateProfile } = useAuth()
  const formErrorHandler = useFormErrorHandler()
  
  // All hooks must be called before any conditional returns
  const [currentStep, setCurrentStep] = useState<Step>('courseInfo')
  const [formData, setFormData] = useState({
    // 基本情報
    university: '',
    faculty: '',
    department: '',
    
    // 科目情報
    courseName: '',
    year: 2024,
    term: '',
    
    // 試験情報
    examType: '',
    examDate: '',
    examScope: '',
    examFormat: '',
    
    // 作成者情報
    author: '',
    description: '',
    
    // 教員情報
    teachers: [] as CourseTeacher[],
    file: null as File | null, // ファイルを追加
    tags: [] as string[] // タグを追加
  })
  
  const [teacherInput, setTeacherInput] = useState({
    teacherName: '',
    difficulty: 3,
    grading: '',
    attendance: false,
    notes: ''
  })
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState('')

  // ユーザーログイン情報を自動入力
  useEffect(() => {
    if (user && isLoggedIn) {
      console.log('=== 過去問投稿ページ: ユーザー情報デバッグ ===')
      console.log('👤 User object full:', JSON.stringify(user, null, 2))
      console.log('🏫 University:', user.university, '(type:', typeof user.university, ')')
      console.log('🏛️ Faculty:', user.faculty, '(type:', typeof user.faculty, ')')
      console.log('📚 Department:', user.department, '(type:', typeof user.department, ')')
      console.log('📅 Year:', user.year, '(type:', typeof user.year, ')')
      console.log('📧 Email:', user.email)
      console.log('🔗 ID:', user.id.substring(0, 8) + '...')
      
      // ユーザー情報の有効性チェック
      const hasValidUniversity = user.university && user.university !== '未設定'
      const hasValidFaculty = user.faculty && user.faculty !== '未設定'
      const hasValidDepartment = user.department && user.department !== '未設定'
      const isComplete = hasValidUniversity && hasValidFaculty && hasValidDepartment
      
      // フォームデータに反映
      const newFormData = {
        university: hasValidUniversity ? user.university : '',
        faculty: hasValidFaculty ? user.faculty : '',
        department: hasValidDepartment ? user.department : '',
        author: hasValidFaculty ? `${user.faculty}${user.year ? user.year + '年' : ''}` : `${user.name || 'ユーザー'}${user.year ? user.year + '年' : ''}`
      }
      
      console.log('📝 フォームデータに設定する値:', newFormData)
      
      setFormData(prev => ({
        ...prev,
        ...newFormData
      }))
      
      console.log('📊 大学情報の状況:', {
        university: hasValidUniversity ? '✅ 設定済み' : '❌ 未設定',
        faculty: hasValidFaculty ? '✅ 設定済み' : '❌ 未設定', 
        department: hasValidDepartment ? '✅ 設定済み' : '❌ 未設定',
        complete: isComplete ? '✅ 完了' : '❌ 不完全'
      })
      console.log('===========================================')
      
      // ステップの決定
      if (isComplete) {
        console.log('✅ 大学情報が完全なので科目情報ステップに移動')
        setCurrentStep('courseInfo')
      } else {
        console.log('⚠️ 大学情報が不完全です。大学選択ステップから開始します')
        console.log('💡 ヒント: プロフィール設定で大学情報を事前に登録すると、この手順をスキップできます')
        setCurrentStep('university')
      }
    }
  }, [user, isLoggedIn])

  // 大学選択に基づいて利用可能な学部を取得
  // const availableFaculties = useMemo(() => {
  //   if (!formData.university) return []
  //   const university = universityDataDetailed.find(u => u.name === formData.university)
  //   return university?.faculties || []
  // }, [formData.university])

  // 学部選択に基づいて利用可能な学科を取得
  // const availableDepartments = useMemo(() => {
  //   if (!formData.university || !formData.faculty) return []
  //   const university = universityDataDetailed.find(u => u.name === formData.university)
  //   if (!university) return []
  //   const faculty = university.faculties.find(f => f.name === formData.faculty)
  //   return faculty?.departments || []
  // }, [formData.university, formData.faculty])


  // Get university options for autocomplete
  const universityOptions = useMemo(() => {
    return universityDataDetailed.map(u => ({
      value: u.name,
      label: u.name
    }))
  }, [])
  
  // Get faculty options based on selected university
  const facultyOptions = useMemo(() => {
    if (!formData.university) return []
    const university = universityDataDetailed.find(u => u.name === formData.university)
    return university?.faculties.map(f => ({
      value: f.name,
      label: f.name
    })) || []
  }, [formData.university])
  
  // Get department options based on selected faculty
  const departmentOptions = useMemo(() => {
    if (!formData.university || !formData.faculty) return []
    const university = universityDataDetailed.find(u => u.name === formData.university)
    const faculty = university?.faculties.find(f => f.name === formData.faculty)
    return faculty?.departments.map(d => ({
      value: d.name,
      label: d.name
    })) || []
  }, [formData.university, formData.faculty])

  // Navigation functions
  const goToNextStep = () => {
    const stepOrder: Step[] = [
      'university',
      'faculty',
      'department',
      'courseInfo',
      'confirm'
    ]
    
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex < stepOrder.length - 1) {
      const nextStep = stepOrder[currentIndex + 1]
      if (nextStep) {
        setCurrentStep(nextStep)
      }
    }
  }

  const goToPrevStep = () => {
    const stepOrder: Step[] = [
      'university',
      'faculty',
      'department',
      'courseInfo',
      'confirm'
    ]
    
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex > 0) {
      const prevStep = stepOrder[currentIndex - 1]
      if (prevStep) {
        setCurrentStep(prevStep)
      }
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 'university':
        return formData.university !== ''
      case 'faculty':
        return formData.faculty !== ''
      case 'department':
        return formData.department !== ''
      case 'courseInfo':
        // ログインユーザーは大学情報が自動入力されるので、科目関連の必須項目のみチェック
        // 教員情報は任意（投稿時に「不明」として処理）
        return formData.courseName !== '' && 
               formData.year > 0 && 
               formData.term !== '' &&
               formData.examType !== '' && 
               selectedFile !== null
      case 'confirm':
        return true
      default:
        return false
    }
  }

  // Step indicator
  const renderStepIndicator = () => {
    const steps = [
      { key: 'university', label: '大学', number: 1 },
      { key: 'faculty', label: '学部', number: 2 },
      { key: 'department', label: '学科', number: 3 },
      { key: 'courseInfo', label: '科目・試験・教員情報', number: 1 },
      { key: 'confirm', label: '確認', number: 2 },
    ]

    // Always skip university steps since login is required
    const displaySteps = steps.filter(s => !['university', 'faculty', 'department'].includes(s.key))

    const getCurrentStepNumber = () => {
      const step = steps.find(s => s.key === currentStep)
      return step?.number || 1
    }

    const currentStepNumber = getCurrentStepNumber()

    return (
      <nav className="mb-4 sm:mb-5 md:mb-6 px-2 sm:px-4" aria-label="投稿手順">
        <ol className="flex items-center justify-center flex-wrap gap-1 sm:gap-2" role="list">
          {displaySteps.map((step, index) => (
            <li key={step.key} className="flex items-center">
              <div className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 transition-all duration-200 ${
                step.number < currentStepNumber
                  ? 'bg-green-500 border-green-500 text-white'
                  : step.number === currentStepNumber
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-gray-100 border-gray-300 text-gray-400'
              }`}>
                {step.number < currentStepNumber ? (
                  <CheckIcon size={12} className="sm:w-3.5 sm:h-3.5" />
                ) : (
                  <span className="text-xs sm:text-sm font-bold">{step.number}</span>
                )}
              </div>
              <span className={`ml-1 sm:ml-1.5 text-xs sm:text-sm font-medium ${
                step.number <= currentStepNumber ? 'text-gray-900' : 'text-gray-400'
              }`}>
                <span className="sm:hidden">{step.label.slice(0,2)}</span>
                <span className="hidden sm:inline">{step.label}</span>
              </span>
              {index < displaySteps.length - 1 && (
                <div className={`w-2 sm:w-4 md:w-8 h-0.5 mx-1 sm:mx-2 ${
                  step.number < currentStepNumber ? 'bg-green-500' : 'bg-gray-300'
                }`} />
              )}
            </li>
          ))}
        </ol>
      </nav>
    )
  }

  // Handle handlers
  const handleUniversityChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      university: value,
      faculty: '',
      department: ''
    }))
  }

  const handleFacultyChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      faculty: value,
      department: ''
    }))
  }

  const handleDepartmentChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      department: value
    }))
  }


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file
      if (!file) {
        alert('ファイルが選択されていません')
        return
      }
      
      // ファイルサイズチェック（25MB制限）
      const maxSize = 25 * 1024 * 1024 // 25MB
      if (file.size > maxSize) {
        alert('ファイルサイズは25MB以下にしてください')
        return
      }

      // ファイル形式チェック
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
      if (!allowedTypes.includes(file.type)) {
        alert('PDF、JPEG、PNG形式のファイルのみアップロード可能です')
        return
      }

      // UI表示用と送信用の両方を更新
      setSelectedFile(file)
      setFormData(prev => ({
        ...prev,
        file
      }))
      
      console.log('ファイル選択:', { name: file.name, size: file.size, type: file.type })
    }
  }

  const handleAddTeacher = () => {
    if (!teacherInput.teacherName.trim()) {
      formErrorHandler.handleValidationError('教員名を入力してください', 'teacherName')
      return
    }

    const newTeacher: CourseTeacher = {
      id: Date.now().toString(),
      name: teacherInput.teacherName,
      difficulty: teacherInput.difficulty,
      grading: teacherInput.grading,
      attendance: teacherInput.attendance,
      notes: teacherInput.notes
    }

    setFormData(prev => ({
      ...prev,
      teachers: [...prev.teachers, newTeacher]
    }))

    // Reset teacher input
    setTeacherInput({
      teacherName: '',
      difficulty: 3,
      grading: '',
      attendance: false,
      notes: ''
    })
  }

  const handleRemoveTeacher = (teacherId: string) => {
    setFormData(prev => ({
      ...prev,
      teachers: prev.teachers.filter(t => t.id !== teacherId)
    }))
  }


  const handleSubmit = async () => {
          if (!isLoggedIn) {
        alert('ログインが必要です')
        return
      }

      setIsSubmitting(true)

      try {
        console.log('アップロード開始:', formData)
        setUploadProgress('ファイル検証中...')
        
        // ファイルが選択されているか確認
        if (!formData.file) {
          alert('ファイルを選択してください')
          setIsSubmitting(false)
          setUploadProgress('')
          return
        }

        // ファイルサイズチェック（25MB制限）
        const maxSize = 25 * 1024 * 1024 // 25MB
        if (formData.file.size > maxSize) {
          alert('ファイルサイズは25MB以下にしてください')
          setIsSubmitting(false)
          return
        }

        // ファイル形式チェック
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
        if (!allowedTypes.includes(formData.file.type)) {
          alert('PDF、JPEG、PNG形式のファイルのみアップロード可能です')
          setIsSubmitting(false)
          return
        }

      // ファイル名を生成（ユニークな名前）
      setUploadProgress('ファイルアップロード準備中...')
      const fileExtension = formData.file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`
      const filePath = `${user?.id}/${fileName}`

      console.log('ファイルアップロード開始:', { fileName, filePath })
      setUploadProgress('ファイルアップロード中...')

      // Supabase Storageにファイルをアップロード（タイムアウト付き）
      const uploadPromise = supabase.storage
        .from('past-exams')
        .upload(filePath, formData.file, {
          cacheControl: '3600',
          upsert: false
        })

      // 30秒のタイムアウトを設定
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('アップロードがタイムアウトしました（30秒）')), 30000)
      )

      try {
        const { data: uploadData, error: uploadError } = await Promise.race([
          uploadPromise,
          timeoutPromise
        ])

        if (uploadError) {
          console.error('ファイルアップロードエラー:', uploadError)
          alert('ファイルのアップロードに失敗しました。ネットワーク接続を確認してください。')
          setIsSubmitting(false)
          setUploadProgress('')
          return
        }

        console.log('ファイルアップロード成功:', uploadData)
      } catch (timeoutError) {
        console.error('アップロードタイムアウト:', timeoutError)
        alert('ファイルアップロードがタイムアウトしました。ファイルサイズを確認するか、後でもう一度お試しください。')
        setIsSubmitting(false)
        setUploadProgress('')
        return
      }

      setUploadProgress('データベース保存中...')

      // ファイルの公開URLを取得
      const { data: urlData } = supabase.storage
        .from('past-exams')
        .getPublicUrl(filePath)

      const fileUrl = urlData.publicUrl

      // データベースに過去問情報を保存（ユーザー情報を確実に適用）
      const pastExamData = {
        title: formData.courseName || '無題',
        course_name: formData.courseName || '',
        professor: formData.teachers.length > 0 
          ? formData.teachers.map(t => t.name).join(', ')
          : '不明', // 教員名をカンマ区切りで保存、または「不明」
        university: formData.university || user?.university || '',
        faculty: formData.faculty || user?.faculty || '',
        department: formData.department || user?.department || '',
        year: formData.year || new Date().getFullYear(),
        semester: formData.term || 'spring',
        exam_type: formData.examType || 'final',
        file_url: fileUrl,
        file_name: formData.file.name,
        uploaded_by: user?.id || '',
        difficulty: formData.teachers.length > 0 
          ? formData.teachers.map(t => Number(t.difficulty) || 3).reduce((sum, val) => sum + val, 0) / formData.teachers.length 
          : 3, // 教員の難易度の平均を保存
        tags: formData.tags || []
      }

      console.log('📤 過去問データ保存開始:', {
        title: pastExamData.title,
        course_name: pastExamData.course_name,
        university: pastExamData.university,
        faculty: pastExamData.faculty,
        department: pastExamData.department,
        uploaded_by: pastExamData.uploaded_by.substring(0, 8) + '...',
        professor: pastExamData.professor
      })

      const { data: examData, error: examError } = await supabase
        .from('past_exams')
        .insert(pastExamData)
        .select()
        .single()

      if (examError) {
        console.error('過去問データ保存エラー:', examError)
        alert('過去問情報の保存に失敗しました')
        setIsSubmitting(false)
        return
      }

      console.log('過去問データ保存成功:', examData)
      
      // ユーザーの大学情報が「未設定」の場合、今回入力した情報で更新
      if (user && (user.university === '未設定' || user.faculty === '未設定' || user.department === '未設定') &&
          formData.university && formData.faculty && formData.department) {
        
        console.log('🔄 ユーザープロフィールを投稿情報で更新中...')
        const profileUpdates = {
          university: formData.university,
          faculty: formData.faculty,
          department: formData.department
        }
        
        try {
          const result = await updateProfile(profileUpdates)
          if (!result.error) {
            console.log('✅ プロフィール更新成功！次回投稿時から自動入力されます')
          }
        } catch (error) {
          console.warn('⚠️ プロフィール更新失敗（投稿は成功済み）:', error)
        }
      }
      
      // 成功メッセージを表示
      setCurrentStep('complete')
      
    } catch (error) {
      console.error('アップロード全体エラー:', error)
      alert('アップロード中にエラーが発生しました')
    } finally {
      setIsSubmitting(false)
      setUploadProgress('')
    }
  }

  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case 'university':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">大学を選択してください</h2>
              <p className="text-sm sm:text-base text-gray-600">過去問を投稿する大学を選んでください</p>
            </div>
            
            {user && user.university === '未設定' && (
              <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">便利な機能</h3>
                    <p className="mt-1 text-sm text-blue-700">
                      ここで選択した大学・学部・学科情報は自動保存され、次回の投稿時から入力が不要になります！
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            <VirtualizedAutocompleteSelect
              options={universityOptions}
              value={formData.university}
              onChange={handleUniversityChange}
              placeholder="大学名を入力してください"
            />
          </div>
        )

      case 'faculty':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-sm text-indigo-600 font-medium">{formData.university}</span>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">学部を選択してください</h2>
              <p className="text-sm sm:text-base text-gray-600">過去問の学部を選んでください</p>
            </div>
            
            <VirtualizedAutocompleteSelect
              options={facultyOptions}
              value={formData.faculty}
              onChange={handleFacultyChange}
              placeholder="学部名を入力してください"
            />
          </div>
        )

      case 'department':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <span className="text-sm text-indigo-600 font-medium">
                {formData.university} / {formData.faculty}
              </span>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">学科を選択してください</h2>
              <p className="text-gray-600">過去問の学科を選んでください</p>
            </div>
            
            <VirtualizedAutocompleteSelect
              options={departmentOptions}
              value={formData.department}
              onChange={handleDepartmentChange}
              placeholder="学科名を入力してください"
            />
          </div>
        )


      case 'courseInfo':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">科目・試験・教員情報を入力してください</h2>
              <p className="text-gray-600">過去問に関する情報をまとめて入力してください</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  科目名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.courseName}
                  onChange={(e) => setFormData(prev => ({ ...prev, courseName: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="例：微分積分学I"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    年度 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    {YEAR_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    学期 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.term}
                    onChange={(e) => setFormData(prev => ({ ...prev, term: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">選択してください</option>
                    {TERM_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  試験の種類 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.examType}
                  onChange={(e) => setFormData(prev => ({ ...prev, examType: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">選択してください</option>
                  {EXAM_TYPE_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="border-t pt-6 mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">教員情報（任意）</h3>
                <p className="text-sm text-gray-600 mb-4">教員名を追加すると、他の学生に有益な情報を提供できます</p>
                
                {formData.teachers.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <h4 className="text-sm font-medium text-gray-700">追加済みの教員</h4>
                    {formData.teachers.map(teacher => (
                      <div key={teacher.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium">{teacher.name}</span>
                        </div>
                        <button
                          onClick={() => handleRemoveTeacher(teacher.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          削除
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-4 border-t pt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      教員名
                    </label>
                    <input
                      type="text"
                      value={teacherInput.teacherName}
                      onChange={(e) => setTeacherInput(prev => ({ ...prev, teacherName: e.target.value }))}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="例：山田太郎"
                    />
                  </div>

                  <AnimatedButton
                    variant="secondary"
                    onClick={handleAddTeacher}
                    className="w-full"
                  >
                    教員を追加
                  </AnimatedButton>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ファイルアップロード <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-400 transition-colors">
                  <div className="space-y-1 text-center">
                    {selectedFile ? (
                      <div className="text-sm text-gray-900">
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        <button
                          type="button"
                          onClick={() => setSelectedFile(null)}
                          className="mt-2 text-indigo-600 hover:text-indigo-500"
                        >
                          別のファイルを選択
                        </button>
                      </div>
                    ) : (
                      <>
                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    <div className="flex text-sm text-gray-600">
                          <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                            <span>ファイルを選択</span>
                            <input 
                              id="file-upload" 
                              name="file-upload" 
                              type="file" 
                              className="sr-only" 
                              onChange={handleFileChange}
                          accept=".pdf,.jpg,.jpeg,.png"
                            />
                          </label>
                          <p className="pl-1">またはドラッグ＆ドロップ</p>
                        </div>
                    <p className="text-xs text-gray-500">PDF, JPG, PNG 最大25MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  試験範囲（任意）
                </label>
                <textarea
                  value={formData.examScope}
                  onChange={(e) => setFormData(prev => ({ ...prev, examScope: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={3}
                  placeholder="例：第1章〜第5章、配布プリント"
                />
              </div>
            </div>
          </div>
        )

      case 'confirm':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">投稿内容の確認</h2>
              <p className="text-gray-600">以下の内容で投稿します</p>
            </div>
            
            <div className="space-y-4 bg-gray-50 p-6 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">基本情報</h3>
                <dl className="space-y-1 text-sm">
                  <div className="flex">
                    <dt className="font-medium text-gray-600 w-24 flex-shrink-0">大学:</dt>
                    <dd className="text-gray-900 truncate">{formData.university || '未設定'}</dd>
                  </div>
                  <div className="flex">
                    <dt className="font-medium text-gray-600 w-24 flex-shrink-0">学部:</dt>
                    <dd className="text-gray-900 truncate">{formData.faculty || '未設定'}</dd>
                  </div>
                  <div className="flex">
                    <dt className="font-medium text-gray-600 w-24 flex-shrink-0">学科:</dt>
                    <dd className="text-gray-900 truncate">{formData.department || '未設定'}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">科目情報</h3>
                <dl className="space-y-1 text-sm">
                  <div className="flex">
                    <dt className="font-medium text-gray-600 w-24">科目名:</dt>
                    <dd className="text-gray-900">{formData.courseName}</dd>
                  </div>
                  <div className="flex">
                    <dt className="font-medium text-gray-600 w-24">年度:</dt>
                    <dd className="text-gray-900">{formData.year}年度</dd>
                  </div>
                  <div className="flex">
                    <dt className="font-medium text-gray-600 w-24">学期:</dt>
                    <dd className="text-gray-900">
                      {TERM_OPTIONS.find(t => t.value === formData.term)?.label}
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">試験情報</h3>
                <dl className="space-y-1 text-sm">
                  <div className="flex">
                    <dt className="font-medium text-gray-600 w-24">試験種別:</dt>
                    <dd className="text-gray-900">
                      {EXAM_TYPE_OPTIONS.find(e => e.value === formData.examType)?.label}
                    </dd>
                  </div>
                  <div className="flex">
                    <dt className="font-medium text-gray-600 w-24">ファイル:</dt>
                    <dd className="text-gray-900">{selectedFile?.name}</dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 mb-2">教員情報</h3>
                {formData.teachers.length > 0 ? (
                  <ul className="space-y-1 text-sm">
                    {formData.teachers.map(teacher => (
                      <li key={teacher.id} className="text-gray-900 truncate">
                        {teacher.name}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-900">不明</p>
                )}
              </div>
            </div>

          </div>
        )

      case 'complete':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckIcon size={40} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">投稿が完了しました！</h2>
            <p className="text-gray-600">
              過去問の投稿ありがとうございます。<br />
              あなたの貢献が他の学生の学習に役立ちます。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/threads">
                <AnimatedButton variant="secondary">
                  投稿一覧を見る
                </AnimatedButton>
              </Link>
              <Link href="/">
                <AnimatedButton variant="primary">
                  ホームに戻る
                </AnimatedButton>
              </Link>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  // 認証状態読み込み中はローディング表示
  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">認証状態を確認中...</p>
        </div>
      </main>
    )
  }

  // ログインしていない場合はログインページに誘導
  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-200 text-center max-w-md">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">ログインが必要です</h1>
          <p className="text-gray-600 mb-6">
            過去問を投稿するにはログインが必要です。<br />
            ログイン後、大学情報が自動入力されて便利です！
          </p>
          <div className="space-y-3">
            <Link href="/auth/email" className="block w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors">
              ログイン・新規登録
            </Link>
            <Link href="/" className="block w-full text-gray-600 hover:text-gray-800 transition-colors">
              ホームに戻る
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 md:py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <Link href="/" className="inline-block mb-3 sm:mb-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-indigo-600 bg-clip-text text-transparent">
              過去問<span className="text-indigo-600">hub</span>
            </h1>
          </Link>
          <p className="text-sm sm:text-base text-gray-600">過去問を投稿して、みんなの学習を支援しよう</p>
        </div>

        {/* Step Indicator */}
        {currentStep !== 'complete' && renderStepIndicator()}

        {/* Content Card */}
        <div className="bg-white/90 backdrop-blur-sm p-4 sm:p-6 md:p-8 rounded-2xl shadow-xl border border-gray-100">
          {renderStepContent()}
          
          {/* Navigation */}
          {currentStep !== 'complete' && (
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center mt-6 sm:mt-8 gap-3 sm:gap-0">
              <button
                onClick={goToPrevStep}
                disabled={currentStep === 'courseInfo'}
                className={`flex items-center justify-center gap-2 px-6 py-3 sm:px-4 sm:py-2 rounded-lg font-medium transition-all min-h-[44px] ${
                  currentStep === 'courseInfo'
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <ArrowRightIcon size={16} className="rotate-180" />
                戻る
              </button>
              
              <AnimatedButton
                variant="primary"
                size="md"
                disabled={!isStepValid()}
                onClick={currentStep === 'confirm' ? handleSubmit : goToNextStep}
                className="flex items-center justify-center gap-2 px-6 py-3 sm:px-4 sm:py-2 min-h-[44px]"
              >
                {currentStep === 'confirm' 
                  ? (isSubmitting 
                      ? (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            {uploadProgress || '投稿中...'}
                          </div>
                        )
                      : '投稿する') 
                  : '次へ'}
                {currentStep !== 'confirm' && <ArrowRightIcon size={16} />}
              </AnimatedButton>
            </div>
          )}
        </div>
      </div>

    </main>
  )
}