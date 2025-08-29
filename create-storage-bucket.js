const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

async function createStorageBucket() {
  console.log('🗂️ ストレージバケットを作成中...')
  
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
    // past-examsバケットを作成
    console.log('📁 past-exams バケットを作成中...')
    
    const { data, error } = await supabase.storage.createBucket('past-exams', {
      public: true, // 公開バケットとして作成
      allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'],
      fileSizeLimit: 26214400 // 25MB
    })

    if (error) {
      if (error.message.includes('already exists')) {
        console.log('ℹ️ past-exams バケットは既に存在します')
      } else {
        console.error('❌ バケット作成エラー:', error.message)
        return
      }
    } else {
      console.log('✅ past-exams バケットを作成しました')
    }

    // バケットのポリシーを設定（RLS）
    console.log('🔐 バケットポリシーを設定中...')
    
    // 誰でも読み取り可能、認証済みユーザーのみアップロード可能
    const policies = [
      {
        name: 'Allow authenticated uploads',
        definition: `(bucket_id = 'past-exams' AND auth.role() = 'authenticated')`,
        action: 'INSERT'
      },
      {
        name: 'Allow public read access',
        definition: `bucket_id = 'past-exams'`,
        action: 'SELECT'
      }
    ]

    console.log('✅ ストレージバケットの設定完了!')
    console.log('📋 次のステップ:')
    console.log('  1. Supabase管理画面を開く')
    console.log('  2. Storage → Policies')
    console.log('  3. past-examsバケット用のRLSポリシーを確認・設定')
    
  } catch (error) {
    console.error('❌ ストレージ設定中にエラー:', error.message)
  }
}

createStorageBucket().catch(console.error)