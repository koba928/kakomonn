'use client'

import { useState, useEffect } from 'react'
import { PlusIcon } from '@/components/icons/IconSystem'
import { FloatingActionButton } from '@/components/ui/MicroInteractions'

function HomeContent() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <>
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