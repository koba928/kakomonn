'use client'

import Link from 'next/link'
import { useState } from 'react'
import { AnimatedButton } from '@/components/ui/MicroInteractions'
import { AcademicInfoSelector, AcademicInfo } from '@/components/ui/AcademicInfoSelector'

type Step = 'university' | 'faculty' | 'department' | 'year' | 'penname'

export default function UniversityInfoPage() {
  const [currentStep, setCurrentStep] = useState<Step>('university')
  const [academicInfo, setAcademicInfo] = useState<AcademicInfo>({
    university: '',
    faculty: '',
    department: ''
  })
  const [year, setYear] = useState('')
  const [penName, setPenName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleAcademicInfoChange = (newInfo: AcademicInfo) => {
    setAcademicInfo(newInfo)
  }

  const handleNext = () => {
    switch (currentStep) {
      case 'university':
        if (academicInfo.university) setCurrentStep('faculty')
        break
      case 'faculty':
        if (academicInfo.faculty) setCurrentStep('department')
        break
      case 'department':
        if (academicInfo.department) setCurrentStep('year')
        break
      case 'year':
        setCurrentStep('penname')
        break
      case 'penname':
        handleComplete()
        break
    }
  }

  const handleBack = () => {
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
      case 'penname':
        setCurrentStep('year')
        break
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)

    // デモ用：ユーザー情報をlocalStorageに保存
    const userInfo = {
      ...academicInfo,
      year,
      penName,
      isLoggedIn: true,
      completedAt: new Date().toISOString()
    }
    
    localStorage.setItem('kakomonn_user', JSON.stringify(userInfo))

    setTimeout(() => {
      setIsLoading(false)
      // 検索ページに遷移（大学情報で最適化される）
      window.location.href = '/search'
    }, 1500)
  }

  const canProceed = () => {
    switch (currentStep) {
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

  const getStepNumber = () => {
    const stepMap: Record<Step, number> = {
      university: 1,
      faculty: 2,
      department: 3,
      year: 4,
      penname: 5
    }
    return stepMap[currentStep]
  }

  const renderYearSelection = () => (
    <div className="space-y-6">
      {/* ステップインジケーター */}
      <div className="flex justify-center mb-6">
        <div className="flex space-x-2">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i + 1 <= getStepNumber() ? 'bg-indigo-600' : 'bg-gray-300'
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
        <h2 className="text-2xl font-bold text-gray-900 mb-2">学年を選択してください</h2>
        <p className="text-gray-600">現在の学年を教えてください</p>
      </div>

      <div className="space-y-3">
        {['1年生', '2年生', '3年生', '4年生', '大学院生', 'その他'].map((yearOption) => (
          <button
            key={yearOption}
            onClick={() => setYear(yearOption)}
            className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
              year === yearOption
                ? 'border-indigo-500 bg-indigo-50 shadow-md'
                : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">{yearOption}</span>
              <div className={`w-5 h-5 rounded-full border-2 transition-colors ${
                year === yearOption
                  ? 'border-indigo-500 bg-indigo-500'
                  : 'border-gray-300'
              }`}>
                {year === yearOption && (
                  <div className="w-full h-full rounded-full bg-indigo-500 flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )

  const renderPenNameInput = () => (
    <div className="space-y-6">
      {/* ステップインジケーター */}
      <div className="flex justify-center mb-6">
        <div className="flex space-x-2">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i + 1 <= getStepNumber() ? 'bg-indigo-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">ペンネームを設定（任意）</h2>
        <p className="text-gray-600">投稿時に表示される名前です。後から変更できます</p>
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
          {penName ? `${penName.length}/20文字` : '空欄の場合は「匿名ユーザー」として表示されます'}
        </p>
      </div>

      {/* プレビュー */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">プロフィールプレビュー</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <p><strong>表示名:</strong> {penName || '匿名ユーザー'}</p>
          <p><strong>所属:</strong> {academicInfo.university} {academicInfo.faculty} {academicInfo.department}</p>
          <p><strong>学年:</strong> {year}</p>
        </div>
      </div>
    </div>
  )

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <Link 
            href="/" 
            className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 inline-block"
          >
            KakoMoNN
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            大学情報を入力
          </h1>
          <p className="text-gray-600">
            あなたに最適化された情報を表示するために入力してください
          </p>
        </div>

        {/* メインコンテンツ */}
        <div className="space-y-8">
          {currentStep === 'year' ? renderYearSelection() :
           currentStep === 'penname' ? renderPenNameInput() :
           <AcademicInfoSelector
             value={academicInfo}
             onChange={handleAcademicInfoChange}
             currentStep={currentStep as 'university' | 'faculty' | 'department'}
             showSteps={true}
           />}

          {/* ナビゲーションボタン */}
          <div className="flex gap-3">
            {currentStep !== 'university' && (
              <AnimatedButton
                variant="secondary"
                size="lg"
                onClick={handleBack}
                className="flex-1"
                aria-label="前の手順に戻る"
              >
                戻る
              </AnimatedButton>
            )}
            
            <AnimatedButton
              variant="primary"
              size="lg"
              onClick={handleNext}
              disabled={!canProceed() || isLoading}
              className="flex-1"
              aria-label={currentStep === 'penname' ? '完了' : '次の手順に進む'}
            >
              {isLoading ? '完了中...' : currentStep === 'penname' ? '完了' : '次へ'}
            </AnimatedButton>
          </div>

          {/* 進捗情報 */}
          <div className="text-center text-sm text-gray-500">
            {getStepNumber()}/5 完了 
            {currentStep === 'penname' && (
              <span className="text-indigo-600 ml-2">もう少しです！</span>
            )}
          </div>
        </div>

        {/* デモ情報 */}
        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">🚧 デモモード</h4>
          <p className="text-xs text-yellow-700">
            現在はデモ版です。入力された情報はブラウザ内にのみ保存されます。
          </p>
        </div>
      </div>
    </main>
  )
}