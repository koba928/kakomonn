'use client'

import { useState } from 'react'
import { useUser } from '@/contexts/UserContext'

interface Comment {
  id: string
  content: string
  author: string
  createdAt: string
  likes: number
  isLiked?: boolean
}

interface ThreadDetailClientProps {
  initialComments: Comment[]
  threadId?: string
}

export default function ThreadDetailClient({ initialComments, threadId }: ThreadDetailClientProps) {
  const { user, isLoggedIn } = useUser()
  
  // Use threadId for future API calls
  console.log('Thread ID:', threadId)
  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(89)
  // const [shareCount] = useState(32)

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      author: user?.name || '匿名ユーザー',
      createdAt: new Date().toLocaleString('ja-JP', {
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      likes: 0,
      isLiked: false
    }

    setComments([...comments, comment])
    setNewComment('')
  }

  const handleLike = (commentId: string) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { 
            ...comment, 
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            isLiked: !comment.isLiked
          }
        : comment
    ))
  }

  const handleThreadLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
  }

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked)
  }

  // Suppress unused var warnings for future use
  void handleThreadLike;
  void handleBookmark;
  void likeCount;

  return (
    <>
      {/* Comment form */}
      <div className="bg-white border-b border-gray-200">
        <div className="p-4">
          <form onSubmit={handleSubmitComment}>
            <div className="flex space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold">
                  {user?.name?.charAt(0) || '匿'}
                </span>
              </div>
              <div className="flex-1">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={isLoggedIn ? "返信をツイート" : "ログインしてコメントする"}
                  className="w-full text-xl placeholder-gray-500 border-none resize-none focus:outline-none"
                  rows={3}
                  disabled={!isLoggedIn}
                />
                {isLoggedIn && (
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-4 text-indigo-500">
                      <button type="button" className="hover:bg-indigo-50 p-2 rounded-full transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button type="button" className="hover:bg-indigo-50 p-2 rounded-full transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 110 2h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6H3a1 1 0 110-2h4z" />
                        </svg>
                      </button>
                      <button type="button" className="hover:bg-indigo-50 p-2 rounded-full transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1a3 3 0 015.83 1M15 10h1a3 3 0 01-1.001 2.249M9 10v3.001M15 10v3.001" />
                        </svg>
                      </button>
                    </div>
                    <button
                      type="submit"
                      disabled={!newComment.trim()}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-full font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      返信
                    </button>
                  </div>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Comments list */}
      <div>
        {comments.map((comment) => (
          <div key={comment.id} className="bg-white border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <div className="p-4">
              <div className="flex space-x-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                  <span className="text-white font-bold">
                    {comment.author.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-900">{comment.author}</span>
                    <span className="text-gray-500">·</span>
                    <span className="text-gray-500 text-sm">{comment.createdAt}</span>
                  </div>
                  
                  <div className="mt-2 text-gray-700 whitespace-pre-line">
                    {comment.content}
                  </div>
                  
                  {/* Comment actions */}
                  <div className="flex items-center justify-between max-w-md mt-3">
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors group">
                      <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <span className="text-sm">0</span>
                    </button>
                    
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition-colors group">
                      <div className="p-2 rounded-full group-hover:bg-green-50 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </div>
                      <span className="text-sm">0</span>
                    </button>
                    
                    <button
                      onClick={() => handleLike(comment.id)}
                      className={`flex items-center space-x-2 transition-colors group ${
                        comment.isLiked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                      }`}
                    >
                      <div className="p-2 rounded-full group-hover:bg-red-50 transition-colors">
                        <svg className={`w-4 h-4 ${comment.isLiked ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <span className="text-sm">{comment.likes}</span>
                    </button>
                    
                    <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors group">
                      <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Login prompt if not logged in */}
      {!isLoggedIn && (
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="text-center">
            <p className="text-gray-700 mb-4">ログインしてコメントに参加しよう</p>
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-full font-medium hover:bg-indigo-700 transition-colors">
              ログイン
            </button>
          </div>
        </div>
      )}
    </>
  )
}