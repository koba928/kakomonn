import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const { faculty } = await request.json()

    // Validate faculty input
    if (!faculty || typeof faculty !== 'string' || faculty.trim().length === 0) {
      return NextResponse.json(
        { error: '学部を入力してください' },
        { status: 400 }
      )
    }

    // Get authenticated user
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch {}
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set({ name, value: '', ...options })
            } catch {}
          },
        },
      }
    )
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: '認証が必要です' },
        { status: 401 }
      )
    }

    // Check if profile already exists
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single()

    if (existingProfile) {
      return NextResponse.json(
        { error: 'プロフィールは既に登録されています' },
        { status: 400 }
      )
    }

    // Create profile with fixed university value
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: user.id,
        university: '名古屋大学', // Always set server-side
        faculty: faculty.trim()
      })
      .select()
      .single()

    if (error) {
      console.error('Profile creation error:', error)
      return NextResponse.json(
        { error: 'プロフィールの作成に失敗しました' },
        { status: 500 }
      )
    }

    // Update user metadata
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      {
        user_metadata: {
          university: '名古屋大学',
          faculty: faculty.trim(),
          profile_completed: true
        }
      }
    )

    if (updateError) {
      console.error('User metadata update error:', updateError)
    }

    return NextResponse.json({
      message: 'プロフィールを登録しました',
      profile: data
    })

  } catch (error) {
    console.error('Profile completion error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}