import { createClient } from '@/lib/supabase/client'
import type { HearthNode, NoteData } from './types'

export interface CaptureResult {
  ok: true
  node: HearthNode<NoteData>
}

export interface CaptureError {
  ok: false
  error: string
}

function titleFrom(content: string): string | null {
  const firstLine = content.trim().split('\n')[0]?.trim()
  if (!firstLine) return null
  return firstLine.length > 80 ? firstLine.slice(0, 80) + '…' : firstLine
}

export async function captureNote(
  rawContent: string
): Promise<CaptureResult | CaptureError> {
  const content = rawContent.trim()
  if (!content) return { ok: false, error: 'empty' }

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { ok: false, error: 'not_authenticated' }

  const data: NoteData = {
    title: titleFrom(content),
    content,
    schema_version: 1,
  }

  const { data: node, error: nodeError } = await supabase
    .from('nodes')
    .insert({
      user_id: user.id,
      type: 'note',
      data,
    })
    .select()
    .single()

  if (nodeError || !node) {
    return { ok: false, error: nodeError?.message ?? 'insert_failed' }
  }

  const { error: eventError } = await supabase.from('events').insert({
    user_id: user.id,
    type: 'note_created',
    subject_node_id: node.id,
    data: { length: content.length },
  })

  // Event logging is best-effort. If it fails, the note still saved.
  if (eventError) {
    console.warn('note_created event failed:', eventError.message)
  }

  return { ok: true, node: node as HearthNode<NoteData> }
}