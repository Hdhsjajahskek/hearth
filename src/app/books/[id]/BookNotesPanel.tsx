'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getNotesForBook, createBookNote } from '@/lib/hearth/books'
import type { HearthNode, NoteData } from '@/lib/hearth/types'

// A "point" is a short note — under 120 chars, single line.
const POINT_MAX_LENGTH = 120

function isPoint(note: HearthNode<NoteData>): boolean {
  const c = note.data.content
  return c.length <= POINT_MAX_LENGTH && !c.includes('\n')
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

export function BookNotesPanel({ bookId }: { bookId: string }) {
  const [notes, setNotes] = useState<HearthNode<NoteData>[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Point input
  const [pointValue, setPointValue] = useState('')
  const [savingPoint, setSavingPoint] = useState(false)
  const pointRef = useRef<HTMLInputElement>(null)

  // Note input
  const [noteValue, setNoteValue] = useState('')
  const [savingNote, setSavingNote] = useState(false)
  const noteRef = useRef<HTMLTextAreaElement>(null)

  const refresh = useCallback(async () => {
    const data = await getNotesForBook(bookId)
    setNotes(data)
    setLoading(false)
  }, [bookId])

  useEffect(() => {
    refresh()
  }, [refresh])

  // Auto-grow the note textarea
  useEffect(() => {
    const el = noteRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }, [noteValue])

  async function submitPoint() {
    if (!pointValue.trim() || savingPoint) return
    setSavingPoint(true)
    setError(null)

    const result = await createBookNote(bookId, pointValue)

    setSavingPoint(false)

    if (!result.ok) {
      setError(result.error)
      return
    }

    setPointValue('')
    await refresh()
    pointRef.current?.focus()
  }

  async function submitNote() {
    if (!noteValue.trim() || savingNote) return
    setSavingNote(true)
    setError(null)

    const result = await createBookNote(bookId, noteValue)

    setSavingNote(false)

    if (!result.ok) {
      setError(result.error)
      return
    }

    setNoteValue('')
    await refresh()
    noteRef.current?.focus()
  }

  function onPointKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      submitPoint()
    }
  }

  function onNoteKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      submitNote()
    }
  }

  const points = notes.filter(isPoint)
  const longNotes = notes.filter((n) => !isPoint(n))

  return (
    <aside className="h-full border-l border-[#1F1813] bg-[#0A0806] flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#1F1813]">
        <h2 className="text-xs text-[#7A6F65] font-mono uppercase tracking-wider">
          Notes · {notes.length}
        </h2>
      </div>

      {error && (
        <div className="px-4 py-2 border-b border-[#1F1813]">
          <p className="text-xs text-[#8B4A2A]">{error}</p>
        </div>
      )}

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        {/* ---------------- POINTS ---------------- */}
        <section className="px-4 py-3 border-b border-[#1F1813]">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs text-[#7A6F65] font-mono uppercase tracking-wider">
              Points · {points.length}
            </h3>
          </div>

          {/* Point input */}
          <div className="flex items-center gap-2 mb-3">
            <input
              ref={pointRef}
              type="text"
              value={pointValue}
              onChange={(e) => setPointValue(e.target.value)}
              onKeyDown={onPointKeyDown}
              placeholder="Add a point…"
              disabled={savingPoint}
              className="flex-1 bg-[#14100C] text-[#F5EFE7] placeholder-[#7A6F65] text-sm border border-[#1F1813] focus:border-[#8B4A2A] rounded px-3 py-2 outline-none"
            />
            <button
              onClick={submitPoint}
              disabled={!pointValue.trim() || savingPoint}
              className="rounded bg-[#FF6B1A] hover:bg-[#FFB347] text-[#0A0806] font-medium text-xs py-2 px-3 disabled:opacity-30 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
            >
              {savingPoint ? '…' : '+'}
            </button>
          </div>

          {/* Points list */}
          {points.length === 0 && !loading ? (
            <p className="text-xs text-[#7A6F65] italic">
              No points yet. Short takeaways live here.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {points.map((note) => (
                <li
                  key={note.id}
                  className="flex items-start gap-2 text-sm text-[#F5EFE7] leading-snug"
                >
                  <span className="text-[#8B4A2A] mt-[3px] shrink-0">•</span>
                  <span className="flex-1">
                    {note.data.content}
                    <span className="text-xs text-[#7A6F65] font-mono ml-2">
                      {timeAgo(note.created_at)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* ---------------- NOTES ---------------- */}
        <section className="px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs text-[#7A6F65] font-mono uppercase tracking-wider">
              Notes · {longNotes.length}
            </h3>
          </div>

          {/* Note input */}
          <div className="border border-[#1F1813] rounded bg-[#14100C] mb-3">
            <textarea
              ref={noteRef}
              value={noteValue}
              onChange={(e) => setNoteValue(e.target.value)}
              onKeyDown={onNoteKeyDown}
              placeholder="What did you learn?"
              rows={2}
              disabled={savingNote}
              className="w-full bg-transparent text-[#F5EFE7] placeholder-[#7A6F65] px-3 py-2 outline-none resize-none text-sm leading-relaxed"
            />
            <div className="flex items-center justify-between px-3 pb-2">
              <span className="text-xs text-[#7A6F65] font-mono">
                {savingNote ? 'saving…' : '⌘/Ctrl + Enter'}
              </span>
              <button
                onClick={submitNote}
                disabled={!noteValue.trim() || savingNote}
                className="rounded bg-[#FF6B1A] hover:bg-[#FFB347] text-[#0A0806] font-medium text-xs py-1.5 px-3 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Add note
              </button>
            </div>
          </div>

          {/* Notes list */}
          {longNotes.length === 0 && !loading ? (
            <p className="text-xs text-[#7A6F65] italic">
              No notes yet. Longer thoughts live here.
            </p>
          ) : (
            <ul className="space-y-2">
              {longNotes.map((note) => (
                <li
                  key={note.id}
                  className="border border-[#1F1813] rounded bg-[#14100C] px-3 py-2"
                >
                  <p className="text-[#F5EFE7] text-sm whitespace-pre-wrap break-words leading-relaxed">
                    {note.data.content}
                  </p>
                  <p className="text-xs text-[#7A6F65] mt-2 font-mono">
                    {timeAgo(note.created_at)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </aside>
  )
}