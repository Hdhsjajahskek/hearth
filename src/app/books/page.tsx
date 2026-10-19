'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBook, listBooks, deleteBook } from '@/lib/hearth/books'
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

    const nameLower = file.name.toLowerCase()
    if (!nameLower.endsWith('.pdf') && !nameLower.endsWith('.epub')) {
      setError('Only PDF and EPUB files are supported.')
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

  async function handleDelete(e: React.MouseEvent, id: string, path: string, title: string) {
    e.preventDefault()
    e.stopPropagation()
    if (!window.confirm(`Delete "${title}"? This will permanently remove the file.`)) return
    
    setBooks((prev) => prev.filter((b) => b.id !== id))
    await deleteBook(id, path)
  }

  return (
    <main className="min-h-screen bg-[#F7F4EC] pb-32 relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-[#FF6B1A]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-150px] w-[600px] h-[600px] bg-[#FFB800]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 md:px-8 py-10 relative z-10">
        
        <header className="flex items-center justify-between mb-10">
          <Link href="/" className="text-sm font-bold text-[#8A8F98] hover:text-[#FF6B1A] font-sans tracking-wide transition-colors">
            ← Back
          </Link>
          <h1 className="font-sans tracking-[0.3em] text-xs text-[#1A1A1A] font-bold uppercase">
            Library
          </h1>
          <div className="w-12" />
        </header>

        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-serif text-[#1A1A1A] mb-2">
            Your bookshelf.
          </h2>
          <p className="text-base text-[#8A8F98] font-sans">
            Upload PDFs or EPUBs to read and take notes.
          </p>
        </div>

        {/* Uploader */}
        <div className="mb-10">
          <label className="block">
            <input
              ref={fileRef}
              type="file"
              accept="application/pdf,application/epub+zip,.pdf,.epub"
              onChange={onFilePicked}
              className="hidden"
              disabled={uploading}
            />
            <span
              onClick={() => !uploading && fileRef.current?.click()}
              className="cursor-pointer block w-full text-center editorial-card rounded-2xl py-6 transition-colors group"
            >
              <span className="text-lg text-[#8A8F98] font-serif group-hover:text-[#FF6B1A] transition-colors">
                {uploading ? 'uploading…' : '+ Add a new book'}
              </span>
            </span>
          </label>
          {error && (
            <p className="mt-3 text-sm text-[#FF6B1A] font-bold">{error}</p>
          )}
        </div>

        {loading && <p className="text-base text-[#8A8F98]">loading…</p>}

        {!loading && books.length === 0 && (
          <div className="text-center py-16 editorial-card rounded-2xl">
            <p className="text-lg text-[#8A8F98] font-serif">Your shelf is empty.</p>
            <p className="text-sm text-[#8A8F98] mt-2 font-sans">Upload a PDF or EPUB above to start reading.</p>
          </div>
        )}

        {!loading && books.length > 0 && (
          <ul className="space-y-3">
            {books.map((book) => {
              const progress =
                book.data.format === 'epub'
                  ? null
                  : book.data.total_pages && book.data.total_pages > 0
                  ? Math.round(
                      (book.data.current_page / book.data.total_pages) * 100
                    )
                  : null

              const formatLabel = book.data.format === 'epub' ? 'EPUB' : 'PDF'

              return (
                <li key={book.id}>
                  <Link
                    href={`/books/${book.id}`}
                    className="block editorial-card rounded-2xl p-5 group relative"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-xl font-serif text-[#1A1A1A] mb-1 truncate group-hover:text-[#FF6B1A] transition-colors">
                          {book.data.title}
                        </p>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-[#1A1A1A] bg-[#FF6B1A]/10 border border-[#FF6B1A]/20 px-2 py-0.5 rounded-full font-sans tracking-widest uppercase font-bold">
                            {formatLabel}
                          </span>
                          <span className="text-xs text-[#8A8F98] font-sans tracking-widest uppercase font-bold">
                            {progress !== null ? `${progress}% read` : 'Start reading'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <button
                          onClick={(e) => handleDelete(e, book.id, book.data.file_path, book.data.title)}
                          className="text-[#8A8F98] hover:text-[#ff4d4d] transition-colors p-1 text-xl leading-none opacity-0 group-hover:opacity-100"
                          title="Delete book"
                        >
                          ×
                        </button>
                        <span className="text-[#FF6B1A] text-xl transform group-hover:translate-x-1 transition-transform">→</span>
                      </div>
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