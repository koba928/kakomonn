'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'
import { APP_CONFIG } from '@/constants/app'

// Supabaseクライアント
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type VerificationState = 
  | 'verifying'           // メールリンクを確認中
  | 'new_user_form'       // 初回ユーザー登録フォーム
  | 'existing_user_redirect' // 既存ユーザー→ログイン導線
  | 'expired_or_invalid'  // リンク期限切れ・無効
  | 'error'              // 共通エラー

interface FormData {
  faculty: string
  year: string
  agreeToTerms: boolean
}

function EmailVerifyContent() {
  const { loading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [state, setState] = useState<VerificationState>('verifying')
  const [emailFromQuery, setEmailFromQuery] = useState<string>('')
  const [formData, setFormData] = useState<FormData>({
    faculty: '',
    year: '',
    agreeToTerms: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [redirectCountdown, setRedirectCountdown] = useState(3)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // 名古屋大学の学部データ
  const faculties = [
    '文学部', '教育学部', '法学部', '経済学部', '情報学部',
    '理学部', '医学部', '工学部', '農学部'
  ]

  const years = ['1年', '2年', '3年', '4年']

  // ドメイン制限チェック（開発モードでは制限なし）
  const isValidNagoyaEmail = useCallback((email: string) => {
    // 開発モードまたはテストモードでは全てのドメインを許可
    if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_TEST_MODE === 'true') {
      console.log('🔧 開発/テストモード: ドメイン制限をスキップ')
      return true
    }
    
    const validDomains = ['s.thers.ac.jp', 'nagoya-u.ac.jp', 'i.nagoya-u.ac.jp', 'icloud.com']
    return validDomains.some(domain => email.endsWith('@' + domain))
  }, [])

  // 既存ユーザーのリダイレクトカウントダウン
  const startRedirectCountdown = useCallback(() => {
    const timer = setInterval(() => {
      setRedirectCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          router.push('/search')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  // メイン判定ロジック
  const verifyEmailAndUser = useCallback(async () => {
    console.log('🔍 メール認証プロセス開始')
    
    try {
      // 1. URLクエリからメール取得
      const emailQuery = searchParams.get('email')
      if (!emailQuery) {
        console.error('❌ URLクエリにemailが見つかりません')
        setState('expired_or_invalid')
        return
      }

      setEmailFromQuery(emailQuery)

      // 2. ドメイン制限チェック
      if (!isValidNagoyaEmail(emailQuery)) {
        console.error('❌ 許可されていないドメイン:', emailQuery)
        const isDev = process.env.NODE_ENV === 'development'
        setErrorMessage(
          isDev 
            ? '有効なメールアドレスを入力してください（開発モード）' 
            : '許可されたメールアドレス（@s.thers.ac.jp、@nagoya-u.ac.jp、@i.nagoya-u.ac.jp、@icloud.com）のみ利用可能です'
        )
        setState('error')
        return
      }

      // 3. Supabaseセッション確認（少し待つ）
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !currentUser) {
        console.error('❌ ユーザーセッション取得失敗:', userError)
        setState('expired_or_invalid')
        return
      }

      // 4. メールアドレス突き合わせ
      if (currentUser.email !== emailQuery) {
        console.error('❌ メールアドレス不一致:', {
          userEmail: currentUser.email,
          queryEmail: emailQuery
        })
        setState('expired_or_invalid')
        return
      }

      // 5. メール確認済みチェック
      if (!currentUser.email_confirmed_at) {
        console.error('❌ メール未確認')
        setState('expired_or_invalid')
        return
      }

      console.log('✅ メール認証成功:', {
        userId: currentUser.id,
        email: currentUser.email,
        confirmedAt: currentUser.email_confirmed_at
      })

      // 6. profiles存在チェック
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, faculty, year')
        .eq('id', currentUser.id)
        .single()

      if (profileError && (profileError as any).code !== 'PGRST116') {
        console.error('❌ プロフィール取得エラー:', profileError)
        setState('error')
        setErrorMessage('プロフィール確認中にエラーが発生しました')
        return
      }

      // 7. 初回 vs 既存判定
      if (!profile || (profileError as any)?.code === 'PGRST116') {
        console.log('🆕 初回ユーザー → 登録フォーム表示')
        setState('new_user_form')
      } else {
        console.log('✅ 既存ユーザー → リダイレクト処理')
        setState('existing_user_redirect')
        startRedirectCountdown()
      }

    } catch (error) {
      console.error('❌ 認証プロセスエラー:', error)
      setState('error')
      setErrorMessage('認証中にエラーが発生しました')
    }
  }, [searchParams, isValidNagoyaEmail, startRedirectCountdown])

  // 初期認証プロセス実行
  useEffect(() => {
    if (!authLoading) {
      verifyEmailAndUser()
    }
  }, [authLoading, verifyEmailAndUser])

  // 新規ユーザー登録フォーム送信
  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.faculty || !formData.year || !formData.agreeToTerms) {
      setErrorMessage('すべての項目を入力してください')
      return
    }

    setIsSubmitting(true)
    setErrorMessage('')

    try {
      const { data: currentUser } = await supabase.auth.getUser()
      
      if (!currentUser.user) {
        throw new Error('ユーザーセッションが見つかりません')
      }

      // プロフィール作成
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: currentUser.user.id,
          email: currentUser.user.email,
          university: '名古屋大学',
          faculty: formData.faculty,
          year: formData.year,
          created_at: new Date().toISOString()
        })

      if (insertError) {
        throw insertError
      }

      console.log('✅ プロフィール作成成功')
      setSuccessMessage('登録が完了しました！')
      
      // 少し待ってからアプリへ遷移
      setTimeout(() => {
        router.push('/search')
      }, 2000)

    } catch (error: any) {
      console.error('❌ 登録エラー:', error)
      setErrorMessage(error.message || '登録中にエラーが発生しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  // 認証メール再送
  const handleResendEmail = async () => {
    if (!emailFromQuery) return

    setIsResending(true)
    setErrorMessage('')

    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: emailFromQuery,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/email-verify?email=${encodeURIComponent(emailFromQuery)}`
        }
      })

      if (error) throw error

      setSuccessMessage('認証メールを再送しました。メールをご確認ください。')
    } catch (error: any) {
      console.error('❌ 再送エラー:', error)
      setErrorMessage('メール再送中にエラーが発生しました')
    } finally {
      setIsResending(false)
    }
  }

  // メイン画面レンダリング
  const renderContent = () => {
    switch (state) {
      case 'verifying':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              メールリンクを確認中です...
            </h1>
            <p className="text-gray-600">
              認証情報を確認しています。しばらくお待ちください。
            </p>
          </div>
        )

      case 'new_user_form':
        return (
          <div>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                はじめまして！
              </h1>
              <p className="text-gray-600 mb-4">
                以下を登録すると利用開始できます
              </p>
              
              {/* メールアドレス固定表示 */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  メールアドレス
                </label>
                <div className="text-lg font-mono text-gray-900 bg-white border rounded-md p-3">
                  {emailFromQuery}
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  ✅ 認証済み（編集不可）
                </p>
              </div>
            </div>

            <form onSubmit={handleRegistration} className="space-y-6">
              {/* 学部選択 */}
              <div>
                <label htmlFor="faculty" className="block text-sm font-medium text-gray-700 mb-2">
                  学部 <span className="text-red-500">*</span>
                </label>
                <select
                  id="faculty"
                  value={formData.faculty}
                  onChange={(e) => setFormData(prev => ({ ...prev, faculty: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">学部を選択してください</option>
                  {faculties.map(faculty => (
                    <option key={faculty} value={faculty}>{faculty}</option>
                  ))}
                </select>
              </div>

              {/* 学年選択 */}
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                  学年 <span className="text-red-500">*</span>
                </label>
                <select
                  id="year"
                  value={formData.year}
                  onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                >
                  <option value="">学年を選択してください</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              {/* 利用規約同意 */}
              <div className="flex items-start space-x-3">
                <input
                  id="agree"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={(e) => setFormData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                  className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  required
                />
                <label htmlFor="agree" className="text-sm text-gray-700">
                  <Link href="/terms" className="text-indigo-600 hover:underline">利用規約</Link>
                  および
                  <Link href="/privacy" className="text-indigo-600 hover:underline">プライバシーポリシー</Link>
                  に同意します <span className="text-red-500">*</span>
                </label>
              </div>

              {/* 送信ボタン */}
              <button
                type="submit"
                disabled={isSubmitting || !formData.faculty || !formData.year || !formData.agreeToTerms}
                className={`w-full px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isSubmitting || !formData.faculty || !formData.year || !formData.agreeToTerms
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 hover:scale-105 active:scale-95'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    登録中...
                  </div>
                ) : (
                  '登録してはじめる'
                )}
              </button>
            </form>
          </div>
        )

      case 'existing_user_redirect':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              既に登録済みです
            </h1>
            <p className="text-gray-600 mb-6">
              ログインへ移動します...（{redirectCountdown}秒）
            </p>
            
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${((3 - redirectCountdown) / 3) * 100}%` }}
              ></div>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => router.push('/search')}
                className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 hover:scale-105 active:scale-95"
              >
                今すぐ移動
              </button>
              
              <Link
                href="/auth/email"
                className="block w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors text-center"
              >
                ログイン画面へ
              </Link>
            </div>
          </div>
        )

      case 'expired_or_invalid':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              リンクが無効または期限切れです
            </h1>
            <p className="text-gray-600 mb-6">
              認証メールを再送しますか？
            </p>
            
            {emailFromQuery && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-gray-700">送信先：</p>
                <p className="font-mono text-gray-900">{emailFromQuery}</p>
              </div>
            )}

            <div className="space-y-4">
              <button
                onClick={handleResendEmail}
                disabled={isResending}
                className={`w-full px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isResending
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-600 hover:to-purple-700 hover:scale-105 active:scale-95'
                }`}
              >
                {isResending ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    再送信中...
                  </div>
                ) : (
                  '認証メールを再送'
                )}
              </button>
              
              <Link
                href="/signup"
                className="block w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors text-center"
              >
                新規登録画面に戻る
              </Link>
            </div>
          </div>
        )

      case 'error':
        return (
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              エラーが発生しました
            </h1>
            <p className="text-gray-600 mb-6">
              {errorMessage || '予期しないエラーが発生しました'}
            </p>
            
            <Link
              href="/signup"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              新規登録画面に戻る
            </Link>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100">
          {/* ヘッダー */}
          <div className="text-center mb-8">
            <Link 
              href="/" 
              className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 inline-block"
            >
              {APP_CONFIG.name}
            </Link>
          </div>

          {/* メッセージ表示 */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm mb-6">
              {successMessage}
            </div>
          )}

          {/* メインコンテンツ */}
          {renderContent()}
        </div>
      </div>
    </main>
  )
}

export default function EmailVerifyPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            メールリンクを確認中です...
          </h1>
          <p className="text-gray-600">
            認証情報を確認しています。しばらくお待ちください。
          </p>
        </div>
      </main>
    }>
      <EmailVerifyContent />
    </Suspense>
  )
}