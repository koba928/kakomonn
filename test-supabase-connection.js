const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

async function testConnection() {
  // Load environment variables from .env file manually
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  let supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    try {
      const envContent = fs.readFileSync('.env', 'utf8')
      const lines = envContent.split('\n')
      for (const line of lines) {
        const [key, value] = line.split('=')
        if (key === 'NEXT_PUBLIC_SUPABASE_URL') {
          supabaseUrl = value.replace(/"/g, '').replace(/\\n/g, '')
        }
        if (key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') {
          supabaseKey = value.replace(/"/g, '').replace(/\\n/g, '')
        }
      }
    } catch (error) {
      console.error('❌ .envファイルが読み込めません:', error.message)
    }
  }

  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ 環境変数が設定されていません')
    console.log('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl)
    console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', !!supabaseKey)
    return
  }

  console.log('🔍 Supabase接続テスト開始...')
  console.log('URL:', supabaseUrl)
  console.log('Key:', supabaseKey.substring(0, 20) + '...')

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // 1. データベース接続テスト
    console.log('\n📊 データベース接続テスト...')
    const { data: tablesData, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .limit(5)

    if (tablesError) {
      console.error('❌ データベース接続失敗:', tablesError)
    } else {
      console.log('✅ データベース接続成功')
      console.log('📋 既存テーブル:', tablesData?.map(t => t.table_name) || [])
    }

    // 2. past_examsテーブル存在確認
    console.log('\n📚 past_examsテーブル確認...')
    const { data: examData, error: examError } = await supabase
      .from('past_exams')
      .select('count')
      .limit(1)

    if (examError) {
      console.error('❌ past_examsテーブルが存在しません:', examError.message)
    } else {
      console.log('✅ past_examsテーブル存在確認')
    }

    // 3. ストレージバケット確認
    console.log('\n🗂️  ストレージバケット確認...')
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()

    if (bucketError) {
      console.error('❌ ストレージアクセス失敗:', bucketError)
    } else {
      console.log('✅ ストレージアクセス成功')
      console.log('📦 既存バケット:', buckets?.map(b => b.name) || [])
      
      const pastExamsBucket = buckets?.find(b => b.name === 'past-exams')
      if (pastExamsBucket) {
        console.log('✅ past-examsバケット存在確認')
      } else {
        console.error('❌ past-examsバケットが存在しません')
      }
    }

    // 4. 認証テスト
    console.log('\n🔐 認証システム確認...')
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.log('ℹ️  認証情報なし（正常）:', authError.message)
    } else if (user) {
      console.log('✅ ログイン中のユーザー:', user.email)
    }

  } catch (error) {
    console.error('❌ 接続テスト中にエラー:', error)
  }
}

testConnection().then(() => {
  console.log('\n🎯 接続テスト完了')
}).catch(console.error)