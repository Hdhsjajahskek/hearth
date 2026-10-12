'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { getNotesForBook, createBookNote } from '@/lib/hearth/books'
import type { HearthNode, NoteData } from '@/lib/hearth/types'

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
  const [value, setValue] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const refresh = useCallback(async () => {
    const data = await getNotesForBook(bookId)
    setNotes(data)
    setLoading(false)
  }, [bookId])

  useEffect(() => {
    refresh()
  }, [refresh])

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 160) + 'px'
  }, [value])

  async function submit() {
    if (!value.trim() || saving) return
    setSaving(true)
    setError(null)

    const result = await createBookNote(bookId, value)

    setSaving(false)

    if (!result.ok) {
      setError(result.error)
      return
    }

    setValue('')
    await refresh()
    textareaRef.current?.focus()
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      submit()
    }
  }

  return (
    <aside className="h-full border-l border-[#1F1813] bg-[#0A0806] flex flex-col">
      <div className="px-4 py-3 border-b border-[#1F1813]">
        <h2 className="text-xs text-[#7A6F65] font-mono uppercase tracking-wider">
          Notes · {notes.length}
        </h2>
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-b border-[#1F1813]">
        <div className="border border-[#1F1813] rounded bg-[#14100C]">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="What did you learn?"
            rows={2}
            className="w-full bg-transparent text-[#F5EFE7] placeholder-[#7A6F65] px-3 py-2 outline-none resize-none text-sm leading-relaxed"
          />
          <div className="flex items-center justify-between px-3 pb-2">
            <span className="text-xs text-[#7A6F65] font-mono">
              {saving ? (
                'saving…'
              ) : error ? (
                <span className="text-[#8B4A2A]">{error}</span>
              ) : (
                '⌘/Ctrl + Enter'
              )}
            </span>
            <button
              onClick={submit}
              disabled={!value.trim() || saving}
              className="rounded bg-[#FF6B1A] hover:bg-[#FFB347] text-[#0A0806] font-medium text-xs py-1.5 px-3 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {loading && (
          <p className="text-xs text-[#7A6F65] font-mono">loading…</p>
        )}

        {!loading && notes.length === 0 && (
          <p className="text-sm text-[#7A6F65]">
            No notes yet. Write what you learn as you read.
          </p>
        )}

        {!loading && notes.length > 0 && (
          <ul className="space-y-2">
            {notes.map((note) => (
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
      </div>
    </aside>
  )
}