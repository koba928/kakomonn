import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')
  const error_description = searchParams.get('error_description')

  console.log('🔗 認証コールバック受信:', {
    hasCode: !!code,
    error,
    error_description,
    origin
  })

  if (error) {
    console.error('❌ 認証エラー:', { error, error_description })
    // 新規登録フローなので、エラー時は新規登録に特化したエラーページへ
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
  }

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              )
            } catch {
              // The `setAll` method was called from a Server Component.
            }
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('❌ セッション交換エラー:', error)
      // 新規登録中のエラーなので、新規登録向けエラーページへ
      return NextResponse.redirect(`${origin}/auth/auth-code-error`)
    }
    
    if (data.session) {
      console.log('🔐 メール認証成功:', {
        userId: data.session.user.id,
        email: data.session.user.email
      })

      // Check if user has completed profile setup (both faculty and year required)
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('faculty, year')
        .eq('id', data.session.user.id)
        .single()
      
      console.log('👤 プロフィール確認:', {
        hasProfile: !!profileData,
        profileError: profileError?.code,
        faculty: profileData?.faculty,
        year: profileData?.year
      })

      // If no profile exists, create one with basic university info
      if (profileError?.code === 'PGRST116' || !profileData) {
        console.log('🆕 プロフィールレコード作成中...')
        try {
          const { error: createError } = await supabase
            .from('profiles')
            .insert({
              id: data.session.user.id,
              university: '名古屋大学',
              faculty: null,
              year: null
            })
          
          if (createError) {
            console.error('❌ プロフィール作成エラー:', createError)
          } else {
            console.log('✅ 基本プロフィールレコード作成完了')
          }
        } catch (insertError) {
          console.error('❌ プロフィール挿入エラー:', insertError)
        }
      }
      
      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      // 新規登録フローなので、成功時は新規登録成功画面を経由
      let redirectUrl = '/signup-success'
      if (profileData?.faculty && profileData?.year) {
        console.log('✅ プロフィール完成済み → 新規登録成功画面経由で検索画面へ')
        redirectUrl = '/signup-success'
      } else {
        console.log('⏳ 新規登録完了 → 新規登録成功画面へ')
        redirectUrl = '/signup-success'
      }
      
      console.log('🔄 リダイレクト実行:', redirectUrl)
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${redirectUrl}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${redirectUrl}`)
      } else {
        return NextResponse.redirect(`${origin}${redirectUrl}`)
      }
    } else {
      console.error('❌ セッションデータが不正:', { hasData: !!data, hasSession: !!data?.session })
    }
  } else {
    console.error('❌ 認証コードが見つかりません')
  }

  // Return the user to the signup-friendly error page
  console.log('🔄 新規登録エラーページにリダイレクト')
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}