// 強制ユーザー削除スクリプト
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

async function forceDeleteUser(email) {
  try {
    console.log('🔍 ユーザー検索中:', email)
    
    // 全ユーザーを取得
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      console.error('❌ ユーザー一覧取得エラー:', listError)
      return
    }
    
    // メールアドレスでユーザーを検索
    const user = users.find(u => u.email === email)
    
    if (!user) {
      console.log('ℹ️ ユーザーが見つかりませんでした:', email)
      return
    }
    
    console.log('👤 ユーザーが見つかりました:', {
      id: user.id,
      email: user.email,
      created_at: user.created_at,
      email_confirmed_at: user.email_confirmed_at,
      phone_confirmed_at: user.phone_confirmed_at
    })
    
    // Step 1: プロフィール削除
    console.log('🗑️ Step 1: プロフィール削除...')
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id)
      
      if (profileError && profileError.code !== 'PGRST116') {
        console.warn('⚠️ プロフィール削除エラー:', profileError.message)
      } else {
        console.log('✅ プロフィール削除完了')
      }
    } catch (e) {
      console.warn('⚠️ プロフィール削除スキップ:', e.message)
    }
    
    // Step 2: users テーブルから削除（もしあれば）
    console.log('🗑️ Step 2: usersテーブル削除...')
    try {
      const { error: userTableError } = await supabase
        .from('users')
        .delete()
        .eq('id', user.id)
      
      if (userTableError && userTableError.code !== 'PGRST116') {
        console.warn('⚠️ usersテーブル削除エラー:', userTableError.message)
      } else {
        console.log('✅ usersテーブル削除完了')
      }
    } catch (e) {
      console.warn('⚠️ usersテーブル削除スキップ:', e.message)
    }
    
    // Step 3: 認証ユーザー削除（複数回試行）
    console.log('🗑️ Step 3: 認証ユーザー削除...')
    
    let deleteAttempts = 0
    let deleteSuccess = false
    
    while (deleteAttempts < 3 && !deleteSuccess) {
      deleteAttempts++
      console.log(`🔄 削除試行 ${deleteAttempts}/3...`)
      
      const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)
      
      if (!deleteError) {
        deleteSuccess = true
        console.log('✅ 認証ユーザー削除成功!')
      } else {
        console.warn(`⚠️ 削除試行${deleteAttempts}失敗:`, deleteError.message)
        if (deleteAttempts < 3) {
          console.log('⏳ 2秒待機してリトライ...')
          await new Promise(resolve => setTimeout(resolve, 2000))
        }
      }
    }
    
    if (!deleteSuccess) {
      console.error('❌ 削除に失敗しました。手動でSupabaseダッシュボードから削除してください')
      console.log('🔗 Supabase Auth: https://supabase.com/dashboard/project/' + process.env.NEXT_PUBLIC_SUPABASE_URL.split('//')[1].split('.')[0] + '/auth/users')
      return
    }
    
    // Step 4: 削除確認
    console.log('🔍 Step 4: 削除確認中...')
    await new Promise(resolve => setTimeout(resolve, 1000)) // 1秒待機
    
    const { data: { users: updatedUsers } } = await supabase.auth.admin.listUsers()
    const stillExists = updatedUsers.find(u => u.email === email)
    
    if (stillExists) {
      console.log('❌ まだ存在しています。Supabaseダッシュボードから手動削除してください')
    } else {
      console.log('✅ 完全に削除されました!')
      console.log('🎉 新規登録をテストできます!')
    }
    
  } catch (error) {
    console.error('❌ 処理エラー:', error)
  }
}

const email = process.argv[2]

if (!email) {
  console.log('使用方法: node scripts/force-delete-user.js your-email@s.thers.ac.jp')
  process.exit(1)
}

console.log('🚨 強制削除スクリプト実行中...')
console.log('📧 対象:', email)

forceDeleteUser(email)