import { createClient } from '@/lib/supabase/client'
import type { HearthNode, ContactData } from './types'

export async function createContact(
  name: string,
  phone: string | null,
  email: string | null,
  note: string | null
): Promise<{ ok: true; contact: HearthNode<ContactData> } | { ok: false; error: string }> {
  const trimmed = name.trim()
  if (!trimmed) return { ok: false, error: 'Name required' }

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'not_authenticated' }

  const data: ContactData = { name: trimmed, phone, email, note, schema_version: 1 }

  const { data: node, error } = await supabase
    .from('nodes')
    .insert({ user_id: user.id, type: 'contact', data })
    .select()
    .single()

  if (error || !node) {
    return { ok: false, error: error?.message ?? 'insert_failed' }
  }

  return { ok: true, contact: node as HearthNode<ContactData> }
}

export async function listContacts(): Promise<HearthNode<ContactData>[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('nodes')
    .select('*')
    .eq('type', 'contact')
    .order('data->>name', { ascending: true })
    
  return (data ?? []) as HearthNode<ContactData>[]
}

export async function deleteContact(id: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase.from('nodes').delete().eq('id', id)
  return !error
}