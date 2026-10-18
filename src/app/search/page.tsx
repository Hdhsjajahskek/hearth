'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { searchEverything } from '@/lib/hearth/read'
import { updateLeadStatus } from '@/lib/hearth/leads'
import type { HearthNode, NoteData, LeadData } from '@/lib/hearth/types'

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime()
  const now = Date.now()
  const diff = Math.floor((now - then) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  if (diff < 172800) return 'yesterday'
  const days = Math.floor(diff / 86400)
  if (days < 30) return `${days}d ago`
  return new Date(iso).toLocaleDateString()
}

// Color mapping for statuses
const statusColors: Record<LeadData['status'], string> = {
  new: 'border-[#7A6F65] text-[#7A6F65] focus:ring-[#7A6F65]',
  contacted: 'border-[#8B4A2A] text-[#FFB347] focus:ring-[#FFB347]',
  interested: 'border-[#FF6B1A] text-[#FF6B1A] focus:ring-[#FF6B1A]',
  client: 'border-[#00E5FF] text-[#00E5FF] focus:ring-[#00E5FF]',
  dead: 'border-[#5a1c1c] text-[#ff4d4d] focus:ring-[#ff4d4d]',
}

export default function SearchPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<HearthNode<NoteData | LeadData>[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [isDaySearch, setIsDaySearch] = useState(false)
  const [dayNumber, setDayNumber] = useState<number | null>(null)

  // Modal state for clicked lead
  const [selectedLead, setSelectedLead] = useState<HearthNode<LeadData> | null>(null)

  useEffect(() => {
    const q = query.trim()
    if (!q) {
      setResults([])
      setSearched(false)
      return
    }

    setLoading(true)
    const t = setTimeout(async () => {
      const res = await searchEverything(q)
      setResults(res.nodes)
      setIsDaySearch(res.isDaySearch)
      setDayNumber(res.dayNumber)
      setLoading(false)
      setSearched(true)
    }, 200)

    return () => clearTimeout(t)
  }, [query])

  async function handleStatusChange(leadId: string, status: LeadData['status']) {
    if (!selectedLead) return
    // Optimistic UI update
    const updatedLead = { ...selectedLead, data: { ...selectedLead.data, status } }
    setSelectedLead(updatedLead)
    setResults((prev) => prev.map((r) => r.id === leadId ? updatedLead : r))
    
    await updateLeadStatus(leadId, status)
  }

  const notes = results.filter((r) => r.type === 'note') as HearthNode<NoteData>[]
  const leads = results.filter((r) => r.type === 'lead') as HearthNode<LeadData>[]

  return (
    <main className="min-h-screen bg-[#0A0806] text-[#F5EFE7] relative">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <header className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push('/')}
            className="text-xs text-[#7A6F65] hover:text-[#F5EFE7] transition-colors font-mono"
          >
            ← inbox
          </button>
          <h1 className="font-mono tracking-[0.3em] text-sm text-[#7A6F65]">SEARCH</h1>
          <div className="w-12" />
        </header>

        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search (e.g. 'day 1 leads' or 'sharma')"
          className="w-full bg-transparent text-[#F5EFE7] placeholder-[#7A6F65] px-4 py-4 outline-none text-lg border border-[#1F1813] rounded-lg bg-[#14100C]"
        />

        <section className="mt-8">
          {loading && <p className="text-sm text-[#7A6F65] font-mono">searching…</p>}

          {!loading && searched && results.length === 0 && (
            <p className="text-sm text-[#7A6F65]">
              Nothing found for &ldquo;{query}&rdquo;.
            </p>
          )}

          {!loading && results.length > 0 && (
            <div>
              <h2 className="text-xs text-[#FF6B1A] font-mono uppercase tracking-wider mb-4 border-b border-[#1F1813] pb-2">
                {isDaySearch ? `Results from Day ${dayNumber}` : `Search Results`}
              </h2>

              {/* LEADS */}
              {leads.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-[10px] text-[#7A6F65] font-mono uppercase tracking-wider mb-2">
                    Leads ({leads.length})
                  </h3>
                  <ul className="space-y-2">
                    {leads.map((lead) => (
                      <li 
                        key={lead.id} 
                        onClick={() => setSelectedLead(lead)}
                        className="border border-[#1F1813] hover:border-[#8B4A2A] cursor-pointer rounded-lg bg-[#14100C] px-4 py-3 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-[#F5EFE7] text-sm font-medium">{lead.data.name}</p>
                            <p className="text-xs text-[#7A6F65] mt-1">
                              {lead.data.phone && <a href={`tel:${lead.data.phone}`} onClick={(e) => e.stopPropagation()} className="hover:text-[#FF6B1A]">{lead.data.phone}</a>}
                              {lead.data.address && ` · ${lead.data.address}`}
                            </p>
                          </div>
                          <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${statusColors[lead.data.status]}`}>
                            {lead.data.status}
                          </span>
                        </div>
                        {lead.data.note && <p className="text-xs text-[#FFB347] mt-2">{lead.data.note}</p>}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* NOTES */}
              {notes.length > 0 && (
                <div>
                  <h3 className="text-[10px] text-[#7A6F65] font-mono uppercase tracking-wider mb-2">
                    Notes ({notes.length})
                  </h3>
                  <ul className="space-y-2">
                    {notes.map((note) => (
                      <li key={note.id} className="border border-[#1F1813] rounded-lg bg-[#14100C] px-4 py-3">
                        <p className="text-[#F5EFE7] text-sm whitespace-pre-wrap break-words leading-relaxed">
                          {note.data.content.length > 400 ? note.data.content.slice(0, 400) + '…' : note.data.content}
                        </p>
                        <p className="text-xs text-[#7A6F65] mt-2 font-mono">
                          {timeAgo(note.created_at)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {!loading && !searched && (
            <p className="text-sm text-[#7A6F65]">
              Try searching for a name, a phone number, or <span className="text-[#FF6B1A]">"day 1"</span>.
            </p>
          )}
        </section>
      </div>

      {/* --- QUICK ACTION DRAWER FOR LEADS --- */}
      {selectedLead && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedLead(null)}
        >
          <div 
            className="bg-[#14100C] border border-[#1F1813] rounded-xl shadow-2xl w-full max-w-md overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <h2 className="text-xl font-medium text-[#F5EFE7] mb-1">{selectedLead.data.name}</h2>
              {selectedLead.data.address && <p className="text-sm text-[#7A6F65] mb-4">{selectedLead.data.address}</p>}
              
              <div className="space-y-3 mb-6">
                {selectedLead.data.phone && (
                  <a 
                    href={`tel:${selectedLead.data.phone}`}
                    className="block w-full text-center bg-[#0A0806] border border-[#1F1813] hover:border-[#FF6B1A] text-[#FF6B1A] font-medium py-3 rounded-lg transition-colors"
                  >
                    Call {selectedLead.data.phone}
                  </a>
                )}
                {selectedLead.data.note && (
                  <div className="bg-[#0A0806] p-3 rounded border border-[#1F1813]">
                    <p className="text-xs text-[#7A6F65] font-mono uppercase mb-1">Note</p>
                    <p className="text-sm text-[#FFB347]">{selectedLead.data.note}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs text-[#7A6F65] font-mono uppercase mb-2">Update Status</p>
                <select
                  value={selectedLead.data.status}
                  onChange={(e) => handleStatusChange(selectedLead.id, e.target.value as LeadData['status'])}
                  className={`w-full bg-[#0A0806] text-sm rounded px-3 py-2 outline-none border transition-all duration-200 focus:ring-2 ring-opacity-50 ${statusColors[selectedLead.data.status]}`}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="interested">Interested</option>
                  <option value="client">Client</option>
                  <option value="dead">Dead</option>
                </select>
              </div>
            </div>
            
            <button
              onClick={() => setSelectedLead(null)}
              className="w-full bg-[#1F1813] hover:bg-[#2a211a] text-[#F5EFE7] text-sm font-medium py-3 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  )
}