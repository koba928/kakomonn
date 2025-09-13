#!/usr/bin/env node

// Supabaseプロジェクトの現在の設定を確認するスクリプト
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

async function checkSupabaseConfig() {
  console.log('🔍 Supabaseプロジェクト設定確認...')
  console.log('Project URL:', supabaseUrl)
  
  try {
    // 1. 設定確認（利用可能なAPI）
    console.log('\n📋 利用可能な認証設定API:')
    
    // authのAPIエンドポイントをチェック
    const configEndpoints = [
      '/auth/v1/settings',
      '/rest/v1/auth/config',
    ]
    
    for (const endpoint of configEndpoints) {
      try {
        const response = await fetch(`${supabaseUrl}${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'apikey': supabaseServiceKey,
            'Content-Type': 'application/json'
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          console.log(`✅ ${endpoint}:`, JSON.stringify(data, null, 2))
        } else {
          console.log(`❌ ${endpoint}: ${response.status} ${response.statusText}`)
        }
      } catch (error) {
        console.log(`❌ ${endpoint}: ${error.message}`)
      }
    }

    // 2. 管理API経由で設定確認を試行
    console.log('\n🔧 管理設定確認試行...')
    
    try {
      // Supabase Management API（制限あり）
      const managementUrl = `https://api.supabase.com/v1/projects/${extractProjectId(supabaseUrl)}/config/auth`
      console.log('Management API URL:', managementUrl)
      console.log('ℹ️ Management APIは通常、個人アクセストークンが必要です')
    } catch (error) {
      console.log('❌ Management API確認失敗:', error.message)
    }

    // 3. 実際のメール送信テストでエラー詳細を取得
    console.log('\n📧 実際のメール送信エラー詳細を確認...')
    
    const testEmail = 'test-config@s.thers.ac.jp'
    
    // 既存ユーザーをクリーンアップ
    const { data: users } = await supabaseAdmin.auth.admin.listUsers()
    for (const user of users.users) {
      if (user.email === testEmail) {
        await supabaseAdmin.auth.admin.deleteUser(user.id)
      }
    }

    // メール送信テスト
    const { data: signupData, error: signupError } = await supabaseAdmin.auth.admin.createUser({
      email: testEmail,
      password: 'test-password-123',
      email_confirm: false,
      user_metadata: { university: '名古屋大学' }
    })

    if (signupError) {
      console.error('❌ ユーザー作成エラー:', signupError)
      return
    }

    console.log('✅ ユーザー作成成功:', signupData.user.id)

    // メールリンク生成（詳細エラー確認）
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email: testEmail,
      password: 'test-password-123',
      options: {
        redirectTo: 'https://kakomonn.vercel.app/auth/callback'
      }
    })

    if (linkError) {
      console.error('❌ メールリンク生成エラー詳細:', {
        message: linkError.message,
        status: linkError.status,
        code: linkError.code,
        details: linkError
      })
    } else {
      console.log('✅ メールリンク生成成功')
      console.log('🔗 生成されたリンク:', linkData.properties?.action_link)
      console.log('📍 リダイレクト先URL確認:', linkData.properties?.action_link?.includes('kakomonn.vercel.app') ? '正しい' : '古いURL')
    }

    // クリーンアップ
    await supabaseAdmin.auth.admin.deleteUser(signupData.user.id)

    console.log('\n📋 推奨アクション:')
    console.log('1. Supabaseダッシュボード → Authentication → URL Configuration')
    console.log('2. Site URL を https://kakomonn.vercel.app に設定')
    console.log('3. Redirect URLs に https://kakomonn.vercel.app/** を追加')
    console.log('4. カスタムSMTP設定を検討（SendGrid、Resendなど）')

  } catch (error) {
    console.error('❌ 設定確認エラー:', error)
  }
}

function extractProjectId(url) {
  try {
    const match = url.match(/https:\/\/([^.]+)\.supabase\.co/)
    return match ? match[1] : null
  } catch (error) {
    return null
  }
}

checkSupabaseConfig()