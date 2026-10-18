'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { listLeads, updateLeadStatus, deleteLead } from '@/lib/hearth/leads'
import { getDayNumber } from '@/lib/hearth/read'
import type { LeadData, HearthNode } from '@/lib/hearth/types'

const statusColors: Record<LeadData['status'], string> = {
  new: 'border-[#7A6F65] text-[#7A6F65] focus:ring-[#7A6F65]',
  contacted: 'border-[#8B4A2A] text-[#FFB347] focus:ring-[#FFB347]',
  interested: 'border-[#FF6B1A] text-[#FF6B1A] focus:ring-[#FF6B1A]',
  client: 'border-[#00E5FF] text-[#00E5FF] focus:ring-[#00E5FF]',
  dead: 'border-[#5a1c1c] text-[#ff4d4d] focus:ring-[#ff4d4d]',
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<HearthNode<LeadData>[]>([])
  const [loading, setLoading] = useState(true)
  const [grouped, setGrouped] = useState<Record<number, HearthNode<LeadData>[]>>({})

  const refresh = useCallback(async () => {
    const data = await listLeads()
    const groups: Record<number, HearthNode<LeadData>[]> = {}
    for (const lead of data) {
      const dayNum = await getDayNumber(lead.created_at)
      if (!groups[dayNum]) groups[dayNum] = []
      groups[dayNum].push(lead)
    }
    setGrouped(groups)
    setLeads(data)
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

  const sortedDays = Object.keys(grouped).map(Number).sort((a, b) => b - a)

  return (
    <main className="min-h-screen bg-[#0A0806] text-[#F5EFE7]">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <Link href="/" className="text-xs text-[#7A6F65] hover:text-[#F5EFE7] font-mono">← inbox</Link>
          <h1 className="font-mono tracking-[0.3em] text-sm text-[#7A6F65]">LEADS</h1>
          <div className="w-12" />
        </header>

        {loading && <p className="text-sm text-[#7A6F65]">loading…</p>}
        {!loading && leads.length === 0 && <p className="text-sm text-[#7A6F65]">No leads yet. Go to Inbox to add one.</p>}

        <div className="space-y-10">
          {sortedDays.map((dayNum) => (
            <div key={dayNum}>
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-xs text-[#FF6B1A] font-mono uppercase tracking-widest">
                  {dayNum > 0 ? `Day ${dayNum}` : `Pre-Hearth`}
                </h2>
                <div className="h-[1px] flex-1 bg-[#1F1813]"></div>
              </div>
              <ul className="space-y-3">
                {grouped[dayNum].map((lead) => (
                  <li key={lead.id} className="border border-[#1F1813] rounded-lg bg-[#14100C] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-medium">{lead.data.name}</p>
                      <p className="text-xs text-[#7A6F65] mt-1">
                        {lead.data.phone && <a href={`tel:${lead.data.phone}`} className="hover:text-[#FF6B1A]">{lead.data.phone}</a>}
                        {lead.data.address && ` · ${lead.data.address}`}
                      </p>
                      {lead.data.note && <p className="text-xs text-[#FFB347] mt-1">{lead.data.note}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={lead.data.status}
                        onChange={(e) => handleStatus(lead.id, e.target.value as LeadData['status'])}
                        className={`bg-[#0A0806] text-xs rounded px-2 py-1 outline-none transition-all duration-200 focus:ring-2 ring-opacity-50 shadow-[0_0_10px_rgba(0,0,0,0)] ${statusColors[lead.data.status]}`}
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="interested">Interested</option>
                        <option value="client">Client</option>
                        <option value="dead">Dead</option>
                      </select>
                      <button
                        onClick={() => handleDelete(lead.id, lead.data.name)}
                        className="text-[#8B4A2A] hover:text-[#ff4d4d] transition-colors px-2 text-lg leading-none"
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
    </main>
  )
}