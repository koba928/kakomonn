const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

async function testAuthState() {
  console.log('🔐 認証状態テスト開始...')
  
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
    console.log('🔍 現在の認証状態を確認中...')
    
    // 現在のセッションを確認
    const { data: { session }, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionError) {
      console.error('❌ セッション取得エラー:', sessionError.message)
      return
    }
    
    console.log('📊 セッション情報:', {
      hasSession: !!session,
      userId: session?.user?.id?.substring(0, 8) + '...',
      email: session?.user?.email,
      expires_at: session?.expires_at ? new Date(session.expires_at * 1000).toLocaleString() : null
    })
    
    if (session) {
      console.log('✅ 有効なセッションが存在します')
      
      // ユーザーメタデータを確認
      console.log('👤 ユーザーメタデータ:', {
        name: session.user.user_metadata?.name,
        university: session.user.user_metadata?.university,
        faculty: session.user.user_metadata?.faculty,
        department: session.user.user_metadata?.department
      })
      
      // ユーザー情報を再取得
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        console.error('❌ ユーザー情報取得エラー:', userError.message)
      } else {
        console.log('✅ ユーザー情報取得成功')
        console.log('📋 ユーザー詳細:', {
          id: user.id.substring(0, 8) + '...',
          email: user.email,
          email_confirmed_at: user.email_confirmed_at,
          last_sign_in_at: user.last_sign_in_at
        })
      }
    } else {
      console.log('❌ 有効なセッションがありません')
      console.log('💡 ログインが必要です')
    }
    
  } catch (error) {
    console.error('❌ テスト中にエラー:', error.message)
  }
}

testAuthState().catch(console.error)