'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { listLeads, updateLeadStatus, deleteLead, updateLead } from '@/lib/hearth/leads'
import { logOutreach, getOutreachStats, OutreachStats } from '@/lib/hearth/outreach'
import { getDayNumber } from '@/lib/hearth/read'
import type { LeadData, HearthNode } from '@/lib/hearth/types'

const statusColors: Record<LeadData['status'], string> = {
  new: 'border-[#7A6F65] text-[#7A6F65] focus:ring-[#7A6F65]',
  contacted: 'border-[#8B4A2A] text-[#FFB347] focus:ring-[#FFB347]',
  interested: 'border-[#FF6B1A] text-[#FF6B1A] focus:ring-[#FF6B1A]',
  client: 'border-[#00D1FF] text-[#00D1FF] focus:ring-[#00D1FF]', /* Matched to our new Cyan */
  dead: 'border-[#5a1c1c] text-[#ff4d4d] focus:ring-[#ff4d4d]',
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<HearthNode<LeadData>[]>([])
  const [loading, setLoading] = useState(true)
  const [grouped, setGrouped] = useState<Record<number, HearthNode<LeadData>[]>>({})

  // Outreach State
  const [stats, setStats] = useState<{ today: OutreachStats, week: OutreachStats, month: OutreachStats } | null>(null)
  const [showLogForm, setShowLogForm] = useState(false)
  const [logReached, setLogReached] = useState('')
  const [logCallbacks, setLogCallbacks] = useState('')
  const [logDemos, setLogDemos] = useState('')
  const [logging, setLogging] = useState(false)

  // Edit State
  const [editingLead, setEditingLead] = useState<HearthNode<LeadData> | null>(null)
  const [editName, setEditName] = useState('')
  const [editPhone, setEditPhone] = useState('')
  const [editAddress, setEditAddress] = useState('')
  const [editNote, setEditNote] = useState('')
  const [savingEdit, setSavingEdit] = useState(false)

  const refresh = useCallback(async () => {
    const [data, statsData] = await Promise.all([listLeads(), getOutreachStats()])
    
    const groups: Record<number, HearthNode<LeadData>[]> = {}
    for (const lead of data) {
      const dayNum = await getDayNumber(lead.created_at)
      if (!groups[dayNum]) groups[dayNum] = []
      groups[dayNum].push(lead)
    }
    
    setGrouped(groups)
    setLeads(data)
    setStats(statsData)
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  async function handleStatus(leadId: string, status: LeadData['status']) {
    setLeads((prev) => prev.map((l) => l.id === leadId ? { ...l, data: { ...l.data, status } } : l))
    await updateLeadStatus(leadId, status)
  }

  async function handleDelete(leadId: string, name: string) {
    if (!window.confirm(`Delete lead "${name}"?`)) return
    setLeads((prev) => prev.filter((l) => l.id !== leadId))
    setGrouped((prev) => {
      const next = { ...prev }
      for (const day in next) {
        next[day] = next[day].filter((l) => l.id !== leadId)
      }
      return next
    })
    await deleteLead(leadId)
  }

  function openEditModal(lead: HearthNode<LeadData>) {
    setEditingLead(lead)
    setEditName(lead.data.name)
    setEditPhone(lead.data.phone || '')
    setEditAddress(lead.data.address || '')
    setEditNote(lead.data.note || '')
  }

  async function saveEdit() {
    if (!editingLead || !editName.trim()) return
    setSavingEdit(true)
    
    const updatedData: LeadData = {
      ...editingLead.data,
      name: editName.trim(),
      phone: editPhone.trim() || null,
      address: editAddress.trim() || null,
      note: editNote.trim() || null,
    }

    const res = await updateLead(editingLead.id, updatedData)
    setSavingEdit(false)

    if (res.ok) {
      setLeads((prev) => prev.map((l) => l.id === editingLead.id ? { ...l, data: updatedData } : l))
      setGrouped((prev) => {
        const next = { ...prev }
        for (const day in next) {
          next[day] = next[day].map((l) => l.id === editingLead.id ? { ...l, data: updatedData } : l)
        }
        return next
      })
      setEditingLead(null)
    } else {
      alert(res.error)
    }
  }

  async function submitOutreach() {
    setLogging(true)
    const r = parseInt(logReached) || 0
    const c = parseInt(logCallbacks) || 0
    const d = parseInt(logDemos) || 0
    
    const res = await logOutreach(r, c, d, null)
    setLogging(false)
    
    if (res.ok) {
      setShowLogForm(false)
      setLogReached('')
      setLogCallbacks('')
      setLogDemos('')
      refresh()
    } else {
      alert(res.error)
    }
  }

  const sortedDays = Object.keys(grouped).map(Number).sort((a, b) => b - a)
  const pct = (num: number, total: number) => total === 0 ? '0%' : Math.round((num / total) * 100) + '%'

  return (
    <main className="min-h-screen bg-[#F7F4EC] pb-32 relative overflow-hidden">
      
      {/* Background Orbs */}
      <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-[#FF6B1A]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-150px] w-[600px] h-[600px] bg-[#FFB800]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 md:px-8 py-16 relative z-10">
        
        <header className="flex items-center justify-between mb-16">
          <Link href="/" className="text-sm font-bold text-[#8A8F98] hover:text-[#FF6B1A] font-sans tracking-wide transition-colors">← Back</Link>
          <h1 className="font-sans tracking-[0.3em] text-sm text-[#1A1A1A] font-bold uppercase">Leads</h1>
          <div className="w-12" />
        </header>

        {/* OUTREACH TRACKER */}
        {stats && (
          <div className="editorial-card rounded-3xl p-8 mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-serif text-[#1A1A1A]">Outreach Stats</h2>
              <button 
                onClick={() => setShowLogForm(!showLogForm)}
                className="text-sm font-bold text-[#FF6B1A] hover:text-[#FF8C42] transition-colors"
              >
                {showLogForm ? 'Cancel' : '+ Log Today'}
              </button>
            </div>

            {showLogForm ? (
              <div className="flex flex-col md:flex-row items-center gap-4">
                <input type="number" placeholder="Reached" value={logReached} onChange={e => setLogReached(e.target.value)} className="w-full bg-[#F7F4EC] text-lg font-bold text-center border-none rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#FF6B1A]" />
                <input type="number" placeholder="Callbacks" value={logCallbacks} onChange={e => setLogCallbacks(e.target.value)} className="w-full bg-[#F7F4EC] text-lg font-bold text-center border-none rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#FF6B1A]" />
                <input type="number" placeholder="Demos" value={logDemos} onChange={e => setLogDemos(e.target.value)} className="w-full bg-[#F7F4EC] text-lg font-bold text-center border-none rounded-xl p-4 outline-none focus:ring-2 focus:ring-[#FF6B1A]" />
                <button onClick={submitOutreach} disabled={logging} className="accent-btn py-4 px-8 rounded-xl w-full md:w-auto disabled:opacity-50">Save</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="border-b md:border-b-0 md:border-r border-black/5 pb-6 md:pb-0 md:pr-8">
                  <p className="text-sm text-[#8A8F98] font-sans uppercase tracking-widest font-bold mb-4">Today</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline"><span className="text-base text-[#8A8F98]">Reached</span> <span className="text-3xl font-serif">{stats.today.reached}</span></div>
                    <div className="flex justify-between items-baseline"><span className="text-base text-[#8A8F98]">Callbacks</span> <span className="text-2xl font-serif text-[#FF6B1A]">{stats.today.callbacks} <span className="text-sm font-sans">({pct(stats.today.callbacks, stats.today.reached)})</span></span></div>
                    <div className="flex justify-between items-baseline"><span className="text-base text-[#8A8F98]">Demos</span> <span className="text-2xl font-serif text-[#00D1FF]">{stats.today.demos} <span className="text-sm font-sans">({pct(stats.today.demos, stats.today.reached)})</span></span></div>
                  </div>
                </div>
                <div className="border-b md:border-b-0 md:border-r border-black/5 pb-6 md:pb-0 md:pr-8">
                  <p className="text-sm text-[#8A8F98] font-sans uppercase tracking-widest font-bold mb-4">This Week</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline"><span className="text-base text-[#8A8F98]">Reached</span> <span className="text-3xl font-serif">{stats.week.reached}</span></div>
                    <div className="flex justify-between items-baseline"><span className="text-base text-[#8A8F98]">Callbacks</span> <span className="text-2xl font-serif text-[#FF6B1A]">{stats.week.callbacks} <span className="text-sm font-sans">({pct(stats.week.callbacks, stats.week.reached)})</span></span></div>
                    <div className="flex justify-between items-baseline"><span className="text-base text-[#8A8F98]">Demos</span> <span className="text-2xl font-serif text-[#00D1FF]">{stats.week.demos} <span className="text-sm font-sans">({pct(stats.week.demos, stats.week.reached)})</span></span></div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-[#8A8F98] font-sans uppercase tracking-widest font-bold mb-4">This Month</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline"><span className="text-base text-[#8A8F98]">Reached</span> <span className="text-3xl font-serif">{stats.month.reached}</span></div>
                    <div className="flex justify-between items-baseline"><span className="text-base text-[#8A8F98]">Callbacks</span> <span className="text-2xl font-serif text-[#FF6B1A]">{stats.month.callbacks} <span className="text-sm font-sans">({pct(stats.month.callbacks, stats.month.reached)})</span></span></div>
                    <div className="flex justify-between items-baseline"><span className="text-base text-[#8A8F98]">Demos</span> <span className="text-2xl font-serif text-[#00D1FF]">{stats.month.demos} <span className="text-sm font-sans">({pct(stats.month.demos, stats.month.reached)})</span></span></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {loading && <p className="text-lg text-[#8A8F98]">loading…</p>}
        {!loading && leads.length === 0 && <p className="text-lg text-[#8A8F98]">No leads yet. Capture one from the Daily Brief.</p>}

        <div className="space-y-12">
          {sortedDays.map((dayNum) => (
            <div key={dayNum}>
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-sm font-sans uppercase tracking-[0.2em] font-bold text-[#FF6B1A]">
                  {dayNum > 0 ? `Day ${dayNum}` : `Pre-Hearth`}
                </h2>
                <div className="h-[1px] flex-1 bg-black/5"></div>
              </div>
              <ul className="space-y-4">
                {grouped[dayNum].map((lead) => (
                  <li key={lead.id} className="editorial-card rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <p className="text-2xl font-serif text-[#1A1A1A]">{lead.data.name}</p>
                      <p className="text-base text-[#8A8F98] mt-1 font-sans">
                        {lead.data.phone && <a href={`tel:${lead.data.phone}`} className="hover:text-[#FF6B1A] transition-colors">{lead.data.phone}</a>}
                        {lead.data.address && ` · ${lead.data.address}`}
                      </p>
                      {lead.data.note && <p className="text-sm text-[#FF6B1A] mt-2 font-sans font-medium">{lead.data.note}</p>}
                    </div>
                    <div className="flex items-center gap-4">
                      <button onClick={() => openEditModal(lead)} className="text-sm font-bold text-[#8A8F98] hover:text-[#FF6B1A] transition-colors">Edit</button>
                      <select
                        value={lead.data.status}
                        onChange={(e) => handleStatus(lead.id, e.target.value as LeadData['status'])}
                        className={`bg-transparent text-sm font-bold rounded-full px-4 py-2 outline-none border-2 transition-all duration-200 ${statusColors[lead.data.status]}`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="interested">Interested</option>
                        <option value="client">Client</option>
                        <option value="dead">Dead</option>
                      </select>
                      <button
                        onClick={() => handleDelete(lead.id, lead.data.name)}
                        className="text-[#8A8F98] hover:text-[#ff4d4d] transition-colors px-2 text-2xl leading-none font-light"
                        title="Delete lead"
                      >
                        ×
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* EDIT MODAL */}
      {editingLead && (
        <div className="fixed inset-0 z-50 bg-[#F7F4EC]/80 backdrop-blur-md flex items-center justify-center p-6" onClick={() => setEditingLead(null)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-8">
              <h2 className="text-3xl font-serif mb-6 text-[#1A1A1A]">Edit Lead</h2>
              <div className="space-y-4">
                <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Name" className="w-full bg-[#F7F4EC] text-lg text-[#1A1A1A] border-none rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#FF6B1A]" />
                <input type="tel" value={editPhone} onChange={(e) => setEditPhone(e.target.value)} placeholder="Phone" className="w-full bg-[#F7F4EC] text-lg text-[#1A1A1A] border-none rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#FF6B1A]" />
                <input type="text" value={editAddress} onChange={(e) => setEditAddress(e.target.value)} placeholder="Address" className="w-full bg-[#F7F4EC] text-lg text-[#1A1A1A] border-none rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#FF6B1A]" />
                <input type="text" value={editNote} onChange={(e) => setEditNote(e.target.value)} placeholder="Note" className="w-full bg-[#F7F4EC] text-lg text-[#1A1A1A] border-none rounded-xl px-5 py-3 outline-none focus:ring-2 focus:ring-[#FF6B1A]" />
              </div>
            </div>
            <div className="flex border-t border-black/5">
              <button onClick={() => setEditingLead(null)} className="flex-1 py-4 text-base font-bold text-[#8A8F98] hover:text-[#1A1A1A] transition-colors">Cancel</button>
              <button onClick={saveEdit} disabled={savingEdit || !editName.trim()} className="flex-1 py-4 text-base font-bold text-[#FF6B1A] bg-[#F7F4EC]/30 hover:bg-[#F7F4EC] transition-colors">Save</button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}