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

  // Note
  const [noteText, setNoteText] = useState('')

  // Lead
  const [leadName, setLeadName] = useState('')
  const [leadPhone, setLeadPhone] = useState('')
  const [leadAddress, setLeadAddress] = useState('')
  const [leadNote, setLeadNote] = useState('')
  const [leadStatus, setLeadStatus] = useState<LeadData['status']>('new')

  // Contact
  const [cName, setCName] = useState('')
  const [cPhone, setCPhone] = useState('')
  const [cEmail, setCEmail] = useState('')
  const [cNote, setCNote] = useState('')

  // Event
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

  const inputClass = "w-full bg-[#0A0806] text-[#F5EFE7] placeholder-[#7A6F65] text-sm border border-[#1F1813] rounded-md px-3 py-2.5 outline-none focus:border-[#8B4A2A]"

  return (
    <div className="border border-[#1F1813] rounded-xl bg-[#14100C] p-5 shadow-2xl">
      <div className="flex gap-4 mb-5 border-b border-[#1F1813] pb-3 overflow-x-auto">
        {(['note', 'lead', 'contact', 'event'] as Mode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`text-sm font-medium transition-colors capitalize whitespace-nowrap ${mode === m ? 'text-[#FF6B1A]' : 'text-[#7A6F65] hover:text-[#F5EFE7]'}`}
          >
            {m}
          </button>
        ))}
      </div>

      {mode === 'note' && (
        <textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="What's on your mind?" rows={3} className="w-full bg-transparent text-[#F5EFE7] placeholder-[#7A6F65] text-base border-none outline-none resize-none" />
      )}

      {mode === 'lead' && (
        <div className="space-y-3">
          <input type="text" placeholder="Business Name *" value={leadName} onChange={(e) => setLeadName(e.target.value)} className={inputClass} />
          <div className="grid grid-cols-2 gap-3">
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
        <div className="space-y-3">
          <input type="text" placeholder="Name *" value={cName} onChange={(e) => setCName(e.target.value)} className={inputClass} />
          <input type="tel" placeholder="Phone" value={cPhone} onChange={(e) => setCPhone(e.target.value)} className={inputClass} />
          <input type="email" placeholder="Email" value={cEmail} onChange={(e) => setCEmail(e.target.value)} className={inputClass} />
          <input type="text" placeholder="Note" value={cNote} onChange={(e) => setCNote(e.target.value)} className={inputClass} />
        </div>
      )}

      {mode === 'event' && (
        <div className="space-y-3">
          <input type="text" placeholder="Event/Meeting Title *" value={eTitle} onChange={(e) => setETitle(e.target.value)} className={inputClass} />
          <div className="grid grid-cols-2 gap-3">
            <input type="date" value={eDate} onChange={(e) => setEDate(e.target.value)} className={inputClass} />
            <input type="time" value={eTime} onChange={(e) => setETime(e.target.value)} className={inputClass} />
          </div>
          <input type="text" placeholder="Note" value={eNote} onChange={(e) => setENote(e.target.value)} className={inputClass} />
        </div>
      )}

      <div className="flex justify-between items-center mt-4 pt-3 border-t border-[#1F1813]">
        <span className="text-xs text-[#8B4A2A]">{error}</span>
        <button onClick={handleSubmit} disabled={busy} className="bg-[#FF6B1A] text-[#0A0806] text-xs font-medium py-2 px-5 rounded-md disabled:opacity-30 transition-colors">
          Save {mode.charAt(0).toUpperCase() + mode.slice(1)}
        </button>
      </div>
    </div>
  )
}