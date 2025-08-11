import Link from 'next/link'
import ThreadDetailClient from './ThreadDetailClient'
import { api } from '@/services/api'

interface Thread {
  id: string
  title: string
  content: string
  author: string
  course: string
  university: string
  faculty: string
  createdAt: string
  examYear?: number | undefined
  fileUrl?: string | undefined
  fileName?: string | undefined
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

export default async function ThreadDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  
  // APIからスレッドとコメント取得
  let threadData = mockThread
  let initialComments = mockComments
  
  try {
    // スレッド詳細取得
    const thread = await api.threads.getById(id)
    if (thread) {
      threadData = {
        id: thread.id,
        title: thread.title,
        content: thread.content,
        author: thread.author_id,
        course: thread.course,
        university: thread.university,
        faculty: thread.faculty,
        createdAt: new Date(thread.created_at).toLocaleDateString('ja-JP'),
        examYear: thread.exam_year ?? undefined,
        fileUrl: undefined,
        fileName: undefined
      }
    }
    
    // コメント取得
    const comments = await api.comments.getByThreadId(id)
    if (comments && Array.isArray(comments)) {
      initialComments = comments.map(c => ({
        id: c.id,
        content: c.content,
        author: c.author_id,
        createdAt: new Date(c.created_at).toLocaleDateString('ja-JP'),
        likes: 0,
      })) as any
    }
  } catch (e) {
    console.error('API取得エラー:', e)
    // 失敗時はモック継続
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Twitter-style header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4">
          <div className="flex items-center h-14">
            <Link 
              href="/threads" 
              className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 transition-colors mr-8"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">スレッド</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Main thread */}
        <div className="bg-white border-b border-gray-200">
          {/* Author info */}
          <div className="p-4">
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {mockThread.author.charAt(0)}
                </span>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-gray-900">{threadData.author}</span>
                  <span className="text-gray-500">·</span>
                  <span className="text-gray-500 text-sm">{threadData.createdAt}</span>
                </div>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-2 mb-3">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                    {threadData.university}
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    {threadData.faculty}
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
                    {threadData.course}
                  </span>
                  {threadData.examYear && (
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs font-medium">
                      {threadData.examYear}年度
                    </span>
                  )}
                </div>
                
                {/* Title */}
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  {threadData.title}
                </h2>
                
                {/* Content */}
                <div className="text-gray-700 whitespace-pre-line leading-relaxed mb-4">
                  {threadData.content}
                </div>
                
                {/* Attached file */}
                {threadData.fileUrl && (
                  <div className="border border-gray-200 rounded-xl p-4 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{threadData.fileName}</p>
                        <p className="text-sm text-gray-500">PDF ファイル</p>
                      </div>
                      <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                        ダウンロード
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Engagement stats */}
                <div className="text-sm text-gray-500 mb-3">
                  <span>124回表示</span>
                  <span className="ml-4">15件のダウンロード</span>
                </div>
                
                {/* Action buttons - Twitter style */}
                <div className="flex items-center justify-between max-w-md border-t border-b border-gray-200 py-2 my-3">
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors group">
                    <div className="p-2 rounded-full group-hover:bg-blue-50 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <span className="text-sm">{mockComments.length}</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-green-600 transition-colors group">
                    <div className="p-2 rounded-full group-hover:bg-green-50 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </div>
                    <span className="text-sm">32</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-red-600 transition-colors group">
                    <div className="p-2 rounded-full group-hover:bg-red-50 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </div>
                    <span className="text-sm">89</span>
                  </button>
                  
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-indigo-600 transition-colors group">
                    <div className="p-2 rounded-full group-hover:bg-indigo-50 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </div>
                  </button>
                  
                  <button className="flex items-center space-x-2 text-gray-500 hover:text-gray-700 transition-colors group">
                    <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* クライアントコンポーネント（インタラクティブ機能） */}
        <ThreadDetailClient initialComments={initialComments as any} threadId={id} />
      </div>

    </main>
  )
}