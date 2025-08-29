const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

async function fixStorageRLS() {
  console.log('🔐 ストレージRLSポリシーを修正中...')
  
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
    // SQLクエリでRLSポリシーを設定
    console.log('📋 RLSポリシーを設定中...')
    
    const policies = [
      // 1. 認証済みユーザーがアップロード可能
      `
      CREATE POLICY IF NOT EXISTS "Authenticated users can upload" 
      ON storage.objects FOR INSERT 
      WITH CHECK (
        bucket_id = 'past-exams' 
        AND auth.role() = 'authenticated'
      );
      `,
      
      // 2. すべてのユーザーが読み取り可能
      `
      CREATE POLICY IF NOT EXISTS "Public read access" 
      ON storage.objects FOR SELECT 
      USING (bucket_id = 'past-exams');
      `,
      
      // 3. ファイル所有者が更新・削除可能
      `
      CREATE POLICY IF NOT EXISTS "Users can update own files" 
      ON storage.objects FOR UPDATE 
      USING (
        bucket_id = 'past-exams' 
        AND auth.uid()::text = (storage.foldername(name))[1]
      );
      `,
      
      `
      CREATE POLICY IF NOT EXISTS "Users can delete own files" 
      ON storage.objects FOR DELETE 
      USING (
        bucket_id = 'past-exams' 
        AND auth.uid()::text = (storage.foldername(name))[1]
      );
      `
    ]
    
    for (const policy of policies) {
      try {
        const { error } = await supabaseAdmin.rpc('exec', { sql: policy })
        if (error) {
          console.log('⚠️ ポリシー設定:', error.message)
        } else {
          console.log('✅ ポリシー設定完了')
        }
      } catch (err) {
        // RPC関数が存在しない場合の代替手段
        console.log('ℹ️ RPC経由でのポリシー設定をスキップ（手動設定が必要）')
      }
    }
    
    console.log('\\n📋 手動設定が必要な場合:')
    console.log('1. Supabase管理画面 → Storage → Policies')
    console.log('2. past-examsバケット用の以下ポリシーを作成:')
    console.log('   - INSERT: bucket_id = "past-exams" AND auth.role() = "authenticated"')
    console.log('   - SELECT: bucket_id = "past-exams"')
    console.log('   - UPDATE/DELETE: bucket_id = "past-exams" AND auth.uid()::text = (storage.foldername(name))[1]')
    
  } catch (error) {
    console.error('❌ RLS設定中にエラー:', error.message)
  }
}

fixStorageRLS().catch(console.error)