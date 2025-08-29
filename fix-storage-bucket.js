const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

async function fixStorageBucket() {
  console.log('🔧 ストレージバケット設定を修正中...')
  
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

  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

  try {
    // バケットを削除して再作成
    console.log('🗑️ 既存バケットを削除中...')
    
    const { error: deleteError } = await supabaseAdmin.storage.deleteBucket('past-exams')
    if (deleteError && !deleteError.message.includes('not found')) {
      console.log('⚠️ バケット削除:', deleteError.message)
    }
    
    console.log('📁 新しいバケットを作成中...')
    
    const { data, error } = await supabaseAdmin.storage.createBucket('past-exams', {
      public: true,
      // より幅広いファイル形式を許可
      allowedMimeTypes: [
        'application/pdf',
        'image/jpeg', 'image/jpg', 'image/png', 'image/webp',
        'text/plain', // テスト用
        'application/octet-stream' // バイナリファイル
      ],
      fileSizeLimit: 26214400 // 25MB
    })

    if (error) {
      console.error('❌ バケット作成エラー:', error.message)
      return
    }
    
    console.log('✅ バケットを作成しました')
    
    // テストアップロード
    console.log('📤 テストアップロード中...')
    
    const testContent = `テスト - ${new Date().toISOString()}`
    const testFileName = `test-${Date.now()}.txt`
    const testBlob = new Blob([testContent], { type: 'text/plain' })
    
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('past-exams')
      .upload(testFileName, testBlob)
    
    if (uploadError) {
      console.error('❌ テストアップロードエラー:', uploadError)
    } else {
      console.log('✅ テストアップロード成功!')
      
      // 公開URLを取得
      const { data: urlData } = supabaseAdmin.storage
        .from('past-exams')
        .getPublicUrl(testFileName)
      
      console.log('🔗 テストファイルURL:', urlData.publicUrl)
      
      // テストファイルを削除
      await supabaseAdmin.storage
        .from('past-exams')
        .remove([testFileName])
      
      console.log('🗑️ テストファイルを削除')
    }
    
    console.log('\\n✅ ストレージ修正完了!')
    console.log('📱 アプリでファイルアップロードをテストしてください')
    
  } catch (error) {
    console.error('❌ 修正中にエラー:', error.message)
  }
}

fixStorageBucket().catch(console.error)