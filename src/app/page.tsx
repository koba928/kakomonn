import Link from 'next/link'
import { SearchIcon, PlusIcon } from '@/components/icons/IconSystem'
import { AnimatedButton, FloatingActionButton } from '@/components/ui/MicroInteractions'
import { HomeContent } from '@/components/home/HomeContent'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 relative overflow-hidden transition-colors duration-300">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>
      
      {/* プラスマークで投稿ボタン */}
      <FloatingActionButton
        icon={<PlusIcon size={24} />}
        onClick={() => window.location.href = '/upload'}
        position="bottom-right"
      />

      <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12 relative z-10 flex items-center min-h-screen">
        <div className="text-center max-w-5xl mx-auto">
          {/* ヒーローセクション */}
          <div className="mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-4 sm:mb-6 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              大学生のための学習プラットフォーム
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 via-indigo-800 to-indigo-600 bg-clip-text text-transparent animate-slide-in leading-tight">
              過去問<span className="text-indigo-600">hub</span>
            </h1>
            
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-800 mb-3 sm:mb-4 font-medium animate-slide-in">
              過去問を探せて、話せる。
            </p>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-8 sm:mb-12 max-w-2xl mx-auto animate-slide-in leading-relaxed">
              全国の大学生が集まる、勉強記録と情報交換のコミュニティ。<br className="hidden sm:block" />
              先輩の知識を活用して、効率的な試験対策を。
            </p>

            {/* メインアクション - 過去問を探すボタンのみ */}
            <div className="flex justify-center animate-slide-in mb-4">
              <Link href="/threads">
                <AnimatedButton variant="primary" size="lg">
                  <SearchIcon size={24} />
                  過去問を探す
                </AnimatedButton>
              </Link>
            </div>
            
            {/* 使い方ガイド */}
            <div className="text-center text-sm text-gray-600 animate-fade-in">
              <p className="mb-3 font-medium text-gray-700">💡 使い方</p>
              <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs opacity-90">
                <span className="flex items-center gap-1 bg-white/50 px-2 py-1 rounded-full">
                  <SearchIcon size={12} className="text-blue-600" />
                  大学・学部で検索
                </span>
                <span className="flex items-center gap-1 bg-white/50 px-2 py-1 rounded-full">
                  📝 質問・相談を投稿
                </span>
                <span className="flex items-center gap-1 bg-white/50 px-2 py-1 rounded-full">
                  <PlusIcon size={12} className="text-green-600" />
                  右下で新規投稿
                </span>
              </div>
              <div className="mt-4">
                <Link href="/register" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  ユーザー登録をして、パーソナライズされた情報を受け取る →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Client Component */}
      <HomeContent />
    </main>
  )
}