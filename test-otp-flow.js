#!/usr/bin/env node

// OTP認証フローのテストスクリプト
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

async function testOTPFlow() {
  console.log('🧪 OTP認証フローテスト開始...')
  
  const testEmail = 'test@s.thers.ac.jp'
  
  try {
    // 1. 既存ユーザーをクリーンアップ
    console.log('🧹 既存ユーザーをクリーンアップ...')
    const { data: users } = await supabaseAdmin.auth.admin.listUsers()
    
    for (const user of users.users) {
      if (user.email === testEmail) {
        await supabaseAdmin.auth.admin.deleteUser(user.id)
        console.log(`🗑️ 削除: ${user.email}`)
      }
    }

    // 2. ユーザー作成とOTP生成
    console.log('\n📝 ユーザー作成とOTP生成...')
    
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: testEmail,
      password: 'test-password-123',
      email_confirm: false,
      user_metadata: { university: '名古屋大学' }
    })
    
    if (userError) {
      console.error('❌ ユーザー作成エラー:', userError)
      return
    }
    
    console.log('✅ ユーザー作成成功:', userData.user.id)

    // 3. OTP生成
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email: testEmail,
      password: 'test-password-123',
      options: {
        redirectTo: 'https://kakomonn.vercel.app/auth/callback'
      }
    })
    
    if (linkError) {
      console.error('❌ OTP生成エラー:', linkError)
      await supabaseAdmin.auth.admin.deleteUser(userData.user.id)
      return
    }
    
    const otp = linkData?.properties?.email_otp
    console.log('✅ OTP生成成功:', otp)

    if (!otp) {
      console.error('❌ OTPが生成されませんでした')
      await supabaseAdmin.auth.admin.deleteUser(userData.user.id)
      return
    }

    // 4. OTP認証テスト
    console.log('\n🔐 OTP認証テスト...')
    
    const { data: verifyData, error: verifyError } = await supabaseAdmin.auth.verifyOtp({
      email: testEmail,
      token: otp,
      type: 'email'
    })
    
    if (verifyError) {
      console.error('❌ OTP認証エラー:', verifyError)
    } else {
      console.log('✅ OTP認証成功:', verifyData.user?.id)
      
      // ユーザーの状態確認
      const { data: userCheck } = await supabaseAdmin.auth.admin.getUserById(userData.user.id)
      console.log('📊 ユーザー状態:')
      console.log('  email_confirmed_at:', userCheck.user?.email_confirmed_at)
      console.log('  confirmed_at:', userCheck.user?.confirmed_at)
    }

    // 5. クリーンアップ
    console.log('\n🧹 テストユーザー削除...')
    await supabaseAdmin.auth.admin.deleteUser(userData.user.id)
    console.log('✅ テスト完了')

  } catch (error) {
    console.error('❌ テスト全体エラー:', error)
  }
}

testOTPFlow()