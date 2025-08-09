'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { SearchIcon } from '@/components/icons/IconSystem'
import { AnimatedButton } from '@/components/ui/MicroInteractions'
import HomeContent from '@/components/home/HomeContent'
import { APP_CONFIG } from '@/constants/app'

export default function Home() {
  const [mainButtonHref, setMainButtonHref] = useState('/auth/email')

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
            
            <h1 id="hero-heading" className="text-4xl sm:text-5xl md:text-7xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-gray-900 via-indigo-800 to-indigo-600 bg-clip-text text-transparent animate-fade-in leading-tight">
              {APP_CONFIG.name.split('hub')[0]}<span className="text-indigo-600">hub</span>
            </h1>
            
            <p className="text-xl sm:text-2xl md:text-3xl text-gray-800 mb-3 sm:mb-4 font-medium animate-fade-in">
              {APP_CONFIG.tagline}
            </p>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-700 mb-8 sm:mb-12 max-w-2xl mx-auto animate-fade-in leading-relaxed">
              {APP_CONFIG.fullDescription}
            </p>

            {/* メインアクション */}
            <nav className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" aria-label="メインナビゲーション">
              <Link href={mainButtonHref}>
                <AnimatedButton variant="primary" size="lg" aria-label="過去問を検索する" className="w-full sm:w-auto">
                  <SearchIcon size={24} aria-hidden={true} />
                  過去問を探す
                </AnimatedButton>
              </Link>
              <Link href="/auth/email?redirect=/upload">
                <AnimatedButton variant="primary" size="lg" aria-label="過去問を投稿する" className="w-full sm:w-auto">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  過去問を投稿
                </AnimatedButton>
              </Link>
            </nav>
          </header>
        </section>
      </div>

      {/* Client Component */}
      <HomeContent />
    </main>
  )
}