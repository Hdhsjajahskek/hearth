import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const ALLOWED = (process.env.ALLOWED_EMAILS ?? '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

// Helper to race a promise against a timeout
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Supabase timeout')), ms)
    ),
  ])
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  let user = null
  try {
    // Wrap the call in a 3-second timeout
    const { data } = await withTimeout(supabase.auth.getUser(), 3000)
    user = data.user
  } catch (error) {
    console.error('Auth check timed out or failed:', error)
    // If it fails, we just treat them as logged out, but we don't crash
  }

  const path = request.nextUrl.pathname
  const isAuthRoute = path.startsWith('/login') || path.startsWith('/auth')

  // Not signed in → go to login (unless it's already an auth route)
  if (!user && !isAuthRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Signed in but not on the allowlist → sign out
  if (user && !ALLOWED.includes((user.email ?? '').toLowerCase())) {
    try {
      await supabase.auth.signOut()
    } catch (e) {
      console.error('Sign out failed:', e)
    }
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('error', 'not_allowed')
    return NextResponse.redirect(url)
  }

  // Signed in and trying to hit /login → go home
  if (user && path === '/login') {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return response
}