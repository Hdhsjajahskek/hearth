import { createClient } from '@/lib/supabase/client'
import type { HearthNode, EventData } from './types'

export async function createEvent(
  title: string,
  date: string,
  time: string | null,
  note: string | null
): Promise<{ ok: true; event: HearthNode<EventData> } | { ok: false; error: string }> {
  const trimmed = title.trim()
  if (!trimmed || !date) return { ok: false, error: 'Title and Date required' }

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'not_authenticated' }

  const data: EventData = { title: trimmed, date, time, note, schema_version: 1 }

  const { data: node, error } = await supabase
    .from('nodes')
    .insert({ user_id: user.id, type: 'event', data })
    .select()
    .single()

  if (error || !node) {
    return { ok: false, error: error?.message ?? 'insert_failed' }
  }

  return { ok: true, event: node as HearthNode<EventData> }
}

export async function listEvents(): Promise<HearthNode<EventData>[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('nodes')
    .select('*')
    .eq('type', 'event')
    .order('data->>date', { ascending: true })
    
  return (data ?? []) as HearthNode<EventData>[]
}

export async function deleteEvent(id: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase.from('nodes').delete().eq('id', id)
  return !error
}