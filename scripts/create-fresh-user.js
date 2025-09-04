// 新規ユーザー作成 + 認証リンク生成
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

async function createFreshUser(email) {
  try {
    console.log('📧 新規ユーザー作成中:', email)
    
    // Step 1: 既存ユーザーチェック
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      console.error('❌ ユーザー一覧取得エラー:', listError)
      return
    }
    
    const existingUser = users.find(u => u.email === email)
    
    if (existingUser) {
      console.log('🔍 既存ユーザーを削除中...')
      const { error: deleteError } = await supabase.auth.admin.deleteUser(existingUser.id)
      
      if (deleteError) {
        console.error('❌ ユーザー削除エラー:', deleteError)
        return
      }
      
      console.log('✅ 既存ユーザー削除完了')
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
    
    // Step 2: 新規ユーザー作成
    console.log('👤 新規ユーザー作成中...')
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      email_confirm: false
    })
    
    if (error) {
      console.error('❌ ユーザー作成エラー:', error)
      return
    }
    
    console.log('✅ ユーザー作成成功:', data.user.id)
    
    // Step 3: サインアップ用リンク生成
    console.log('🔗 サインアップリンク生成中...')
    const { data: signupLink, error: signupError } = await supabase.auth.admin.generateLink({
      type: 'signup',
      email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding`
      }
    })
    
    if (signupError) {
      console.error('❌ サインアップリンク生成エラー:', signupError)
    } else {
      console.log('✅ サインアップリンク生成成功')
      console.log('🔗 Signup link:', signupLink.properties?.action_link)
    }
    
    // Step 4: マジックリンク生成（バックアップ）
    console.log('🔗 マジックリンク生成中...')
    const { data: magicLink, error: magicError } = await supabase.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding`
      }
    })
    
    if (magicError) {
      console.error('❌ マジックリンク生成エラー:', magicError)
    } else {
      console.log('✅ マジックリンク生成成功')
      console.log('🔗 Magic link:', magicLink.properties?.action_link)
    }
    
  } catch (error) {
    console.error('❌ 処理エラー:', error)
  }
}

const email = process.argv[2]

if (!email) {
  console.log('使用方法: node scripts/create-fresh-user.js your-email@s.thers.ac.jp')
  process.exit(1)
}

createFreshUser(email)