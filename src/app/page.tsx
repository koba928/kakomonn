'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { SearchIcon } from '@/components/icons/IconSystem'
import { AnimatedButton } from '@/components/ui/MicroInteractions'
import { APP_CONFIG } from '@/constants/app'
import { useAuth } from '@/hooks/useAuth'

export default function Home() {
  const { user, isLoggedIn, loading, session } = useAuth()
  const [mainButtonHref, setMainButtonHref] = useState('/auth/email')
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // 初回チェック
    const checkAuth = async () => {
      setIsChecking(true)
      
      // loadingが終わるまで待つ
      if (loading) {
        return
      }

      console.log('🏠 ホーム画面認証状態チェック:', { 
        isLoggedIn, 
        hasUser: !!user,
        hasSession: !!session
      })

      // セッションが存在する、またはユーザーが存在する場合はログイン済み
      if ((session && session.user) || (isLoggedIn && user)) {
        console.log('✅ ログイン済みユーザー - 検索画面に誘導')
        setMainButtonHref('/search')
      } else {
        console.log('❌ 未ログインユーザー - ログイン画面に誘導')
        setMainButtonHref('/auth/email')
      }
      
      setIsChecking(false)
    }

    checkAuth()
  }, [isLoggedIn, user, loading, session])

  // 認証状態確認中の場合はローディング表示
  if (loading || isChecking) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </main>
    )
  }

  return (
    <main id="main-content" className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 relative overflow-hidden transition-colors duration-300">
      {/* モバイル最適化: 背景装飾を軽量化 */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-20 -right-20 w-40 h-40 sm:w-80 sm:h-80 sm:-top-40 sm:-right-40 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-50 sm:opacity-70 animate-blob"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 sm:w-80 sm:h-80 sm:-bottom-40 sm:-left-40 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-50 sm:opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      {/* モバイル: padding圧縮、一画面に収める */}
      <div className="container mx-auto px-4 py-4 sm:py-8 md:py-12 relative z-10 flex items-center min-h-screen">
        <section className="text-center max-w-5xl mx-auto w-full" aria-labelledby="hero-heading">
          {/* ヒーローセクション - モバイル圧縮版 */}
          <header className="mb-6 sm:mb-12">
            {/* モバイル: タグを小さく */}
            <div className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-3 sm:mb-6 animate-fade-in" role="banner">
              <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-indigo-500"></span>
              </span>
              <span className="hidden sm:inline">大学生のための学習プラットフォーム</span>
              <span className="sm:hidden">学習プラットフォーム</span>
            </div>
            
            {/* モバイル: タイトルサイズ圧縮 */}
            <h1 id="hero-heading" className="text-3xl sm:text-5xl md:text-7xl font-bold mb-2 sm:mb-6 bg-gradient-to-r from-gray-900 via-indigo-800 to-indigo-600 bg-clip-text text-transparent animate-fade-in leading-tight">
              {APP_CONFIG.name.split('hub')[0]}<span className="text-indigo-600">hub</span>
            </h1>
            
            {/* モバイル: サブタイトル圧縮 */}
            <p className="text-lg sm:text-2xl md:text-3xl text-gray-800 mb-2 sm:mb-4 font-medium animate-fade-in">
              {APP_CONFIG.tagline}
            </p>
            
            {/* モバイル: 説明文を短縮または隠す */}
            <p className="hidden sm:block text-base sm:text-lg md:text-xl text-gray-700 mb-8 sm:mb-12 max-w-2xl mx-auto animate-fade-in leading-relaxed">
              {APP_CONFIG.fullDescription}
            </p>
            <p className="sm:hidden text-sm text-gray-600 mb-6 mx-auto animate-fade-in leading-relaxed">
              過去問を探して、話し合える場所
            </p>

            {/* メインアクション - モバイル最適化 */}
            <nav className="flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4 animate-fade-in max-w-sm mx-auto sm:max-w-none" aria-label="メインナビゲーション">
              <Link href={mainButtonHref} className="flex-1 sm:flex-initial">
                <AnimatedButton variant="primary" size="md" aria-label="過去問を検索する" className="w-full justify-center max-w-xs mx-auto sm:mx-0">
                  <SearchIcon size={20} aria-hidden={true} />
                  過去問を探す
                </AnimatedButton>
              </Link>
              <Link href="/auth/email?redirect=/upload" className="flex-1 sm:flex-initial">
                <AnimatedButton variant="secondary" size="md" aria-label="過去問を投稿する" className="w-full justify-center max-w-xs mx-auto sm:mx-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  過去問を投稿
                </AnimatedButton>
              </Link>
            </nav>
          </header>

          {/* フッター - 法的文書へのリンク */}
          <footer className="mt-8 sm:mt-16 text-center text-xs sm:text-sm text-gray-500">
            <nav className="flex justify-center gap-4 sm:gap-6" aria-label="法的文書">
              <Link href="/terms" className="hover:text-gray-700 transition-colors">
                利用規約
              </Link>
              <Link href="/privacy" className="hover:text-gray-700 transition-colors">
                プライバシーポリシー
              </Link>
            </nav>
            <div className="mt-2">
              <p>&copy; 2025 MATURA. All rights reserved.</p>
            </div>
          </footer>
        </section>
      </div>

      {/* 安全領域に配慮したフッタースペーサ（モバイル） */}
      <div className="h-[24px] sm:h-0" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }} />
    </main>
  )
}