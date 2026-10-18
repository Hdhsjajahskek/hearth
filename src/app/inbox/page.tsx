'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { NoteList } from '@/components/NoteList'
import { recentNotes } from '@/lib/hearth/read'
import type { HearthNode, NoteData } from '@/lib/hearth/types'

export default function InboxPage() {
  const [notes, setNotes] = useState<HearthNode<NoteData>[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const data = await recentNotes()
    setNotes(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <main className="min-h-screen bg-[#0A0806] text-[#F5EFE7] pb-24">
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-8">
        <header className="flex items-center justify-between mb-8">
          <Link href="/" className="text-xs text-[#7A6F65] hover:text-[#F5EFE7] font-mono">← home</Link>
          <h1 className="font-mono tracking-[0.3em] text-sm text-[#7A6F65]">INBOX</h1>
          <div className="w-12" />
        </header>
        
        <NoteList notes={notes} loading={loading} onDelete={refresh} />
      </div>
    </main>
  )
}