import Link from 'next/link'
import ExamDetailClient from './ExamDetailClient'
import { api } from '@/services/api'

export default async function ExamDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  
  // 過去問詳細取得
  let examData = null
  let initialComments = []
  
  try {
    const exam = await api.pastExams.getById(id)
    if (exam) {
      examData = exam
      
      // コメント取得
      const comments = await api.pastExamComments.getByPastExamId(id)
      initialComments = comments
    }
  } catch (error) {
    console.error('過去問データ取得エラー:', error)
  }

  if (!examData) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">過去問が見つかりません</h1>
          <Link href="/search" className="text-indigo-600 hover:text-indigo-700">
            検索に戻る
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
          <div className="flex items-center h-14">
            <Link 
              href="/search" 
              className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors mr-8"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">過去問詳細</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Exam Details */}
        <div className="bg-white border-b border-gray-200">
          <div className="p-6">
            {/* University & Course Info */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                {examData.university}
              </span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                {examData.faculty}
              </span>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                {examData.course_name}
              </span>
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                {examData.professor}
              </span>
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                {examData.year}年度 {examData.semester}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {examData.title}
            </h2>

            {/* File Download */}
            <div className="border border-gray-200 rounded-xl p-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{examData.file_name}</p>
                  <p className="text-sm text-gray-500">
                    {examData.download_count || 0}回ダウンロード • 
                    難易度: {'★'.repeat(examData.difficulty || 3)}
                  </p>
                </div>
                <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                  ダウンロード
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-6 text-sm text-gray-500 border-t border-gray-200 pt-4">
              <span>{examData.download_count || 0}回ダウンロード</span>
              <span>投稿日: {new Date(examData.created_at).toLocaleDateString('ja-JP')}</span>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <ExamDetailClient examData={examData} initialComments={initialComments} />
      </div>
    </main>
  )
}