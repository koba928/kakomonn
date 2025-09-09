#!/usr/bin/env node

// シンプルなメール送信テストスクリプト
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey)

async function testEmailMethods() {
  console.log('🧪 メール送信方法テスト開始...')
  
  const testEmail = 'test123@s.thers.ac.jp'
  
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

    // 2. 方法1: Admin CreateUser + GenerateLink
    console.log('\n1️⃣ Admin CreateUser + GenerateLink方式:')
    
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
      email: testEmail,
      password: 'temp-password-123',
      email_confirm: false,
      user_metadata: { university: '名古屋大学' }
    })
    
    if (userError) {
      console.error('❌ ユーザー作成エラー:', userError)
    } else {
      console.log('✅ ユーザー作成成功:', userData.user.id)
      
      const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'signup',
        email: testEmail,
        password: 'temp-password-123',
        options: {
          redirectTo: 'https://kakomonn.vercel.app/auth/callback'
        }
      })
      
      if (linkError) {
        console.error('❌ リンク生成エラー:', linkError)
      } else {
        console.log('✅ メールリンク生成成功:')
        console.log('   Link:', linkData.properties?.action_link)
        console.log('   OTP:', linkData.properties?.email_otp)
      }
      
      await supabaseAdmin.auth.admin.deleteUser(userData.user.id)
    }

    // 3. 方法2: InviteUserByEmail
    console.log('\n2️⃣ InviteUserByEmail方式:')
    
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(testEmail, {
      redirectTo: 'https://kakomonn.vercel.app/auth/callback'
    })
    
    if (inviteError) {
      console.error('❌ 招待エラー:', inviteError)
    } else {
      console.log('✅ 招待成功:', inviteData)
      if (inviteData.user?.id) {
        await supabaseAdmin.auth.admin.deleteUser(inviteData.user.id)
      }
    }

    // 4. 方法3: 通常のSignUp
    console.log('\n3️⃣ 通常のSignUp方式:')
    
    const { data: signupData, error: signupError } = await supabaseClient.auth.signUp({
      email: testEmail,
      password: 'temp-password-123',
      options: {
        emailRedirectTo: 'https://kakomonn.vercel.app/auth/callback'
      }
    })
    
    if (signupError) {
      console.error('❌ サインアップエラー:', signupError)
    } else {
      console.log('✅ サインアップ成功:', signupData)
      if (signupData.user?.id) {
        await supabaseAdmin.auth.admin.deleteUser(signupData.user.id)
      }
    }

    console.log('\n📊 結論:')
    console.log('メール送信が機能しない場合、以下を確認:')
    console.log('1. Supabaseダッシュボード → Authentication → Settings')
    console.log('2. "Enable email confirmations" = ON')
    console.log('3. Site URL = https://kakomonn.vercel.app')
    console.log('4. スパムフォルダを確認')
    console.log('5. メールプロバイダーの制限を確認')

  } catch (error) {
    console.error('❌ テスト全体エラー:', error)
  }
}

testEmailMethods()