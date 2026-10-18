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
    <main className="min-h-screen bg-[#0A0806] text-[#F5EFE7] pb-24">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-8">
          <Link href="/" className="text-xs text-[#7A6F65] hover:text-[#F5EFE7] font-mono">← home</Link>
          <h1 className="font-mono tracking-[0.3em] text-sm text-[#7A6F65]">CONTACTS</h1>
          <div className="w-12" />
        </header>

        {loading && <p className="text-sm text-[#7A6F65]">loading…</p>}
        {!loading && contacts.length === 0 && (
          <p className="text-sm text-[#7A6F65]">No contacts yet. Go to the Daily Brief to add one.</p>
        )}

        <ul className="space-y-3">
          {contacts.map((contact) => (
            <li key={contact.id} className="border border-[#1F1813] rounded-lg bg-[#14100C] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">{contact.data.name}</p>
                <p className="text-xs text-[#7A6F65] mt-1">
                  {contact.data.phone && <a href={`tel:${contact.data.phone}`} className="hover:text-[#FF6B1A]">{contact.data.phone}</a>}
                  {contact.data.email && <span className="ml-2 hover:text-[#FF6B1A]"><a href={`mailto:${contact.data.email}`}>{contact.data.email}</a></span>}
                </p>
                {contact.data.note && <p className="text-xs text-[#FFB347] mt-1">{contact.data.note}</p>}
              </div>
              <div className="flex items-center gap-3">
                 {contact.data.phone && (
                   <a href={`tel:${contact.data.phone}`} className="text-xs bg-[#1F1813] hover:bg-[#8B4A2A] text-[#F5EFE7] px-3 py-1.5 rounded transition-colors">
                     Call
                   </a>
                 )}
                 <button 
                   onClick={() => handleDelete(contact.id, contact.data.name)}
                   className="text-[#8B4A2A] hover:text-[#ff4d4d] text-lg leading-none"
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