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
    return <p className="text-sm text-[#7A6F65] font-mono">loading…</p>
  }

  if (notes.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-[#7A6F65] text-sm">Nothing captured yet.</p>
        <p className="text-[#7A6F65] text-xs mt-1">
          Type something above and press Capture.
        </p>
      </div>
    )
  }

  return (
    <ul className="space-y-1">
      {notes.map((note) => {
        const content = note.data.content
        const title = note.data.title
        const isMultiline = content.includes('\n')
        const showTitle = isMultiline && title && title !== content
        const dayNum = days[note.id]

        return (
          <li
            key={note.id}
            className="group border border-[#1F1813] rounded-lg bg-[#14100C] hover:bg-[#1A140F] transition-colors px-4 py-3"
          >
            {showTitle && (
              <p className="text-[#F5EFE7] text-sm font-medium mb-1 truncate">
                {title}
              </p>
            )}
            <p className="text-[#F5EFE7] text-sm whitespace-pre-wrap break-words leading-relaxed">
              {content.length > 400 ? content.slice(0, 400) + '…' : content}
            </p>
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <p className="text-xs text-[#7A6F65] font-mono">
                  {timeAgo(note.created_at)}
                </p>
                {dayNum && (
                  <>
                    <span className="text-[#1F1813] text-xs">•</span>
                    <p className="text-[10px] text-[#FF6B1A] font-mono uppercase tracking-wider">
                      {dayNum > 0 ? `Day ${dayNum}` : `Pre-Hearth`}
                    </p>
                  </>
                )}
              </div>
              
              {/* Clear, visible delete button */}
              <button 
                onClick={() => handleDelete(note.id)}
                className="text-xs text-[#8B4A2A] hover:text-[#ff4d4d] transition-colors font-mono"
                title="Delete note"
              >
                delete
              </button>
            </div>
          </li>
        )
      })}
    </ul>
  )
}