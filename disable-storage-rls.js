const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

async function disableStorageRLS() {
  console.log('🚫 ストレージRLSを一時的に無効化...')
  
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
    // バケットを削除して、RLS無効で再作成
    console.log('🗑️ バケットを再作成（RLS無効）...')
    
    // 既存バケットを削除
    const { error: deleteError } = await supabaseAdmin.storage.deleteBucket('past-exams')
    if (deleteError && !deleteError.message.includes('not found')) {
      console.log('⚠️ バケット削除:', deleteError.message)
    }
    
    // 新しいバケットを作成（公開バケット）
    const { data, error } = await supabaseAdmin.storage.createBucket('past-exams', {
      public: true, // 公開バケットにすることでRLSを回避
      allowedMimeTypes: [
        'application/pdf',
        'image/jpeg', 'image/jpg', 'image/png', 'image/webp'
      ],
      fileSizeLimit: 26214400 // 25MB
    })

    if (error) {
      console.error('❌ バケット作成エラー:', error.message)
      return
    }
    
    console.log('✅ 公開バケットを作成しました')
    
    // テストアップロード（匿名）
    console.log('📤 テストアップロード中...')
    
    const supabaseAnon = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || supabaseServiceKey)
    
    const testContent = `テスト - ${new Date().toISOString()}`
    const testFileName = `test-anonymous-${Date.now()}.txt`
    
    // Create a proper File object
    const testFile = {
      name: testFileName,
      type: 'text/plain',
      size: testContent.length,
      arrayBuffer: async () => new TextEncoder().encode(testContent).buffer,
      slice: () => testFile,
      stream: () => new ReadableStream(),
      text: async () => testContent
    }
    
    const { data: uploadData, error: uploadError } = await supabaseAnon.storage
      .from('past-exams')
      .upload(testFileName, testContent, {
        contentType: 'text/plain'
      })
    
    if (uploadError) {
      console.error('❌ テストアップロードエラー:', uploadError)
    } else {
      console.log('✅ 匿名テストアップロード成功!')
      
      // 公開URLを取得
      const { data: urlData } = supabaseAnon.storage
        .from('past-exams')
        .getPublicUrl(testFileName)
      
      console.log('🔗 テストファイルURL:', urlData.publicUrl)
      
      // テストファイルを削除
      await supabaseAdmin.storage
        .from('past-exams')
        .remove([testFileName])
      
      console.log('🗑️ テストファイルを削除')
    }
    
    console.log('\\n✅ 公開ストレージ設定完了!')
    console.log('⚠️ 注意: セキュリティのため、後で適切なRLSポリシーを設定してください')
    
  } catch (error) {
    console.error('❌ 設定中にエラー:', error.message)
  }
}

disableStorageRLS().catch(console.error)