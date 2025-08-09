'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { CheckIcon, ArrowRightIcon } from '@/components/icons/IconSystem'
import { useAuthContext } from '@/components/providers/AuthProvider'
import { VirtualizedAutocompleteSelect } from '@/components/ui/VirtualizedAutocompleteSelect'
import { TeacherSearchModal } from '@/components/teacher/TeacherSearchModal'
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
  | 'courseCategory'
  | 'courseInfo'
  | 'examInfo'
  | 'teacher'
  | 'confirm'
  | 'complete'

interface TargetAudience {
  id: string
  name: string
  description?: string
}

const YEAR_OPTIONS = [
  { value: 2024, label: '2024年度' },
  { value: 2023, label: '2023年度' },
  { value: 2022, label: '2022年度' },
  { value: 2021, label: '2021年度' },
  { value: 2020, label: '2020年度' },
  { value: 2019, label: '2019年度' },
  { value: 2018, label: '2018年度' },
  { value: 2017, label: '2017年度' },
]

const TERM_OPTIONS = [
  { value: 'spring', label: '春学期' },
  { value: 'fall', label: '秋学期' },
  { value: 'full-year', label: '通年' },
  { value: 'intensive', label: '集中講義' },
]

const EXAM_TYPE_OPTIONS = [
  { value: 'midterm', label: '中間試験' },
  { value: 'final', label: '期末試験' },
  { value: 'quiz', label: '小テスト' },
  { value: 'report', label: 'レポート' },
  { value: 'other', label: 'その他' },
]

const COURSE_CATEGORIES = [
  { 
    value: 'specialized', 
    label: '専門科目', 
    description: '学部・学科の専門科目（検索時に専門科目として検索されます）' 
  },
  { 
    value: 'general', 
    label: '一般科目', 
    description: '全学共通・教養科目（検索時に一般科目として検索されます）' 
  },
]

const TEACHER_POSITIONS = [
  { value: 'professor', label: '教授' },
  { value: 'associate-professor', label: '准教授' },
  { value: 'lecturer', label: '講師' },
  { value: 'assistant-professor', label: '助教' },
  { value: 'part-time', label: '非常勤講師' },
  { value: 'unknown', label: '不明' },
]

export default function UploadPage() {
  const { user, loading, isLoggedIn } = useAuthContext()
  const formErrorHandler = useFormErrorHandler()
  
  // All hooks must be called before any conditional returns
  const [currentStep, setCurrentStep] = useState<Step>('courseCategory')
  const [showTeacherSearchModal, setShowTeacherSearchModal] = useState(false)
  const [formData, setFormData] = useState({
    // 基本情報
    university: '',
    faculty: '',
    department: '',
    courseCategory: '',
    
    // 科目情報
    courseName: '',
    year: 2024,
    term: '',
    targetAudiences: 'all-years' as string,
    
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
    teacherPosition: '',
    isMainInstructor: true,
    teachingStyle: '',
    difficulty: 3,
    grading: '',
    attendance: false,
    notes: ''
  })
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ユーザーログイン情報を自動入力
  useEffect(() => {
    if (user && isLoggedIn) {
      setFormData(prev => ({
        ...prev,
        university: user.university,
        faculty: user.faculty,
        department: user.department,
        author: `${user.faculty}${user.year}年`
      }))
      
      // ログインユーザーは大学選択をスキップ
      if (user.university && user.faculty && user.department) {
        setCurrentStep('courseCategory')
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

  // 対象者のオプション（学年ベース）
  const availableTargetAudiences = useMemo((): TargetAudience[] => {
    return [
      { id: 'all-years', name: '学年問わず', description: 'すべての学年' },
      { id: '1st-year', name: '1年生', description: '1年生向け' },
      { id: '2nd-year', name: '2年生', description: '2年生向け' },
      { id: '3rd-year', name: '3年生', description: '3年生向け' },
      { id: '4th-year', name: '4年生', description: '4年生向け' },
      { id: 'graduate', name: '大学院生', description: '大学院生向け' }
    ]
  }, [])

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
      'courseCategory',
      'courseInfo',
      'examInfo',
      'teacher',
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
      'courseCategory',
      'courseInfo',
      'examInfo',
      'teacher',
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
      case 'courseCategory':
        return formData.courseCategory !== ''
      case 'courseInfo':
        return formData.courseName !== '' && 
               formData.year > 0 && 
               formData.term !== '' &&
               formData.targetAudiences !== ''
      case 'examInfo':
        return formData.examType !== '' && selectedFile !== null
      case 'teacher':
        return formData.teachers.length > 0
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
      { key: 'courseCategory', label: '科目分類', number: 1 },
      { key: 'courseInfo', label: '科目情報', number: 2 },
      { key: 'examInfo', label: '試験情報', number: 3 },
      { key: 'teacher', label: '教員情報', number: 4 },
      { key: 'confirm', label: '確認', number: 5 },
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
      
      // ファイルサイズチェック（10MB制限）
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        alert('ファイルサイズは10MB以下にしてください')
        return
      }

      // ファイル形式チェック
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
      if (!allowedTypes.includes(file.type)) {
        alert('PDF、JPEG、PNG形式のファイルのみアップロード可能です')
        return
      }

      setFormData(prev => ({
        ...prev,
        file: file
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
      position: teacherInput.teacherPosition,
      isMainInstructor: teacherInput.isMainInstructor,
      teachingStyle: teacherInput.teachingStyle,
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
      teacherPosition: '',
      isMainInstructor: false,
      teachingStyle: '',
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

  const handleTeacherSelect = (teacher: any) => {
    const courseTeacher: CourseTeacher = {
      id: teacher.id || Date.now().toString(),
      name: teacher.name,
      kana: teacher.kana,
      position: teacher.position
    }
    setFormData(prev => ({
      ...prev,
      teachers: [...prev.teachers, courseTeacher]
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
        
        // ファイルが選択されているか確認
        if (!formData.file) {
          alert('ファイルを選択してください')
          setIsSubmitting(false)
          return
        }

        // ファイルサイズチェック（10MB制限）
        const maxSize = 10 * 1024 * 1024 // 10MB
        if (formData.file.size > maxSize) {
          alert('ファイルサイズは10MB以下にしてください')
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
      const fileExtension = formData.file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExtension}`
      const filePath = `${user?.id}/${fileName}`

      console.log('ファイルアップロード開始:', { fileName, filePath })

      // Supabase Storageにファイルをアップロード
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('past-exams')
        .upload(filePath, formData.file)

      if (uploadError) {
        console.error('ファイルアップロードエラー:', uploadError)
        alert('ファイルのアップロードに失敗しました')
        setIsSubmitting(false)
        return
      }

      console.log('ファイルアップロード成功:', uploadData)

      // ファイルの公開URLを取得
      const { data: urlData } = supabase.storage
        .from('past-exams')
        .getPublicUrl(filePath)

      const fileUrl = urlData.publicUrl

      // データベースに過去問情報を保存
      const pastExamData = {
        title: formData.courseName || '無題',
        course_name: formData.courseName || '',
        professor: formData.teachers.map(t => t.name).join(', '), // 教員名をカンマ区切りで保存
        university: formData.university || '',
        faculty: formData.faculty || '',
        department: formData.department || '',
        year: formData.year || new Date().getFullYear(),
        semester: formData.term || 'spring',
        exam_type: formData.examType || 'final',
        file_url: fileUrl,
        file_name: formData.file.name,
        uploaded_by: user?.id || '',
        difficulty: formData.teachers.length > 0 
          ? formData.teachers.map(t => Number(t.difficulty) || 3).reduce((sum, val) => sum + val, 0) / formData.teachers.length 
          : 3, // 教員の難易度の平均を保存
        tags: formData.tags || [],
        target_audiences: [{
          id: formData.targetAudiences,
          name: availableTargetAudiences.find(t => t.id === formData.targetAudiences)?.name || '不明'
        }]
      }

      console.log('過去問データ保存開始:', pastExamData)

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
      
      // 成功メッセージを表示
      setCurrentStep('complete')
      
    } catch (error) {
      console.error('アップロード全体エラー:', error)
      alert('アップロード中にエラーが発生しました')
    } finally {
      setIsSubmitting(false)
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

      case 'courseCategory':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">科目タイプを選択してください</h2>
              <p className="text-gray-600">検索ページと同じ分類で、どちらのタイプか選んでください</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {COURSE_CATEGORIES.map(category => (
                <button
                  key={category.value}
                  onClick={() => setFormData(prev => ({ ...prev, courseCategory: category.value }))}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    formData.courseCategory === category.value
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 bg-white hover:border-indigo-300'
                  }`}
                >
                  <h3 className="font-semibold text-gray-900 mb-1">{category.label}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </button>
              ))}
            </div>
          </div>
        )

      case 'courseInfo':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">科目情報を入力してください</h2>
              <p className="text-gray-600">科目の詳細情報を入力してください</p>
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
                  対象者 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.targetAudiences}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetAudiences: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {availableTargetAudiences.map(target => (
                    <option key={target.id} value={target.id}>
                      {target.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )

      case 'examInfo':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">試験情報を入力してください</h2>
              <p className="text-gray-600">試験の詳細とファイルをアップロードしてください</p>
            </div>
            
            <div className="space-y-4">
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  試験日（任意）
                </label>
                <input
                  type="date"
                  value={formData.examDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, examDate: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
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
                              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                            />
                          </label>
                          <p className="pl-1">またはドラッグ＆ドロップ</p>
                        </div>
                        <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG 最大20MB</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'teacher':
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">教員情報を入力してください</h2>
              <p className="text-gray-600">担当教員の情報を追加してください（最低1人）</p>
            </div>
            
            {formData.teachers.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-700">追加済みの教員</h3>
                {formData.teachers.map(teacher => (
                  <div key={teacher.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="font-medium">{teacher.name}</span>
                      {teacher.position && <span className="text-sm text-gray-600 ml-2">({teacher.position})</span>}
                      {teacher.isMainInstructor && <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded ml-2">主担当</span>}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    教員名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={teacherInput.teacherName}
                    onChange={(e) => setTeacherInput(prev => ({ ...prev, teacherName: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="例：山田太郎"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    職位
                  </label>
                  <select
                    value={teacherInput.teacherPosition}
                    onChange={(e) => setTeacherInput(prev => ({ ...prev, teacherPosition: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">選択してください</option>
                    {TEACHER_POSITIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isMainInstructor"
                  checked={teacherInput.isMainInstructor}
                  onChange={(e) => setTeacherInput(prev => ({ ...prev, isMainInstructor: e.target.checked }))}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="isMainInstructor" className="ml-2 text-sm text-gray-700">
                  主担当教員
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  授業スタイル
                </label>
                <textarea
                  value={teacherInput.teachingStyle}
                  onChange={(e) => setTeacherInput(prev => ({ ...prev, teachingStyle: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  rows={2}
                  placeholder="例：板書中心、スライド使用、演習重視など"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  難易度（1-5）
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={teacherInput.difficulty}
                  onChange={(e) => setTeacherInput(prev => ({ ...prev, difficulty: parseInt(e.target.value) }))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>易しい</span>
                  <span>普通</span>
                  <span>難しい</span>
                </div>
              </div>

              <div className="flex gap-4">
                <AnimatedButton
                  variant="secondary"
                  onClick={() => setShowTeacherSearchModal(true)}
                  className="flex-1"
                >
                  教員を検索
                </AnimatedButton>
                <AnimatedButton
                  variant="primary"
                  onClick={handleAddTeacher}
                  className="flex-1"
                >
                  教員を追加
                </AnimatedButton>
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
                    <dt className="font-medium text-gray-600 w-24">大学:</dt>
                    <dd className="text-gray-900">{formData.university}</dd>
                  </div>
                  <div className="flex">
                    <dt className="font-medium text-gray-600 w-24">学部:</dt>
                    <dd className="text-gray-900">{formData.faculty}</dd>
                  </div>
                  <div className="flex">
                    <dt className="font-medium text-gray-600 w-24">学科:</dt>
                    <dd className="text-gray-900">{formData.department}</dd>
                  </div>
                  <div className="flex">
                    <dt className="font-medium text-gray-600 w-24">科目分類:</dt>
                    <dd className="text-gray-900">
                      {COURSE_CATEGORIES.find(c => c.value === formData.courseCategory)?.label}
                    </dd>
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
                <ul className="space-y-1 text-sm">
                  {formData.teachers.map(teacher => (
                    <li key={teacher.id} className="text-gray-900">
                      {teacher.name}
                      {teacher.position && ` (${teacher.position})`}
                      {teacher.isMainInstructor && ' - 主担当'}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="text-center">
              <AnimatedButton
                variant="primary"
                size="lg"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? '投稿中...' : '投稿する'}
              </AnimatedButton>
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
                disabled={currentStep === 'courseCategory'}
                className={`flex items-center justify-center gap-2 px-6 py-3 sm:px-4 sm:py-2 rounded-lg font-medium transition-all min-h-[44px] ${
                  currentStep === 'courseCategory'
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
                {currentStep === 'confirm' ? '投稿する' : '次へ'}
                {currentStep !== 'confirm' && <ArrowRightIcon size={16} />}
              </AnimatedButton>
            </div>
          )}
        </div>
      </div>

      {/* Teacher Search Modal */}
      <TeacherSearchModal
        isOpen={showTeacherSearchModal}
        onClose={() => setShowTeacherSearchModal(false)}
        onSelect={handleTeacherSelect}
      />
    </main>
  )
}