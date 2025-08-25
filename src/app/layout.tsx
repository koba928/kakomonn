import type { Metadata } from 'next'
import './globals.css'
import { ClientProviders } from '@/components/providers/ClientProviders'

export const metadata: Metadata = {
  title: '過去問hub - 大学生のための過去問共有プラットフォーム',
  description: '過去問を探せて、話せる。大学生のテスト対策を支援するコミュニティ',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body className="antialiased bg-white text-gray-900 transition-colors duration-300" suppressHydrationWarning>
        {/* Skip navigation link for keyboard users */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2"
        >
          メインコンテンツへスキップ
        </a>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}