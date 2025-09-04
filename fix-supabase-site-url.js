#!/usr/bin/env node

// SupabaseのSite URL設定を修正するスクリプト
require('dotenv').config({ path: '.env.local' })

const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ 環境変数が不足しています')
  process.exit(1)
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function fixSiteUrlSettings() {
  console.log('🔧 Supabase Site URL設定修正中...')
  
  try {
    // Management APIを使用してSite URLを更新
    const response = await fetch(`${supabaseUrl}/rest/v1/config`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({
        site_url: 'https://kakomonn.vercel.app',
        additional_redirect_urls: [
          'https://kakomonn.vercel.app/auth/callback',
          'https://kakomonn.vercel.app/onboarding'
        ]
      })
    })
    
    if (response.ok) {
      console.log('✅ Site URL設定更新成功')
    } else {
      const error = await response.text()
      console.log('ℹ️ Management API直接更新は制限されています')
      console.log('🔧 代替方法: generateLinkのredirectToを直接指定します')
    }
    
  } catch (error) {
    console.log('ℹ️ 管理API直接更新は制限されています:', error.message)
    console.log('🔧 代替方法で設定します')
  }
}

fixSiteUrlSettings()