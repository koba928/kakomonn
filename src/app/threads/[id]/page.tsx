
import Link from 'next/link'
import ThreadDetailClient from './ThreadDetailClient'

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

interface Comment {
  id: string
  content: string
  author: string
  createdAt: string
  likes: number
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

export default async function ThreadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 relative">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <nav className="bg-white/90 backdrop-blur-sm shadow-lg border-b border-gray-200 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center group">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-indigo-600 bg-clip-text text-transparent group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-200">
                過去問<span className="text-indigo-600">hub</span>
              </h1>
            </Link>
            
            <div className="flex items-center gap-4">
              <Link 
                href="/threads" 
                className="group flex items-center gap-2 text-gray-600 hover:text-indigo-600 transition-colors font-medium"
              >
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                スレッド一覧に戻る
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        {/* スレッド本文 */}
        <div className="bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-lg border border-gray-100 mb-8">
          <div className="flex items-center gap-3 text-sm mb-6">
            <span className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium">
              {mockThread.university}
            </span>
            <span className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-full text-sm font-medium">
              {mockThread.faculty}
            </span>
            <span className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium">
              {mockThread.course}
            </span>
            {mockThread.examYear && (
              <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                {mockThread.examYear}年度
              </span>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-gray-900 via-indigo-800 to-indigo-600 bg-clip-text text-transparent">
            {mockThread.title}
          </h1>

          <div className="flex items-center gap-6 text-sm mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold">
                  {mockThread.author.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">投稿者: {mockThread.author}</p>
                <p className="text-gray-500">投稿日: {mockThread.createdAt}</p>
              </div>
            </div>
          </div>

          <div className="prose max-w-none text-gray-700 mb-8 leading-relaxed text-lg">
            {mockThread.content.split('\n').map((line, index) => (
              <p key={index} className="mb-3">
                {line}
              </p>
            ))}
          </div>

          {/* 添付ファイル */}
          {mockThread.fileUrl && (
            <div className="border-t border-gray-200 pt-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-gradient-to-br from-red-400 to-red-600 w-8 h-8 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900">添付ファイル</h3>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-pink-50 p-6 rounded-2xl border border-red-100">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-red-500 to-red-600 p-4 rounded-xl">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-lg">{mockThread.fileName}</p>
                    <p className="text-red-600 font-medium">PDF形式 - 勉強記録</p>
                  </div>
                  <button className="group bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2">
                    ダウンロード
                    <svg className="w-4 h-4 group-hover:translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m-7 4h14a2 2 0 002-2V9a2 2 0 00-2-2M5 3v4M3 5h4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* クライアントコンポーネント（インタラクティブ機能） */}
        <ThreadDetailClient initialComments={mockComments} />
      </div>

    </main>
  )
}