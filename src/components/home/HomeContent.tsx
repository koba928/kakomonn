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
      {/* プラスマークで投稿ボタン - モバイル最適化 */}
      <FloatingActionButton
        icon={<PlusIcon size={20} />}
        onClick={() => window.location.href = '/auth/email?redirect=/upload'}
        position="bottom-right"
        aria-label="過去問を投稿する"
        className="shadow-lg hover:shadow-xl transition-shadow duration-300"
      />
    </>
  )
}

export { HomeContent }
export default HomeContent