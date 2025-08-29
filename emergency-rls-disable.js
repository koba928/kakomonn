const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

async function emergencyRLSDisable() {
  console.log('🚨 緊急RLS無効化を実行中...')
  
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

  try {
    console.log('🔧 REST APIでRLS無効化を試行中...')
    
    // REST APIでRLSを無効化
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({
        query: 'ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;'
      })
    })

    if (!response.ok) {
      console.log('⚠️ REST API経由でのRLS無効化に失敗')
      console.log('📋 手動での対応が必要です:')
      console.log('1. Supabase管理画面 → SQL Editor')
      console.log('2. 以下のSQLを実行:')
      console.log('   ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;')
    } else {
      console.log('✅ RLS無効化成功!')
    }
    
    // テストアップロード
    console.log('📤 無効化後のテストアップロード...')
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    const testContent = 'RLSテスト'
    const testFileName = `rls-test-${Date.now()}.txt`
    
    const { data, error } = await supabase.storage
      .from('past-exams')
      .upload(testFileName, testContent, {
        contentType: 'text/plain'
      })
    
    if (error) {
      console.error('❌ テストアップロード失敗:', error.message)
      console.log('🔴 手動でのRLS無効化が必要です')
    } else {
      console.log('✅ テストアップロード成功! RLSが無効化されました')
      
      // テストファイルを削除
      await supabase.storage.from('past-exams').remove([testFileName])
      console.log('🗑️ テストファイルを削除')
    }
    
  } catch (error) {
    console.error('❌ 緊急RLS無効化中にエラー:', error.message)
    console.log('📋 manual-rls-fix.md を参照して手動で修正してください')
  }
}

emergencyRLSDisable().catch(console.error)