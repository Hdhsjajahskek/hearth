'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { getBook, getBookSignedUrl, updateBookProgress } from '@/lib/hearth/books'
import type { BookData, HearthNode } from '@/lib/hearth/types'
import { BookNotesPanel } from './BookNotesPanel'
import { EpubReader } from './EpubReader'

export default function BookView({ bookId }: { bookId: string }) {
  const [book, setBook] = useState<HearthNode<BookData> | null>(null)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState<number | null>(null)
  const [zoomPercent, setZoomPercent] = useState(100)
  const [showNotes, setShowNotes] = useState(false)
  const [fullScreen, setFullScreen] = useState(false)

  const iframeRef = useRef<HTMLIFrameElement>(null)
  // Keeps track of the latest page so we can save it when the component unmounts
  const latestPageRef = useRef<number>(1)

  // Load book + signed URL
  useEffect(() => {
    let cancelled = false

    async function load() {
      const b = await getBook(bookId)
      if (cancelled) return
      if (!b) {
        setError('Book not found.')
        setLoading(false)
        return
      }
      setBook(b)
      setPage(b.data.current_page || 1)
      latestPageRef.current = b.data.current_page || 1
      setTotalPages(null)

      if (b.data.format === 'epub') {
        setLoading(false)
        return
      }

      const url = await getBookSignedUrl(b.data.file_path, 60 * 60 * 8)
      if (cancelled) return
      if (!url) {
        setError('Could not open the PDF.')
        setLoading(false)
        return
      }
      setPdfUrl(url)
      setLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [bookId])

  // Listen for messages from the PDF viewer
  useEffect(() => {
    function onMessage(ev: MessageEvent) {
      const data = ev.data
      if (!data || typeof data !== 'object') return
      if (typeof data.type !== 'string' || !data.type.startsWith('hearth:')) return

      if (data.type === 'hearth:pagesloaded' && typeof data.total === 'number') {
        setTotalPages(data.total)
      }

      if (data.type === 'hearth:pagechanging' && typeof data.page === 'number') {
        setPage(data.page)
        latestPageRef.current = data.page // Update the ref immediately
      }

      if (data.type === 'hearth:zoomChanged' && typeof data.percent === 'number') {
        setZoomPercent(data.percent)
      }
    }

    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  // Save progress debounced (while reading)
  useEffect(() => {
    if (!book || book.data.format === 'epub') return
    const t = setTimeout(() => {
      updateBookProgress(book.id, page, totalPages)
    }, 1500)
    return () => clearTimeout(t)
  }, [page, book, totalPages])

  // Force save when leaving the page (tab close, back button, nav)
  useEffect(() => {
    function flushSave() {
      if (book && book.data.format !== 'epub' && latestPageRef.current > 0) {
        updateBookProgress(book.id, latestPageRef.current, totalPages)
      }
    }

    window.addEventListener('beforeunload', flushSave)
    window.addEventListener('pagehide', flushSave)

    return () => {
      window.removeEventListener('beforeunload', flushSave)
      window.removeEventListener('pagehide', flushSave)
      flushSave() // Save on unmount
    }
  }, [book, totalPages])

  // ESC exits full screen
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setFullScreen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function postToViewer(msg: Record<string, unknown>) {
    iframeRef.current?.contentWindow?.postMessage(msg, '*')
  }

  function gotoPage(n: number) {
    if (n < 1) return
    if (totalPages && n > totalPages) return
    postToViewer({ type: 'hearth:goto', page: n })
    setPage(n)
    latestPageRef.current = n
  }

  function zoomIn() { postToViewer({ type: 'hearth:zoom', zoom: (zoomPercent + 10) / 100 }) }
  function zoomOut() { postToViewer({ type: 'hearth:zoom', zoom: (zoomPercent - 10) / 100 }) }
  function fitWidth() { postToViewer({ type: 'hearth:fitWidth' }) }

  function onIframeLoad() {
    if (pdfUrl && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage({ type: 'hearth:fileUrl', url: pdfUrl }, '*')
    }
    setTimeout(() => gotoPage(page), 800)
  }

  if (loading) return <main className="min-h-screen bg-[#0A0806] text-[#F5EFE7] flex items-center justify-center"><p className="text-sm text-[#7A6F65] font-mono">loading book…</p></main>
  if (error || !book) return <main className="min-h-screen bg-[#0A0806] text-[#F5EFE7] p-8"><Link href="/books" className="text-xs text-[#7A6F65] hover:text-[#F5EFE7] font-mono">← books</Link><p className="mt-8 text-sm text-[#8B4A2A]">{error ?? 'Not found.'}</p></main>

  if (book.data.format === 'epub') {
    return (
      <main className="min-h-screen bg-[#0A0806] text-[#F5EFE7] flex flex-col">
        <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-[#1F1813]">
          <Link href="/books" className="text-xs text-[#7A6F65] hover:text-[#F5EFE7] transition-colors font-mono">← books</Link>
          <h1 className="text-sm font-medium truncate max-w-xs md:max-w-xl">{book.data.title}</h1>
          <button onClick={() => setShowNotes((v) => !v)} className="text-xs text-[#7A6F65] hover:text-[#F5EFE7] transition-colors font-mono">{showNotes ? 'hide notes' : 'notes'}</button>
        </header>
        <div className="flex-1 flex overflow-hidden min-h-0">
          <EpubReader book={book} />
          {showNotes && <div className="w-[340px] border-l border-[#1F1813] bg-[#0A0806] overflow-hidden"><BookNotesPanel bookId={book.id} /></div>}
        </div>
      </main>
    )
  }

  if (!pdfUrl) return <main className="min-h-screen bg-[#0A0806] text-[#F5EFE7] p-8"><Link href="/books" className="text-xs text-[#7A6F65] hover:text-[#F5EFE7] font-mono">← books</Link><p className="mt-8 text-sm text-[#8B4A2A]">Could not open the PDF.</p></main>

  const progress = totalPages && totalPages > 0 ? Math.round((page / totalPages) * 100) : null

  return (
    <main className="min-h-screen bg-[#0A0806] text-[#F5EFE7] flex flex-col">
      {!fullScreen && (
        <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-[#1F1813]">
          <Link href="/books" className="text-xs text-[#7A6F65] hover:text-[#F5EFE7] transition-colors font-mono">← books</Link>
          <h1 className="text-sm font-medium truncate max-w-xs md:max-w-xl">{book.data.title}</h1>
          <div className="flex items-center gap-3">
            <button onClick={() => setFullScreen(true)} className="text-xs text-[#7A6F65] hover:text-[#F5EFE7] transition-colors font-mono">full</button>
            <button onClick={() => setShowNotes((v) => !v)} className="text-xs text-[#7A6F65] hover:text-[#F5EFE7] transition-colors font-mono">{showNotes ? 'hide notes' : 'notes'}</button>
          </div>
        </header>
      )}

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col relative">
          {!fullScreen && (
            <>
              <div className="flex items-center justify-between px-2 md:px-6 py-2 border-b border-[#1F1813] bg-[#14100C] gap-1 md:gap-2 flex-wrap">
                <button onClick={() => gotoPage(page - 1)} disabled={page <= 1} className="text-xs text-[#7A6F65] hover:text-[#F5EFE7] disabled:opacity-30 font-mono whitespace-nowrap">← prev</button>
                <div className="flex items-center gap-1 md:gap-2 flex-wrap justify-center">
                  <input type="number" min={1} max={totalPages ?? undefined} value={page} onChange={(e) => { const n = parseInt(e.target.value); if (!isNaN(n)) gotoPage(n) }} className="w-12 md:w-14 bg-[#0A0806] text-center text-xs text-[#F5EFE7] font-mono border border-[#1F1813] rounded px-1 md:px-2 py-1 outline-none focus:border-[#8B4A2A]" />
                  <span className="text-xs text-[#7A6F65] font-mono">/ {totalPages ?? '?'}</span>
                  <div className="flex items-center gap-1 ml-1 md:ml-3">
                    <button onClick={zoomOut} className="w-6 h-6 text-xs text-[#7A6F65] hover:text-[#F5EFE7] border border-[#1F1813] rounded font-mono">−</button>
                    <span className="text-xs text-[#7A6F65] font-mono w-9 md:w-10 text-center">{zoomPercent}%</span>
                    <button onClick={zoomIn} className="w-6 h-6 text-xs text-[#7A6F65] hover:text-[#F5EFE7] border border-[#1F1813] rounded font-mono">+</button>
                    <button onClick={fitWidth} className="ml-1 md:ml-2 text-xs text-[#7A6F65] hover:text-[#F5EFE7] font-mono">fit</button>
                  </div>
                </div>
                <button onClick={() => gotoPage(page + 1)} disabled={totalPages ? page >= totalPages : false} className="text-xs text-[#7A6F65] hover:text-[#F5EFE7] disabled:opacity-30 font-mono whitespace-nowrap">next →</button>
              </div>
              <div className="h-[2px] bg-[#1F1813]">
                <div className="h-full bg-[#FF6B1A] transition-all duration-300" style={{ width: progress !== null ? `${progress}%` : '0%' }} />
              </div>
            </>
          )}

          {fullScreen && <button onClick={() => setFullScreen(false)} className="absolute top-3 right-3 z-20 text-xs text-[#7A6F65] hover:text-[#F5EFE7] transition-colors font-mono bg-[#14100C]/80 backdrop-blur border border-[#1F1813] rounded px-3 py-1.5">exit full</button>}

          <div className="flex-1 relative" onDoubleClick={() => setFullScreen((v) => !v)}>
            <button aria-label="Previous page" onClick={() => gotoPage(page - 1)} disabled={page <= 1} className="absolute left-0 top-0 bottom-0 w-[8%] max-w-[80px] z-10 cursor-w-resize disabled:cursor-default" />
            <button aria-label="Next page" onClick={() => gotoPage(page + 1)} disabled={totalPages ? page >= totalPages : false} className="absolute right-0 top-0 bottom-0 w-[8%] max-w-[80px] z-10 cursor-e-resize disabled:cursor-default" />
            <iframe ref={iframeRef} onLoad={onIframeLoad} src="/pdfjs/viewer.html" className="absolute inset-0 w-full h-full" style={{ border: 'none', background: '#0A0806' }} title={book.data.title} />
          </div>
        </div>

        {showNotes && !fullScreen && <div className="w-[340px] border-l border-[#1F1813] bg-[#0A0806] overflow-hidden"><BookNotesPanel bookId={book.id} /></div>}
      </div>
    </main>
  )
}