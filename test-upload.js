const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

async function testUpload() {
  console.log('📤 ファイルアップロードテスト開始...')
  
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
    // まず認証状態を確認
    const { data: { user } } = await supabase.auth.getUser()
    console.log('👤 認証状態:', user ? `ログイン済み (${user.email})` : '未ログイン')

    // バケット一覧を確認
    console.log('🗂️ バケット一覧を取得中...')
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets()
    
    if (bucketError) {
      console.error('❌ バケット一覧取得エラー:', bucketError.message)
      return
    }
    
    console.log('📁 利用可能なバケット:', buckets.map(b => b.name))
    
    // past-examsバケットの存在確認
    const pastExamsBucket = buckets.find(b => b.name === 'past-exams')
    if (!pastExamsBucket) {
      console.log('❌ past-exams バケットが見つかりません')
      return
    }
    
    console.log('✅ past-exams バケットが存在します')
    
    // テストファイル作成
    const testContent = 'テストファイル内容'
    const testFileName = `test-${Date.now()}.txt`
    const testFile = new Blob([testContent], { type: 'text/plain' })
    
    console.log('📤 テストファイルアップロード中...')
    
    // アップロード実行
    const { data, error } = await supabase.storage
      .from('past-exams')
      .upload(testFileName, testFile, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (error) {
      console.error('❌ アップロードエラー:', error)
      
      // より詳細なエラー情報
      if (error.message) {
        console.error('エラーメッセージ:', error.message)
      }
      if (error.statusCode) {
        console.error('ステータスコード:', error.statusCode)
      }
    } else {
      console.log('✅ アップロード成功!')
      console.log('📄 アップロード結果:', data)
      
      // 公開URLを取得してテスト
      const { data: urlData } = supabase.storage
        .from('past-exams')
        .getPublicUrl(testFileName)
      
      console.log('🔗 公開URL:', urlData.publicUrl)
      
      // テストファイルを削除
      const { error: deleteError } = await supabase.storage
        .from('past-exams')
        .remove([testFileName])
      
      if (deleteError) {
        console.log('⚠️ テストファイル削除エラー:', deleteError.message)
      } else {
        console.log('🗑️ テストファイルを削除しました')
      }
    }
    
  } catch (error) {
    console.error('❌ テスト中にエラー:', error.message)
  }
}

testUpload().catch(console.error)