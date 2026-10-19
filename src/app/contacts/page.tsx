'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { listContacts, deleteContact } from '@/lib/hearth/contacts'
import type { ContactData, HearthNode } from '@/lib/hearth/types'

export default function ContactsPage() {
  const [contacts, setContacts] = useState<HearthNode<ContactData>[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const data = await listContacts()
    setContacts(data)
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete contact "${name}"?`)) return
    setContacts((prev) => prev.filter((c) => c.id !== id))
    await deleteContact(id)
  }

  return (
    <main className="min-h-screen bg-[#F7F4EC] pb-32 relative overflow-hidden">
      
      <div className="absolute top-[-100px] left-[-100px] w-[500px] h-[500px] bg-[#FF6B1A]/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-150px] w-[600px] h-[600px] bg-[#7A00FF]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 md:px-8 py-10 relative z-10">
        
        <header className="flex items-center justify-between mb-10">
          <Link href="/" className="text-sm font-bold text-[#8A8F98] hover:text-[#FF6B1A] font-sans tracking-wide transition-colors">← Back</Link>
          <h1 className="font-sans tracking-[0.3em] text-xs text-[#1A1A1A] font-bold uppercase">Contacts</h1>
          <div className="w-12" />
        </header>

        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-serif text-[#1A1A1A] mb-2">Your people.</h2>
          <p className="text-base text-[#8A8F98] font-sans">Important numbers and connections.</p>
        </div>

        {loading && <p className="text-base text-[#8A8F98]">loading…</p>}
        {!loading && contacts.length === 0 && (
          <div className="text-center py-16 editorial-card rounded-3xl">
            <p className="text-lg text-[#8A8F98] font-serif">No contacts yet.</p>
          </div>
        )}

        <ul className="space-y-3">
          {contacts.map((contact) => (
            <li key={contact.id} className="editorial-card rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 group">
              <div>
                <p className="text-xl font-serif text-[#1A1A1A] mb-1">{contact.data.name}</p>
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-sm text-[#8A8F98] font-sans">
                  {contact.data.phone && <a href={`tel:${contact.data.phone}`} className="hover:text-[#FF6B1A] transition-colors">{contact.data.phone}</a>}
                  {contact.data.email && <a href={`mailto:${contact.data.email}`} className="hover:text-[#FF6B1A] transition-colors">{contact.data.email}</a>}
                </div>
                {contact.data.note && <p className="text-sm text-[#FF6B1A] mt-2 font-sans font-medium">{contact.data.note}</p>}
              </div>
              
              <div className="flex items-center gap-3">
                 {contact.data.phone && (
                   <a href={`tel:${contact.data.phone}`} className="accent-btn py-2 px-5 rounded-full text-xs">Call</a>
                 )}
                 <button 
                   onClick={() => handleDelete(contact.id, contact.data.name)}
                   className="text-[#8A8F98] hover:text-[#ff4d4d] transition-colors text-xl w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100"
                 >
                   ×
                 </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}