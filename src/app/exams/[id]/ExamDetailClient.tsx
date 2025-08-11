'use client'

import { useState } from 'react'
import { api } from '@/services/api'
import { useAuth } from '@/hooks/useAuth'

interface ExamDetailClientProps {
  examData: any
  initialComments: any[]
}

interface Comment {
  id: string
  content: string
  author_id: string
  users?: { name: string; pen_name: string }
  created_at: string
  parent_comment_id?: string
  replies?: Comment[]
}

export default function ExamDetailClient({ examData, initialComments }: ExamDetailClientProps) {
  const { user, isLoggedIn } = useAuth()
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // コメント階層化
  const organizeComments = (flatComments: any[]): Comment[] => {
    const commentMap = new Map()
    const rootComments: Comment[] = []

    // まずすべてのコメントをマップに追加
    flatComments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] })
    })

    // 親子関係を構築
    flatComments.forEach(comment => {
      if (comment.parent_comment_id) {
        const parent = commentMap.get(comment.parent_comment_id)
        if (parent) {
          parent.replies.push(commentMap.get(comment.id))
        }
      } else {
        rootComments.push(commentMap.get(comment.id))
      }
    })

    return rootComments
  }

  const organizedComments = organizeComments(comments)

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !isLoggedIn || !user) {
      if (!isLoggedIn) alert('ログインが必要です')
      return
    }

    setIsSubmitting(true)
    try {
      const commentData = {
        past_exam_id: examData.id,
        content: newComment.trim(),
        author_id: user.id
      }

      const createdComment = await api.pastExamComments.create(commentData)
      setComments(prev => [...prev, createdComment])
      setNewComment('')
    } catch (error) {
      console.error('コメント投稿エラー:', error)
      alert('コメントの投稿に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitReply = async () => {
    if (!replyText.trim() || !replyTo || !isLoggedIn || !user) return

    setIsSubmitting(true)
    try {
      const replyData = {
        past_exam_id: examData.id,
        content: replyText.trim(),
        author_id: user.id,
        parent_comment_id: replyTo
      }

      const createdReply = await api.pastExamComments.create(replyData)
      setComments(prev => [...prev, createdReply])
      setReplyTo(null)
      setReplyText('')
    } catch (error) {
      console.error('返信投稿エラー:', error)
      alert('返信の投稿に失敗しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  const CommentComponent = ({ comment, level = 0 }: { comment: Comment; level?: number }) => (
    <div className={`${level > 0 ? 'ml-12 border-l-2 border-gray-100 pl-4' : ''}`}>
      {/* Comment */}
      <div className="flex space-x-3 py-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
          <span className="text-white font-bold text-sm">
            {(comment.users?.pen_name || comment.author_id).charAt(0)}
          </span>
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-bold text-gray-900 text-sm">
              {comment.users?.pen_name || comment.author_id}
            </span>
            <span className="text-gray-500 text-sm">
              {new Date(comment.created_at).toLocaleDateString('ja-JP', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
          <div className="text-gray-700 text-sm leading-relaxed mb-2">
            {comment.content}
          </div>
          
          {/* Action buttons */}
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <button 
              onClick={() => setReplyTo(comment.id)}
              className="hover:text-indigo-600 transition-colors flex items-center space-x-1"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              <span>返信</span>
            </button>
            <button className="hover:text-red-500 transition-colors flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>0</span>
            </button>
          </div>

          {/* Reply input */}
          {replyTo === comment.id && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`${comment.users?.pen_name || comment.author_id}さんに返信...`}
                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                rows={3}
              />
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={() => {
                    setReplyTo(null)
                    setReplyText('')
                  }}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  onClick={handleSubmitReply}
                  disabled={!replyText.trim() || isSubmitting}
                  className="px-4 py-1 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  返信
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-1">
          {comment.replies.map((reply) => (
            <CommentComponent key={reply.id} comment={reply} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="bg-white">
      {/* Comment Input */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {isLoggedIn ? (user?.email?.charAt(0) || 'U') : 'G'}
            </span>
          </div>
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={isLoggedIn ? 'この過去問について質問・コメントを投稿...' : 'ログインしてコメントを投稿'}
              className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              rows={3}
              disabled={!isLoggedIn}
            />
            <div className="flex justify-between items-center mt-3">
              <span className="text-sm text-gray-500">
                {newComment.length}/280文字
              </span>
              <button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmitting || !isLoggedIn}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
              >
                {isSubmitting ? '投稿中...' : '投稿'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="divide-y divide-gray-100">
        {organizedComments.length > 0 ? (
          organizedComments.map((comment) => (
            <CommentComponent key={comment.id} comment={comment} />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">まだコメントがありません</h3>
            <p className="text-gray-500">
              この過去問について最初のコメントを投稿してみましょう
            </p>
          </div>
        )}
      </div>
    </div>
  )
}