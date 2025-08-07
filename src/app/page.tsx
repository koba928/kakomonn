'use client'

import Link from 'next/link'
import { SearchIcon, ThreadIcon, BookIcon, ArrowRightIcon, PlusIcon } from '@/components/icons/IconSystem'
import { AnimatedButton, FloatingActionButton } from '@/components/ui/MicroInteractions'
import { ThemeToggle } from '@/components/theme/ThemeProvider'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 relative overflow-hidden transition-colors duration-300">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>
      
      {/* プラスマークで投稿ボタン */}
      <FloatingActionButton
        icon={<PlusIcon size={24} />}
        onClick={() => window.location.href = '/upload'}
        position="bottom-right"
      />

      <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
        <div className="text-center max-w-5xl mx-auto">
          {/* ヒーローセクション */}
          <div className="mb-16">
            <div className="inline-flex items-center gap-2 bg-indigo-50 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              大学生のための学習プラットフォーム
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-indigo-800 to-indigo-600 dark:from-gray-100 dark:via-indigo-200 dark:to-indigo-400 bg-clip-text text-transparent animate-slide-in">
              過去問<span className="text-indigo-600">hub</span>
            </h1>
            
            <p className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 mb-4 font-medium animate-slide-in">
              過去問を探せて、話せる。
            </p>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto animate-slide-in">
              全国の大学生が集まる、勉強記録と情報交換のコミュニティ。
              先輩の知識を活用して、効率的な試験対策を。
            </p>

            {/* メインアクション - 過去問を探すボタンのみ */}
            <div className="flex justify-center animate-slide-in">
              <Link href="/threads">
                <AnimatedButton variant="primary" size="lg" className="flex items-center gap-2">
                  過去問を探す
                  <SearchIcon size={20} />
                </AnimatedButton>
              </Link>
            </div>
          </div>
          
          {/* 統計情報 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16 max-w-3xl mx-auto animate-fade-in">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">50+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">大学</div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">1,000+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">スレッド</div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">5,000+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">ユーザー</div>
            </div>
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">10,000+</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">コメント</div>
            </div>
          </div>
          
          {/* 機能カード */}
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-12 animate-fade-in">
              過去問hubでできること
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700 animate-slide-in">
                <div className="bg-gradient-to-br from-blue-400 to-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BookIcon size={32} color="white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">過去問アーカイブ</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  学部・授業名・年度で簡単検索。先輩の勉強記録から効率的な試験対策を見つけよう
                </p>
              </div>
              
              <div className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700 animate-slide-in">
                <div className="bg-gradient-to-br from-purple-400 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <ThreadIcon size={32} color="white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">リアルタイム情報交換</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  「この問題どう解く？」「今年の傾向は？」Discord風のスレッドで気軽に質問・相談
                </p>
              </div>
              
              <div className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700 animate-slide-in">
                <div className="bg-gradient-to-br from-pink-400 to-pink-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <SearchIcon size={32} color="white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-gray-100">スマートな推薦</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  あなたの大学・学部・学年に最適化された情報をお届け。必要な情報に素早くアクセス
                </p>
              </div>
            </div>
          </div>

          {/* CTA セクション */}
          <div className="mt-20 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-700 dark:to-purple-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl animate-fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              今すぐ始めよう
            </h2>
            <p className="text-lg md:text-xl mb-8 opacity-90">
              全国の大学生が参加する学習コミュニティに参加して、
              効率的な試験対策を始めましょう
            </p>
            <Link href="/threads">
              <AnimatedButton variant="secondary" size="lg" className="inline-flex items-center gap-2 text-indigo-600">
                過去問を探してみる
                <SearchIcon size={20} />
              </AnimatedButton>
            </Link>
          </div>
        </div>
      </div>

    </main>
  )
}