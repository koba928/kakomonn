'use client'

import Link from 'next/link'
import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'
import { AnimatedButton } from '@/components/ui/MicroInteractions'
import { AcademicInfoSelector, AcademicInfo } from '@/components/ui/AcademicInfoSelector'
import { VirtualizedAutocompleteSelect } from '@/components/ui/VirtualizedAutocompleteSelect'
import { useAuth } from '@/hooks/useAuth'

type Step = 'university' | 'faculty' | 'department' | 'year' | 'penname'

function UniversityInfoPageContent() {
  const { user, updateProfile } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState<Step>('university')
  const [redirectUrl, setRedirectUrl] = useState('/search')
  const [academicInfo, setAcademicInfo] = useState<AcademicInfo>({
    university: '',
    faculty: '',
    department: ''
  })
  const [year, setYear] = useState('')
  const [penName, setPenName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // リダイレクトパラメータを取得
    const redirect = searchParams.get('redirect')
    if (redirect) {
      setRedirectUrl(redirect)
    }
    
    // 既に大学情報が完了しているかチェック
    const checkExistingInfo = async () => {
      // Supabaseのユーザー情報を確認
      if (user && user.university && user.university !== '未設定') {
        // 大学情報が既に登録済みなら指定されたページへ
        router.push(redirect || '/search')
        return
      }
      
      // localStorageも確認（互換性のため）
      const savedUserInfo = localStorage.getItem('kakomonn_user')
      if (savedUserInfo) {
        try {
          const parsed = JSON.parse(savedUserInfo)
          if (parsed.university && parsed.faculty && parsed.department && parsed.universityInfoCompleted) {
            router.push(redirect || '/search')
            return
          }
        } catch (error) {
          console.error('Failed to parse user info:', error)
        }
      }
      
      setIsChecking(false)
    }

    checkExistingInfo()
  }, [user, searchParams])

  // チェック中はローディング表示
  if (isChecking) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">確認中...</p>
        </div>
      </main>
    )
  }

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

    try {
      // Supabaseに大学情報を保存
      const yearNumber = year.includes('1') ? 1 : 
                        year.includes('2') ? 2 : 
                        year.includes('3') ? 3 : 
                        year.includes('4') ? 4 : 1
      
      const { error } = await updateProfile({
        university: academicInfo.university,
        faculty: academicInfo.faculty,
        department: academicInfo.department,
        year: yearNumber,
        pen_name: penName || '匿名さん'
      })

      if (error) {
        console.error('プロフィール更新エラー:', error)
      }

      // localStorageにも保存（互換性のため）
      const userInfo = {
        ...academicInfo,
        year,
        penName: penName || '匿名さん',
        isLoggedIn: true,
        completedAt: new Date().toISOString(),
        universityInfoCompleted: true
      }
      
      localStorage.setItem('kakomonn_user', JSON.stringify(userInfo))

      setTimeout(() => {
        setIsLoading(false)
        router.push(redirectUrl)
      }, 1500)
    } catch (err) {
      console.error('完了処理エラー:', err)
      setIsLoading(false)
    }
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

  const renderYearSelection = () => {
    const yearOptions = [
      { value: '1年生', label: '1年生' },
      { value: '2年生', label: '2年生' },
      { value: '3年生', label: '3年生' },
      { value: '4年生', label: '4年生' },
      { value: '大学院生', label: '大学院生' },
      { value: 'その他', label: 'その他' }
    ]
    
    return (
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

        <VirtualizedAutocompleteSelect
          options={yearOptions}
          value={year}
          onChange={setYear}
          placeholder="学年を選択してください"
        />
      </div>
    )
  }

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
          {penName ? `${penName.length}/20文字` : '空欄の場合は「匿名さん」として表示されます'}
        </p>
      </div>

      {/* プレビュー */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-900 mb-2">プロフィールプレビュー</h4>
        <div className="space-y-2 text-sm text-gray-600">
          <p><strong>表示名:</strong> {penName || '匿名さん'}</p>
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
              className={currentStep === 'university' ? 'w-full' : 'flex-1'}
              aria-label={currentStep === 'penname' ? '完了' : '次の手順に進む'}
            >
              {isLoading ? '完了中...' : currentStep === 'penname' ? '完了' : '次へ'}
            </AnimatedButton>
          </div>

          {/* ログインページに戻るリンク（最初のステップのみ表示） */}
          {currentStep === 'university' && (
            <div className="text-center">
              <Link 
                href="/auth/email"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                ← ログインに戻る
              </Link>
            </div>
          )}

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

export default function UniversityInfoPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </main>
    }>
      <UniversityInfoPageContent />
    </Suspense>
  )
}