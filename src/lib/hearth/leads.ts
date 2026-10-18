import { createClient } from '@/lib/supabase/client'
import type { HearthNode, LeadData } from './types'

export async function createLead(
  name: string,
  phone: string | null,
  address: string | null,
  note: string | null,
  status: LeadData['status'] = 'new'
): Promise<{ ok: true; lead: HearthNode<LeadData> } | { ok: false; error: string }> {
  const trimmedName = name.trim()
  if (!trimmedName) return { ok: false, error: 'Name is required' }

  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'not_authenticated' }

  const leadData: LeadData = {
    name: trimmedName,
    phone: phone?.trim() || null,
    address: address?.trim() || null,
    note: note?.trim() || null,
    status,
    schema_version: 1,
  }

  const { data: node, error: nodeError } = await supabase
    .from('nodes')
    .insert({ user_id: user.id, type: 'lead', data: leadData })
    .select()
    .single()

  if (nodeError || !node) return { ok: false, error: nodeError?.message ?? 'insert_failed' }

  await supabase.from('events').insert({
    user_id: user.id,
    type: 'lead_created',
    subject_node_id: node.id,
    data: { name: trimmedName },
  })

  return { ok: true, lead: node as HearthNode<LeadData> }
}

export async function listLeads(): Promise<HearthNode<LeadData>[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('nodes')
    .select('*')
    .eq('type', 'lead')
    .order('created_at', { ascending: false })

  if (error) return []
  return (data ?? []) as HearthNode<LeadData>[]
}

export async function updateLeadStatus(
  leadId: string,
  status: LeadData['status']
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = createClient()
  
  const { data: existing, error: readError } = await supabase
    .from('nodes')
    .select('data')
    .eq('id', leadId)
    .maybeSingle()

  if (readError || !existing) return { ok: false, error: 'lead_not_found' }

  const newData = { ...(existing.data as LeadData), status }

  const { error } = await supabase
    .from('nodes')
    .update({ data: newData })
    .eq('id', leadId)

  if (error) return { ok: false, error: error.message }
  return { ok: true }
}