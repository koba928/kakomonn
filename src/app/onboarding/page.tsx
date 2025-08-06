'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface University {
  id: string
  name: string
}

interface Faculty {
  id: string
  name: string
  universityId: string
}

export default function OnboardingPage() {
  const router = useRouter()
  const [universities, setUniversities] = useState<University[]>([])
  const [faculties, setFaculties] = useState<Faculty[]>([])
  const [selectedUniversity, setSelectedUniversity] = useState('')
  const [selectedFaculty, setSelectedFaculty] = useState('')
  const [selectedGrade, setSelectedGrade] = useState('')
  const [loading, setLoading] = useState(false)

  // Fetch universities on component mount
  useEffect(() => {
    fetchUniversities()
  }, [])

  // Fetch faculties when university changes
  useEffect(() => {
    if (selectedUniversity) {
      fetchFaculties(selectedUniversity)
      setSelectedFaculty('') // Reset faculty selection
    }
  }, [selectedUniversity])

  const fetchUniversities = async () => {
    try {
      const response = await fetch('/api/universities')
      const data = await response.json()
      setUniversities(data)
    } catch (error) {
      console.error('Failed to fetch universities:', error)
    }
  }

  const fetchFaculties = async (universityId: string) => {
    try {
      const response = await fetch(`/api/faculties?universityId=${universityId}`)
      const data = await response.json()
      setFaculties(data)
    } catch (error) {
      console.error('Failed to fetch faculties:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedUniversity || !selectedFaculty || !selectedGrade) {
      alert('すべての項目を選択してください。')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          universityId: selectedUniversity,
          facultyId: selectedFaculty,
          grade: parseInt(selectedGrade),
        }),
      })

      if (response.ok) {
        router.push('/dashboard')
      } else {
        alert('プロフィールの更新に失敗しました。')
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
      alert('プロフィールの更新に失敗しました。')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            プロフィール設定
          </h1>
          <p className="text-gray-600">
            あなたの大学情報を教えてください
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2">
              大学 <span className="text-red-500">*</span>
            </label>
            <select
              id="university"
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            >
              <option value="">大学を選択してください</option>
              {universities.map((university) => (
                <option key={university.id} value={university.id}>
                  {university.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="faculty" className="block text-sm font-medium text-gray-700 mb-2">
              学部 <span className="text-red-500">*</span>
            </label>
            <select
              id="faculty"
              value={selectedFaculty}
              onChange={(e) => setSelectedFaculty(e.target.value)}
              disabled={!selectedUniversity}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              required
            >
              <option value="">学部を選択してください</option>
              {faculties.map((faculty) => (
                <option key={faculty.id} value={faculty.id}>
                  {faculty.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="grade" className="block text-sm font-medium text-gray-700 mb-2">
              学年 <span className="text-red-500">*</span>
            </label>
            <select
              id="grade"
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            >
              <option value="">学年を選択してください</option>
              <option value="1">1年生</option>
              <option value="2">2年生</option>
              <option value="3">3年生</option>
              <option value="4">4年生</option>
              <option value="5">修士1年</option>
              <option value="6">修士2年</option>
              <option value="7">博士課程</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '設定中...' : '設定を完了'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            この情報は、あなたに関連する過去問や情報を表示するために使用されます。
          </p>
        </div>
      </div>
    </main>
  )
}