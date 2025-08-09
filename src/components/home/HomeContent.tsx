'use client'

import { useState, useEffect } from 'react'
import { PlusIcon } from '@/components/icons/IconSystem'
import { ThemeToggle } from '@/components/theme/ThemeProvider'
import { FloatingActionButton } from '@/components/ui/MicroInteractions'

function HomeContent() {
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
          onClick={() => window?.location && (window.location.href = '/auth/email?redirect=/upload')}
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
        onClick={() => window.location.href = '/auth/email?redirect=/upload'}
        position="bottom-right"
        aria-label="投稿する"
      />
    </>
  )
}

export { HomeContent }
export default HomeContent