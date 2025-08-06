import type { Metadata } from 'next'
import './globals.css'

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
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}