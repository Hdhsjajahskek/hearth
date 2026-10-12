import { createClient } from '@/lib/supabase/client'
import type { BookData, HearthNode, NoteData } from './types'

// ============================================================
// Helpers
// ============================================================

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\.(pdf|epub)$/i, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}

function titleFromFilename(filename: string): string {
  return filename.replace(/\.(pdf|epub)$/i, '').trim() || 'Untitled'
}

// ============================================================
// Types
// ============================================================

export interface CreateBookResult {
  ok: true
  book: HearthNode<BookData>
}

export interface CreateBookError {
  ok: false
  error: string
}

// ============================================================
// Books — CRUD
// ============================================================

export async function createBook(
  file: File,
  totalPages: number | null = null
): Promise<CreateBookResult | CreateBookError> {
  const nameLower = file.name.toLowerCase()
  const isPdf = nameLower.endsWith('.pdf')
  const isEpub = nameLower.endsWith('.epub')

  if (!isPdf && !isEpub) {
    return { ok: false, error: 'Only PDF and EPUB files are supported.' }
  }

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { ok: false, error: 'not_authenticated' }

  const format: 'pdf' | 'epub' = isPdf ? 'pdf' : 'epub'
  const ext = isPdf ? 'pdf' : 'epub'

  const bookData: BookData = {
    title: titleFromFilename(file.name),
    author: null,
    file_path: '',
    format,
    current_page: 0,
    total_pages: totalPages,
    current_location: null,
    schema_version: 2,
  }

  const { data: node, error: nodeError } = await supabase
    .from('nodes')
    .insert({
      user_id: user.id,
      type: 'book',
      data: bookData,
    })
    .select()
    .single()

  if (nodeError || !node) {
    return { ok: false, error: nodeError?.message ?? 'insert_failed' }
  }

  const path = `${user.id}/${node.id}-${slugify(file.name)}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('books')
    .upload(path, file, {
      contentType: isPdf ? 'application/pdf' : 'application/epub+zip',
      upsert: false,
    })

  if (uploadError) {
    await supabase.from('nodes').delete().eq('id', node.id)
    return { ok: false, error: uploadError.message }
  }

  const { data: updated, error: updateError } = await supabase
    .from('nodes')
    .update({ data: { ...bookData, file_path: path } })
    .eq('id', node.id)
    .select()
    .single()

  if (updateError || !updated) {
    return { ok: false, error: updateError?.message ?? 'update_failed' }
  }

  await supabase.from('events').insert({
    user_id: user.id,
    type: 'book_created',
    subject_node_id: node.id,
    data: { filename: file.name, size: file.size, format },
  })

  return { ok: true, book: updated as HearthNode<BookData> }
}

export async function listBooks(): Promise<HearthNode<BookData>[]> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('nodes')
    .select('*')
    .eq('type', 'book')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('listBooks failed:', error.message)
    return []
  }

  return (data ?? []) as HearthNode<BookData>[]
}

export async function getBook(
  id: string
): Promise<HearthNode<BookData> | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('nodes')
    .select('*')
    .eq('id', id)
    .eq('type', 'book')
    .maybeSingle()

  if (error || !data) {
    console.error('getBook failed:', error?.message)
    return null
  }

  return data as HearthNode<BookData>
}

export async function getBookSignedUrl(
  filePath: string,
  expiresInSeconds = 3600
): Promise<string | null> {
  const supabase = createClient()

  const { data, error } = await supabase.storage
    .from('books')
    .createSignedUrl(filePath, expiresInSeconds)

  if (error || !data) {
    console.error('signed url failed:', error?.message)
    return null
  }

  return data.signedUrl
}

// ============================================================
// Progress (PDF)
// ============================================================

export async function updateBookProgress(
  bookId: string,
  currentPage: number,
  totalPages: number | null = null
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { ok: false, error: 'not_authenticated' }

  const { data: existing, error: readError } = await supabase
    .from('nodes')
    .select('data')
    .eq('id', bookId)
    .eq('type', 'book')
    .maybeSingle()

  if (readError || !existing) {
    return { ok: false, error: readError?.message ?? 'book_not_found' }
  }

  const newData = {
    ...(existing.data as Record<string, unknown>),
    current_page: currentPage,
    ...(totalPages !== null ? { total_pages: totalPages } : {}),
  }

  const { error: updateError } = await supabase
    .from('nodes')
    .update({ data: newData })
    .eq('id', bookId)

  if (updateError) return { ok: false, error: updateError.message }

  await supabase.from('events').insert({
    user_id: user.id,
    type: 'book_progress',
    subject_node_id: bookId,
    data: { page: currentPage, total: totalPages },
  })

  return { ok: true }
}

// ============================================================
// Location (EPUB)
// ============================================================

export async function updateBookLocation(
  bookId: string,
  cfi: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { ok: false, error: 'not_authenticated' }

  const { data: existing, error: readError } = await supabase
    .from('nodes')
    .select('data')
    .eq('id', bookId)
    .eq('type', 'book')
    .maybeSingle()

  if (readError || !existing) {
    return { ok: false, error: readError?.message ?? 'book_not_found' }
  }

  const newData = {
    ...(existing.data as Record<string, unknown>),
    current_location: cfi,
  }

  const { error: updateError } = await supabase
    .from('nodes')
    .update({ data: newData })
    .eq('id', bookId)

  if (updateError) return { ok: false, error: updateError.message }

  return { ok: true }
}

// ============================================================
// Per-book notes
// ============================================================

export async function getNotesForBook(
  bookId: string
): Promise<HearthNode<NoteData>[]> {
  const supabase = createClient()

  const { data: edges, error: edgesError } = await supabase
    .from('edges')
    .select('from_node_id')
    .eq('to_node_id', bookId)
    .eq('relation', 'about')

  if (edgesError) {
    console.error('getNotesForBook edges failed:', edgesError.message)
    return []
  }

  const noteIds = (edges ?? []).map((e) => e.from_node_id)
  if (noteIds.length === 0) return []

  const { data, error } = await supabase
    .from('nodes')
    .select('*')
    .in('id', noteIds)
    .eq('type', 'note')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getNotesForBook notes failed:', error.message)
    return []
  }

  return (data ?? []) as HearthNode<NoteData>[]
}

export async function createBookNote(
  bookId: string,
  content: string
): Promise<
  { ok: true; note: HearthNode<NoteData> } | { ok: false; error: string }
> {
  const trimmed = content.trim()
  if (!trimmed) return { ok: false, error: 'empty' }

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { ok: false, error: 'not_authenticated' }

  const firstLine = trimmed.split('\n')[0]?.trim()
  const title = firstLine
    ? firstLine.length > 80
      ? firstLine.slice(0, 80) + '…'
      : firstLine
    : null

  const { data: note, error: noteError } = await supabase
    .from('nodes')
    .insert({
      user_id: user.id,
      type: 'note',
      data: {
        title,
        content: trimmed,
        schema_version: 1,
      },
    })
    .select()
    .single()

  if (noteError || !note) {
    return { ok: false, error: noteError?.message ?? 'insert_failed' }
  }

  const { error: edgeError } = await supabase.from('edges').insert({
    user_id: user.id,
    from_node_id: note.id,
    to_node_id: bookId,
    relation: 'about',
  })

  if (edgeError) {
    await supabase.from('nodes').delete().eq('id', note.id)
    return { ok: false, error: edgeError.message }
  }

  await supabase.from('events').insert({
    user_id: user.id,
    type: 'note_created',
    subject_node_id: note.id,
    data: { length: trimmed.length, attached_to: bookId },
  })

  return { ok: true, note: note as HearthNode<NoteData> }
}