import { createClient } from '@/lib/supabase/client'
import type { HearthNode, OutreachData } from './types'

export async function logOutreach(
  reached: number,
  callbacks: number,
  demos: number,
  note: string | null
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'not_authenticated' }

  const data: OutreachData = { reached, callbacks, demos, note, schema_version: 1 }

  const { error } = await supabase
    .from('nodes')
    .insert({ user_id: user.id, type: 'outreach', data })

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}

export interface OutreachStats {
  reached: number
  callbacks: number
  demos: number
}

export async function getOutreachStats(): Promise<{ today: OutreachStats, week: OutreachStats, month: OutreachStats }> {
  const supabase = createClient()
  
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - now.getDay()) // Start of week (Sunday)
  weekStart.setHours(0, 0, 0, 0)
  
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()

  // Fetch all outreach nodes
  const { data, error } = await supabase
    .from('nodes')
    .select('*')
    .eq('type', 'outreach')

  if (error || !data) {
    return {
      today: { reached: 0, callbacks: 0, demos: 0 },
      week: { reached: 0, callbacks: 0, demos: 0 },
      month: { reached: 0, callbacks: 0, demos: 0 },
    }
  }

  const stats = {
    today: { reached: 0, callbacks: 0, demos: 0 },
    week: { reached: 0, callbacks: 0, demos: 0 },
    month: { reached: 0, callbacks: 0, demos: 0 },
  }

  for (const node of data as HearthNode<OutreachData>[]) {
    const createdAt = new Date(node.created_at)
    const d = node.data

    // Month
    if (createdAt >= new Date(monthStart)) {
      stats.month.reached += d.reached
      stats.month.callbacks += d.callbacks
      stats.month.demos += d.demos
    }

    // Week
    if (createdAt >= weekStart) {
      stats.week.reached += d.reached
      stats.week.callbacks += d.callbacks
      stats.week.demos += d.demos
    }

    // Today
    if (createdAt >= new Date(todayStart)) {
      stats.today.reached += d.reached
      stats.today.callbacks += d.callbacks
      stats.today.demos += d.demos
    }
  }

  return stats
}