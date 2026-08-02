import { NextResponse } from 'next/server'

function isProtectedPath(pathname) {
  return (
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/timeline') ||
    pathname.startsWith('/settings') ||
    pathname.startsWith('/api/timeline')
  )
}

function parseJwtPayload(token) {
  try {
    const payload = token.split('.')[1]
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = atob(normalized)
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

function isTokenFresh(token) {
  if (!token) return false

  const payload = parseJwtPayload(token)
  const exp = payload?.exp
  if (!exp) return false

  // Consider token stale when it expires in under 30 seconds.
  return exp * 1000 > Date.now() + 30000
}

async function refreshSupabaseSession(refreshToken) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey || !refreshToken) return null

  const response = await fetch(
    `${supabaseUrl}/auth/v1/token?grant_type=refresh_token`,
    {
      method: 'POST',
      headers: {
        apikey: supabaseAnonKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    },
  )

  if (!response.ok) return null

  return response.json()
}

export default async function middleware(request) {
  const { pathname } = request.nextUrl

  if (!isProtectedPath(pathname)) {
    return NextResponse.next()
  }

  const accessToken = request.cookies.get('sb-access-token')?.value
  if (accessToken && isTokenFresh(accessToken)) {
    return NextResponse.next()
  }

  const refreshToken = request.cookies.get('sb-refresh-token')?.value
  const refreshed = await refreshSupabaseSession(refreshToken)

  if (refreshed?.access_token) {
    const response = NextResponse.next()

    response.cookies.set('sb-access-token', refreshed.access_token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    if (refreshed.refresh_token) {
      response.cookies.set('sb-refresh-token', refreshed.refresh_token, {
        httpOnly: true,
        sameSite: 'lax',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        maxAge: 60 * 60 * 24 * 30,
      })
    }

    return response
  }

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const loginUrl = new URL('/login', request.url)
  loginUrl.searchParams.set('next', pathname)
  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: [
    // Skip static files
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
