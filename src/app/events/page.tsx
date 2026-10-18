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
    <main className="min-h-screen bg-[#0A0806] text-[#F5EFE7] pb-24">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <Link href="/" className="text-xs text-[#7A6F65] hover:text-[#F5EFE7] font-mono">← home</Link>
          <h1 className="font-mono tracking-[0.3em] text-sm text-[#7A6F65]">CALENDAR</h1>
          <div className="w-12" />
        </header>

        {loading && <p className="text-sm text-[#7A6F65]">loading…</p>}
        {!loading && events.length === 0 && (
          <p className="text-sm text-[#7A6F65]">No events scheduled. Go to the Daily Brief to add one.</p>
        )}

        <div className="space-y-8">
          {sortedDates.map(date => {
            const dayDate = new Date(date + 'T00:00:00') // Force local timezone
            const today = new Date()
            today.setHours(0,0,0,0)
            const isToday = dayDate.getTime() === today.getTime()

            return (
              <div key={date}>
                <div className="flex items-center gap-4 mb-4">
                  <h2 className={`text-xs font-mono uppercase tracking-widest ${isToday ? 'text-[#FF6B1A]' : 'text-[#7A6F65]'}`}>
                    {isToday ? 'Today' : dayDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </h2>
                  <div className="h-[1px] flex-1 bg-[#1F1813]"></div>
                </div>

                <ul className="space-y-3">
                  {groupedEvents[date].map(event => (
                    <li key={event.id} className="border border-[#1F1813] rounded-lg bg-[#14100C] p-4 flex justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-[#F5EFE7]">{event.data.title}</p>
                        {event.data.time && <p className="text-xs text-[#FF6B1A] mt-1 font-mono">{event.data.time}</p>}
                        {event.data.note && <p className="text-xs text-[#7A6F65] mt-1">{event.data.note}</p>}
                      </div>
                      <button 
                        onClick={() => handleDelete(event.id, event.data.title)}
                        className="text-[#8B4A2A] hover:text-[#ff4d4d] text-lg leading-none self-start"
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