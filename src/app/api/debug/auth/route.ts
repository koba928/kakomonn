import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function GET() {
  try {
    // 1. 最近のユーザーを確認
    const { data: recentUsers, error: usersError } = await supabaseAdmin
      .from('auth.users')
      .select('id, email, created_at, email_confirmed_at')
      .order('created_at', { ascending: false })
      .limit(5)

    // 2. profilesテーブルの存在確認
    const { count: profilesCount, error: profilesError } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })

    // 3. RLS状態の確認（生SQLクエリ）
    const { data: rlsStatus, error: rlsError } = await supabaseAdmin.rpc('get_table_rls_status', {
      table_name: 'profiles'
    }).single()

    // 4. トリガーの確認
    const { data: triggers, error: triggersError } = await supabaseAdmin
      .from('information_schema.triggers')
      .select('trigger_name, event_object_table')
      .eq('trigger_schema', 'public')

    return NextResponse.json({
      status: 'ok',
      debug: {
        recentUsers: recentUsers || [],
        recentUsersError: usersError?.message,
        profilesCount: profilesCount ?? 0,
        profilesError: profilesError?.message,
        rlsEnabled: rlsStatus?.rls_enabled ?? null,
        rlsError: rlsError?.message,
        triggers: triggers || [],
        triggersError: triggersError?.message
      },
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      }
    })
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}