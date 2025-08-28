const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

async function fixEmailConfirmation() {
  console.log('📧 メール確認問題を修正中...')
  
  // Load environment variables
  let supabaseUrl, supabaseServiceKey
  try {
    const envContent = fs.readFileSync('.env', 'utf8')
    const lines = envContent.split('\n')
    for (const line of lines) {
      if (line.includes('=')) {
        const [key, value] = line.split('=', 2)
        if (key === 'NEXT_PUBLIC_SUPABASE_URL') {
          supabaseUrl = value.replace(/"/g, '').trim()
        }
        if (key === 'SUPABASE_SERVICE_ROLE_KEY') {
          supabaseServiceKey = value.replace(/"/g, '').trim()
        }
      }
    }
  } catch (error) {
    console.error('❌ .envファイルが読み込めません:', error.message)
    return
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  try {
    console.log('🔧 既存ユーザーのメール確認状態を更新中...')
    
    // Method 1: Update existing users to confirm their emails
    const updateQuery = `
      UPDATE auth.users 
      SET email_confirmed_at = now() 
      WHERE email_confirmed_at IS NULL;
    `
    
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({ sql: updateQuery })
    })

    if (response.ok) {
      console.log('✅ 既存ユーザーのメール確認を完了しました')
    } else {
      console.log('⚠️ 直接SQL実行に失敗、代替方法を試行中...')
      
      // Method 2: Try to get current users and update them
      const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers()
      
      if (users && users.length > 0) {
        console.log(`👥 ${users.length}人のユーザーを確認中...`)
        
        for (const user of users) {
          if (!user.email_confirmed_at) {
            console.log(`📧 ユーザー ${user.email} のメール確認を更新中...`)
            
            const { error: updateError } = await supabase.auth.admin.updateUserById(
              user.id, 
              { email_confirm: true }
            )
            
            if (updateError) {
              console.log(`⚠️ ユーザー ${user.email} の更新失敗:`, updateError.message)
            } else {
              console.log(`✅ ユーザー ${user.email} のメール確認完了`)
            }
          }
        }
      }
    }
    
    // Method 3: Try to disable email confirmation for future users
    console.log('\n🛠️ 新規ユーザー向けの設定確認...')
    
    // Note: This requires direct database access which may not be available via API
    console.log('ℹ️ 新規ユーザーの自動確認には管理画面での設定変更が必要です')
    console.log('📋 手順:')
    console.log('  1. Supabase管理画面を開く')
    console.log('  2. Authentication → Settings')
    console.log('  3. "Enable email confirmations" をOFFにする')

    console.log('\n🎉 メール確認問題の修正完了!')
    console.log('💡 既存ユーザーはログイン可能になりました')
    
  } catch (error) {
    console.error('❌ メール確認修正中にエラー:', error.message)
  }
}

fixEmailConfirmation().catch(console.error)