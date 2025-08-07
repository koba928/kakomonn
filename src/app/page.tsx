'use client'

import Link from 'next/link'
import { SearchIcon, ThreadIcon, BookIcon, ArrowRightIcon, UploadIcon, UserIcon } from '@/components/icons/IconSystem'
import { ThemeToggle } from '@/components/theme/ThemeProvider'
import { MDButton, MDCard, MDSurface, MDFAB, MDAppBar } from '@/components/ui/MaterialComponents'
import { materialTheme, cn } from '@/styles/material-design'

export default function Home() {
  return (
    <main className={cn("min-h-screen", materialTheme.colors.background, "relative overflow-hidden transition-colors duration-300")}>
      {/* Simplified background - Google style */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 dark:bg-blue-900/20 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-50 dark:bg-indigo-900/20 rounded-full blur-3xl opacity-50"></div>
      </div>

      {/* App Bar */}
      <MDAppBar
        title="過去問hub"
        actions={[
          <ThemeToggle key="theme" />,
          <UserIcon key="user" size={24} />
        ]}
      />
      
      {/* Material Design FAB */}
      <MDFAB
        icon={<UploadIcon size={24} />}
        onClick={() => window.location.href = '/upload'}
        extended
        label="投稿する"
      />

      <div className="container mx-auto px-4 py-8 md:py-16 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section - Google Style */}
          <div className="mb-12 md:mb-16">
            {/* Simple, clear messaging */}
            <h1 className={cn(
              materialTheme.typography.displayLarge,
              "mb-4 text-center",
              materialTheme.colors.onBackground,
              "md:text-6xl"
            )}>
              大学生のための<br className="md:hidden" />
              <span className="text-blue-600 dark:text-blue-400">勉強記録共有</span>プラットフォーム
            </h1>
            
            <p className={cn(
              materialTheme.typography.bodyLarge,
              "text-center mb-8 max-w-2xl mx-auto",
              materialTheme.colors.onSurfaceVariant
            )}>
              過去問を探して、話せる。全国の大学生が集まる学習コミュニティで、
              効率的な試験対策を始めましょう。
            </p>

            {/* Clear CTAs - Google style */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/threads">
                <MDButton
                  variant="filled"
                  size="large"
                  endIcon={<ArrowRightIcon size={20} />}
                >
                  スレッドを探す
                </MDButton>
              </Link>
              
              <Link href="/upload">
                <MDButton
                  variant="outlined"
                  size="large"
                  startIcon={<UploadIcon size={20} />}
                >
                  勉強記録を投稿
                </MDButton>
              </Link>
            </div>
          </div>
          
          {/* Key metrics - Simple and clear */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 max-w-3xl mx-auto">
            {[
              { value: "50+", label: "大学" },
              { value: "1,000+", label: "スレッド" },
              { value: "5,000+", label: "ユーザー" },
              { value: "10,000+", label: "コメント" },
            ].map((stat, index) => (
              <MDSurface key={index} elevation={1} className="text-center">
                <div className={cn(materialTheme.typography.headlineMedium, "text-blue-600 dark:text-blue-400")}>
                  {stat.value}
                </div>
                <div className={cn(materialTheme.typography.bodyMedium, materialTheme.colors.onSurfaceVariant)}>
                  {stat.label}
                </div>
              </MDSurface>
            ))}
          </div>
          
          {/* Features Section - Material Design style */}
          <div className="max-w-4xl mx-auto">
            <h2 className={cn(
              materialTheme.typography.headlineLarge,
              "text-center mb-8",
              materialTheme.colors.onBackground
            )}>
              主な機能
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              <MDCard variant="elevated" className="p-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-4">
                  <BookIcon size={24} color="currentColor" className="text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className={cn(materialTheme.typography.titleLarge, "mb-2")}>
                  勉強記録アーカイブ
                </h3>
                <p className={cn(materialTheme.typography.bodyMedium, materialTheme.colors.onSurfaceVariant)}>
                  学部・授業名・年度で簡単検索。先輩の知識を活用して効率的に学習
                </p>
              </MDCard>
              <MDCard variant="elevated" className="p-6">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center mb-4">
                  <ThreadIcon size={24} color="currentColor" className="text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className={cn(materialTheme.typography.titleLarge, "mb-2")}>
                  リアルタイムディスカッション
                </h3>
                <p className={cn(materialTheme.typography.bodyMedium, materialTheme.colors.onSurfaceVariant)}>
                  質問や相談をスレッド形式で投稿。同じ授業を受ける仲間と情報交換
                </p>
              </MDCard>
              <MDCard variant="elevated" className="p-6">
                <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mb-4">
                  <SearchIcon size={24} color="currentColor" className="text-green-600 dark:text-green-400" />
                </div>
                <h3 className={cn(materialTheme.typography.titleLarge, "mb-2")}>
                  スマート検索
                </h3>
                <p className={cn(materialTheme.typography.bodyMedium, materialTheme.colors.onSurfaceVariant)}>
                  大学・学部・学年でフィルタリング。必要な情報にすばやくアクセス
                </p>
              </MDCard>
            </div>
          </div>

          {/* Final CTA - Clean and focused */}
          <MDSurface elevation={2} className="mt-16 text-center p-8 md:p-12 bg-blue-50 dark:bg-blue-900/20">
            <h2 className={cn(
              materialTheme.typography.headlineMedium,
              "mb-4",
              materialTheme.colors.onBackground
            )}>
              今すぐ始めましょう
            </h2>
            <p className={cn(
              materialTheme.typography.bodyLarge,
              "mb-6 max-w-xl mx-auto",
              materialTheme.colors.onSurfaceVariant
            )}>
              全国の大学生が参加する学習コミュニティで、
              効率的な試験対策を始めましょう
            </p>
            <Link href="/threads">
              <MDButton
                variant="filled"
                size="large"
                endIcon={<ArrowRightIcon size={20} />}
              >
                無料で始める
              </MDButton>
            </Link>
          </MDSurface>
        </div>
      </div>

    </main>
  )
}