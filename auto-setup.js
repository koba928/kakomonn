const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

async function autoSetup() {
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

  console.log('🤖 Supabase自動セットアップ開始...')
  console.log('URL:', supabaseUrl)

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })

  try {
    // Method 1: Try direct table creation using supabase-js
    console.log('📋 Method 1: 直接テーブル作成を試行...')
    
    // Create users table
    console.log('👥 usersテーブル作成中...')
    const { error: usersError } = await supabase.rpc('exec', {
      sql: `
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
        
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          email VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(100) NOT NULL,
          university VARCHAR(100) NOT NULL,
          faculty VARCHAR(100) NOT NULL,
          department VARCHAR(100) NOT NULL,
          year INTEGER NOT NULL,
          pen_name VARCHAR(100) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })
    
    if (!usersError) {
      console.log('✅ usersテーブル作成成功')
    } else {
      console.log('⚠️ usersテーブル作成失敗:', usersError.message)
    }

    // Create past_exams table
    console.log('📚 past_examsテーブル作成中...')
    const { error: examsError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS past_exams (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          title VARCHAR(255) NOT NULL,
          course_name VARCHAR(100) NOT NULL,
          professor VARCHAR(100) NOT NULL,
          university VARCHAR(100) NOT NULL,
          faculty VARCHAR(100) NOT NULL,
          department VARCHAR(100) NOT NULL,
          year INTEGER NOT NULL,
          semester VARCHAR(20) NOT NULL,
          exam_type VARCHAR(20) NOT NULL,
          file_url TEXT NOT NULL,
          file_name VARCHAR(255) NOT NULL,
          uploaded_by UUID NOT NULL,
          download_count INTEGER DEFAULT 0,
          difficulty INTEGER DEFAULT 3,
          helpful_count INTEGER DEFAULT 0,
          tags TEXT[] DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })
    
    if (!examsError) {
      console.log('✅ past_examsテーブル作成成功')
    } else {
      console.log('⚠️ past_examsテーブル作成失敗:', examsError.message)
    }

  } catch (error) {
    console.log('❌ Method 1 失敗:', error.message)
  }

  try {
    // Method 2: Use REST API directly
    console.log('\n📋 Method 2: REST API直接呼び出しを試行...')
    
    const createUsersTable = `
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        university VARCHAR(100) NOT NULL,
        faculty VARCHAR(100) NOT NULL,
        department VARCHAR(100) NOT NULL,
        year INTEGER NOT NULL,
        pen_name VARCHAR(100) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `

    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'apikey': supabaseServiceKey
      },
      body: JSON.stringify({ query: createUsersTable })
    })

    console.log('REST API レスポンス:', response.status, response.statusText)

  } catch (error) {
    console.log('❌ Method 2 失敗:', error.message)
  }

  try {
    // Method 3: Create storage bucket
    console.log('\n🗂️ Method 3: ストレージバケット作成...')
    
    const { data: bucketData, error: bucketError } = await supabase.storage.createBucket('past-exams', {
      public: true,
      fileSizeLimit: 26214400, // 25MB
      allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
    })

    if (bucketError) {
      if (bucketError.message.includes('already exists')) {
        console.log('ℹ️ past-examsバケットは既に存在します')
      } else {
        console.log('❌ バケット作成失敗:', bucketError.message)
      }
    } else {
      console.log('✅ past-examsバケット作成成功')
    }

  } catch (error) {
    console.log('❌ Method 3 失敗:', error.message)
  }

  // Final verification
  console.log('\n🔍 最終確認中...')
  setTimeout(() => {
    require('./test-supabase-connection.js')
  }, 2000)
}

autoSetup().catch(console.error)