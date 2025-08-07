'use client'

import { useState } from 'react'
import { universityData } from '@/data/universityData'
import { UserRegistrationData } from '@/types/user'
import { AnimatedButton } from '@/components/ui/MicroInteractions'
import Link from 'next/link'

export default function RegisterPage() {
  const [formData, setFormData] = useState<UserRegistrationData>({
    name: '',
    university: '',
    faculty: '',
    year: 1,
    email: ''
  })
  
  const [errors, setErrors] = useState<Partial<UserRegistrationData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 選択された大学に対応する学部を取得
  const availableFaculties = formData.university 
    ? universityData.find(u => u.name === formData.university)?.faculties || []
    : []

  const handleInputChange = (field: keyof UserRegistrationData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // 大学を変更した場合は学部をリセット
      ...(field === 'university' && { faculty: '' })
    }))
    
    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<UserRegistrationData> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = '名前を入力してください'
    }
    
    if (!formData.university) {
      newErrors.university = '大学を選択してください'
    }
    
    if (!formData.faculty) {
      newErrors.faculty = '学部を選択してください'
    }
    
    if (formData.year < 1 || formData.year > 6) {
      newErrors.year = '学年を正しく選択してください'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    
    try {
      // ここで実際のユーザー登録処理を行う
      // 現在はモックとしてローカルストレージに保存
      const userProfile = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      localStorage.setItem('userProfile', JSON.stringify(userProfile))
      
      // 成功後はトップページにリダイレクト
      window.location.href = '/'
    } catch (error) {
      console.error('Registration failed:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 dark:bg-purple-900/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* ヘッダー */}
          <div className="text-center mb-12">
            <Link href="/" className="inline-block mb-8 group">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-indigo-600 dark:from-gray-100 dark:via-indigo-200 dark:to-indigo-400 bg-clip-text text-transparent group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-200">
                過去問<span className="text-indigo-600 dark:text-indigo-400">hub</span>
              </h1>
            </Link>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              アカウント登録
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              あなたの大学・学部・学年を登録して、パーソナライズされた過去問情報を受け取りましょう
            </p>
          </div>

          {/* 登録フォーム */}
          <form onSubmit={handleSubmit} className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700">
            <div className="space-y-6">
              {/* 名前 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                  名前 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="山田太郎"
                  className={`w-full p-4 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 dark:text-white ${
                    errors.name ? 'border-red-300' : 'border-gray-200 dark:border-gray-600 hover:border-indigo-200'
                  }`}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* 大学 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                  大学 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.university}
                  onChange={(e) => handleInputChange('university', e.target.value)}
                  className={`w-full p-4 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 dark:text-white ${
                    errors.university ? 'border-red-300' : 'border-gray-200 dark:border-gray-600 hover:border-indigo-200'
                  }`}
                >
                  <option value="">大学を選択してください</option>
                  {universityData.map(uni => (
                    <option key={uni.id} value={uni.name}>{uni.name}</option>
                  ))}
                </select>
                {errors.university && (
                  <p className="mt-2 text-sm text-red-600">{errors.university}</p>
                )}
              </div>

              {/* 学部 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                  学部 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.faculty}
                  onChange={(e) => handleInputChange('faculty', e.target.value)}
                  disabled={!formData.university}
                  className={`w-full p-4 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 dark:text-white ${
                    !formData.university ? 'opacity-50 cursor-not-allowed' : ''
                  } ${
                    errors.faculty ? 'border-red-300' : 'border-gray-200 dark:border-gray-600 hover:border-indigo-200'
                  }`}
                >
                  <option value="">学部を選択してください</option>
                  {availableFaculties.map(faculty => (
                    <option key={faculty.id} value={faculty.name}>{faculty.name}</option>
                  ))}
                </select>
                {errors.faculty && (
                  <p className="mt-2 text-sm text-red-600">{errors.faculty}</p>
                )}
                {formData.university && availableFaculties.length === 0 && (
                  <p className="mt-2 text-sm text-gray-500">この大学には学部データがありません</p>
                )}
              </div>

              {/* 学年 */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                  学年 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.year}
                  onChange={(e) => handleInputChange('year', parseInt(e.target.value))}
                  className={`w-full p-4 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 dark:text-white ${
                    errors.year ? 'border-red-300' : 'border-gray-200 dark:border-gray-600 hover:border-indigo-200'
                  }`}
                >
                  <option value={1}>1年生</option>
                  <option value={2}>2年生</option>
                  <option value={3}>3年生</option>
                  <option value={4}>4年生</option>
                  <option value={5}>大学院1年生</option>
                  <option value={6}>大学院2年生</option>
                </select>
                {errors.year && (
                  <p className="mt-2 text-sm text-red-600">{errors.year}</p>
                )}
              </div>

              {/* メールアドレス（任意） */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                  メールアドレス（任意）
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="example@university.ac.jp"
                  className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white dark:bg-gray-700 dark:text-white hover:border-indigo-200"
                />
                <p className="mt-2 text-sm text-gray-500">
                  メールアドレスは通知機能で使用されます（今後実装予定）
                </p>
              </div>
            </div>

            {/* 登録ボタン */}
            <div className="mt-8">
              <AnimatedButton
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
                onClick={() => {}}
              >
                {isSubmitting ? '登録中...' : 'アカウント登録'}
              </AnimatedButton>
            </div>

            <div className="mt-6 text-center">
              <Link href="/" className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 text-sm font-medium">
                ← トップページに戻る
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}