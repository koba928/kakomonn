#!/usr/bin/env node

// Supabaseメール送信問題の徹底的な調査スクリプト
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const allowedDomains = process.env.ALLOWED_EMAIL_DOMAINS
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL

console.log('🔍 環境変数チェック:')
console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ 設定済み' : '❌ 未設定')
console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✅ 設定済み' : '❌ 未設定')
console.log('ALLOWED_EMAIL_DOMAINS:', allowedDomains)
console.log('SITE_URL:', siteUrl)
console.log('')

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ 必要な環境変数が不足しています')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function comprehensiveEmailDebug() {
  console.log('🧪 包括的メール送信デバッグ開始...')
  
  const testEmail = 'test@s.thers.ac.jp'
  const realEmail = 'rintaro.170928@icloud.com'
  
  try {
    // 1. Supabaseプロジェクト設定を確認
    console.log('\n1️⃣ Supabaseプロジェクト設定確認...')
    
    const { data: settings, error: settingsError } = await supabaseAdmin.auth.admin.getSettings()
    
    if (settingsError) {
      console.error('❌ 設定取得エラー:', settingsError)
    } else {
      console.log('✅ Supabase Auth設定:')
      console.log('  Site URL:', settings?.site_url)
      console.log('  External email enabled:', settings?.external_email_enabled)
      console.log('  Email enabled:', settings?.email_enabled)
      console.log('  Email autoconfirm:', settings?.email_autoconfirm)
    }

    // 2. 既存ユーザーを削除（テスト準備）
    console.log('\n2️⃣ 既存テストユーザーをクリーンアップ...')
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    
    for (const user of existingUsers.users) {
      if (user.email === testEmail || user.email === realEmail) {
        console.log(`🗑️ 既存ユーザー削除: ${user.email}`)
        await supabaseAdmin.auth.admin.deleteUser(user.id)
      }
    }

    // 3. 複数の方法でメール送信を試行
    console.log('\n3️⃣ メール送信方法1: createUser + generateLink')
    
    const { data: userData1, error: userError1 } = await supabaseAdmin.auth.admin.createUser({
      email: testEmail,
      password: 'test-password-123',
      email_confirm: false,
      user_metadata: { university: '名古屋大学' }
    })
    
    if (userError1) {
      console.error('❌ ユーザー作成エラー (方法1):', userError1)
    } else {
      console.log('✅ ユーザー作成成功 (方法1):', userData1.user.id)
      
      // メールリンク生成
      const { data: linkData1, error: linkError1 } = await supabaseAdmin.auth.admin.generateLink({
        type: 'signup',
        email: testEmail,
        password: 'test-password-123',
        options: {
          redirectTo: 'https://kakomonn.vercel.app/auth/callback'
        }
      })
      
      if (linkError1) {
        console.error('❌ リンク生成エラー (方法1):', linkError1)
      } else {
        console.log('✅ メールリンク生成成功 (方法1):')
        console.log('   Action link:', linkData1.properties?.action_link)
        console.log('   Email OTP:', linkData1.properties?.email_otp)
        console.log('   Hashed token:', linkData1.properties?.hashed_token)
      }
      
      // ユーザー削除
      await supabaseAdmin.auth.admin.deleteUser(userData1.user.id)
    }

    // 4. 方法2: inviteUserByEmail
    console.log('\n4️⃣ メール送信方法2: inviteUserByEmail')
    
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(testEmail, {
      redirectTo: 'https://kakomonn.vercel.app/auth/callback',
      data: { university: '名古屋大学' }
    })
    
    if (inviteError) {
      console.error('❌ 招待メール送信エラー:', inviteError)
    } else {
      console.log('✅ 招待メール送信成功:', inviteData)
      
      // 作成されたユーザーをクリーンアップ
      if (inviteData?.user?.id) {
        await supabaseAdmin.auth.admin.deleteUser(inviteData.user.id)
      }
    }

    // 5. 方法3: signUpWithPassword（通常のフロー）
    console.log('\n5️⃣ メール送信方法3: signUpWithPassword')
    
    const normalSupabase = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    
    const { data: signupData, error: signupError } = await normalSupabase.auth.signUp({
      email: testEmail,
      password: 'test-password-123',
      options: {
        emailRedirectTo: 'https://kakomonn.vercel.app/auth/callback',
        data: { university: '名古屋大学' }
      }
    })
    
    if (signupError) {
      console.error('❌ 通常サインアップエラー:', signupError)
    } else {
      console.log('✅ 通常サインアップ成功:', signupData.user?.id)
      
      // 作成されたユーザーをクリーンアップ
      if (signupData.user?.id) {
        await supabaseAdmin.auth.admin.deleteUser(signupData.user.id)
      }
    }

    // 6. メールテンプレートとSMTP設定を確認
    console.log('\n6️⃣ メール設定の推奨事項:')
    console.log('🔧 Supabaseダッシュボードで以下を確認してください:')
    console.log('   1. Authentication > Settings > Email')
    console.log('   2. "Enable email confirmations" がONか')
    console.log('   3. "Enable custom SMTP" がOFFか（デフォルトSMTPを使用）')
    console.log('   4. Site URL が https://kakomonn.vercel.app に設定されているか')
    console.log('   5. メールテンプレートが正しく設定されているか')
    
  } catch (error) {
    console.error('❌ 包括的デバッグエラー:', error)
  }
}

comprehensiveEmailDebug()