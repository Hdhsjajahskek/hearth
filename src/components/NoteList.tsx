'use client'

import { useEffect, useState } from 'react'
import type { HearthNode, NoteData } from '@/lib/hearth/types'
import { getDayNumber, deleteNote } from '@/lib/hearth/read'

interface Props {
  notes: HearthNode<NoteData>[]
  loading: boolean
  onDelete?: () => void
}

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime()
  const now = Date.now()
  const diff = Math.floor((now - then) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 172800) return 'yesterday'
  const days = Math.floor(diff / 86400)
  if (days < 30) return `${days}d ago`
  return new Date(iso).toLocaleDateString()
}

export function NoteList({ notes, loading, onDelete }: Props) {
  const [days, setDays] = useState<Record<string, number>>({})

  useEffect(() => {
    async function loadDays() {
      const newDays: Record<string, number> = {}
      for (const note of notes) {
        newDays[note.id] = await getDayNumber(note.created_at)
      }
      setDays(newDays)
    }
    if (notes.length > 0) loadDays()
  }, [notes])

  async function handleDelete(noteId: string) {
    if (!window.confirm('Delete this note? This cannot be undone.')) return
    await deleteNote(noteId)
    if (onDelete) onDelete()
  }

  if (loading) {
    return <p className="text-lg text-[#8A8F98]">loading…</p>
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-24 editorial-card rounded-3xl">
        <p className="text-xl text-[#8A8F98] font-serif">Nothing captured yet.</p>
        <p className="text-sm text-[#8A8F98] mt-2 font-sans">Go to the Brief to capture a thought.</p>
      </div>
    )
  }

  // Group notes by Day for the editorial timeline look
  const groupedByDay: Record<number, HearthNode<NoteData>[]> = {}
  for (const note of notes) {
    const dayNum = days[note.id] || 0
    if (!groupedByDay[dayNum]) groupedByDay[dayNum] = []
    groupedByDay[dayNum].push(note)
  }
  
  const sortedDays = Object.keys(groupedByDay).map(Number).sort((a, b) => b - a)

  return (
    <div className="space-y-16">
      {sortedDays.map((dayNum) => (
        <div key={dayNum}>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-sm font-sans uppercase tracking-[0.2em] font-bold text-[#FF6B1A]">
              {dayNum > 0 ? `Day ${dayNum}` : `Pre-Hearth`}
            </h2>
            <div className="h-[1px] flex-1 bg-black/5"></div>
          </div>
          
          <ul className="space-y-4">
            {groupedByDay[dayNum].map((note) => {
              const content = note.data.content
              const title = note.data.title
              const isMultiline = content.includes('\n')
              const showTitle = isMultiline && title && title !== content

              return (
                <li key={note.id} className="editorial-card rounded-2xl p-6 md:p-8 group relative">
                  
                  {/* Delete button - appears on hover */}
                  <button 
                    onClick={() => handleDelete(note.id)}
                    className="absolute top-4 right-4 text-[#8A8F98] hover:text-[#ff4d4d] opacity-0 group-hover:opacity-100 transition-opacity text-2xl leading-none w-8 h-8 flex items-center justify-center"
                    title="Delete note"
                  >
                    ×
                  </button>

                  {showTitle && (
                    <p className="text-2xl text-[#1A1A1A] font-serif mb-3 pr-8">
                      {title}
                    </p>
                  )}
                  
                  <p className="text-lg md:text-xl text-[#1A1A1A] font-serif whitespace-pre-wrap break-words leading-relaxed pr-8">
                    {content.length > 400 ? content.slice(0, 400) + '…' : content}
                  </p>
                  
                  <div className="mt-6 flex items-center gap-2">
                    <p className="text-xs text-[#8A8F98] font-sans font-bold uppercase tracking-widest">
                      {timeAgo(note.created_at)}
                    </p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}