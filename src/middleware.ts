import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  try {
    // Race the Supabase call against a 3-second timeout
    return await Promise.race([
      updateSession(request),
      new Promise((resolve) =>
        setTimeout(() => resolve(NextResponse.next()), 3000)
      )
    ])
  } catch (e) {
    // If anything fails, let the request through so the app doesn't 504
    return NextResponse.next()
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     * - auth (auth callback)
     * - assets (images, fonts, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|login|auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}