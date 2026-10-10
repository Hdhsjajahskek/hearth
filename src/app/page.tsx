import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <main className="min-h-screen bg-[#0A0806] text-[#F5EFE7] p-8">
      <h1 className="font-mono tracking-[0.3em] text-sm text-[#7A6F65]">
        HEARTH
      </h1>
      <p className="mt-8 text-lg">
        Signed in as {user.email}
      </p>
      <p className="mt-2 text-sm text-[#7A6F65]">
        Empty for now. The Inbox comes next.
      </p>
    </main>
  )
}