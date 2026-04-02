import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Enhanced Middleware for Session Refresh & Persistence
 * Ensures that the session is verified and the cookie is updated BEFORE page load.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // 1. Sync Request Cookies
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          
          // 2. Initialize Response
          supabaseResponse = NextResponse.next({
            request,
          })

          // 3. Sync Response Cookies
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // ── IMPORTANT ──
  // Do NOT remove this getUser() call. This serves as the 'Refresh Heartbeat'.
  // It forces Supabase to verify the session and issue a NEW cookie if needed.
  // This is what prevents the 'orphaned sessions' that cause sign-outs.
  const { data: { user } } = await supabase.auth.getUser()

  // [OPTIONAL]: Redirect to login if user is null and path is private
  // if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
  //   const url = request.nextUrl.clone()
  //   url.pathname = '/login'
  //   return NextResponse.redirect(url)
  // }

  return supabaseResponse
}

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
