import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const { faculty, year } = await request.json()

    // Validate faculty and year input
    if (!faculty || typeof faculty !== 'string' || faculty.trim().length === 0) {
      return NextResponse.json(
        { error: '学部を選択してください' },
        { status: 400 }
      )
    }

    if (!year || typeof year !== 'string' || !['1年', '2年', '3年', '4年'].includes(year)) {
      return NextResponse.json(
        { error: '学年を選択してください' },
        { status: 400 }
      )
    }

    // Get authenticated user
    const cookieStore = await cookies()
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

    // Check if profiles table exists and profile has faculty set
    let existingProfile = null
    try {
      const profileResponse = await supabaseAdmin
        .from('profiles')
        .select('faculty, year')
        .eq('id', user.id)
        .single()
      
      existingProfile = profileResponse.data

      if (existingProfile?.faculty && existingProfile?.year) {
        return NextResponse.json(
          { error: 'プロフィールは既に登録されています' },
          { status: 400 }
        )
      }
    } catch (error) {
      console.log('⚠️ プロフィールテーブルまたはレコードが存在しません。新規作成を試みます。')
    }

    // Try to update existing profile, or create new one if it doesn't exist
    let data, error
    
    if (existingProfile) {
      // Update existing profile
      const updateResponse = await supabaseAdmin
        .from('profiles')
        .update({
          faculty: faculty.trim(),
          year: year
        })
        .eq('id', user.id)
        .select()
        .single()
      
      data = updateResponse.data
      error = updateResponse.error
    } else {
      // Create new profile
      const insertResponse = await supabaseAdmin
        .from('profiles')
        .insert({
          id: user.id,
          university: '名古屋大学',
          faculty: faculty.trim(),
          year: year
        })
        .select()
        .single()
      
      data = insertResponse.data
      error = insertResponse.error
    }

    if (error) {
      console.error('Profile creation/update error:', error)
      return NextResponse.json(
        { error: 'プロフィールの保存に失敗しました' },
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
          year: year,
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