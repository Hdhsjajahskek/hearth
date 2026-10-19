'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { listEvents, deleteEvent } from '@/lib/hearth/events'
import type { EventData, HearthNode } from '@/lib/hearth/types'

export default function EventsPage() {
  const [events, setEvents] = useState<HearthNode<EventData>[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const data = await listEvents()
    setEvents(data)
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  async function handleDelete(id: string, title: string) {
    if (!window.confirm(`Delete event "${title}"?`)) return
    setEvents((prev) => prev.filter((e) => e.id !== id))
    await deleteEvent(id)
  }

  // Group events by Date
  const groupedEvents = events.reduce((acc, event) => {
    const date = event.data.date
    if (!acc[date]) acc[date] = []
    acc[date].push(event)
    return acc
  }, {} as Record<string, HearthNode<EventData>[]>)

  const sortedDates = Object.keys(groupedEvents).sort()

  return (
    <main className="min-h-screen bg-[#F7F4EC] pb-32 relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-[#00D1FF]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-150px] w-[600px] h-[600px] bg-[#FFB800]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 md:px-8 py-16 relative z-10">
        
        <header className="flex items-center justify-between mb-16">
          <Link href="/" className="text-sm font-bold text-[#8A8F98] hover:text-[#FF6B1A] font-sans tracking-wide transition-colors">
            ← Back
          </Link>
          <h1 className="font-sans tracking-[0.3em] text-sm text-[#1A1A1A] font-bold uppercase">
            Calendar
          </h1>
          <div className="w-12" />
        </header>

        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-serif text-[#1A1A1A] mb-4">
            Your schedule.
          </h2>
          <p className="text-lg text-[#8A8F98] font-sans">
            Meetings, events, and dates that matter.
          </p>
        </div>

        {loading && <p className="text-lg text-[#8A8F98]">loading…</p>}
        {!loading && events.length === 0 && (
          <div className="text-center py-24 editorial-card rounded-3xl">
            <p className="text-xl text-[#8A8F98] font-serif">No events scheduled.</p>
            <p className="text-sm text-[#8A8F98] mt-2 font-sans">Add one from the Daily Brief.</p>
          </div>
        )}

        <div className="space-y-12">
          {sortedDates.map(date => {
            const dayDate = new Date(date + 'T00:00:00') 
            const today = new Date()
            today.setHours(0,0,0,0)
            const isToday = dayDate.getTime() === today.getTime()

            return (
              <div key={date}>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className={`text-sm font-sans uppercase tracking-[0.2em] font-bold ${isToday ? 'text-[#FF6B1A]' : 'text-[#1A1A1A]'}`}>
                    {isToday ? 'Today' : dayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </h2>
                  <div className="h-[1px] flex-1 bg-black/5"></div>
                </div>

                <ul className="space-y-4">
                  {groupedEvents[date].map(event => (
                    <li key={event.id} className="editorial-card rounded-3xl p-6 md:p-8 flex justify-between gap-6 group">
                      <div>
                        <p className="text-2xl font-serif text-[#1A1A1A] mb-2">{event.data.title}</p>
                        {event.data.time && (
                          <p className="text-sm text-[#FF6B1A] font-sans uppercase tracking-widest font-bold">
                            {event.data.time}
                          </p>
                        )}
                        {event.data.note && (
                          <p className="text-base text-[#8A8F98] mt-3 font-sans">{event.data.note}</p>
                        )}
                      </div>
                      <button 
                        onClick={() => handleDelete(event.id, event.data.title)}
                        className="text-[#8A8F98] hover:text-[#ff4d4d] transition-colors text-2xl leading-none w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 self-start"
                        title="Delete event"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}