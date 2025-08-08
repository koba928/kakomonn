'use client'

import React, { useState, useEffect } from 'react'
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
    }
  }, [searchQuery])

  const handleSelect = (teacher: Teacher) => {
    onSelect(teacher)
    onClose()
    setSearchQuery('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">教員検索</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="教員名を入力してください"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-4"
          autoFocus
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
              className="w-full p-3 text-left hover:bg-gray-100 rounded-lg mb-2"
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