const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

async function applySchemaDirectly() {
  // Load environment variables
  let supabaseUrl, supabaseServiceKey
  try {
    const envContent = fs.readFileSync('.env', 'utf8')
    const lines = envContent.split('\n')
    for (const line of lines) {
      if (line.includes('=')) {
        const [key, value] = line.split('=', 2)
        if (key === 'NEXT_PUBLIC_SUPABASE_URL') {
          supabaseUrl = value.replace(/"/g, '').replace(/\\n/g, '').trim()
        }
        if (key === 'SUPABASE_SERVICE_ROLE_KEY') {
          supabaseServiceKey = value.replace(/"/g, '').replace(/\\n/g, '').trim()
        }
      }
    }
  } catch (error) {
    console.error('❌ .envファイルが読み込めません:', error.message)
    return
  }

  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ 環境変数が設定されていません')
    console.log('URL:', !!supabaseUrl, supabaseUrl?.substring(0, 30))
    console.log('Key:', !!supabaseServiceKey, supabaseServiceKey?.substring(0, 30))
    return
  }

  console.log('🔧 Supabaseスキーマ適用開始...')
  console.log('URL:', supabaseUrl)

  try {
    // Read schema file
    const schemaSQL = fs.readFileSync('supabase-schema.sql', 'utf8')
    
    // Split into individual SQL statements
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'))

    console.log(`📋 ${statements.length}個のSQL文を実行します...`)

    // Execute each statement using direct HTTP requests to Supabase
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim()
      if (!statement) continue

      try {
        console.log(`🔨 実行中 (${i + 1}/${statements.length}): ${statement.substring(0, 50)}...`)
        
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'apikey': supabaseServiceKey,
            'Prefer': 'return=minimal'
          },
          body: JSON.stringify({
            sql: statement + ';'
          })
        })

        if (response.ok) {
          console.log(`✅ 完了 (${i + 1}/${statements.length})`)
        } else {
          const errorText = await response.text()
          console.log(`⚠️  警告 (${i + 1}/${statements.length}):`, response.status, errorText.substring(0, 100))
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))
        
      } catch (error) {
        console.log(`⚠️  エラー (${i + 1}/${statements.length}):`, error.message.substring(0, 100))
      }
    }

    console.log('🎉 スキーマ適用処理完了！')

  } catch (error) {
    console.error('❌ スキーマ適用エラー:', error.message)
  }
}

async function createStorageBucket() {
  console.log('\n🗂️  ストレージバケット作成開始...')
  
  // Load environment variables  
  let supabaseUrl, supabaseServiceKey
  try {
    const envContent = fs.readFileSync('.env', 'utf8')
    const lines = envContent.split('\n')
    for (const line of lines) {
      if (line.includes('=')) {
        const [key, value] = line.split('=', 2)
        if (key === 'NEXT_PUBLIC_SUPABASE_URL') {
          supabaseUrl = value.replace(/"/g, '').replace(/\\n/g, '').trim()
        }
        if (key === 'SUPABASE_SERVICE_ROLE_KEY') {
          supabaseServiceKey = value.replace(/"/g, '').replace(/\\n/g, '').trim()
        }
      }
    }
  } catch (error) {
    console.error('❌ .envファイルが読み込めません:', error.message)
    return
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  try {
    // Create storage bucket
    const { data, error } = await supabase.storage.createBucket('past-exams', {
      public: true,
      fileSizeLimit: 26214400, // 25MB
      allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    })

    if (error && !error.message.includes('already exists')) {
      console.error('❌ バケット作成エラー:', error.message)
    } else {
      console.log('✅ past-examsバケット作成完了')
    }

  } catch (error) {
    console.error('❌ ストレージ設定エラー:', error.message)
  }
}

async function main() {
  await applySchemaDirectly()
  await createStorageBucket()
  
  console.log('\n🔍 設定確認を実行中...')
  // Run connection test
  require('./test-supabase-connection.js')
}

main().catch(console.error)