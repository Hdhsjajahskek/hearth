'use client'

import { useState, useRef, useEffect } from 'react'
import { captureNote } from '@/lib/hearth/capture'

interface Props {
  onCaptured: () => void
}

export function CaptureBox({ onCaptured }: Props) {
  const [value, setValue] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-grow the textarea as you type
  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 240) + 'px'
  }, [value])

  // Autofocus on mount
  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  async function submit() {
    if (!value.trim() || busy) return
    setBusy(true)
    setError(null)

    const result = await captureNote(value)

    setBusy(false)

    if (!result.ok) {
      setError(result.error)
      return
    }

    setValue('')
    onCaptured()
    textareaRef.current?.focus()
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault()
      submit()
    }
  }

  return (
    <div className="border border-[#1F1813] rounded-lg bg-[#14100C] overflow-hidden">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="What's on your mind?"
        rows={1}
        className="w-full bg-transparent text-[#F5EFE7] placeholder-[#7A6F65] px-4 py-4 outline-none resize-none text-base leading-relaxed"
      />
      <div className="flex items-center justify-between px-4 pb-3 pt-1">
        <span className="text-xs text-[#7A6F65] font-mono">
          {busy ? 'saving…' : error ? <span className="text-[#8B4A2A]">{error}</span> : '⌘/Ctrl + Enter'}
        </span>
        <button
          onClick={submit}
          disabled={!value.trim() || busy}
          className="rounded-md bg-[#FF6B1A] hover:bg-[#FFB347] transition-colors text-[#0A0806] font-medium text-sm py-2 px-4 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          Capture
        </button>
      </div>
    </div>
  )
}