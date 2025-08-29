'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { api } from '@/services/api'
import { AnimatedButton } from '@/components/ui/MicroInteractions'

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

interface EditExamPageProps {
  params: { id: string }
}

export default function EditExamPage({ params }: EditExamPageProps) {
  const { id } = params
  const { user } = useAuth()
  const router = useRouter()
  const [exam, setExam] = useState<PastExam | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  // フォームの状態
  const [formData, setFormData] = useState({
    title: '',
    course_name: '',
    professor: '',
    year: new Date().getFullYear(),
    semester: '',
    exam_type: '',
    tags: [] as string[]
  })
  const [newTag, setNewTag] = useState('')

  useEffect(() => {
    const loadExam = async () => {
      try {
        setIsLoading(true)
        const examData = await api.pastExams.getById(id)
        if (!examData) {
          setError('過去問が見つかりません')
          return
        }

        // 投稿者本人かチェック
        if (examData.uploaded_by !== user?.id) {
          setError('この過去問を編集する権限がありません')
          return
        }

        setExam(examData)
        setFormData({
          title: examData.title,
          course_name: examData.course_name,
          professor: examData.professor,
          year: examData.year,
          semester: examData.semester,
          exam_type: examData.exam_type,
          tags: examData.tags || []
        })
      } catch (error) {
        console.error('過去問取得エラー:', error)
        setError('過去問の取得に失敗しました')
      } finally {
        setIsLoading(false)
      }
    }

    if (user?.id) {
      loadExam()
    }
  }, [id, user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const handleSave = async () => {
    if (!exam) return

    try {
      setIsSaving(true)
      setError('')

      // バリデーション
      if (!formData.title.trim() || !formData.course_name.trim() || !formData.professor.trim()) {
        setError('タイトル、授業名、教授名は必須です')
        return
      }

      const updateData = {
        title: formData.title.trim(),
        course_name: formData.course_name.trim(),
        professor: formData.professor.trim(),
        year: formData.year,
        semester: formData.semester,
        exam_type: formData.exam_type,
        tags: formData.tags,
        updated_at: new Date().toISOString()
      }

      const result = await api.pastExams.update(exam.id, updateData)
      
      // 成功メッセージを表示してリダイレクト
      alert('過去問を更新しました')
      router.push(`/exams/${exam.id}`)
    } catch (error) {
      console.error('更新エラー:', error)
      if (error instanceof Error) {
        setError(`更新に失敗しました: ${error.message}`)
      } else {
        setError('更新に失敗しました')
      }
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">エラー</h1>
          <p className="text-red-600 mb-4">{error}</p>
          <Link href="/profile" className="text-indigo-600 hover:text-indigo-700">
            マイページに戻る
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center">
              <Link 
                href={`/exams/${id}`} 
                className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors mr-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <h1 className="text-xl font-bold text-gray-900">過去問を編集</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">過去問情報を編集</h2>

          <div className="space-y-6">
            {/* タイトル */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                タイトル <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="例: 2024年度春学期期末試験"
              />
            </div>

            {/* 授業名 */}
            <div>
              <label htmlFor="course_name" className="block text-sm font-medium text-gray-700 mb-2">
                授業名 <span className="text-red-500">*</span>
              </label>
              <input
                id="course_name"
                name="course_name"
                type="text"
                value={formData.course_name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="例: 線形代数学"
              />
            </div>

            {/* 教授名 */}
            <div>
              <label htmlFor="professor" className="block text-sm font-medium text-gray-700 mb-2">
                教授名 <span className="text-red-500">*</span>
              </label>
              <input
                id="professor"
                name="professor"
                type="text"
                value={formData.professor}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="例: 田中太郎"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 年度 */}
              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                  年度
                </label>
                <select
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() - i
                    return (
                      <option key={year} value={year}>
                        {year}年度
                      </option>
                    )
                  })}
                </select>
              </div>

              {/* 学期 */}
              <div>
                <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-2">
                  学期
                </label>
                <select
                  id="semester"
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">選択してください</option>
                  <option value="春学期">春学期</option>
                  <option value="秋学期">秋学期</option>
                  <option value="通年">通年</option>
                  <option value="集中">集中講義</option>
                </select>
              </div>
            </div>

            {/* 試験種別 */}
            <div>
              <label htmlFor="exam_type" className="block text-sm font-medium text-gray-700 mb-2">
                試験種別
              </label>
              <select
                id="exam_type"
                name="exam_type"
                value={formData.exam_type}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">選択してください</option>
                <option value="期末試験">期末試験</option>
                <option value="中間試験">中間試験</option>
                <option value="小テスト">小テスト</option>
                <option value="レポート">レポート</option>
                <option value="その他">その他</option>
              </select>
            </div>

            {/* タグ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                タグ
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-indigo-600 hover:text-indigo-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="タグを入力"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddTag()
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  追加
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {/* 保存ボタン */}
            <div className="flex justify-end space-x-4 pt-6">
              <Link
                href={`/exams/${id}`}
                className="px-6 py-3 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                キャンセル
              </Link>
              <AnimatedButton
                variant="primary"
                size="lg"
                onClick={handleSave}
                disabled={isSaving}
                className="min-w-[120px]"
              >
                {isSaving ? '保存中...' : '保存する'}
              </AnimatedButton>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}