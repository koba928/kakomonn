'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { UserIcon, PlusIcon } from '@/components/icons/IconSystem'
import { ThemeToggle } from '@/components/theme/ThemeProvider'
import { FloatingActionButton } from '@/components/ui/MicroInteractions'
import { useAuthContext } from '@/components/providers/AuthProvider'

function HomeContent() {
  const { user } = useAuthContext()
  const isLoggedIn = !!user
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <>
        {/* Header Controls - Static version during SSR */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-center gap-3">
          <div className="flex items-center gap-3">
            <Link href="/register/step-by-step" className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-200 hover:bg-white transition-all duration-200">
              <div className="flex items-center gap-2">
                <UserIcon size={16} className="text-indigo-600" />
                <span className="text-sm font-medium text-gray-700">ユーザー登録</span>
              </div>
            </Link>
          </div>
        </div>
        
        {/* プラスマークで投稿ボタン */}
        <FloatingActionButton
          icon={<PlusIcon size={24} />}
          onClick={() => window?.location && (window.location.href = '/upload')}
          position="bottom-right"
          aria-label="投稿する"
        />
      </>
    )
  }

  return (
    <>
      {/* Header Controls */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 flex items-center gap-3">
        {isLoggedIn ? (
          <div className="flex items-center gap-3">
            <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-600">
              <div className="flex items-center gap-2">
                <UserIcon size={16} className="text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  {user?.name}さん ({user?.university} {user?.faculty} {user?.year}年)
                </span>
              </div>
            </div>
            <ThemeToggle />
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link href="/register/step-by-step" className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:bg-white dark:hover:bg-gray-800 transition-all duration-200">
              <div className="flex items-center gap-2">
                <UserIcon size={16} className="text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">ユーザー登録</span>
              </div>
            </Link>
            <ThemeToggle />
          </div>
        )}
      </div>
      
      {/* プラスマークで投稿ボタン */}
      <FloatingActionButton
        icon={<PlusIcon size={24} />}
        onClick={() => window.location.href = '/upload'}
        position="bottom-right"
        aria-label="投稿する"
      />
    </>
  )
}

export { HomeContent }
export default HomeContent