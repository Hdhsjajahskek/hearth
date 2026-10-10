import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return new Response('unauthorized', { status: 401 })
  }

  const [nodesRes, edgesRes, eventsRes] = await Promise.all([
    supabase.from('nodes').select('*').order('created_at'),
    supabase.from('edges').select('*').order('created_at'),
    supabase.from('events').select('*').order('timestamp'),
  ])

  const payload = {
    hearth_export_version: 1,
    exported_at: new Date().toISOString(),
    user: { id: user.id, email: user.email },
    counts: {
      nodes: nodesRes.data?.length ?? 0,
      edges: edgesRes.data?.length ?? 0,
      events: eventsRes.data?.length ?? 0,
    },
    nodes: nodesRes.data ?? [],
    edges: edgesRes.data ?? [],
    events: eventsRes.data ?? [],
  }

  const filename = `hearth-export-${new Date().toISOString().slice(0, 10)}.json`

  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}