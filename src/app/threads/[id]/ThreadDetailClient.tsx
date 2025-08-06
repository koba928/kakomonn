'use client'

import { useState } from 'react'

interface Comment {
  id: string
  content: string
  author: string
  createdAt: string
  likes: number
}

interface ThreadDetailClientProps {
  initialComments: Comment[]
}

export default function ThreadDetailClient({ initialComments }: ThreadDetailClientProps) {
  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState<Comment[]>(initialComments)

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
    <>
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
    </>
  )
}