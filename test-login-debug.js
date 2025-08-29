const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

async function testLoginDebug() {
  console.log('🔐 ログインデバッグ開始...')
  
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

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

  try {
    console.log('👥 全ユーザーの認証状態を確認...')
    
    // 全認証ユーザーを取得
    const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (listError) {
      console.error('❌ ユーザー一覧取得エラー:', listError)
      return
    }
    
    console.log(`📊 登録ユーザー数: ${users.length}`)
    
    users.forEach((user, index) => {
      console.log(`\\n👤 ユーザー ${index + 1}:`)
      console.log(`   📧 Email: ${user.email}`)
      console.log(`   🆔 ID: ${user.id}`)
      console.log(`   ✅ Email確認: ${user.email_confirmed_at ? '済み' : '未確認'}`)
      console.log(`   📅 作成日: ${new Date(user.created_at).toLocaleString('ja-JP')}`)
      console.log(`   🔑 最終ログイン: ${user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString('ja-JP') : 'なし'}`)
      console.log(`   📋 メタデータ:`, {
        name: user.user_metadata?.name,
        university: user.user_metadata?.university
      })
    })
    
    // メール確認が必要かどうかをチェック
    const unconfirmedUsers = users.filter(u => !u.email_confirmed_at)
    if (unconfirmedUsers.length > 0) {
      console.log(`\\n⚠️ メール未確認ユーザー: ${unconfirmedUsers.length}人`)
      console.log('💡 これがログインできない原因の可能性があります')
      
      // メール確認を自動で完了させる
      console.log('\\n🔧 メール確認を自動完了中...')
      
      for (const user of unconfirmedUsers) {
        try {
          const { error } = await supabaseAdmin.auth.admin.updateUserById(
            user.id,
            { email_confirm: true }
          )
          
          if (error) {
            console.log(`❌ ${user.email} のメール確認エラー:`, error.message)
          } else {
            console.log(`✅ ${user.email} のメール確認を完了しました`)
          }
        } catch (updateError) {
          console.log(`❌ ${user.email} の更新エラー:`, updateError.message)
        }
      }
    }
    
    console.log('\\n🔧 ログイン問題解決方法:')
    console.log('1. メール確認が完了したのでログインを再試行')
    console.log('2. ブラウザのキャッシュをクリア')
    console.log('3. プライベートモードでテスト')
    console.log('4. パスワードが正しいことを確認')
    
  } catch (error) {
    console.error('❌ デバッグ中にエラー:', error.message)
  }
}

testLoginDebug().catch(console.error)