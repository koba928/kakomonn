// ユーザー削除スクリプト
// 使用方法: node scripts/delete-user.js your-email@nagoya-u.ac.jp

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// Service Role Keyを使用したSupabaseクライアント
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

async function deleteUser(email) {
  try {
    console.log('🔍 ユーザー検索中:', email)
    
    // ユーザーを検索
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      console.error('❌ ユーザー一覧取得エラー:', listError)
      return
    }
    
    const user = users.find(u => u.email === email)
    
    if (!user) {
      console.log('ℹ️ ユーザーが見つかりませんでした:', email)
      return
    }
    
    console.log('👤 ユーザーが見つかりました:', {
      id: user.id,
      email: user.email,
      created_at: user.created_at
    })
    
    // プロフィール削除（存在する場合）
    console.log('🗑️ プロフィールデータ削除中...')
    const { error: profileError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', user.id)
    
    if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = not found
      console.warn('⚠️ プロフィール削除エラー:', profileError)
    } else {
      console.log('✅ プロフィールデータ削除完了')
    }
    
    // 投稿した過去問は保持（削除しない）
    const { data: exams } = await supabase
      .from('past_exams')
      .select('id, title')
      .eq('uploaded_by', user.id)
    
    if (exams && exams.length > 0) {
      console.log('📚 投稿した過去問:', exams.length + '件（保持されます）')
      exams.forEach(exam => {
        console.log('  -', exam.title)
      })
    }
    
    // ユーザー削除
    console.log('🗑️ ユーザー削除中...')
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)
    
    if (deleteError) {
      console.error('❌ ユーザー削除エラー:', deleteError)
      return
    }
    
    console.log('✅ ユーザー削除完了:', email)
    console.log('🎉 これで新規登録をテストできます！')
    
  } catch (error) {
    console.error('❌ 削除処理エラー:', error)
  }
}

// コマンドライン引数からメールアドレスを取得
const email = process.argv[2]

if (!email) {
  console.log('使用方法: node scripts/delete-user.js your-email@nagoya-u.ac.jp')
  process.exit(1)
}

if (!email.includes('@')) {
  console.log('❌ 有効なメールアドレスを入力してください')
  process.exit(1)
}

console.log('🚨 注意: このスクリプトはユーザーとそのデータを完全に削除します')
console.log('📧 削除対象:', email)
console.log('')

// 実行
deleteUser(email)
  .then(() => {
    console.log('🏁 処理完了')
    process.exit(0)
  })
  .catch(error => {
    console.error('💥 エラーで終了:', error)
    process.exit(1)
  })