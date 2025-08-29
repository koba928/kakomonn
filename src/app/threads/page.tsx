'use client'

import Link from 'next/link'

export default function ThreadsPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">この機能は現在準備中です</h1>
          <p className="text-gray-600 mb-6">スレッド機能は今後追加予定です。</p>
          <Link 
            href="/search"
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            過去問検索に戻る
          </Link>
        </div>
      </div>
    </main>
  )
}