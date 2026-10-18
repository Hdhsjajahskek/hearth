'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CaptureBox } from '@/components/CaptureBox'
import { getRecentBook } from '@/lib/hearth/read'
import type { HearthNode, BookData } from '@/lib/hearth/types'
import Link from 'next/link'
import { BottomNav } from '@/components/BottomNav'

export default function DailyBriefPage() {
  const [recentBook, setRecentBook] = useState<HearthNode<BookData> | null>(null)
  const [greeting, setGreeting] = useState('Hello')
  const [todayDate, setTodayDate] = useState('')
  const [mounted, setMounted] = useState(false)

  const refresh = useCallback(async () => {
    const bookData = await getRecentBook()
    setRecentBook(bookData)
  }, [])

  useEffect(() => {
    setMounted(true)
    const now = new Date()
    const hour = now.getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 18) setGreeting('Good afternoon')
    else setGreeting('Good evening')

    setTodayDate(now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }))
    refresh()
  }, [refresh])

  async function signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-[#0A0806] text-[#F5EFE7] pb-24">
      <div className="max-w-2xl mx-auto px-4 md:px-6 py-12">
        
        {/* HEADER */}
        <header className="flex items-start justify-between mb-12">
          <div>
            <h1 className="font-mono tracking-[0.3em] text-xs text-[#7A6F65] mb-4">HEARTH</h1>
            <h2 className="text-3xl font-medium tracking-tight">{greeting}, Bhupesh.</h2>
            <p className="text-sm text-[#7A6F65] mt-2">{todayDate}</p>
          </div>
          <button onClick={signOut} className="text-[10px] text-[#7A6F65] hover:text-[#F5EFE7] font-mono transition-colors">
            sign out
          </button>
        </header>

        {/* QUICK CAPTURE */}
        <div className="mb-12">
          <CaptureBox onCaptured={refresh} />
        </div>

        {/* RESUME READING */}
        {recentBook && (
          <section>
            <h3 className="text-xs text-[#FF6B1A] font-mono uppercase tracking-wider mb-4">Continue Reading</h3>
            <Link href={`/books/${recentBook.id}`} className="block border border-[#1F1813] rounded-xl bg-[#14100C] hover:bg-[#1A140F] p-6 transition-all hover:border-[#8B4A2A]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg text-[#F5EFE7] font-medium mb-1">{recentBook.data.title}</p>
                  <p className="text-xs text-[#7A6F65] font-mono">
                    {recentBook.data.format === 'epub' ? 'EPUB Reader' : `Page ${recentBook.data.current_page} / ${recentBook.data.total_pages || '?'}`}
                  </p>
                </div>
                <span className="text-[#FF6B1A] text-2xl">→</span>
              </div>
            </Link>
          </section>
        )}

      </div>
      
      <BottomNav />
    </main>
  )
}