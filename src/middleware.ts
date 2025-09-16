import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let res = NextResponse.next()
  
  const pathname = req.nextUrl.pathname

  // auth/callback は常に通す（認証処理のため）
  if (pathname === '/auth/callback') {
    return res
  }

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

  // 保護対象ルート
  const protectedRoutes = ['/upload', '/profile', '/search', '/dashboard', '/onboarding']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute && !user) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // プロフィール完成チェック（認証済みユーザーのみ）
  if (user && isProtectedRoute && pathname !== '/onboarding') {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('faculty, year')
        .eq('id', user.id)
        .single()

      // プロフィールが未完成なら、オンボーディングへ
      if (!profile?.faculty || !profile?.year) {
        return NextResponse.redirect(new URL('/onboarding', req.url))
      }
    } catch (error) {
      // プロフィールテーブルが存在しない場合もオンボーディングへ
      return NextResponse.redirect(new URL('/onboarding', req.url))
    }
  }

  // 完成済みユーザーがオンボーディングにアクセスした場合、ダッシュボードへ
  if (user && pathname === '/onboarding') {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('faculty, year')
        .eq('id', user.id)
        .single()

      if (profile?.faculty && profile?.year) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    } catch (error) {
      // プロフィールテーブルが存在しない場合はオンボーディングを通す
    }
  }

  return res
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|api|auth/callback|auth/verify-success|signup/confirm).*)',
  ],
}