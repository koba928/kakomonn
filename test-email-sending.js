#!/usr/bin/env node

// Supabaseメール送信テスト用スクリプト
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ 環境変数が不足しています')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl)
  console.log('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey)
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function testEmailSending() {
  console.log('🧪 メール送信テスト開始...')
  
  const testEmail = 'test@s.thers.ac.jp'
  const tempPassword = 'test-password-123'
  
  try {
    // 1. テストユーザーを作成
    console.log('👤 テストユーザー作成中...')
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: testEmail,
      password: tempPassword,
      email_confirm: false,
      user_metadata: { university: '名古屋大学' }
    })
    
    if (userError) {
      console.error('❌ ユーザー作成エラー:', userError)
      return
    }
    
    console.log('✅ テストユーザー作成成功:', userData.user.id)
    
    // 2. 確認メールリンクを生成
    console.log('📧 メールリンク生成中...')
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email: testEmail,
      password: tempPassword,
      options: {
        redirectTo: 'https://kakomonn.vercel.app/auth/callback'
      }
    })
    
    if (linkError) {
      console.error('❌ メールリンク生成エラー:', linkError)
    } else {
      console.log('✅ メールリンク生成成功')
      console.log('🔗 確認リンク:', linkData.properties?.action_link)
    }
    
    // 3. テストユーザーを削除
    console.log('🗑️ テストユーザー削除中...')
    await supabaseAdmin.auth.admin.deleteUser(userData.user.id)
    console.log('✅ テストユーザー削除完了')
    
  } catch (error) {
    console.error('❌ テスト全体エラー:', error)
  }
}

testEmailSending()