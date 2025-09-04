// ユーザー確認スクリプト
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

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

async function checkUsers(email) {
  try {
    console.log('🔍 全ユーザー確認中...')
    
    const { data: { users }, error } = await supabase.auth.admin.listUsers()
    
    if (error) {
      console.error('❌ エラー:', error)
      return
    }
    
    console.log('👥 総ユーザー数:', users.length)
    
    if (email) {
      const targetUser = users.find(u => u.email === email)
      if (targetUser) {
        console.log('❌ まだ存在しています:', {
          id: targetUser.id,
          email: targetUser.email,
          created_at: targetUser.created_at,
          email_confirmed_at: targetUser.email_confirmed_at
        })
        
        // 強制削除を試行
        console.log('🔄 強制削除を試行中...')
        const { error: deleteError } = await supabase.auth.admin.deleteUser(targetUser.id)
        
        if (deleteError) {
          console.error('❌ 削除失敗:', deleteError)
        } else {
          console.log('✅ 削除成功!')
        }
      } else {
        console.log('✅ ユーザーは削除されています')
      }
    }
    
    // 該当ドメインのユーザーを表示
    const domainUsers = users.filter(u => u.email && u.email.includes('@s.thers.ac.jp'))
    if (domainUsers.length > 0) {
      console.log('\n📧 @s.thers.ac.jp ドメインのユーザー:')
      domainUsers.forEach(user => {
        console.log(`  - ${user.email} (${user.id.substring(0, 8)}...)`)
      })
    }
    
  } catch (error) {
    console.error('❌ エラー:', error)
  }
}

const email = process.argv[2]
checkUsers(email)