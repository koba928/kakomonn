'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function UploadPage() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    course: '',
    university: '',
    faculty: '',
    examYear: '',
    examType: 'midterm',
    author: ''
  })
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // デモ用の処理
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    alert('勉強記録を投稿しました！（デモ）')
    
    // フォームリセット
    setFormData({
      title: '',
      content: '',
      course: '',
      university: '',
      faculty: '',
      examYear: '',
      examType: 'midterm',
      author: ''
    })
    setSelectedFile(null)
    setIsSubmitting(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 relative">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <nav className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-gray-200 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center group">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-indigo-600 bg-clip-text text-transparent group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-200">
                過去問<span className="text-indigo-600">hub</span>
              </h1>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link 
                href="/threads" 
                className="group flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors font-medium"
              >
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                スレッド一覧に戻る
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-lg border border-gray-100">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 w-6 h-6 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              新しい勉強記録
            </div>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-indigo-800 to-indigo-600 bg-clip-text text-transparent">
              勉強記録を投稿
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              手書きノートや勉強記録をシェアして、全国の大学生同士で学び合いましょう
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 基本情報 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  大学名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="university"
                  value={formData.university}
                  onChange={handleInputChange}
                  placeholder="例: 東京大学"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white hover:border-indigo-200 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  学部 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="faculty"
                  value={formData.faculty}
                  onChange={handleInputChange}
                  placeholder="例: 経済学部"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white hover:border-indigo-200 font-medium"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  授業名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  placeholder="例: マクロ経済学"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white hover:border-indigo-200 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  年度
                </label>
                <input
                  type="number"
                  name="examYear"
                  value={formData.examYear}
                  onChange={handleInputChange}
                  placeholder="例: 2024"
                  min="2020"
                  max="2030"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white hover:border-indigo-200 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  試験種別
                </label>
                <select
                  name="examType"
                  value={formData.examType}
                  onChange={handleInputChange}
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white hover:border-indigo-200 font-medium"
                >
                  <option value="midterm">中間試験</option>
                  <option value="final">期末試験</option>
                  <option value="quiz">小テスト</option>
                  <option value="report">レポート</option>
                  <option value="other">その他</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">
                  投稿者名（任意）
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleInputChange}
                  placeholder="例: 経済3年"
                  className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white hover:border-indigo-200 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                タイトル <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="例: マクロ経済学 2024年期末試験について"
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white hover:border-indigo-200 font-medium text-lg"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                内容・説明 <span className="text-red-500">*</span>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="試験の傾向、注意点、勉強方法などを詳しく書いてください..."
                className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white hover:border-indigo-200 resize-none font-medium leading-relaxed"
                rows={8}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">
                勉強記録ファイル（任意）
              </label>
              <div className="border-2 border-dashed border-indigo-200 rounded-2xl p-8 hover:border-indigo-300 transition-colors bg-gradient-to-br from-indigo-50 to-purple-50">
                <div className="text-center">
                  <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div className="flex justify-center text-lg text-gray-600 mb-4">
                    <label className="relative cursor-pointer bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                      <span>ファイルを選択</span>
                      <input
                        type="file"
                        className="sr-only"
                        onChange={handleFileChange}
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                      />
                    </label>
                  </div>
                  <p className="text-gray-600 mb-2">またはドラッグ&ドロップ</p>
                  <p className="text-sm text-gray-500 font-medium">
                    PDF, JPG, PNG, DOC形式 (最大10MB)
                  </p>
                  
                  {selectedFile && (
                    <div className="mt-6 p-4 bg-white rounded-xl border border-indigo-100 shadow-md">
                      <div className="flex items-center gap-3">
                        <div className="bg-gradient-to-br from-green-400 to-green-600 w-10 h-10 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="text-left flex-1">
                          <p className="text-sm font-bold text-gray-900">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            サイズ: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-6">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-yellow-800 mb-2">著作権について</h4>
                  <p className="text-sm text-yellow-800 leading-relaxed">
                    実際の試験問題ではなく、<strong>手書きノートや勉強記録</strong>をアップロードしてください。著作権に配慮し、学習コミュニティの発展に貢献できるコンテンツの共有をお願いします。
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <Link
                href="/threads"
                className="group flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                キャンセル
              </Link>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="group bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-10 py-4 rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-3 text-lg"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    投稿中...
                  </>
                ) : (
                  <>
                    勉強記録を投稿
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

    </main>
  )
}