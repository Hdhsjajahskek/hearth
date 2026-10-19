'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { NoteList } from '@/components/NoteList'
import { recentNotes } from '@/lib/hearth/read'
import type { HearthNode, NoteData } from '@/lib/hearth/types'
import { BottomNav } from '@/components/BottomNav'

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
    <main className="min-h-screen bg-[#F7F4EC] pb-32 relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-[#FF007A]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-150px] w-[600px] h-[600px] bg-[#00D1FF]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 md:px-8 py-16 relative z-10">
        
        <header className="flex items-center justify-between mb-16">
          <Link href="/" className="text-sm font-bold text-[#8A8F98] hover:text-[#FF6B1A] font-sans tracking-wide transition-colors">
            ← Back
          </Link>
          <h1 className="font-sans tracking-[0.3em] text-sm text-[#1A1A1A] font-bold uppercase">
            Inbox
          </h1>
          <div className="w-12" />
        </header>

        <div className="mb-8">
          <h2 className="text-4xl md:text-5xl font-serif text-[#1A1A1A] mb-4">
            Your mind, captured.
          </h2>
          <p className="text-lg text-[#8A8F98] font-sans">
            Every thought, organized by the day you had it.
          </p>
        </div>

        <NoteList notes={notes} loading={loading} onDelete={refresh} />

      </div>
      
      <BottomNav />
    </main>
  )
}