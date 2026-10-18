'use client'

import { useState } from 'react'
import { captureNote } from '@/lib/hearth/capture'
import { createLead } from '@/lib/hearth/leads'
import type { LeadData } from '@/lib/hearth/types'

export function CaptureBox({ onCaptured }: { onCaptured: () => void }) {
  const [mode, setMode] = useState<'note' | 'lead'>('note')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [noteText, setNoteText] = useState('')
  const [leadName, setLeadName] = useState('')
  const [leadPhone, setLeadPhone] = useState('')
  const [leadAddress, setLeadAddress] = useState('')
  const [leadNote, setLeadNote] = useState('')
  const [leadStatus, setLeadStatus] = useState<LeadData['status']>('new')

  async function submitNote() {
    if (!noteText.trim() || busy) return
    setBusy(true)
    setError(null)
    const res = await captureNote(noteText)
    setBusy(false)
    if (!res.ok) return setError(res.error)
    setNoteText('')
    onCaptured()
  }

  async function submitLead() {
    if (!leadName.trim() || busy) return
    setBusy(true)
    setError(null)
    const res = await createLead(leadName, leadPhone, leadAddress, leadNote, leadStatus)
    setBusy(false)
    if (!res.ok) return setError(res.error)
    
    setLeadName('')
    setLeadPhone('')
    setLeadAddress('')
    setLeadNote('')
    setLeadStatus('new')
    onCaptured()
  }

  const statusColors: Record<LeadData['status'], string> = {
    new: 'border-[#7A6F65] text-[#7A6F65] focus:ring-[#7A6F65]',
    contacted: 'border-[#8B4A2A] text-[#FFB347] focus:ring-[#FFB347]',
    interested: 'border-[#FF6B1A] text-[#FF6B1A] focus:ring-[#FF6B1A]',
    client: 'border-[#00E5FF] text-[#00E5FF] focus:ring-[#00E5FF]',
    dead: 'border-[#5a1c1c] text-[#ff4d4d] focus:ring-[#ff4d4d]',
  }

  return (
    <div className="border border-[#1F1813] rounded-xl bg-[#14100C] p-5 shadow-2xl">
      <div className="flex gap-4 mb-5 border-b border-[#1F1813] pb-3">
        <button
          onClick={() => setMode('note')}
          className={`text-sm font-medium transition-colors ${mode === 'note' ? 'text-[#FF6B1A]' : 'text-[#7A6F65] hover:text-[#F5EFE7]'}`}
        >
          Capture Note
        </button>
        <button
          onClick={() => setMode('lead')}
          className={`text-sm font-medium transition-colors ${mode === 'lead' ? 'text-[#FF6B1A]' : 'text-[#7A6F65] hover:text-[#F5EFE7]'}`}
        >
          Add Lead
        </button>
      </div>

      {mode === 'note' ? (
        <div>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="What's on your mind?"
            rows={3}
            className="w-full bg-transparent text-[#F5EFE7] placeholder-[#7A6F65] text-base border-none outline-none resize-none"
          />
          <div className="flex justify-between items-center mt-3 pt-3 border-t border-[#1F1813]">
            <span className="text-[10px] text-[#7A6F65] font-mono">Press Save to capture</span>
            <button onClick={submitNote} disabled={!noteText.trim() || busy} className="bg-[#FF6B1A] text-[#0A0806] text-xs font-medium py-2 px-5 rounded-md disabled:opacity-30 transition-colors">
              Save Note
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Business Name *"
            value={leadName}
            onChange={(e) => setLeadName(e.target.value)}
            className="w-full bg-[#0A0806] text-[#F5EFE7] placeholder-[#7A6F65] text-sm border border-[#1F1813] rounded-md px-3 py-2.5 outline-none focus:border-[#8B4A2A]"
          />
          <div className="grid grid-cols-2 gap-3">
             <input
              type="tel"
              placeholder="Phone"
              value={leadPhone}
              onChange={(e) => setLeadPhone(e.target.value)}
              className="w-full bg-[#0A0806] text-[#F5EFE7] placeholder-[#7A6F65] text-sm border border-[#1F1813] rounded-md px-3 py-2.5 outline-none focus:border-[#8B4A2A]"
            />
            <input
              type="text"
              placeholder="Address"
              value={leadAddress}
              onChange={(e) => setLeadAddress(e.target.value)}
              className="w-full bg-[#0A0806] text-[#F5EFE7] placeholder-[#7A6F65] text-sm border border-[#1F1813] rounded-md px-3 py-2.5 outline-none focus:border-[#8B4A2A]"
            />
          </div>
          <input
            type="text"
            placeholder="Note (optional)"
            value={leadNote}
            onChange={(e) => setLeadNote(e.target.value)}
            className="w-full bg-[#0A0806] text-[#F5EFE7] placeholder-[#7A6F65] text-sm border border-[#1F1813] rounded-md px-3 py-2.5 outline-none focus:border-[#8B4A2A]"
          />
          <div className="flex items-center justify-between mt-2 pt-3 border-t border-[#1F1813]">
            <select
              value={leadStatus}
              onChange={(e) => setLeadStatus(e.target.value as LeadData['status'])}
              className={`bg-[#0A0806] text-xs rounded-md px-3 py-2 outline-none border transition-all ${statusColors[leadStatus]}`}
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="interested">Interested</option>
              <option value="client">Client</option>
              <option value="dead">Dead</option>
            </select>
            <button onClick={submitLead} disabled={!leadName.trim() || busy} className="bg-[#FF6B1A] text-[#0A0806] text-xs font-medium py-2 px-5 rounded-md disabled:opacity-30 transition-colors">
              Save Lead
            </button>
          </div>
          {error && <p className="text-xs text-[#8B4A2A] text-right mt-1">{error}</p>}
        </div>
      )}
    </div>
  )
}