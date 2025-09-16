import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  console.log('🔗 認証コールバック受信:', {
    hasCode: !!code,
    origin
  })

  if (!code) {
    console.log('❌ 認証コードなし → ログインへ')
    return NextResponse.redirect(`${origin}/login`)
  }

  try {
    const supabase = await createClient()
    
    // セッション交換
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error || !data.session?.user) {
      console.error('❌ セッション交換エラー:', error)
      return NextResponse.redirect(`${origin}/login`)
    }

    const userId = data.session.user.id
    console.log('✅ セッション確立:', userId)

    // プロフィール存在チェック
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', userId)
      .single()

    console.log('👤 プロフィール確認:', {
      hasProfile: !!profile,
      profileError: profileError?.code
    })

    if (profileError?.code === 'PGRST116' || !profile) {
      // プロフィールなし → 新規ユーザー
      console.log('🆕 新規ユーザー → /signup')
      return NextResponse.redirect(`${origin}/signup`)
    } else {
      // プロフィールあり → 既存ユーザー
      console.log('👤 既存ユーザー → /')
      return NextResponse.redirect(`${origin}/`)
    }

  } catch (error) {
    console.error('❌ コールバック処理エラー:', error)
    return NextResponse.redirect(`${origin}/login`)
  }
}