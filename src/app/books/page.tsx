'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBook, listBooks } from '@/lib/hearth/books'
import type { BookData, HearthNode } from '@/lib/hearth/types'

export default function BooksPage() {
  const router = useRouter()
  const [books, setBooks] = useState<HearthNode<BookData>[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const refresh = useCallback(async () => {
    const data = await listBooks()
    setBooks(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  async function onFilePicked(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.type !== 'application/pdf') {
      setError('Only PDF files are supported right now.')
      return
    }

    setUploading(true)
    setError(null)

    const result = await createBook(file)

    setUploading(false)

    if (fileRef.current) fileRef.current.value = ''

    if (!result.ok) {
      setError(result.error)
      return
    }

    await refresh()
    router.push(`/books/${result.book.id}`)
  }

  return (
    <main className="min-h-screen bg-[#0A0806] text-[#F5EFE7]">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <header className="flex items-center justify-between mb-10">
          <Link
            href="/"
            className="text-xs text-[#7A6F65] hover:text-[#F5EFE7] transition-colors font-mono"
          >
            ← home
          </Link>
          <h1 className="font-mono tracking-[0.3em] text-sm text-[#7A6F65]">
            BOOKS
          </h1>
          <div className="w-12" />
        </header>

        <div className="mb-10">
          <label className="block">
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf,.pdf"
              onChange={onFilePicked}
              className="hidden"
              disabled={uploading}
            />
            <span
              onClick={() => !uploading && fileRef.current?.click()}
              className="cursor-pointer block w-full text-center border border-dashed border-[#1F1813] hover:border-[#8B4A2A] rounded-lg py-8 transition-colors"
            >
              <span className="text-sm text-[#7A6F65]">
                {uploading ? 'uploading…' : 'Drop a PDF here, or click to choose'}
              </span>
            </span>
          </label>
          {error && (
            <p className="mt-3 text-sm text-[#8B4A2A]">{error}</p>
          )}
        </div>

        {loading && (
          <p className="text-sm text-[#7A6F65] font-mono">loading…</p>
        )}

        {!loading && books.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-[#7A6F65]">No books yet.</p>
            <p className="text-xs text-[#7A6F65] mt-1">
              Upload a PDF to start your shelf.
            </p>
          </div>
        )}

        {!loading && books.length > 0 && (
          <ul className="space-y-2">
            {books.map((book) => {
              const progress =
                book.data.total_pages && book.data.total_pages > 0
                  ? Math.round(
                      (book.data.current_page / book.data.total_pages) * 100
                    )
                  : null

              return (
                <li key={book.id}>
                  <Link
                    href={`/books/${book.id}`}
                    className="block border border-[#1F1813] rounded-lg bg-[#14100C] hover:bg-[#1A140F] transition-colors px-5 py-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-[#F5EFE7] text-sm font-medium truncate">
                          {book.data.title}
                        </p>
                        {book.data.author && (
                          <p className="text-xs text-[#7A6F65] mt-0.5 truncate">
                            {book.data.author}
                          </p>
                        )}
                      </div>
                      <p className="text-xs text-[#7A6F65] font-mono whitespace-nowrap">
                        {progress !== null
                          ? `${progress}%`
                          : `p. ${book.data.current_page}`}
                      </p>
                    </div>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </main>
  )
}