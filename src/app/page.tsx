'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { SearchIcon } from '@/components/icons/IconSystem'
import { AnimatedButton } from '@/components/ui/MicroInteractions'
import HomeContent from '@/components/home/HomeContent'
import { APP_CONFIG } from '@/constants/app'

export default function Home() {
  const [mainButtonHref, setMainButtonHref] = useState('/auth/method-select')

  useEffect(() => {
    // ログイン済みかつ大学情報が登録済みかチェック
    const checkExistingUser = () => {
      const savedUserInfo = localStorage.getItem('kakomonn_user')
      
      if (savedUserInfo) {
        try {
          const parsed = JSON.parse(savedUserInfo)
          // 大学情報が完全に登録済みの場合、直接検索ページへ
          if (parsed.university && parsed.faculty && parsed.department && parsed.isLoggedIn) {
            setMainButtonHref('/search')
          }
        } catch (error) {
          console.error('Failed to parse user info:', error)
        }
      }
    }

    checkExistingUser()
  }, [])

  return (
    <main id="main-content" className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 relative overflow-hidden transition-colors duration-300">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12 relative z-10 flex items-center min-h-screen">
        <section className="text-center max-w-5xl mx-auto" aria-labelledby="hero-heading">
          {/* ヒーローセクション */}
          <header className="mb-8 sm:mb-12">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-4 sm:mb-6 animate-fade-in" role="banner">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              大学生のための学習プラットフォーム
            </div>
            
            <h1 id="hero-heading" className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 via-indigo-800 to-indigo-600 bg-clip-text text-transparent animate-slide-in leading-tight">
              {APP_CONFIG.name.split('hub')[0]}<span className="text-indigo-600">hub</span>
            </h1>
            
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-800 mb-3 sm:mb-4 font-medium animate-slide-in">
              {APP_CONFIG.tagline}
            </p>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-8 sm:mb-12 max-w-2xl mx-auto animate-slide-in leading-relaxed">
              {APP_CONFIG.fullDescription}
            </p>

            {/* メインアクション - 過去問を探すボタン */}
            <nav className="flex justify-center animate-slide-in mb-4" aria-label="メインナビゲーション">
              <Link href={mainButtonHref}>
                <AnimatedButton variant="primary" size="lg" aria-label="過去問を検索する">
                  <SearchIcon size={24} aria-hidden={true} />
                  過去問を探す
                </AnimatedButton>
              </Link>
            </nav>
            
            {/* 使い方ガイド */}
            <section className="text-center text-sm text-gray-600 animate-fade-in" aria-labelledby="guide-heading">
              <h2 id="guide-heading" className="mb-3 font-medium text-gray-700">💡 使い方</h2>
              <ul className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs opacity-90" role="list">
                <li className="flex items-center gap-1 bg-white/50 px-2 py-1 rounded-full">
                  <SearchIcon size={12} className="text-blue-600" aria-hidden={true} />
                  <span>大学・学部で検索</span>
                </li>
                <li className="flex items-center gap-1 bg-white/50 px-2 py-1 rounded-full">
                  <span aria-hidden="true">📝</span>
                  <span>質問・相談を投稿</span>
                </li>
                <li className="flex items-center gap-1 bg-white/50 px-2 py-1 rounded-full">
                  <span aria-hidden="true">➕</span>
                  <span>右下で新規投稿</span>
                </li>
              </ul>
            </section>
          </header>
        </section>
      </div>

      {/* Client Component */}
      <HomeContent />
    </main>
  )
}