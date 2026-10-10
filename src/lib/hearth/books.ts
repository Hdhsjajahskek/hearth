import { createClient } from '@/lib/supabase/client'
import type { BookData, HearthNode } from './types'

export interface CreateBookResult {
  ok: true
  book: HearthNode<BookData>
}

export interface CreateBookError {
  ok: false
  error: string
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/\.pdf$/i, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)
}

function titleFromFilename(filename: string): string {
  return filename.replace(/\.pdf$/i, '').trim() || 'Untitled'
}

export async function createBook(
  file: File,
  totalPages: number | null = null
): Promise<CreateBookResult | CreateBookError> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { ok: false, error: 'not_authenticated' }

  // 1. Create the book node first (so we have an id for the file path)
  const bookData: BookData = {
    title: titleFromFilename(file.name),
    author: null,
    file_path: '', // filled below
    current_page: 0,
    total_pages: totalPages,
    schema_version: 1,
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

  // 2. Upload the PDF to storage at {user_id}/{book_id}-{slug}.pdf
  const path = `${user.id}/${node.id}-${slugify(file.name)}.pdf`

  const { error: uploadError } = await supabase.storage
    .from('books')
    .upload(path, file, {
      contentType: 'application/pdf',
      upsert: false,
    })

  if (uploadError) {
    // Roll back the node — no orphan book without a file
    await supabase.from('nodes').delete().eq('id', node.id)
    return { ok: false, error: uploadError.message }
  }

  // 3. Update the node with the real file_path
  const { data: updated, error: updateError } = await supabase
    .from('nodes')
    .update({ data: { ...bookData, file_path: path } })
    .eq('id', node.id)
    .select()
    .single()

  if (updateError || !updated) {
    // Leave the file but flag the error. Rare.
    return { ok: false, error: updateError?.message ?? 'update_failed' }
  }

  // 4. Log the event
  await supabase.from('events').insert({
    user_id: user.id,
    type: 'book_created',
    subject_node_id: node.id,
    data: { filename: file.name, size: file.size },
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