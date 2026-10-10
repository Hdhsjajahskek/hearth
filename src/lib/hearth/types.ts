// ============================================================
// HEARTH — Core Types
// ============================================================

export type NodeType = 'note'

export type EventType = 'note_created' | 'note_edited'

export interface NoteData {
  title: string | null
  content: string
  schema_version: 1
}

export type NodeData = NoteData

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
  relation: string
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