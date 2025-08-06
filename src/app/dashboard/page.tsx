import { auth, signOut } from '@/app/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function Dashboard() {
  const session = await auth()
  
  if (!session?.user) {
    redirect('/login')
  }

  // Check if user has completed onboarding
  const user = await prisma.user.findUnique({
    where: { email: session.user.email! },
    include: {
      university: true,
      faculty: true,
    },
  })

  if (!user?.universityId || !user?.facultyId || !user?.grade) {
    redirect('/onboarding')
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                過去問<span className="text-indigo-600">hub</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <img
                  src={session.user.image || ''}
                  alt={session.user.name || ''}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm font-medium text-gray-700">
                  {session.user.name}
                </span>
              </div>
              
              <form
                action={async () => {
                  'use server'
                  await signOut()
                }}
              >
                <button
                  type="submit"
                  className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                >
                  ログアウト
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            ようこそ、{session.user.name}さん！
          </h2>
          <p className="text-gray-600">
            {user.university?.name} {user.faculty?.name} {user.grade}年生
          </p>
          <p className="text-gray-500 text-sm mt-1">
            あなたの過去問hubダッシュボードです。
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center mb-4">
              <div className="text-2xl mr-3">🏫</div>
              <h3 className="text-lg font-semibold text-gray-900">プロフィール設定</h3>
            </div>
            <p className="text-gray-600 mb-4">
              大学・学部・学年を設定して、関連する過去問を見つけやすくしましょう。
            </p>
            <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
              設定する
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center mb-4">
              <div className="text-2xl mr-3">📚</div>
              <h3 className="text-lg font-semibold text-gray-900">過去問を探す</h3>
            </div>
            <p className="text-gray-600 mb-4">
              授業名や教員名で過去問を検索。先輩の勉強記録を見つけましょう。
            </p>
            <button className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors">
              検索する
            </button>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow border">
            <div className="flex items-center mb-4">
              <div className="text-2xl mr-3">📝</div>
              <h3 className="text-lg font-semibold text-gray-900">勉強記録をシェア</h3>
            </div>
            <p className="text-gray-600 mb-4">
              手書きノートや勉強記録をアップロードして、後輩をサポート。
            </p>
            <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
              アップロード
            </button>
          </div>
        </div>
        
        <div className="mt-12">
          <h3 className="text-xl font-bold text-gray-900 mb-4">最近の活動</h3>
          <div className="bg-white rounded-lg shadow border p-6">
            <p className="text-gray-500 text-center">
              まだ活動がありません。過去問を検索したり、勉強記録をシェアして始めましょう！
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}