'use client'

import { useParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'
import type { ComponentType } from 'react'


function BookPageInner() {
  const params = useParams<{ id: string }>()
  const bookId = params?.id

  const [BookView, setBookView] = useState<ComponentType<{ bookId: string }> | null>(null)

  useEffect(() => {
    import('./BookView').then((mod) => {
      setBookView(() => mod.default)
    })
  }, [])

  if (!bookId || !BookView) {
    return (
      <main className="min-h-screen bg-[#0A0806] text-[#F5EFE7] flex items-center justify-center">
        <p className="text-sm text-[#7A6F65] font-mono">loading book…</p>
      </main>
    )
  }

  return <BookView bookId={bookId} />
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#0A0806] text-[#F5EFE7] flex items-center justify-center">
          <p className="text-sm text-[#7A6F65] font-mono">loading book…</p>
        </main>
      }
    >
      <BookPageInner />
    </Suspense>
  )
}