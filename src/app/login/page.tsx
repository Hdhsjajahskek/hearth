'use client'

import { createClient } from '@/lib/supabase/client'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginInner() {
  const params = useSearchParams()
  const error = params.get('error')

  async function signIn() {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // Hardcode the exact Vercel callback URL
        redirectTo: 'https://hearth-xngm.vercel.app/auth/callback',
      },
    })
  }

  return (
    <main className="min-h-screen bg-[#0A0806] text-[#F5EFE7] flex items-center justify-center px-6">
      <div className="w-full max-w-sm text-center">
        <h1 className="font-mono tracking-[0.3em] text-sm text-[#7A6F65] mb-12">
          HEARTH
        </h1>

        <p className="text-2xl mb-2">Forget nothing that matters.</p>
        <p className="text-sm text-[#7A6F65] mb-12">
          Sign in to continue.
        </p>

        <button
          onClick={signIn}
          className="w-full rounded-md bg-[#FF6B1A] hover:bg-[#FFB347] transition-colors text-[#0A0806] font-medium py-3 px-6"
        >
          Continue with Google
        </button>

        {error === 'not_allowed' && (
          <p className="mt-6 text-sm text-[#8B4A2A]">
            This account isn&apos;t on the allowlist.
          </p>
        )}
        {error === 'auth_failed' && (
          <p className="mt-6 text-sm text-[#8B4A2A]">
            Sign-in failed. Try again.
          </p>
        )}
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginInner />
    </Suspense>
  )
}