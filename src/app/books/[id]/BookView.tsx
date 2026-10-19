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
  
  // We hide the toolbar in full screen
  const [fullScreen, setFullScreen] = useState(false)

  const iframeRef = useRef<HTMLIFrameElement>(null)
  const latestPageRef = useRef<number>(1)

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
        latestPageRef.current = data.page
      }

      if (data.type === 'hearth:zoomChanged' && typeof data.percent === 'number') {
        setZoomPercent(data.percent)
      }
    }

    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [])

  useEffect(() => {
    if (!book || book.data.format === 'epub') return
    const t = setTimeout(() => {
      updateBookProgress(book.id, page, totalPages)
    }, 1500)
    return () => clearTimeout(t)
  }, [page, book, totalPages])

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
      flushSave()
    }
  }, [book, totalPages])

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

  if (loading) return <main className="min-h-screen bg-[#F7F4EC] flex items-center justify-center"><p className="text-sm text-[#8A8F98] font-mono">loading book…</p></main>
  if (error || !book) return <main className="min-h-screen bg-[#F7F4EC] p-8"><Link href="/books" className="text-sm font-bold text-[#8A8F98] hover:text-[#FF6B1A] font-sans">← books</Link><p className="mt-8 text-base text-[#FF6B1A]">{error ?? 'Not found.'}</p></main>

  if (book.data.format === 'epub') {
    return (
      <main className="min-h-screen bg-[#F7F4EC] flex flex-col">
        <header className="flex items-center justify-between px-6 py-4 border-b border-black/5 bg-white/80 backdrop-blur-md">
          <Link href="/books" className="text-sm font-bold text-[#8A8F98] hover:text-[#FF6B1A] font-sans">← Library</Link>
          <h1 className="text-sm font-sans font-bold uppercase tracking-widest text-[#1A1A1A] truncate max-w-[50%]">{book.data.title}</h1>
          <button onClick={() => setShowNotes((v) => !v)} className="text-sm font-bold text-[#8A8F98] hover:text-[#FF6B1A] font-sans">{showNotes ? 'Hide Notes' : 'Notes'}</button>
        </header>
        <div className="flex-1 flex overflow-hidden min-h-0">
          <EpubReader book={book} />
          {showNotes && <div className="w-[340px] border-l border-black/5 bg-[#F7F4EC] overflow-hidden"><BookNotesPanel bookId={book.id} /></div>}
        </div>
      </main>
    )
  }

  if (!pdfUrl) return <main className="min-h-screen bg-[#F7F4EC] p-8"><Link href="/books" className="text-sm font-bold text-[#8A8F98] hover:text-[#FF6B1A] font-sans">← Library</Link><p className="mt-8 text-base text-[#FF6B1A]">Could not open the PDF.</p></main>

  const progress = totalPages && totalPages > 0 ? Math.round((page / totalPages) * 100) : null

  return (
    <main className="min-h-screen bg-[#F7F4EC] flex flex-col">
      
      {!fullScreen && (
        <header className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-black/5 bg-white/80 backdrop-blur-md z-40">
          <Link href="/books" className="text-sm font-bold text-[#8A8F98] hover:text-[#FF6B1A] font-sans">← Library</Link>
          <h1 className="text-sm font-sans font-bold uppercase tracking-widest text-[#1A1A1A] truncate max-w-[50%]">{book.data.title}</h1>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowNotes((v) => !v)} className="text-sm font-bold text-[#8A8F98] hover:text-[#FF6B1A] font-sans">{showNotes ? 'Hide Notes' : 'Notes'}</button>
            <button onClick={() => setFullScreen(true)} className="text-sm font-bold text-[#8A8F98] hover:text-[#FF6B1A] font-sans">Full</button>
          </div>
        </header>
      )}

      <div className="flex-1 flex overflow-hidden relative">
        <div className="flex-1 flex flex-col relative">
          
          {!fullScreen && (
            <div className="flex items-center justify-between px-4 md:px-6 py-2 border-b border-black/5 bg-[#F7F4EC]">
              <button onClick={() => gotoPage(page - 1)} disabled={page <= 1} className="text-sm font-bold text-[#8A8F98] hover:text-[#FF6B1A] disabled:opacity-30 font-sans tracking-wider">← Prev</button>
              
              <div className="flex items-center gap-4">
                <input type="number" min={1} max={totalPages ?? undefined} value={page} onChange={(e) => { const n = parseInt(e.target.value); if (!isNaN(n)) gotoPage(n) }} className="w-12 bg-white border border-black/10 rounded px-2 py-1 text-center text-sm font-bold font-sans outline-none focus:border-[#FF6B1A]" />
                <span className="text-sm font-bold text-[#8A8F98] font-sans">/ {totalPages ?? '?'}</span>
                
                <div className="flex items-center gap-2">
                  <button onClick={zoomOut} className="w-7 h-7 text-sm font-bold text-[#8A8F98] hover:text-[#1A1A1A] bg-white border border-black/10 rounded">−</button>
                  <span className="text-xs font-bold text-[#8A8F98] font-sans w-8 text-center">{zoomPercent}%</span>
                  <button onClick={zoomIn} className="w-7 h-7 text-sm font-bold text-[#8A8F98] hover:text-[#1A1A1A] bg-white border border-black/10 rounded">+</button>
                </div>
              </div>

              <button onClick={() => gotoPage(page + 1)} disabled={totalPages ? page >= totalPages : false} className="text-sm font-bold text-[#8A8F98] hover:text-[#FF6B1A] disabled:opacity-30 font-sans tracking-wider">Next →</button>
            </div>
          )}

          {fullScreen && <button onClick={() => setFullScreen(false)} className="absolute top-4 right-4 z-20 text-xs text-[#1A1A1A] font-bold hover:text-[#FF6B1A] font-sans bg-white/90 backdrop-blur border border-black/10 rounded-full px-4 py-2 shadow-lg">Exit Full Screen</button>}

          <div className="flex-1 relative" onDoubleClick={() => setFullScreen((v) => !v)}>
            <button aria-label="Previous page" onClick={() => gotoPage(page - 1)} disabled={page <= 1} className="absolute left-0 top-0 bottom-0 w-[8%] max-w-[80px] z-10 cursor-w-resize disabled:cursor-default" />
            <button aria-label="Next page" onClick={() => gotoPage(page + 1)} disabled={totalPages ? page >= totalPages : false} className="absolute right-0 top-0 bottom-0 w-[8%] max-w-[80px] z-10 cursor-e-resize disabled:cursor-default" />
            <iframe ref={iframeRef} onLoad={onIframeLoad} src="/pdfjs/viewer.html" className="absolute inset-0 w-full h-full" style={{ border: 'none', background: '#F7F4EC' }} title={book.data.title} />
          </div>
        </div>

        {showNotes && !fullScreen && <div className="w-[340px] border-l border-black/5 bg-[#F7F4EC] overflow-hidden"><BookNotesPanel bookId={book.id} /></div>}
      </div>
    </main>
  )
}