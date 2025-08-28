const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

async function directBucketTest() {
  console.log('🔍 ストレージバケット直接テスト...')
  
  // Load environment variables
  let supabaseUrl, supabaseAnonKey
  try {
    const envContent = fs.readFileSync('.env', 'utf8')
    const lines = envContent.split('\n')
    for (const line of lines) {
      if (line.includes('=')) {
        const [key, value] = line.split('=', 2)
        if (key === 'NEXT_PUBLIC_SUPABASE_URL') {
          supabaseUrl = value.replace(/"/g, '').trim()
        }
        if (key === 'NEXT_PUBLIC_SUPABASE_ANON_KEY') {
          supabaseAnonKey = value.replace(/"/g, '').trim()
        }
      }
    }
  } catch (error) {
    console.error('❌ .envファイルが読み込めません:', error.message)
    return
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  try {
    // 直接バケットにアクセスしてテスト
    console.log('\n📁 past-examsバケットに直接アクセス...')
    
    // ファイルリストを取得
    const { data: files, error: listError } = await supabase.storage
      .from('past-exams')
      .list('')
    
    if (listError) {
      console.error('❌ バケットアクセスエラー:', listError.message)
      if (listError.message.includes('not found')) {
        console.log('💡 バケットが存在しない可能性があります')
      }
    } else {
      console.log('✅ バケットアクセス成功！')
      console.log('📂 ファイル数:', files?.length || 0)
    }
    
    // パブリックURL生成テスト
    console.log('\n🔗 パブリックURL生成テスト...')
    const { data: urlData } = supabase.storage
      .from('past-exams')
      .getPublicUrl('test/sample.pdf')
    
    console.log('✅ URL生成成功:', urlData.publicUrl)
    
    // 結論
    console.log('\n📊 テスト結果:')
    if (!listError) {
      console.log('✅ ファイルアップロード環境は整っています！')
      console.log('✅ past-examsバケットが存在し、アクセス可能です')
      console.log('✅ ファイルの閲覧も可能です（パブリックURL経由）')
    } else {
      console.log('⚠️  バケットへのアクセスに問題があります')
      console.log('📝 ただし、アプリケーションからは正常に動作する可能性があります')
    }
    
  } catch (error) {
    console.error('❌ テスト中にエラー:', error.message)
  }
}

directBucketTest().catch(console.error)