'use client'

import type { HearthNode, NoteData } from '@/lib/hearth/types'

interface Props {
  notes: HearthNode<NoteData>[]
  loading: boolean
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

export function NoteList({ notes, loading }: Props) {
  if (loading) {
    return (
      <p className="text-sm text-[#7A6F65] font-mono">loading…</p>
    )
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
      {notes.map((note) => (
        <li
          key={note.id}
          className="border border-[#1F1813] rounded-lg bg-[#14100C] hover:bg-[#1A140F] transition-colors px-4 py-3"
        >
          {note.data.title && (
            <p className="text-[#F5EFE7] text-sm font-medium mb-1 truncate">
              {note.data.title}
            </p>
          )}
          <p className="text-[#F5EFE7] text-sm whitespace-pre-wrap break-words leading-relaxed">
            {note.data.content.length > 400
              ? note.data.content.slice(0, 400) + '…'
              : note.data.content}
          </p>
          <p className="text-xs text-[#7A6F65] mt-2 font-mono">
            {timeAgo(note.created_at)}
          </p>
        </li>
      ))}
    </ul>
  )
}