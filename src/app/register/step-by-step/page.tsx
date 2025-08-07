'use client'

import { useState, useMemo } from 'react'
import { universityDataDetailed, getDepartmentsByFaculty } from '@/data/universityDataDetailed'
import { UserRegistrationData } from '@/types/user'
import { AnimatedButton } from '@/components/ui/MicroInteractions'
import Link from 'next/link'
import { ArrowRightIcon, CheckIcon } from '@/components/icons/IconSystem'

type Step = 'university' | 'faculty' | 'department' | 'year' | 'name' | 'complete'

export default function StepByStepRegisterPage() {
  const [currentStep, setCurrentStep] = useState<Step>('university')
  const [formData, setFormData] = useState<UserRegistrationData>({
    name: '',
    university: '',
    faculty: '',
    department: '',
    year: 1,
    email: ''
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
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // 上位選択が変更された場合は下位をリセット
      ...(field === 'university' && { faculty: '', department: '' }),
      ...(field === 'faculty' && { department: '' })
    }))
  }

  const goToNextStep = () => {
    switch (currentStep) {
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
    setIsSubmitting(true)
    
    try {
      const userProfile = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      localStorage.setItem('userProfile', JSON.stringify(userProfile))
      setCurrentStep('complete')
    } catch (error) {
      console.error('Registration failed:', error)
    } finally {
      setIsSubmitting(false)
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
      case 'year':
        return formData.year >= 1 && formData.year <= 6
      case 'name':
        return formData.name.trim() !== ''
      default:
        return false
    }
  }

  const renderStepIndicator = () => {
    const steps = [
      { key: 'university', label: '大学', number: 1 },
      { key: 'faculty', label: '学部', number: 2 },
      { key: 'department', label: '学科', number: 3 },
      { key: 'year', label: '学年', number: 4 },
      { key: 'name', label: '名前', number: 5 }
    ]

    const getCurrentStepNumber = () => {
      const stepMap = { university: 1, faculty: 2, department: 3, year: 4, name: 5, complete: 6 }
      return stepMap[currentStep] || 1
    }

    const currentStepNumber = getCurrentStepNumber()

    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200 ${
              step.number < currentStepNumber
                ? 'bg-green-500 border-green-500 text-white'
                : step.number === currentStepNumber
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'bg-gray-100 border-gray-300 text-gray-400'
            }`}>
              {step.number < currentStepNumber ? (
                <CheckIcon size={16} />
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
              }`} />
            )}
          </div>
        ))}
      </div>
    )
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 'university':
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">あなたの大学を選択してください</h2>
            <p className="text-gray-600 mb-8">まずは通っている大学を教えてください</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {universityDataDetailed.map(university => (
                <button
                  key={university.id}
                  onClick={() => handleSelection('university', university.name)}
                  className={`p-6 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-lg ${
                    formData.university === university.name
                      ? 'border-indigo-500 bg-indigo-50 shadow-lg'
                      : 'border-gray-200 bg-white hover:border-indigo-300'
                  }`}
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{university.name}</h3>
                  <p className="text-sm text-gray-600">{university.faculties.length}学部</p>
                </button>
              ))}
            </div>
          </div>
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
              {[
                { value: 1, label: '1年生' },
                { value: 2, label: '2年生' },
                { value: 3, label: '3年生' },
                { value: 4, label: '4年生' },
                { value: 5, label: '大学院1年' },
                { value: 6, label: '大学院2年' }
              ].map(year => (
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
              <p className="text-gray-600 mb-8">ニックネームでも構いません</p>
            </div>
            
            <div className="max-w-md mx-auto">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleSelection('name', e.target.value)}
                placeholder="例：山田太郎"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white text-center text-lg"
                autoFocus
              />
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
                {formData.name}さん、過去問hubへようこそ！<br />
                {formData.university} {formData.faculty}の情報を中心にパーソナライズされたコンテンツをお届けします。
              </p>
              
              <div className="bg-gray-50 p-4 rounded-xl mb-8">
                <h3 className="font-semibold text-gray-900 mb-2">登録情報</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{formData.university}</p>
                  <p>{formData.faculty}</p>
                  <p>{formData.department}</p>
                  <p>{formData.year}年生</p>
                </div>
              </div>
              
              <Link href="/">
                <AnimatedButton variant="primary" size="lg" className="w-full">
                  過去問hubを使い始める
                </AnimatedButton>
              </Link>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  if (currentStep === 'complete') {
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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden">
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
            {currentStep !== 'complete' && (
              <div className="flex justify-between items-center mt-12">
                <button
                  onClick={goToPrevStep}
                  disabled={currentStep === 'university'}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    currentStep === 'university'
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  戻る
                </button>
                
                <AnimatedButton
                  variant="primary"
                  size="lg"
                  disabled={!isStepValid() || isSubmitting}
                  onClick={goToNextStep}
                  className="flex items-center gap-2"
                >
                  {currentStep === 'name' ? (
                    isSubmitting ? '登録中...' : '登録完了'
                  ) : (
                    <>
                      次へ
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