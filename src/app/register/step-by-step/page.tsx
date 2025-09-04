'use client'

import { useState, useMemo } from 'react'
import { universityDataDetailed } from '@/data/universityDataDetailed'
import { UserRegistrationData } from '@/types/user'
import { AnimatedButton } from '@/components/ui/MicroInteractions'
import Link from 'next/link'
import { ArrowRightIcon, CheckIcon } from '@/components/icons/IconSystem'
import { APP_CONFIG, UI_CONFIG, MESSAGES } from '@/constants/app'
import { useFormErrorHandler } from '@/hooks/useErrorHandler'
import { useAuth } from '@/hooks/useAuth'

type Step = 'email' | 'university' | 'faculty' | 'department' | 'year' | 'name' | 'complete'

export default function StepByStepRegisterPage() {
  const formErrorHandler = useFormErrorHandler()
  const { signUp } = useAuth()
  const [currentStep, setCurrentStep] = useState<Step>('email')
  const [formData, setFormData] = useState<UserRegistrationData>({
    name: '',
    university: '',
    faculty: '',
    department: '',
    year: 1,
    email: '',
    password: '',
    pen_name: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 選択された大学に対応する学部を取得
  const availableFaculties = useMemo(() => {
    if (!formData.university) return []
    const university = universityDataDetailed.find(u => u.name === formData.university)
    return university?.faculties || []
  }, [formData.university])

  // 選択された学部に対応する学科を取得
  const availableDepartments = useMemo(() => {
    if (!formData.university || !formData.faculty) return []
    const university = universityDataDetailed.find(u => u.name === formData.university)
    if (!university) return []
    const faculty = university.faculties.find(f => f.name === formData.faculty)
    return faculty?.departments || []
  }, [formData.university, formData.faculty])

  const handleSelection = (field: keyof UserRegistrationData, value: string | number) => {
    try {
      // Validate selection based on field type
      if (field === 'name' && typeof value === 'string') {
        if (value.trim().length < 1) {
          formErrorHandler.handleValidationError('名前は必須です', field)
          return
        }
        if (value.trim().length > 50) {
          formErrorHandler.handleValidationError('名前は50文字以下で入力してください', field)
          return
        }
      }

      if (field === 'year' && typeof value === 'number') {
        if (value < 1 || value > 6) {
          formErrorHandler.handleValidationError('学年は1年から6年の間で選択してください', field)
          return
        }
      }

      setFormData(prev => ({
        ...prev,
        [field]: value,
        // 上位選択が変更された場合は下位をリセット
        ...(field === 'university' && { faculty: '', department: '' }),
        ...(field === 'faculty' && { department: '' })
      }))

      // Clear any previous errors for this field
      formErrorHandler.clearErrors()
    } catch (error) {
      formErrorHandler.handleSubmissionError(
        error instanceof Error ? error : `${field}の選択中にエラーが発生しました`
      )
    }
  }

  const goToNextStep = () => {
    switch (currentStep) {
      case 'email':
        setCurrentStep('university')
        break
      case 'university':
        setCurrentStep('faculty')
        break
      case 'faculty':
        setCurrentStep('department')
        break
      case 'department':
        setCurrentStep('year')
        break
      case 'year':
        setCurrentStep('name')
        break
      case 'name':
        handleSubmit()
        break
    }
  }

  const goToPrevStep = () => {
    switch (currentStep) {
      case 'university':
        setCurrentStep('email')
        break
      case 'faculty':
        setCurrentStep('university')
        break
      case 'department':
        setCurrentStep('faculty')
        break
      case 'year':
        setCurrentStep('department')
        break
      case 'name':
        setCurrentStep('year')
        break
    }
  }

  const handleSubmit = async () => {
    try {
      // Validate all required fields before submission
      const validationErrors = []
      
      if (!formData.email.trim()) {
        validationErrors.push('メールアドレスが入力されていません')
      }
      if (!formData.password?.trim()) {
        validationErrors.push('パスワードが入力されていません')
      }
      if (!formData.university.trim()) {
        validationErrors.push('大学が選択されていません')
      }
      if (!formData.faculty.trim()) {
        validationErrors.push('学部が選択されていません')
      }
      if (!formData.department.trim()) {
        validationErrors.push('学科が選択されていません')
      }
      if (!formData.name.trim()) {
        validationErrors.push('名前が入力されていません')
      }
      if (formData.year < 1 || formData.year > 6) {
        validationErrors.push('学年が正しく選択されていません')
      }

      if (validationErrors.length > 0) {
        formErrorHandler.handleValidationError(
          `登録情報に不備があります: ${validationErrors.join(', ')}`
        )
        return
      }

      setIsSubmitting(true)

      // Supabase認証でユーザー登録
      const result = await signUp(formData.email)

      if (result.error) {
        formErrorHandler.handleSubmissionError(
          result.error instanceof Error ? result.error : new Error('登録に失敗しました')
        )
        return
      }

      setCurrentStep('complete')

    } catch (error) {
      formErrorHandler.handleSubmissionError(
        error instanceof Error ? error : 'ユーザー登録中にエラーが発生しました'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 'email':
        return formData.email.trim() !== '' && formData.password?.trim() !== ''
      case 'university':
        return formData.university !== ''
      case 'faculty':
        return formData.faculty !== ''
      case 'department':
        return formData.department !== ''
      case 'year':
        return formData.year >= 1 && formData.year <= 6
      case 'name':
        return formData.name.trim() !== ''
      default:
        return false
    }
  }

  const renderStepIndicator = () => {
    const steps = UI_CONFIG.stepIndicator.steps

    const getCurrentStepNumber = () => {
      const stepMap = { email: 1, university: 2, faculty: 3, department: 4, year: 5, name: 6, complete: 7 }
      return stepMap[currentStep] || 1
    }

    const currentStepNumber = getCurrentStepNumber()

    return (
      <nav className="mb-8" aria-label="登録手順">
        <ol className="flex items-center justify-center" role="list">
          {steps.map((step, index) => (
            <li key={step.key} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
                step.number < currentStepNumber
                  ? 'bg-green-500 border-green-500 text-white'
                  : step.number === currentStepNumber
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-gray-100 border-gray-300 text-gray-400'
              }`}
              aria-current={step.number === currentStepNumber ? 'step' : undefined}
              aria-label={`ステップ ${step.number}: ${step.label}${step.number === currentStepNumber ? ' (現在のステップ)' : step.number < currentStepNumber ? ' (完了)' : ' (未完了)'}`}>
                {step.number < currentStepNumber ? (
                  <CheckIcon size={16} aria-hidden={true} />
                ) : (
                  <span className="text-sm font-bold">{step.number}</span>
                )}
              </div>
              <span className={`ml-2 text-sm font-medium ${
                step.number <= currentStepNumber ? 'text-gray-900' : 'text-gray-400'
              }`}>
                {step.label}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-4 ${
                  step.number < currentStepNumber ? 'bg-green-500' : 'bg-gray-300'
                }`} aria-hidden="true" />
              )}
            </li>
          ))}
        </ol>
      </nav>
    )
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 'email':
        return (
          <fieldset>
            <legend className="sr-only">メールアドレスとパスワード入力</legend>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2" id="email-heading">メールアドレスとパスワードを入力してください</h2>
              <p className="text-gray-600 mb-8">アカウント作成のために必要な情報です</p>
            </div>
            
            <div className="max-w-md mx-auto space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  メールアドレス
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleSelection('email', e.target.value)}
                  placeholder="example@university.ac.jp"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white text-lg"
                  autoComplete="email"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  パスワード
                </label>
                <input
                  id="password"
                  type="password"
                  value={formData.password || ''}
                  onChange={(e) => handleSelection('password', e.target.value)}
                  placeholder="8文字以上のパスワード"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white text-lg"
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
                <p className="text-sm text-gray-500 mt-2">8文字以上で入力してください</p>
              </div>
            </div>
          </fieldset>
        )

      case 'university':
        // 名古屋大学に固定
        const nagoyaUniversity = universityDataDetailed.find(u => u.name === '名古屋大学')
        if (!nagoyaUniversity) {
          return <div>名古屋大学のデータが見つかりません</div>
        }
        
        // 自動的に名古屋大学を選択
        if (formData.university !== '名古屋大学') {
          handleSelection('university', '名古屋大学')
        }
        
        return (
          <fieldset>
            <legend className="sr-only">大学確認</legend>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2" id="university-heading">名古屋大学専用サービスです</h2>
              <p className="text-gray-600 mb-8">このサービスは名古屋大学の学生向けの過去問共有サイトです</p>
            </div>
            
            <div className="max-w-md mx-auto">
              <div className="p-6 rounded-xl border-2 border-indigo-500 bg-indigo-50 shadow-lg text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">名古屋大学</h3>
                <p className="text-sm text-gray-600">{nagoyaUniversity.faculties.length}学部</p>
                <div className="mt-4 text-indigo-600 font-medium">✓ 選択済み</div>
              </div>
            </div>
          </fieldset>
        )

      case 'faculty':
        return (
          <div className="text-center">
            <div className="mb-6">
              <span className="text-sm text-indigo-600 font-medium">{formData.university}</span>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">学部を選択してください</h2>
              <p className="text-gray-600 mb-8">所属している学部を教えてください</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {availableFaculties.map(faculty => (
                <button
                  key={faculty.id}
                  onClick={() => handleSelection('faculty', faculty.name)}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-lg ${
                    formData.faculty === faculty.name
                      ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-indigo-300'
                  }`}
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{faculty.name}</h3>
                  <p className="text-sm text-gray-600">{faculty.departments.length}学科</p>
                </button>
              ))}
            </div>
          </div>
        )

      case 'department':
        return (
          <div className="text-center">
            <div className="mb-6">
              <span className="text-sm text-indigo-600 font-medium">{formData.university} / {formData.faculty}</span>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">学科を選択してください</h2>
              <p className="text-gray-600 mb-8">所属している学科を教えてください（未定の場合は「学科未定」を選択）</p>
            </div>
            
            <div className="grid grid-cols-1 gap-3 max-w-2xl mx-auto">
              {availableDepartments.map(department => (
                <button
                  key={department.id}
                  onClick={() => handleSelection('department', department.name)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-md ${
                    formData.department === department.name
                      ? 'border-indigo-500 bg-indigo-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-indigo-300'
                  }`}
                >
                  <h3 className="text-base font-semibold text-gray-900">{department.name}</h3>
                </button>
              ))}
            </div>
          </div>
        )

      case 'year':
        return (
          <div className="text-center">
            <div className="mb-6">
              <span className="text-sm text-indigo-600 font-medium">
                {formData.university} / {formData.faculty} / {formData.department}
              </span>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">学年を選択してください</h2>
              <p className="text-gray-600 mb-8">現在の学年を教えてください</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {UI_CONFIG.yearOptions.map(year => (
                <button
                  key={year.value}
                  onClick={() => handleSelection('year', year.value)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                    formData.year === year.value
                      ? 'border-indigo-500 bg-indigo-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-indigo-300'
                  }`}
                >
                  <h3 className="text-base font-semibold text-gray-900">{year.label}</h3>
                </button>
              ))}
            </div>
          </div>
        )

      case 'name':
        return (
          <div className="text-center">
            <div className="mb-6">
              <span className="text-sm text-indigo-600 font-medium">
                {formData.university} / {formData.faculty} / {formData.department} / {formData.year}年生
              </span>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">最後にお名前を教えてください</h2>
              <p className="text-gray-600 mb-8">本名またはニックネームを入力してください</p>
            </div>
            
            <div className="max-w-md mx-auto space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  お名前（実名）
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleSelection('name', e.target.value)}
                  placeholder="例：山田太郎"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white text-lg"
                  autoFocus
                  required
                />
              </div>
              
              <div>
                <label htmlFor="pen_name" className="block text-sm font-medium text-gray-700 mb-2">
                  ニックネーム（任意）
                </label>
                <input
                  id="pen_name"
                  type="text"
                  value={formData.pen_name || ''}
                  onChange={(e) => handleSelection('pen_name', e.target.value)}
                  placeholder="例：やまだ、太郎くん（空欄の場合は実名を使用）"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white text-lg"
                />
              </div>
            </div>
          </div>
        )

      case 'complete':
        return (
          <div className="text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckIcon size={40} className="text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">登録完了！</h2>
              <p className="text-gray-600 mb-8">
                {formData.name}さん、{APP_CONFIG.name}へようこそ！<br />
                登録したメールアドレスに確認メールを送信しました。<br />
                メール内のリンクをクリックしてアカウントを有効化してください。
              </p>
              
              <div className="bg-gray-50 p-4 rounded-xl mb-8">
                <h3 className="font-semibold text-gray-900 mb-2">登録情報</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>メール: {formData.email}</p>
                  <p>大学: {formData.university}</p>
                  <p>学部: {formData.faculty}</p>
                  <p>学科: {formData.department}</p>
                  <p>学年: {formData.year}年生</p>
                </div>
              </div>
              
              <Link href="/">
                <AnimatedButton variant="primary" size="lg" className="w-full">
                  {MESSAGES.navigation.startUsing}
                </AnimatedButton>
              </Link>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if ((currentStep as Step) === 'complete') {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {renderStepContent()}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main id="main-content" className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* ヘッダー */}
          <div className="text-center mb-12">
            <Link href="/" className="inline-block mb-8 group">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-indigo-600 bg-clip-text text-transparent group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-200">
                過去問<span className="text-indigo-600">hub</span>
              </h1>
            </Link>
            
            <p className="text-gray-600">
              5つのステップであなたの学習環境を設定しましょう
            </p>
          </div>

          {/* ステップインジケーター */}
          {renderStepIndicator()}

          {/* メインコンテンツ */}
          <div className="bg-white/90 backdrop-blur-sm p-8 sm:p-12 rounded-2xl shadow-xl border border-gray-100">
            {renderStepContent()}
            
            {/* ナビゲーションボタン */}
            {(currentStep as Step) !== 'complete' && (
              <div className="flex justify-between items-center mt-12">
                <button
                  onClick={goToPrevStep}
                  disabled={(currentStep as Step) === 'email'}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    (currentStep as Step) === 'email'
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {MESSAGES.navigation.back}
                </button>
                
                <AnimatedButton
                  variant="primary"
                  size="lg"
                  disabled={!isStepValid() || isSubmitting}
                  onClick={goToNextStep}
                  className="flex items-center gap-2"
                >
                  {(currentStep as Step) === 'name' ? (
                    isSubmitting ? MESSAGES.loading.registering : MESSAGES.navigation.complete
                  ) : (
                    <>
                      {MESSAGES.navigation.next}
                      <ArrowRightIcon size={16} />
                    </>
                  )}
                </AnimatedButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}