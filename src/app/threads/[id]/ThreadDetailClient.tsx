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
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900">コメントを投稿</h3>
        </div>
        <form onSubmit={handleSubmitComment} className="space-y-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="このスレッドについてコメントする..."
            className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white hover:border-indigo-200 resize-none"
            rows={4}
            required
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="group bg-indigo-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              コメント投稿
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* コメント一覧 */}
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-purple-400 to-purple-600 w-8 h-8 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            コメント ({comments.length}件)
          </h3>
        </div>
        
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                  <span className="text-lg font-bold text-white">
                    {comment.author.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">{comment.author}</p>
                  <p className="text-sm text-gray-500 font-medium">{comment.createdAt}</p>
                </div>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6 leading-relaxed text-lg">{comment.content}</p>
            
            <div className="flex items-center gap-6">
              <button
                onClick={() => handleLike(comment.id)}
                className="flex items-center gap-2 text-gray-500 hover:text-red-500 transition-colors px-3 py-2 rounded-lg hover:bg-red-50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="font-medium">{comment.likes}</span>
              </button>
              
              <button className="text-gray-500 hover:text-indigo-600 transition-colors px-3 py-2 rounded-lg hover:bg-indigo-50 font-medium">
                返信
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}