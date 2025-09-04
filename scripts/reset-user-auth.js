// 認証状態のみリセット（投稿データは保持）
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

async function resetUserAuth(email) {
  try {
    console.log('🔄 認証状態リセット中:', email)
    
    // Step 1: ユーザー検索
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      console.error('❌ ユーザー一覧取得エラー:', listError)
      return
    }
    
    const user = users.find(u => u.email === email)
    
    if (!user) {
      console.log('ℹ️ ユーザーが見つかりませんでした:', email)
      return
    }
    
    console.log('👤 ユーザーが見つかりました:', {
      id: user.id,
      email: user.email,
      email_confirmed_at: user.email_confirmed_at
    })
    
    // Step 2: メール確認状態をリセット
    console.log('🔄 メール確認状態をリセット中...')
    const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      {
        email_confirm: false
      }
    )
    
    if (updateError) {
      console.error('❌ ユーザー更新エラー:', updateError)
      return
    }
    
    console.log('✅ メール確認状態をリセットしました')
    
    // Step 3: 新しい確認メール送信
    console.log('📧 新しい確認メール送信中...')
    const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
      type: 'signup',
      email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding`
      }
    })
    
    if (linkError) {
      console.error('❌ 確認リンク生成エラー:', linkError)
    } else {
      console.log('✅ 確認リンク生成成功')
      console.log('🔗 Direct link:', linkData.properties?.action_link)
    }
    
    console.log('🎉 認証状態のリセット完了！新規登録フローをテストできます')
    
  } catch (error) {
    console.error('❌ 処理エラー:', error)
  }
}

const email = process.argv[2]

if (!email) {
  console.log('使用方法: node scripts/reset-user-auth.js your-email@s.thers.ac.jp')
  process.exit(1)
}

resetUserAuth(email)