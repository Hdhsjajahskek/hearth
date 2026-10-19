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

const statusColors: Record<LeadData['status'], string> = {
  new: 'border-[#7A6F65] text-[#7A6F65]',
  contacted: 'border-[#8B4A2A] text-[#FFB347]',
  interested: 'border-[#FF6B1A] text-[#FF6B1A]',
  client: 'border-[#00D1FF] text-[#00D1FF]',
  dead: 'border-[#5a1c1c] text-[#ff4d4d]',
}

export default function SearchPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<HearthNode<NoteData | LeadData>[]>([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [isDaySearch, setIsDaySearch] = useState(false)
  const [dayNumber, setDayNumber] = useState<number | null>(null)

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
    const updatedLead = { ...selectedLead, data: { ...selectedLead.data, status } }
    setSelectedLead(updatedLead)
    setResults((prev) => prev.map((r) => r.id === leadId ? updatedLead : r))
    await updateLeadStatus(leadId, status)
  }

  const notes = results.filter((r) => r.type === 'note') as HearthNode<NoteData>[]
  const leads = results.filter((r) => r.type === 'lead') as HearthNode<LeadData>[]

  return (
    <main className="min-h-screen bg-[#F7F4EC] pb-32 relative overflow-hidden">
      
      <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] bg-[#00D1FF]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-150px] w-[600px] h-[600px] bg-[#FF007A]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 md:px-8 py-10 relative z-10">
        
        <header className="flex items-center justify-between mb-10">
          <button
            onClick={() => router.push('/')}
            className="text-sm font-bold text-[#8A8F98] hover:text-[#FF6B1A] font-sans tracking-wide transition-colors"
          >
            ← Back
          </button>
          <h1 className="font-sans tracking-[0.3em] text-xs text-[#1A1A1A] font-bold uppercase">Search</h1>
          <div className="w-12" />
        </header>

        {/* Smaller Search Bar */}
        <div className="mb-10">
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your life..."
            className="w-full bg-transparent text-[#1A1A1A] placeholder-[#C0BDB6] px-2 py-3 outline-none text-2xl md:text-3xl font-serif border-b-2 border-black/10 focus:border-[#FF6B1A] transition-colors"
          />
          <p className="text-xs text-[#8A8F98] font-sans font-bold uppercase tracking-widest mt-3 px-2">
            Try "sharma" or "day 1 leads"
          </p>
        </div>

        <section>
          {loading && <p className="text-base text-[#8A8F98]">searching…</p>}

          {!loading && searched && results.length === 0 && (
            <div className="text-center py-16 editorial-card rounded-3xl">
              <p className="text-lg text-[#8A8F98] font-serif">Nothing found for "{query}".</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="space-y-10">
              {isDaySearch && (
                <div className="flex items-center gap-4">
                  <h2 className="text-xs font-sans uppercase tracking-[0.2em] font-bold text-[#FF6B1A]">
                    Results from Day {dayNumber}
                  </h2>
                  <div className="h-[1px] flex-1 bg-black/5"></div>
                </div>
              )}

              {leads.length > 0 && (
                <div>
                  <h3 className="text-xs font-sans uppercase tracking-[0.2em] font-bold text-[#1A1A1A] mb-4">
                    Leads ({leads.length})
                  </h3>
                  <ul className="space-y-3">
                    {leads.map((lead) => (
                      <li 
                        key={lead.id} 
                        onClick={() => setSelectedLead(lead)}
                        className="editorial-card rounded-2xl p-5 cursor-pointer group"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-lg font-serif text-[#1A1A1A] group-hover:text-[#FF6B1A] transition-colors">{lead.data.name}</p>
                            <p className="text-sm text-[#8A8F98] mt-1 font-sans">
                              {lead.data.phone && <a href={`tel:${lead.data.phone}`} onClick={(e) => e.stopPropagation()} className="hover:text-[#FF6B1A]">{lead.data.phone}</a>}
                              {lead.data.address && ` · ${lead.data.address}`}
                            </p>
                          </div>
                          <span className={`text-[10px] uppercase font-sans tracking-widest font-bold px-2 py-1 rounded-full border ${statusColors[lead.data.status]}`}>
                            {lead.data.status}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {notes.length > 0 && (
                <div>
                  <h3 className="text-xs font-sans uppercase tracking-[0.2em] font-bold text-[#1A1A1A] mb-4">
                    Notes ({notes.length})
                  </h3>
                  <ul className="space-y-3">
                    {notes.map((note) => (
                      <li key={note.id} className="editorial-card rounded-2xl p-5">
                        <p className="text-base text-[#1A1A1A] font-serif whitespace-pre-wrap break-words leading-relaxed">
                          {note.data.content.length > 400 ? note.data.content.slice(0, 400) + '…' : note.data.content}
                        </p>
                        <p className="text-xs text-[#8A8F98] mt-3 font-sans font-bold uppercase tracking-widest">
                          {timeAgo(note.created_at)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </section>
      </div>

      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-[#F7F4EC]/80 backdrop-blur-md flex items-center justify-center p-6" onClick={() => setSelectedLead(null)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <h2 className="text-2xl font-serif text-[#1A1A1A] mb-1">{selectedLead.data.name}</h2>
              {selectedLead.data.address && <p className="text-sm text-[#8A8F98] font-sans mb-4">{selectedLead.data.address}</p>}
              
              <div className="space-y-3 mb-6">
                {selectedLead.data.phone && (
                  <a href={`tel:${selectedLead.data.phone}`} className="accent-btn block w-full text-center py-3 rounded-xl text-base font-bold">
                    Call {selectedLead.data.phone}
                  </a>
                )}
                {selectedLead.data.note && (
                  <div className="bg-[#F7F4EC] p-4 rounded-xl">
                    <p className="text-[10px] text-[#8A8F98] font-sans uppercase tracking-widest font-bold mb-1">Note</p>
                    <p className="text-sm text-[#FF6B1A] font-medium font-sans">{selectedLead.data.note}</p>
                  </div>
                )}
              </div>

              <div>
                <p className="text-[10px] text-[#8A8F98] font-sans uppercase tracking-widest font-bold mb-2">Update Status</p>
                <select
                  value={selectedLead.data.status}
                  onChange={(e) => handleStatusChange(selectedLead.id, e.target.value as LeadData['status'])}
                  className={`w-full bg-[#F7F4EC] text-sm font-bold rounded-xl px-3 py-2 outline-none border ${statusColors[selectedLead.data.status]}`}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="interested">Interested</option>
                  <option value="client">Client</option>
                  <option value="dead">Dead</option>
                </select>
              </div>
            </div>
            <button onClick={() => setSelectedLead(null)} className="w-full bg-[#F7F4EC] hover:bg-[#E8E4D9] text-[#1A1A1A] text-sm font-bold py-3 transition-colors">
              Close
            </button>
          </div>
        </div>
      )}
    </main>
  )
}