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
    <main className="min-h-screen bg-[#F7F4EC] pb-32 relative overflow-hidden">
      
      {/* 
        THE COLOR MESH 
        6 massive orbs blending together 
      */}
      <div className="color-orb top-[-150px] left-[-100px] w-[600px] h-[600px] bg-[#FF007A]" style={{ animationDelay: '0s' }} />
      <div className="color-orb bottom-[-200px] right-[-100px] w-[700px] h-[700px] bg-[#00D1FF]" style={{ animationDelay: '2s' }} />
      <div className="color-orb top-[20%] right-[10%] w-[500px] h-[500px] bg-[#FFB800]" style={{ animationDelay: '4s' }} />
      <div className="color-orb bottom-[10%] left-[5%] w-[600px] h-[600px] bg-[#7A00FF]" style={{ animationDelay: '1s' }} />
      <div className="color-orb top-[40%] left-[30%] w-[400px] h-[400px] bg-[#FF6B1A]" style={{ animationDelay: '3s' }} />
      <div className="color-orb top-[10%] left-[50%] w-[450px] h-[450px] bg-[#00FF66]" style={{ animationDelay: '5s' }} />

      <div className="max-w-4xl mx-auto px-6 md:px-8 py-16 relative z-10">
        
        <header className="flex items-start justify-between mb-16">
          <div>
            <h1 className="font-sans tracking-[0.3em] text-sm text-[#1A1A1A] font-bold mb-6 uppercase drop-shadow-sm">Hearth</h1>
            <h2 className="text-6xl md:text-8xl font-serif text-[#1A1A1A] leading-[0.95] tracking-tighter drop-shadow-md">
              {greeting},<br /> Bhupesh.
            </h2>
            <p className="text-lg text-[#1A1A1A]/70 mt-6 font-sans font-bold tracking-wide">{todayDate}</p>
          </div>
          <button onClick={signOut} className="text-sm font-bold text-[#1A1A1A]/50 hover:text-[#FF6B1A] transition-colors mt-2">
            SIGN OUT
          </button>
        </header>

        {/* QUICK LINKS */}
        <div className="grid grid-cols-2 gap-4 mb-12">
          <Link href="/contacts" className="editorial-card rounded-3xl p-8 text-center group flex flex-col items-center justify-center">
            <span className="text-2xl text-[#1A1A1A] font-serif mb-2 group-hover:text-[#FF6B1A] transition-colors">Contacts</span>
            <span className="text-sm text-[#1A1A1A]/60 font-sans uppercase tracking-widest font-bold">Directory</span>
          </Link>
          <Link href="/events" className="editorial-card rounded-3xl p-8 text-center group flex flex-col items-center justify-center">
            <span className="text-2xl text-[#1A1A1A] font-serif mb-2 group-hover:text-[#FF6B1A] transition-colors">Calendar</span>
            <span className="text-sm text-[#1A1A1A]/60 font-sans uppercase tracking-widest font-bold">Schedule</span>
          </Link>
        </div>

        <div className="mb-20">
          <CaptureBox onCaptured={refresh} />
        </div>

        {/* TODAY'S AGENDA */}
        {(agenda.events.length > 0 || agenda.reminders.length > 0) && (
          <section className="mb-20">
            <h3 className="text-sm text-[#1A1A1A] font-sans uppercase tracking-[0.2em] font-bold mb-6 drop-shadow-sm">Today's Agenda</h3>
            <div className="space-y-4">
              {agenda.events.map((ev) => (
                <div key={ev.id} className="editorial-card rounded-3xl p-8 border-l-4 border-l-[#FF6B1A]">
                  <p className="text-[#1A1A1A] text-3xl font-serif mb-2">{ev.data.title}</p>
                  <p className="text-sm text-[#FF6B1A] font-sans uppercase tracking-widest font-bold">
                    {ev.data.time ? `${ev.data.time} · ` : ''}{ev.data.date}
                  </p>
                  {ev.data.note && <p className="text-base text-[#1A1A1A]/70 mt-4 font-sans font-medium">{ev.data.note}</p>}
                </div>
              ))}
              {agenda.reminders.map((rem) => (
                <div key={rem.id} className="editorial-card rounded-3xl p-8 border-l-4 border-l-[#FF6B1A]">
                  <p className="text-xl text-[#1A1A1A] font-sans font-medium">{rem.data.content}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* RESUME READING */}
        {recentBook && (
          <section>
            <h3 className="text-sm text-[#1A1A1A] font-sans uppercase tracking-[0.2em] font-bold mb-6 drop-shadow-sm">Continue Reading</h3>
            <Link href={`/books/${recentBook.id}`} className="block editorial-card rounded-3xl p-10 group">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl text-[#1A1A1A] font-serif mb-4 leading-tight">{recentBook.data.title}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-[#1A1A1A] bg-[#FF6B1A]/20 border border-[#FF6B1A]/30 px-3 py-1 rounded-full font-sans tracking-widest uppercase font-bold">
                      {recentBook.data.format === 'epub' ? 'EPUB' : 'PDF'}
                    </span>
                    <span className="text-sm text-[#1A1A1A]/60 font-sans tracking-widest uppercase font-bold">
                      Page {recentBook.data.current_page} / {recentBook.data.total_pages || '?'}
                    </span>
                  </div>
                </div>
                <span className="text-[#FF6B1A] text-5xl transform group-hover:translate-x-3 transition-transform">→</span>
              </div>
            </Link>
          </section>
        )}

      </div>
      
      <BottomNav />
    </main>
  )
}