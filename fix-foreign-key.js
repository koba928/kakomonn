const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

async function fixForeignKeyIssue() {
  console.log('🔧 外部キー制約問題を修正中...')
  
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
    console.log('👥 認証済みユーザー一覧を確認...')
    
    // 認証済みユーザー一覧を取得
    const { data: { users: authUsers }, error: authError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (authError) {
      console.error('❌ 認証ユーザー取得エラー:', authError)
      return
    }
    
    console.log(`📊 認証済みユーザー数: ${authUsers.length}`)
    
    for (const authUser of authUsers) {
      console.log(`\\n👤 ユーザー: ${authUser.email}`)
      console.log(`   ID: ${authUser.id}`)
      console.log(`   メタデータ:`, {
        name: authUser.user_metadata?.name,
        university: authUser.user_metadata?.university,
        faculty: authUser.user_metadata?.faculty
      })
      
      // usersテーブルに存在するかチェック
      const { data: existingUser, error: checkError } = await supabaseAdmin
        .from('users')
        .select('id, email, name')
        .eq('id', authUser.id)
        .single()
      
      if (checkError || !existingUser) {
        console.log(`   🔄 usersテーブルにレコードを作成中...`)
        
        // usersテーブルにレコードを作成
        const { error: insertError } = await supabaseAdmin
          .from('users')
          .insert({
            id: authUser.id,
            email: authUser.email,
            name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'ユーザー',
            university: authUser.user_metadata?.university || '未設定',
            faculty: authUser.user_metadata?.faculty || '未設定',
            department: authUser.user_metadata?.department || '未設定',
            year: authUser.user_metadata?.year || 1,
            pen_name: authUser.user_metadata?.pen_name || authUser.user_metadata?.name || 'ユーザー',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
        
        if (insertError) {
          console.log(`   ❌ レコード作成エラー:`, insertError.message)
        } else {
          console.log(`   ✅ usersテーブルにレコードを作成しました`)
        }
      } else {
        console.log(`   ✅ usersテーブルにレコードが存在します`)
      }
    }
    
    console.log('\\n🔧 外部キー制約を一時的に無効化する方法:')
    console.log('SQL Editor で以下を実行:')
    console.log('ALTER TABLE past_exams DROP CONSTRAINT IF EXISTS past_exams_uploaded_by_fkey;')
    
    console.log('\\n✅ 外部キー問題の修正完了!')
    console.log('💡 これでファイルアップロードが正常に動作するはずです')
    
  } catch (error) {
    console.error('❌ 修正中にエラー:', error.message)
  }
}

fixForeignKeyIssue().catch(console.error)