import { createClient } from '@/lib/supabase/client'
import type { HearthNode, NoteData } from './types'

export async function recentNotes(
  limit = 50
): Promise<HearthNode<NoteData>[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('nodes')
    .select('*')
    .eq('type', 'note')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('recentNotes failed:', error.message)
    return []
  }

  return (data ?? []) as HearthNode<NoteData>[]
}

export async function searchNotes(
  query: string,
  limit = 30
): Promise<HearthNode<NoteData>[]> {
  const q = query.trim()
  if (!q) return []

  const supabase = createClient()

  const { data, error } = await supabase
    .from('nodes')
    .select('*')
    .eq('type', 'note')
    .or(`data->>title.ilike.%${q}%,data->>content.ilike.%${q}%`)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('searchNotes failed:', error.message)
    return []
  }

  return (data ?? []) as HearthNode<NoteData>[]
}