import { createClient } from '@/lib/supabase/client'
import type { HearthNode, NoteData, LeadData, BookData } from './types'

// ============================================================
// NOTES (Inbox)
// ============================================================

export async function recentNotes(limit = 50): Promise<HearthNode<NoteData>[]> {
  const supabase = createClient()
  
  // Find notes that are attached to books (so we don't show them in the main inbox)
  const { data: edges } = await supabase.from('edges').select('from_node_id').eq('relation', 'about')
  const attachedIds = new Set((edges ?? []).map((e) => e.from_node_id))

  const { data, error } = await supabase
    .from('nodes')
    .select('*')
    .eq('type', 'note')
    .order('created_at', { ascending: false })
    .limit(limit + attachedIds.size)

  if (error) return []
  
  const filtered = (data ?? []).filter((n) => !attachedIds.has(n.id))
  return (filtered.slice(0, limit) ?? []) as HearthNode<NoteData>[]
}

export async function deleteNote(noteId: string): Promise<boolean> {
  const supabase = createClient()
  const { error } = await supabase.from('nodes').delete().eq('id', noteId)
  return !error
}

// ============================================================
// RECENT BOOK (For Daily Brief)
// ============================================================

export async function getRecentBook(): Promise<HearthNode<BookData> | null> {
  const supabase = createClient()
  
  // Find the most recent book_progress or book_created event
  const { data: events } = await supabase
    .from('events')
    .select('subject_node_id')
    .in('type', ['book_progress', 'book_created'])
    .order('timestamp', { ascending: false })
    .limit(1)

  if (!events || events.length === 0 || !events[0].subject_node_id) return null

  // Fetch the book node
  const { data } = await supabase
    .from('nodes')
    .select('*')
    .eq('id', events[0].subject_node_id)
    .eq('type', 'book')
    .maybeSingle()

  return data as HearthNode<BookData> | null
}

// ============================================================
// TIME & DAY TRACKER
// ============================================================

let _cachedEpoch: Date | null = null

export async function getEpochDate(): Promise<Date> {
  if (_cachedEpoch) return _cachedEpoch
  const supabase = createClient()

  // Look for a manual "Day 1" reset event
  const { data: epochEvent } = await supabase
    .from('events')
    .select('timestamp')
    .eq('type', 'day_one_epoch')
    .order('timestamp', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (epochEvent) {
    _cachedEpoch = new Date(epochEvent.timestamp)
    return _cachedEpoch
  }

  // Fallback: The very first node you ever created
  const { data: first } = await supabase
    .from('nodes')
    .select('created_at')
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle()

  _cachedEpoch = first ? new Date(first.created_at) : new Date()
  return _cachedEpoch
}

export async function getDayNumber(dateStr: string): Promise<number> {
  const epoch = await getEpochDate()
  const firstDate = new Date(epoch)
  firstDate.setHours(0, 0, 0, 0)

  const currentDate = new Date(dateStr)
  currentDate.setHours(0, 0, 0, 0)

  const diffTime = Math.abs(currentDate.getTime() - firstDate.getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays + 1
}

export async function resetDayOne() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  // Insert a new event that marks today as the new epoch
  await supabase.from('events').insert({
    user_id: user.id,
    type: 'day_one_epoch',
    data: { note: 'Manual Day 1 Reset' },
  })

  _cachedEpoch = null
}

// ============================================================
// TEMPORAL SEARCH
// ============================================================

export interface SearchResult {
  nodes: HearthNode<NoteData | LeadData>[]
  isDaySearch: boolean
  dayNumber: number | null
}

export async function searchEverything(query: string): Promise<SearchResult> {
  const q = query.trim().toLowerCase()
  if (!q) return { nodes: [], isDaySearch: false, dayNumber: null }

  let isDaySearch = false
  let dayNumber: number | null = null
  let textQuery = q

  // Check for "day X" syntax
  const dayMatch = q.match(/day\s*(\d+)/)
  if (dayMatch) {
    isDaySearch = true
    dayNumber = parseInt(dayMatch[1], 10)
    textQuery = q.replace(dayMatch[0], '').trim() // Remove "day X" from the text search
  }

  const supabase = createClient()

  // Fetch matching nodes (text search)
  let queryBuilder = supabase
    .from('nodes')
    .select('*')
    .in('type', ['note', 'lead'])

  if (textQuery) {
    queryBuilder = queryBuilder.or(
      `data->>content.ilike.%${textQuery}%,data->>name.ilike.%${textQuery}%,data->>phone.ilike.%${textQuery}%,data->>note.ilike.%${textQuery}%`
    )
  }

  const { data, error } = await queryBuilder.order('created_at', { ascending: false }).limit(100)

  if (error) {
    console.error('Search failed:', error)
    return { nodes: [], isDaySearch, dayNumber }
  }

  let results = (data ?? []) as HearthNode<NoteData | LeadData>[]

  // Filter by Day X if requested
  if (isDaySearch && dayNumber !== null) {
    const filtered = []
    for (const node of results) {
      const nodeDay = await getDayNumber(node.created_at)
      if (nodeDay === dayNumber) {
        filtered.push(node)
      }
    }
    results = filtered
  }

  return { nodes: results, isDaySearch, dayNumber }
}