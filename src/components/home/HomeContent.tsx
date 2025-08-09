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
          <ThemeToggle />
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
        <ThemeToggle />
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