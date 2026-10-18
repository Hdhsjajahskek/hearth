'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { listLeads, updateLeadStatus } from '@/lib/hearth/leads'
import type { LeadData, HearthNode } from '@/lib/hearth/types'

export default function LeadsPage() {
  const [leads, setLeads] = useState<HearthNode<LeadData>[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const data = await listLeads()
    setLeads(data)
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  async function handleStatus(leadId: string, status: LeadData['status']) {
    setLeads((prev) => prev.map((l) => l.id === leadId ? { ...l, data: { ...l.data, status } } : l))
    await updateLeadStatus(leadId, status)
  }

  return (
    <main className="min-h-screen bg-[#0A0806] text-[#F5EFE7]">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <Link href="/" className="text-xs text-[#7A6F65] hover:text-[#F5EFE7] font-mono">
            ← inbox
          </Link>
          <h1 className="font-mono tracking-[0.3em] text-sm text-[#7A6F65]">LEADS</h1>
          <div className="w-12" />
        </header>

        {loading && <p className="text-sm text-[#7A6F65]">loading…</p>}
        {!loading && leads.length === 0 && <p className="text-sm text-[#7A6F65]">No leads yet. Go to Inbox to add one.</p>}

        <ul className="space-y-3">
          {leads.map((lead) => (
            <li key={lead.id} className="border border-[#1F1813] rounded-lg bg-[#14100C] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">{lead.data.name}</p>
                <p className="text-xs text-[#7A6F65] mt-1">
                  {lead.data.phone && <a href={`tel:${lead.data.phone}`} className="hover:text-[#FF6B1A]">{lead.data.phone}</a>}
                  {lead.data.address && ` · ${lead.data.address}`}
                </p>
                {lead.data.note && <p className="text-xs text-[#FFB347] mt-1">{lead.data.note}</p>}
              </div>
              <select
                value={lead.data.status}
                onChange={(e) => handleStatus(lead.id, e.target.value as LeadData['status'])}
                className="bg-[#0A0806] text-xs text-[#F5EFE7] border border-[#1F1813] rounded px-2 py-1 outline-none"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="interested">Interested</option>
                <option value="client">Client</option>
                <option value="dead">Dead</option>
              </select>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}