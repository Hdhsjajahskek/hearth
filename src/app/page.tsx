'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CaptureBox } from '@/components/CaptureBox'
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

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return (
    <main className="min-h-screen bg-[#0A0806] text-[#F5EFE7]">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <header className="flex items-center justify-between mb-8">
  <h1 className="font-mono tracking-[0.3em] text-sm text-[#7A6F65]">
    HEARTH
  </h1>
  <div className="flex items-center gap-4">
    <a
      href="/search"
      className="text-xs text-[#7A6F65] hover:text-[#F5EFE7] transition-colors font-mono"
    >
      search
    </a>
    <button
      onClick={signOut}
      className="text-xs text-[#7A6F65] hover:text-[#F5EFE7] transition-colors font-mono"
    >
      sign out
    </button>
  </div>
</header>

        <CaptureBox onCaptured={refresh} />

        <section className="mt-8">
          <h2 className="text-xs text-[#7A6F65] font-mono uppercase tracking-wider mb-3">
            Recent
          </h2>
          <NoteList notes={notes} loading={loading} />
        </section>
      </div>
    </main>
  )
}