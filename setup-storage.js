const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

async function setupStorage() {
  console.log('🛠️ ストレージセットアップ開始...')
  
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

  // Service Role Keyでクライアント作成（管理者権限）
  const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  try {
    console.log('🗂️ 既存バケットを確認中...')
    
    // 既存バケット一覧を取得
    const { data: buckets, error: listError } = await supabaseAdmin.storage.listBuckets()
    
    if (listError) {
      console.error('❌ バケット一覧取得エラー:', listError.message)
    } else {
      console.log('📁 既存バケット:', buckets.map(b => `${b.name} (公開: ${b.public})`))
    }
    
    // past-examsバケットが存在するかチェック
    const existingBucket = buckets?.find(b => b.name === 'past-exams')
    
    if (existingBucket) {
      console.log('✅ past-exams バケットは既に存在します')
    } else {
      console.log('📁 past-exams バケットを作成中...')
      
      const { data, error } = await supabaseAdmin.storage.createBucket('past-exams', {
        public: true,
        allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
        fileSizeLimit: 26214400 // 25MB
      })

      if (error) {
        console.error('❌ バケット作成エラー:', error.message)
        return
      } else {
        console.log('✅ past-exams バケットを作成しました:', data)
      }
    }
    
    // テストアップロードを実行
    console.log('📤 テストアップロードを実行中...')
    
    const testContent = `テストファイル - ${new Date().toISOString()}`
    const testFileName = `test-${Date.now()}.txt`
    const testFile = new Blob([testContent], { type: 'text/plain' })
    
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('past-exams')
      .upload(testFileName, testFile)
    
    if (uploadError) {
      console.error('❌ テストアップロードエラー:', uploadError)
    } else {
      console.log('✅ テストアップロード成功:', uploadData)
      
      // 公開URLを取得
      const { data: urlData } = supabaseAdmin.storage
        .from('past-exams')
        .getPublicUrl(testFileName)
      
      console.log('🔗 テストファイルURL:', urlData.publicUrl)
      
      // テストファイルを削除
      const { error: deleteError } = await supabaseAdmin.storage
        .from('past-exams')
        .remove([testFileName])
      
      if (!deleteError) {
        console.log('🗑️ テストファイルを削除しました')
      }
    }
    
    console.log('\\n✅ ストレージセットアップ完了!')
    console.log('💡 これでファイルアップロードが動作するはずです')
    
  } catch (error) {
    console.error('❌ セットアップ中にエラー:', error.message)
  }
}

setupStorage().catch(console.error)