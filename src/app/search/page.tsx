'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { searchNotes } from '@/lib/hearth/read'
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

export default function SearchPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<HearthNode<NoteData>[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  useEffect(() => {
    const q = query.trim()
    if (!q) {
      setResults([])
      setSearched(false)
      return
    }

    setLoading(true)
    const t = setTimeout(async () => {
      const data = await searchNotes(q)
      setResults(data)
      setLoading(false)
      setSearched(true)
    }, 200)

    return () => clearTimeout(t)
  }, [query])

  return (
    <main className="min-h-screen bg-[#0A0806] text-[#F5EFE7]">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <header className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push('/')}
            className="text-xs text-[#7A6F65] hover:text-[#F5EFE7] transition-colors font-mono"
          >
            ← inbox
          </button>
          <h1 className="font-mono tracking-[0.3em] text-sm text-[#7A6F65]">
            SEARCH
          </h1>
          <div className="w-12" />
        </header>

        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Find anything…"
          className="w-full bg-transparent text-[#F5EFE7] placeholder-[#7A6F65] px-4 py-4 outline-none text-lg border border-[#1F1813] rounded-lg bg-[#14100C]"
        />

        <section className="mt-8">
          {loading && (
            <p className="text-sm text-[#7A6F65] font-mono">searching…</p>
          )}

          {!loading && searched && results.length === 0 && (
            <p className="text-sm text-[#7A6F65]">
              Nothing found for &ldquo;{query}&rdquo;.
            </p>
          )}

          {!loading && results.length > 0 && (
            <>
              <h2 className="text-xs text-[#7A6F65] font-mono uppercase tracking-wider mb-3">
                Notes · {results.length}
              </h2>
              <ul className="space-y-1">
                {results.map((note) => (
                  <li
                    key={note.id}
                    className="border border-[#1F1813] rounded-lg bg-[#14100C] hover:bg-[#1A140F] transition-colors px-4 py-3"
                  >
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
            </>
          )}

          {!loading && !searched && (
            <p className="text-sm text-[#7A6F65]">
              Type to search across everything in Hearth.
            </p>
          )}
        </section>
      </div>
    </main>
  )
}