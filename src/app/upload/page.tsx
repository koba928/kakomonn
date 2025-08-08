'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import { CheckIcon, ArrowRightIcon } from '@/components/icons/IconSystem'
import { useUser } from '@/contexts/UserContext'
import { VirtualizedAutocompleteSelect } from '@/components/ui/VirtualizedAutocompleteSelect'
import { TeacherSearchModal } from '@/components/teacher/TeacherSearchModal'
import { universityDataDetailed } from '@/data/universityDataDetailed'
import { AnimatedButton } from '@/components/ui/MicroInteractions'
import { useFormErrorHandler, useFileUploadErrorHandler } from '@/hooks/useErrorHandler'
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
  { value: 'general', label: '全学共通科目', description: '全学部生が履修可能な共通科目' },
  { value: 'faculty-wide', label: '学部共通科目', description: '学部内の全学科で共通の科目' },
  { value: 'faculty-core', label: '学部基幹科目', description: '学部の中核となる重要科目' },
  { value: 'department-core', label: '学科専門科目', description: '学科の専門教育科目' },
  { value: 'department-advanced', label: '学科発展科目', description: '高度な専門知識を扱う科目' },
  { value: 'other', label: 'その他', description: '上記に当てはまらない科目' },
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
  const { user, isLoggedIn } = useUser()
  const formErrorHandler = useFormErrorHandler()
  const fileUploadErrorHandler = useFileUploadErrorHandler()
  
  const [currentStep, setCurrentStep] = useState<Step>('university')
  const [showTeacherSearchModal, setShowTeacherSearchModal] = useState(false)
  const [formData, setFormData] = useState({
    // 基本情報
    university: '',
    faculty: '',
    department: '',
    courseCategory: '',
    
    // 科目情報
    courseName: '',
    courseCode: '',
    year: 2024,
    term: '',
    targetAudiences: [] as string[],
    
    // 試験情報
    examType: '',
    examDate: '',
    examScope: '',
    examFormat: '',
    
    // 作成者情報
    author: '',
    description: '',
    
    // 教員情報
    teachers: [] as CourseTeacher[]
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

  // 科目分類に基づいてターゲット層を生成
  const availableTargetAudiences = useMemo((): TargetAudience[] => {
    const baseTargets: TargetAudience[] = []
    
    if (formData.courseCategory === 'general') {
      baseTargets.push(
        { id: 'all-undergrad', name: '全学部生', description: 'すべての学部の学生' },
        { id: 'lower-years', name: '下級生（1-2年）', description: '主に1-2年生向け' },
        { id: 'upper-years', name: '上級生（3-4年）', description: '主に3-4年生向け' },
        { id: 'all-years', name: '全学年', description: 'すべての学年' }
      )
    }
    
    if (formData.courseCategory === 'faculty-wide' && formData.faculty) {
      baseTargets.push(
        { id: 'faculty-all', name: `${formData.faculty}全学科`, description: `${formData.faculty}内すべての学科` },
        { id: 'faculty-lower', name: `${formData.faculty}下級生`, description: `${formData.faculty}の1-2年生` },
        { id: 'faculty-upper', name: `${formData.faculty}上級生`, description: `${formData.faculty}の3-4年生` }
      )
    }
    
    if (formData.courseCategory === 'faculty-core' && formData.faculty) {
      baseTargets.push(
        { id: 'faculty-all', name: `${formData.faculty}全学科`, description: `${formData.faculty}内すべての学科（必修レベル）` },
        { id: 'faculty-core-students', name: '基幹科目履修者', description: '学部の基幹となる科目の履修者' },
        { id: 'related-faculty', name: '関連学部生', description: '関連する他学部の学生' }
      )
    }
    
    if (formData.courseCategory === 'department-core' && formData.faculty && formData.department) {
      baseTargets.push(
        { id: 'department-all', name: `${formData.department}全学年`, description: `${formData.department}のすべての学年` },
        { id: 'department-required', name: '必修履修者', description: '必修科目として履修する学生' },
        { id: 'department-lower', name: `${formData.department}下級生`, description: `${formData.department}の1-2年生` },
        { id: 'department-upper', name: `${formData.department}上級生`, description: `${formData.department}の3-4年生` }
      )
    }
    
    if (formData.courseCategory === 'department-advanced' && formData.faculty && formData.department) {
      baseTargets.push(
        { id: 'department-advanced', name: `${formData.department}専門履修者`, description: `${formData.department}の専門科目履修者` },
        { id: 'department-upper', name: `${formData.department}上級生`, description: `${formData.department}の3-4年生` },
        { id: 'related-departments', name: '関連学科生', description: '関連する他学科の学生' },
        { id: 'graduate-students', name: '大学院進学予定者', description: '大学院進学を考える学生' }
      )
    }
    
    if (formData.courseCategory === 'other') {
      baseTargets.push(
        { id: 'specified-students', name: '指定された学生', description: '特定の条件を満たす学生' },
        { id: 'interested-students', name: '興味のある学生', description: 'この分野に興味がある学生' },
        { id: 'all-students', name: 'すべての学生', description: '制限なし' }
      )
    }
    
    return baseTargets
  }, [formData.courseCategory, formData.faculty, formData.department])

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
               formData.targetAudiences.length > 0
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
      { key: 'courseCategory', label: '科目分類', number: 4 },
      { key: 'courseInfo', label: '科目情報', number: 5 },
      { key: 'examInfo', label: '試験情報', number: 6 },
      { key: 'teacher', label: '教員情報', number: 7 },
      { key: 'confirm', label: '確認', number: 8 },
    ]

    // Skip university steps for logged-in users
    const displaySteps = user && isLoggedIn 
      ? steps.filter(s => !['university', 'faculty', 'department'].includes(s.key))
      : steps

    const getCurrentStepNumber = () => {
      const step = steps.find(s => s.key === currentStep)
      return step?.number || 1
    }

    const currentStepNumber = getCurrentStepNumber()

    return (
      <nav className="mb-6 px-4" aria-label="投稿手順">
        <ol className="flex items-center justify-center flex-wrap gap-2" role="list">
          {displaySteps.map((step, index) => (
            <li key={step.key} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                step.number < currentStepNumber
                  ? 'bg-green-500 border-green-500 text-white'
                  : step.number === currentStepNumber
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-gray-100 border-gray-300 text-gray-400'
              }`}>
                {step.number < currentStepNumber ? (
                  <CheckIcon size={14} />
                ) : (
                  <span className="text-xs font-bold">{step.number}</span>
                )}
              </div>
              <span className={`ml-1.5 text-xs font-medium hidden sm:inline ${
                step.number <= currentStepNumber ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {step.label}
              </span>
              {index < displaySteps.length - 1 && (
                <div className={`w-4 sm:w-8 h-0.5 mx-2 ${
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

  const handleTargetAudienceToggle = (targetId: string) => {
    setFormData(prev => ({
      ...prev,
      targetAudiences: prev.targetAudiences.includes(targetId)
        ? prev.targetAudiences.filter(id => id !== targetId)
        : [...prev.targetAudiences, targetId]
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file
      if (!file) {
        fileUploadErrorHandler.handleValidationError('ファイルが選択されていません')
        return
      }
      setSelectedFile(file)
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
    try {
      setIsSubmitting(true)
      
      // Create form data for upload
      const uploadData = new FormData()
      uploadData.append('file', selectedFile!)
      uploadData.append('data', JSON.stringify({
        ...formData,
        uploadedAt: new Date().toISOString(),
        uploaderId: user?.id || 'anonymous'
      }))
      
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Success
      setCurrentStep('complete')
      
    } catch (error) {
      formErrorHandler.handleSubmissionError(
        error instanceof Error ? error : '投稿中にエラーが発生しました'
      )
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">大学を選択してください</h2>
              <p className="text-gray-600">過去問を投稿する大学を選んでください</p>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">学部を選択してください</h2>
              <p className="text-gray-600">過去問の学部を選んでください</p>
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
              <h2 className="text-2xl font-bold text-gray-900 mb-2">科目の分類を選択してください</h2>
              <p className="text-gray-600">該当する科目の種類を選んでください</p>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  科目コード（任意）
                </label>
                <input
                  type="text"
                  value={formData.courseCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, courseCode: e.target.value }))}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="例：MATH101"
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
                <div className="space-y-2">
                  {availableTargetAudiences.map(target => (
                    <label key={target.id} className="flex items-start p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.targetAudiences.includes(target.id)}
                        onChange={() => handleTargetAudienceToggle(target.id)}
                        className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      />
                      <div className="ml-3">
                        <span className="font-medium text-gray-900">{target.name}</span>
                        {target.description && (
                          <p className="text-sm text-gray-600">{target.description}</p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
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
                  {formData.courseCode && (
                    <div className="flex">
                      <dt className="font-medium text-gray-600 w-24">科目コード:</dt>
                      <dd className="text-gray-900">{formData.courseCode}</dd>
                    </div>
                  )}
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

  // Skip login check for logged-in users
  const canProceed = user && isLoggedIn && ['university', 'faculty', 'department'].includes(currentStep)

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-indigo-600 bg-clip-text text-transparent">
              過去問<span className="text-indigo-600">hub</span>
            </h1>
          </Link>
          <p className="text-gray-600">過去問を投稿して、みんなの学習を支援しよう</p>
        </div>

        {/* Step Indicator */}
        {currentStep !== 'complete' && renderStepIndicator()}

        {/* Content Card */}
        <div className="bg-white/90 backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100">
          {renderStepContent()}
          
          {/* Navigation */}
          {currentStep !== 'complete' && (
            <div className="flex justify-between items-center mt-8">
              <button
                onClick={goToPrevStep}
                disabled={currentStep === 'university' || (user && isLoggedIn && currentStep === 'courseCategory')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                  currentStep === 'university' || (user && isLoggedIn && currentStep === 'courseCategory')
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <ArrowRightIcon size={16} className="rotate-180" />
                戻る
              </button>
              
              <AnimatedButton
                variant="primary"
                disabled={!isStepValid() && !canProceed}
                onClick={currentStep === 'confirm' ? handleSubmit : goToNextStep}
                className="flex items-center gap-2"
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