'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ReactReader } from 'react-reader'
import { getBookSignedUrl, updateBookLocation } from '@/lib/hearth/books'
import type { BookData, HearthNode } from '@/lib/hearth/types'

interface Props {
  book: HearthNode<BookData>
}

export function EpubReader({ book }: Props) {
  const [epubData, setEpubData] = useState<ArrayBuffer | null>(null)
  const [location, setLocation] = useState<string | number | null>(
    book.data.current_location || null
  )
  const [error, setError] = useState<string | null>(null)
  const [rendition, setRendition] = useState<unknown>(null)
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const latestLocationRef = useRef<string | number | null>(
    book.data.current_location || null
  )

  // Fetch EPUB as ArrayBuffer
  useEffect(() => {
    let cancelled = false

    async function load() {
      const signed = await getBookSignedUrl(book.data.file_path, 60 * 60 * 8)
      if (cancelled) return
      if (!signed) {
        setError('Could not open the EPUB.')
        return
      }

      try {
        const res = await fetch(signed)
        if (!res.ok) {
          setError(`Could not fetch EPUB (${res.status}).`)
          return
        }
        const buf = await res.arrayBuffer()
        if (cancelled) return
        setEpubData(buf)
      } catch (err) {
        console.error('[EpubReader] fetch error:', err)
        setError('Could not fetch EPUB.')
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [book.data.file_path])

  // Track every location change — save to ref for unmount save
  const onLocationChange = useCallback(
    (loc: string) => {
      latestLocationRef.current = loc
      setLocation(loc)

      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
      saveTimeoutRef.current = setTimeout(() => {
        updateBookLocation(book.id, loc).then((res) => {
          if (!res.ok) console.warn('[EpubReader] save failed:', res.error)
          else console.log('[EpubReader] saved location:', loc)
        })
      }, 800)
    },
    [book.id]
  )

  // Save on unmount / page close — captures the final location
  useEffect(() => {
    function flushSave() {
      const loc = latestLocationRef.current
      if (typeof loc === 'string' && loc.length > 0) {
        // Fire-and-forget — page is closing
        updateBookLocation(book.id, loc)
      }
    }

    window.addEventListener('beforeunload', flushSave)
    window.addEventListener('pagehide', flushSave)

    return () => {
      window.removeEventListener('beforeunload', flushSave)
      window.removeEventListener('pagehide', flushSave)

      // Also save on route change (component unmount)
      flushSave()
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    }
  }, [book.id])

  // Apply Hearth theme + persist through re-renders
  useEffect(() => {
    if (!rendition) return
    const r = rendition as {
      themes: {
        register: (
          name: string,
          rules: Record<string, Record<string, string>>
        ) => void
        select: (name: string) => void
      }
      on: (event: string, cb: (...args: unknown[]) => void) => void
    }

    r.themes.register('hearth', {
      body: {
        background: '#0A0806 !important',
        color: '#F5EFE7 !important',
        'line-height': '1.7 !important',
        padding: '0 12px !important',
      },
      p: {
        color: '#F5EFE7 !important',
        'font-size': '1.05em !important',
        'line-height': '1.7 !important',
        'margin-bottom': '1em !important',
      },
      h1: {
        color: '#F5EFE7 !important',
        'font-size': '1.6em !important',
        'margin-top': '1.5em !important',
        'margin-bottom': '0.8em !important',
        'font-weight': '500 !important',
      },
      h2: {
        color: '#F5EFE7 !important',
        'font-size': '1.3em !important',
        'margin-top': '1.4em !important',
        'margin-bottom': '0.6em !important',
      },
      h3: {
        color: '#F5EFE7 !important',
        'font-size': '1.15em !important',
        'margin-top': '1.3em !important',
        'margin-bottom': '0.5em !important',
      },
      a: { color: '#FF6B1A !important' },
      blockquote: {
        color: '#7A6F65 !important',
        'border-left': '2px solid #8B4A2A !important',
        'padding-left': '1em !important',
      },
      li: { color: '#F5EFE7 !important' },
    })

    r.themes.select('hearth')
    r.on('rendered', () => r.themes.select('hearth'))
  }, [rendition])

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-[#8B4A2A]">{error}</p>
      </div>
    )
  }

  if (!epubData) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-sm text-[#7A6F65] font-mono">loading book…</p>
      </div>
    )
  }

  return (
    <div className="flex-1 relative bg-[#0A0806] min-h-0">
      <ReactReader
        url={epubData}
        location={location}
        locationChanged={onLocationChange}
        getRendition={(r: unknown) => setRendition(r)}
        epubOptions={{
          flow: 'scrolled',
          manager: 'continuous',
          allowScriptedContent: false,
        }}
      />
      <style jsx global>{`
        .epub-container,
        .epub-view,
        .epub-view iframe {
          background: #0A0806 !important;
        }
        .epub-loading {
          background: #0A0806 !important;
          color: #7A6F65 !important;
        }
        .arrow {
          color: #FF6B1A !important;
        }
      `}</style>
    </div>
  )
}