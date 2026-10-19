'use client'

import { useState } from 'react'
import { captureNote } from '@/lib/hearth/capture'
import { createLead } from '@/lib/hearth/leads'
import { createContact } from '@/lib/hearth/contacts'
import { createEvent } from '@/lib/hearth/events'
import type { LeadData } from '@/lib/hearth/types'

type Mode = 'note' | 'lead' | 'contact' | 'event'

export function CaptureBox({ onCaptured }: { onCaptured: () => void }) {
  const [mode, setMode] = useState<Mode>('note')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [noteText, setNoteText] = useState('')
  const [leadName, setLeadName] = useState('')
  const [leadPhone, setLeadPhone] = useState('')
  const [leadAddress, setLeadAddress] = useState('')
  const [leadNote, setLeadNote] = useState('')
  const [leadStatus, setLeadStatus] = useState<LeadData['status']>('new')

  const [cName, setCName] = useState('')
  const [cPhone, setCPhone] = useState('')
  const [cEmail, setCEmail] = useState('')
  const [cNote, setCNote] = useState('')

  const [eTitle, setETitle] = useState('')
  const [eDate, setEDate] = useState('')
  const [eTime, setETime] = useState('')
  const [eNote, setENote] = useState('')

  async function handleSubmit() {
    setBusy(true)
    setError(null)
    let res: { ok: boolean; error?: string } = { ok: false }

    if (mode === 'note') {
      if (!noteText.trim()) return setBusy(false)
      res = await captureNote(noteText)
      if (res.ok) setNoteText('')
    } else if (mode === 'lead') {
      if (!leadName.trim()) return setBusy(false)
      res = await createLead(leadName, leadPhone, leadAddress, leadNote, leadStatus)
      if (res.ok) { setLeadName(''); setLeadPhone(''); setLeadAddress(''); setLeadNote(''); setLeadStatus('new') }
    } else if (mode === 'contact') {
      if (!cName.trim()) return setBusy(false)
      res = await createContact(cName, cPhone, cEmail, cNote)
      if (res.ok) { setCName(''); setCPhone(''); setCEmail(''); setCNote('') }
    } else if (mode === 'event') {
      if (!eTitle.trim() || !eDate) return setBusy(false)
      res = await createEvent(eTitle, eDate, eTime, eNote)
      if (res.ok) { setETitle(''); setEDate(''); setETime(''); setENote('') }
    }

    setBusy(false)
    if (!res.ok) setError(res.error || 'Failed')
    else onCaptured()
  }

  const inputClass = "w-full bg-[#F7F4EC] border border-black/5 rounded-2xl px-5 py-4 text-base text-[#1A1A1A] placeholder-[#8A8F98] outline-none focus:border-[#FF6B1A] focus:ring-2 focus:ring-[#FF6B1A]/20 transition-all font-sans"

  return (
    <div className="editorial-card rounded-3xl p-6 md:p-12">
      {/* TABS - Fixed to fit without scrolling */}
      <div className="flex items-center gap-4 md:gap-8 mb-8 border-b border-black/5 pb-4 overflow-x-auto hide-scrollbar">
        {(['note', 'lead', 'contact', 'event'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`text-sm md:text-lg font-sans uppercase tracking-widest transition-colors capitalize whitespace-nowrap font-bold ${mode === m ? 'text-[#FF6B1A]' : 'text-[#8A8F98] hover:text-[#1A1A1A]'}`}
          >
            {m}
          </button>
        ))}
      </div>

      {mode === 'note' && (
        <textarea 
          value={noteText} 
          onChange={(e) => setNoteText(e.target.value)} 
          placeholder="What's on your mind?" 
          rows={5} 
          className="w-full bg-transparent text-[#1A1A1A] placeholder-[#C0BDB6] text-3xl md:text-4xl font-serif border-none outline-none resize-none leading-tight" 
        />
      )}

      {mode === 'lead' && (
        <div className="space-y-5">
          <input type="text" placeholder="Business Name *" value={leadName} onChange={(e) => setLeadName(e.target.value)} className={inputClass} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input type="tel" placeholder="Phone" value={leadPhone} onChange={(e) => setLeadPhone(e.target.value)} className={inputClass} />
            <input type="text" placeholder="Address" value={leadAddress} onChange={(e) => setLeadAddress(e.target.value)} className={inputClass} />
          </div>
          <input type="text" placeholder="Note" value={leadNote} onChange={(e) => setLeadNote(e.target.value)} className={inputClass} />
          <select value={leadStatus} onChange={(e) => setLeadStatus(e.target.value as LeadData['status'])} className={inputClass}>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="interested">Interested</option>
            <option value="client">Client</option>
            <option value="dead">Dead</option>
          </select>
        </div>
      )}

      {mode === 'contact' && (
        <div className="space-y-5">
          <input type="text" placeholder="Name *" value={cName} onChange={(e) => setCName(e.target.value)} className={inputClass} />
          <input type="tel" placeholder="Phone" value={cPhone} onChange={(e) => setCPhone(e.target.value)} className={inputClass} />
          <input type="email" placeholder="Email" value={cEmail} onChange={(e) => setCEmail(e.target.value)} className={inputClass} />
          <input type="text" placeholder="Note" value={cNote} onChange={(e) => setCNote(e.target.value)} className={inputClass} />
        </div>
      )}

      {mode === 'event' && (
        <div className="space-y-5">
          <input type="text" placeholder="Event/Meeting Title *" value={eTitle} onChange={(e) => setETitle(e.target.value)} className={inputClass} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input type="date" value={eDate} onChange={(e) => setEDate(e.target.value)} className={inputClass} />
            <input type="time" value={eTime} onChange={(e) => setETime(e.target.value)} className={inputClass} />
          </div>
          <input type="text" placeholder="Note" value={eNote} onChange={(e) => setENote(e.target.value)} className={inputClass} />
        </div>
      )}

      <div className="flex justify-between items-center mt-10 pt-8 border-t border-black/5">
        <span className="text-base text-[#FF6B1A] font-bold">{error}</span>
        <button onClick={handleSubmit} disabled={busy} className="accent-btn py-4 px-10 rounded-full text-base disabled:opacity-50">
          SAVE {mode.toUpperCase()}
        </button>
      </div>
    </div>
  )
}