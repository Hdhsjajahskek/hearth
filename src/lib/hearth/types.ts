// ============================================================
// HEARTH — Core Types
// ============================================================

export type NodeType = 'note' | 'book' | 'lead'

export type EdgeRelation = 'about'

export type EventType =
  | 'note_created'
  | 'note_edited'
  | 'book_created'
  | 'book_progress'
  | 'lead_created'

export interface NoteData {
  title: string | null
  content: string
  schema_version: 1
}

export interface BookData {
  title: string
  author: string | null
  file_path: string
  format: 'pdf' | 'epub'
  current_page: number
  total_pages: number | null
  current_location: string | null
  schema_version: 1 | 2
}

export interface LeadData {
  name: string
  phone: string | null
  address: string | null
  note: string | null
  status: 'new' | 'contacted' | 'interested' | 'client' | 'dead'
  schema_version: 1
}

export type NodeData = NoteData | BookData | LeadData

export interface HearthNode<T extends NodeData = NodeData> {
  id: string
  user_id: string
  type: NodeType
  data: T
  created_at: string
  updated_at: string
}

export interface HearthEdge {
  id: string
  user_id: string
  from_node_id: string
  to_node_id: string
  relation: EdgeRelation
  created_at: string
}

export interface HearthEvent {
  id: string
  user_id: string
  type: EventType
  subject_node_id: string | null
  timestamp: string
  data: Record<string, unknown>
}

// --- Type guards -------------------------------------------------

export function isNote(node: HearthNode): node is HearthNode<NoteData> {
  return node.type === 'note'
}

export function isBook(node: HearthNode): node is HearthNode<BookData> {
  return node.type === 'book'
}

export function isLead(node: HearthNode): node is HearthNode<LeadData> {
  return node.type === 'lead'
}