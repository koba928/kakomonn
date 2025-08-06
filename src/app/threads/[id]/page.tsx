'use client'

import Link from 'next/link'
import { useState } from 'react'

interface Comment {
  id: string
  content: string
  author: string
  createdAt: string
  likes: number
}

interface Thread {
  id: string
  title: string
  content: string
  author: string
  course: string
  university: string
  faculty: string
  createdAt: string
  examYear?: number
  fileUrl?: string
  fileName?: string
}

const mockThread: Thread = {
  id: '1',
  title: 'マクロ経済学 2024年期末試験について',
  content: `来週のマクロ経済学の期末試験、過去問と傾向が似てるかな？

田中教授のマクロ経済学は毎年以下のような構成になってます：
- IS-LMモデル（必出）
- AD-ASモデル
- 財政政策・金融政策の効果
- 開放経済のモデル

特にIS-LMモデルは確実に出るので、グラフの描き方と移動の理由をしっかり覚えておいた方がいいと思います。

2023年の過去問も添付しておくので参考にしてください！`,
  author: '経済3年',
  course: 'マクロ経済学',
  university: '東京大学',
  faculty: '経済学部',
  createdAt: '2024-01-15',
  examYear: 2024,
  fileUrl: '/mock-exam-2023.pdf',
  fileName: '2023年度_マクロ経済学_期末試験.pdf'
}

const mockComments: Comment[] = [
  {
    id: '1',
    content: 'ありがとうございます！IS-LMモデル、グラフの移動パターンをもう一度整理しておきます。',
    author: '経済2年',
    createdAt: '2024-01-15 10:30',
    likes: 5
  },
  {
    id: '2',
    content: '田中教授の試験、計算問題も出ますよね？数値を使ったIS-LM分析とかも準備した方がいいかも。',
    author: '経済3年',
    createdAt: '2024-01-15 11:15',
    likes: 8
  },
  {
    id: '3',
    content: '去年受けました！開放経済モデルも結構重要でした。BP曲線との関係も押さえておくといいです。',
    author: '経済4年',
    createdAt: '2024-01-15 14:20',
    likes: 12
  },
  {
    id: '4',
    content: 'ファイルありがとうございます。参考にさせていただきます。財政政策の乗数効果も覚え直します！',
    author: '経済2年',
    createdAt: '2024-01-15 16:45',
    likes: 3
  }
]

export default function ThreadDetailPage({ params }: { params: { id: string } }) {
  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState<Comment[]>(mockComments)

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      author: '匿名ユーザー',
      createdAt: new Date().toLocaleString('ja-JP'),
      likes: 0
    }

    setComments([...comments, comment])
    setNewComment('')
  }

  const handleLike = (commentId: string) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ))
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                過去問<span className="text-indigo-600">hub</span>
              </h1>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link 
                href="/threads" 
                className="text-gray-600 hover:text-gray-900"
              >
                ← スレッド一覧に戻る
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* スレッド本文 */}
        <div className="bg-white p-8 rounded-lg shadow mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
              {mockThread.university}
            </span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
              {mockThread.faculty}
            </span>
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
              {mockThread.course}
            </span>
            {mockThread.examYear && (
              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                {mockThread.examYear}年度
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {mockThread.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
            <span>投稿者: {mockThread.author}</span>
            <span>投稿日: {mockThread.createdAt}</span>
          </div>

          <div className="prose max-w-none text-gray-700 mb-6">
            {mockThread.content.split('\n').map((line, index) => (
              <p key={index} className="mb-2">
                {line}
              </p>
            ))}
          </div>

          {/* 添付ファイル */}
          {mockThread.fileUrl && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-3">添付ファイル</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-red-100 p-2 rounded">
                    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{mockThread.fileName}</p>
                    <p className="text-sm text-gray-500">PDF形式 - 勉強記録</p>
                  </div>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                    ダウンロード
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* コメント投稿フォーム */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold mb-4">コメントを投稿</h3>
          <form onSubmit={handleSubmitComment} className="space-y-4">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="このスレッドについてコメントする..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={4}
              required
            />
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                コメント投稿
              </button>
            </div>
          </form>
        </div>

        {/* コメント一覧 */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-gray-900">
            コメント ({comments.length}件)
          </h3>
          
          {comments.map((comment) => (
            <div key={comment.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-600">
                      {comment.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{comment.author}</p>
                    <p className="text-sm text-gray-500">{comment.createdAt}</p>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">{comment.content}</p>
              
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleLike(comment.id)}
                  className="flex items-center gap-1 text-gray-500 hover:text-indigo-600 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{comment.likes}</span>
                </button>
                
                <button className="text-gray-500 hover:text-gray-700 transition-colors">
                  返信
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}