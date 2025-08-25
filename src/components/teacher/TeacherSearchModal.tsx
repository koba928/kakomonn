'use client'

import { useState, useEffect, useRef } from 'react'
import { dataService, Teacher } from '@/services/dataService'

interface TeacherSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (teacher: Teacher) => void
}

export function TeacherSearchModal({ isOpen, onClose, onSelect }: TeacherSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchQuery.length >= 2) {
      const searchTeachers = async () => {
        setIsLoading(true)
        try {
          const results = await dataService.searchTeachers(searchQuery)
          setTeachers(results)
        } catch (error) {
          console.error('Teacher search failed:', error)
        } finally {
          setIsLoading(false)
        }
      }

      const timeoutId = setTimeout(searchTeachers, 300)
      return () => clearTimeout(timeoutId)
    } else {
      setTeachers([])
      return undefined
    }
  }, [searchQuery])

  // フォーカストラップの実装
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key === 'Tab') {
        const modal = modalRef.current
        if (!modal) return

        const focusableElements = modal.querySelectorAll(
          'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href]:not([disabled])'
        )
        const firstElement = focusableElements[0] as HTMLElement
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

        if (e.shiftKey) {
          // Shift + Tab (逆方向)
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement?.focus()
          }
        } else {
          // Tab (順方向)
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement?.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    
    // モーダルが開いたら入力フィールドにフォーカス
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  const handleSelect = (teacher: Teacher) => {
    onSelect(teacher)
    onClose()
    setSearchQuery('')
  }

  if (!isOpen) return null

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div 
        ref={modalRef}
        className="bg-white rounded-lg p-6 w-full max-w-md mx-4"
        role="dialog"
        aria-labelledby="modal-title"
        aria-modal="true"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 id="modal-title" className="text-lg font-semibold">教員検索</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl p-2 rounded-md hover:bg-gray-100"
            aria-label="モーダルを閉じる"
          >
            ×
          </button>
        </div>

        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="教員名を入力してください"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-4"
          aria-label="教員名検索"
        />

        <div className="max-h-60 overflow-y-auto">
          {isLoading && (
            <div className="text-center py-4 text-gray-500">検索中...</div>
          )}

          {!isLoading && searchQuery.length < 2 && (
            <div className="text-center py-4 text-gray-500">
              2文字以上入力してください
            </div>
          )}

          {!isLoading && searchQuery.length >= 2 && teachers.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              該当する教員が見つかりません
            </div>
          )}

          {teachers.map(teacher => (
            <button
              key={teacher.id}
              onClick={() => handleSelect(teacher)}
              className="w-full p-3 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg mb-2"
              aria-label={`${teacher.name}を選択 - ${teacher.university}`}
            >
              <div className="font-medium">{teacher.name}</div>
              <div className="text-sm text-gray-600">
                {teacher.university}
                {teacher.faculty && ` ${teacher.faculty}`}
                {teacher.department && ` ${teacher.department}`}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}