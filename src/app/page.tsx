'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CaptureBox } from '@/components/CaptureBox'
import { getRecentBook, getTodayAgenda } from '@/lib/hearth/read'
import type { HearthNode, BookData, EventData, NoteData } from '@/lib/hearth/types'
import Link from 'next/link'
import { BottomNav } from '@/components/BottomNav'

export default function DailyBriefPage() {
  const [recentBook, setRecentBook] = useState<HearthNode<BookData> | null>(null)
  const [agenda, setAgenda] = useState<{ events: HearthNode<EventData>[], reminders: HearthNode<NoteData>[] }>({ events: [], reminders: [] })
  const [greeting, setGreeting] = useState('Hello')
  const [todayDate, setTodayDate] = useState('')
  const [mounted, setMounted] = useState(false)

  const refresh = useCallback(async () => {
    const [bookData, agendaData] = await Promise.all([getRecentBook(), getTodayAgenda()])
    setRecentBook(bookData)
    setAgenda(agendaData)
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
        
        <header className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-mono tracking-[0.3em] text-xs text-[#7A6F65] mb-4">HEARTH</h1>
            <h2 className="text-3xl font-medium tracking-tight">{greeting}, Bhupesh.</h2>
            <p className="text-sm text-[#7A6F65] mt-2">{todayDate}</p>
          </div>
          <button onClick={signOut} className="text-[10px] text-[#7A6F65] hover:text-[#F5EFE7] font-mono transition-colors mt-2">
            sign out
          </button>
        </header>

        {/* THESE ARE THE BUTTONS YOU ARE MISSING */}
        <div className="flex gap-3 mb-8">
          <Link href="/contacts" className="flex-1 border border-[#1F1813] rounded-xl bg-[#14100C] hover:bg-[#1A140F] p-3 text-center transition-colors hover:border-[#8B4A2A]">
            <span className="text-xs text-[#7A6F65] font-mono uppercase tracking-wider">Contacts</span>
          </Link>
          <Link href="/events" className="flex-1 border border-[#1F1813] rounded-xl bg-[#14100C] hover:bg-[#1A140F] p-3 text-center transition-colors hover:border-[#8B4A2A]">
            <span className="text-xs text-[#7A6F65] font-mono uppercase tracking-wider">Calendar</span>
          </Link>
        </div>

        <div className="mb-12">
          <CaptureBox onCaptured={refresh} />
        </div>

        {/* TODAY'S AGENDA */}
        {(agenda.events.length > 0 || agenda.reminders.length > 0) && (
          <section className="mb-12">
            <h3 className="text-xs text-[#FF6B1A] font-mono uppercase tracking-wider mb-4">Today's Agenda</h3>
            <div className="space-y-3">
              {agenda.events.map((ev) => (
                <div key={ev.id} className="border border-[#1F1813] rounded-xl bg-[#14100C] p-4">
                  <p className="text-[#F5EFE7] text-sm font-medium">{ev.data.title}</p>
                  <p className="text-xs text-[#FF6B1A] mt-1 font-mono">
                    {ev.data.time ? `${ev.data.time} · ` : ''}{ev.data.date}
                  </p>
                  {ev.data.note && <p className="text-xs text-[#7A6F65] mt-1">{ev.data.note}</p>}
                </div>
              ))}
              {agenda.reminders.map((rem) => (
                <div key={rem.id} className="border border-[#1F1813] rounded-xl bg-[#14100C] p-4 border-l-4 border-l-[#FFB347]">
                  <p className="text-sm text-[#F5EFE7]">{rem.data.content}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* RESUME READING */}
        {recentBook && (
          <section>
            <h3 className="text-xs text-[#FF6B1A] font-mono uppercase tracking-wider mb-4">Continue Reading</h3>
            <Link href={`/books/${recentBook.id}`} className="block border border-[#1F1813] rounded-xl bg-[#14100C] hover:bg-[#1A140F] p-5 transition-all hover:border-[#8B4A2A]">
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