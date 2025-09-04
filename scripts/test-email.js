// メール送信テストスクリプト
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

async function testEmailSending(email) {
  try {
    console.log('📧 メール送信テスト開始:', email)
    console.log('🔧 環境変数確認:')
    console.log('  NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('  SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '設定済み' : '未設定')
    console.log('  NEXT_PUBLIC_APP_URL:', process.env.NEXT_PUBLIC_APP_URL)
    
    // Method 1: inviteUserByEmail
    console.log('\n📤 Method 1: inviteUserByEmail')
    try {
      const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding`
      })
      
      if (inviteError) {
        console.error('❌ Invite エラー:', inviteError)
      } else {
        console.log('✅ Invite 成功:', inviteData)
      }
    } catch (e) {
      console.error('❌ Invite 例外:', e.message)
    }
    
    // Method 2: generateLink
    console.log('\n🔗 Method 2: generateLink')
    try {
      const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
        type: 'magiclink',
        email,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding`
        }
      })
      
      if (linkError) {
        console.error('❌ Link生成エラー:', linkError)
      } else {
        console.log('✅ Link生成成功')
        console.log('🔗 Direct link:', linkData.properties?.action_link)
      }
    } catch (e) {
      console.error('❌ Link生成例外:', e.message)
    }
    
  } catch (error) {
    console.error('❌ 全体エラー:', error)
  }
}

const email = process.argv[2] || 'test@gmail.com'
console.log('📧 テスト対象メール:', email)

testEmailSending(email)