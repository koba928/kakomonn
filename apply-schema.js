const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

async function applySchema() {
  // Load environment variables from .env file manually
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  let supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    try {
      const envContent = fs.readFileSync('.env', 'utf8')
      const lines = envContent.split('\n')
      for (const line of lines) {
        const [key, value] = line.split('=')
        if (key === 'NEXT_PUBLIC_SUPABASE_URL') {
          supabaseUrl = value.replace(/"/g, '').replace(/\\n/g, '')
        }
        if (key === 'SUPABASE_SERVICE_ROLE_KEY') {
          supabaseServiceKey = value.replace(/"/g, '').replace(/\\n/g, '')
        }
      }
    } catch (error) {
      console.error('❌ .envファイルが読み込めません:', error.message)
      return
    }
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ 環境変数が設定されていません')
    console.log('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl)
    console.log('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey)
    return
  }

  console.log('🔧 Supabaseスキーマ適用開始...')
  
  // Create admin client with service role key
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  try {
    // Read and apply schema
    const schemaSQL = fs.readFileSync('supabase-schema.sql', 'utf8')
    
    console.log('📋 スキーマファイルを読み込み中...')
    
    // Split by statements and execute each one
    const statements = schemaSQL.split(';').filter(stmt => stmt.trim())
    
    console.log(`🔨 ${statements.length}個のステートメントを実行中...`)
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim()
      if (!statement) continue
      
      try {
        const { data, error } = await supabase.rpc('exec_sql', { 
          sql: statement + ';'
        })
        
        if (error) {
          console.warn(`⚠️  ステートメント ${i + 1} 警告:`, error.message)
        } else {
          console.log(`✅ ステートメント ${i + 1} 完了`)
        }
      } catch (err) {
        console.warn(`⚠️  ステートメント ${i + 1} エラー:`, err.message)
      }
    }
    
    console.log('🎉 スキーマ適用完了！')
    
    // Verify tables were created
    console.log('🔍 テーブル作成確認中...')
    const { data: tables } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
    
    if (tables) {
      console.log('📊 作成されたテーブル:', tables.map(t => t.table_name))
    }
    
  } catch (error) {
    console.error('❌ スキーマ適用エラー:', error)
  }
}

// Function to execute raw SQL
async function execRawSQL() {
  // Load environment variables
  let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  let supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    try {
      const envContent = fs.readFileSync('.env', 'utf8')
      const lines = envContent.split('\n')
      for (const line of lines) {
        const [key, value] = line.split('=')
        if (key === 'NEXT_PUBLIC_SUPABASE_URL') {
          supabaseUrl = value.replace(/"/g, '').replace(/\\n/g, '')
        }
        if (key === 'SUPABASE_SERVICE_ROLE_KEY') {
          supabaseServiceKey = value.replace(/"/g, '').replace(/\\n/g, '')
        }
      }
    } catch (error) {
      console.error('❌ .envファイルが読み込めません:', error.message)
      return
    }
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey)
  
  try {
    const schemaSQL = fs.readFileSync('supabase-schema.sql', 'utf8')
    
    console.log('🔧 スキーマを直接実行中...')
    
    // Try to execute the entire schema at once using REST API
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({ sql: schemaSQL })
    })
    
    if (!response.ok) {
      console.log('ℹ️  RPC経由での実行に失敗、代替方法を試行中...')
      
      // Fallback: create tables individually
      const { error: usersError } = await supabase.from('users').select('id').limit(1)
      if (usersError && usersError.message.includes('does not exist')) {
        console.log('📋 テーブルを個別に作成中...')
        
        // Create users table first
        await supabase.rpc('exec_sql', { 
          sql: `CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            email VARCHAR(255) UNIQUE NOT NULL,
            name VARCHAR(100) NOT NULL,
            university VARCHAR(100) NOT NULL,
            faculty VARCHAR(100) NOT NULL,
            department VARCHAR(100) NOT NULL,
            year INTEGER NOT NULL,
            pen_name VARCHAR(100) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );`
        })
        
        console.log('✅ usersテーブル作成完了')
      }
      
    } else {
      console.log('✅ スキーマ実行成功')
    }
    
  } catch (error) {
    console.error('❌ スキーマ実行エラー:', error.message)
  }
}

applySchema().catch(console.error)