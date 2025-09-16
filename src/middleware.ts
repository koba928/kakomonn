import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let res = NextResponse.next()
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({ name, value, ...options })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: any) {
          req.cookies.set({ name, value: '', ...options })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({ name, value: '', ...options })
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected routes that require authentication
  const protectedRoutes = ['/upload', '/profile', '/search', '/dashboard', '/onboarding']
  const pathname = req.nextUrl.pathname

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute && !user) {
    // Redirect to login page for unauthenticated users
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Check if user needs to complete profile (faculty and year)
  if (user && pathname !== '/onboarding' && !pathname.startsWith('/auth') && isProtectedRoute) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('faculty, year')
      .eq('id', user.id)
      .single()

    // If user doesn't have complete profile (missing faculty or year), redirect to onboarding
    if (!profile?.faculty || !profile?.year) {
      return NextResponse.redirect(new URL('/onboarding', req.url))
    }
  }

  // If user has complete profile and tries to access onboarding, redirect to dashboard
  if (user && pathname === '/onboarding') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('faculty, year')
      .eq('id', user.id)
      .single()

    if (profile?.faculty && profile?.year) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/auth|auth/verify-success|auth/complete-registration|signup|login|signup/confirm).*)',
    '/api/:path*',
  ],
}