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
          onClick={() => window?.location && (window.location.href = '/auth/email?redirect=/upload')}
          aria-label="投稿する"
        >
          <PlusIcon size={24} />
        </FloatingActionButton>
      </>
    )
  }

  return (
    <>
      {/* プラスマークで投稿ボタン - モバイル最適化 */}
      <FloatingActionButton
        onClick={() => window.location.href = '/auth/email?redirect=/upload'}
        aria-label="過去問を投稿する"
        className="shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <PlusIcon size={20} />
      </FloatingActionButton>
    </>
  )
}

export { HomeContent }
export default HomeContent