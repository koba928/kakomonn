const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')

async function checkUploadSuccess() {
  console.log('📊 アップロード成功確認中...')
  
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
    // 最新の過去問データを確認
    console.log('📋 過去問データを確認中...')
    
    const { data: pastExams, error } = await supabaseAdmin
      .from('past_exams')
      .select(`
        id,
        title,
        course_name,
        professor,
        university,
        faculty,
        department,
        year,
        semester,
        exam_type,
        file_name,
        file_url,
        uploaded_by,
        created_at
      `)
      .order('created_at', { ascending: false })
      .limit(10)
    
    if (error) {
      console.error('❌ データ取得エラー:', error.message)
      return
    }
    
    console.log(`📊 過去問データ総数: ${pastExams.length}件`)
    
    if (pastExams.length === 0) {
      console.log('⚠️ 過去問データが見つかりません')
      return
    }
    
    // 名古屋大学のデータを特に確認
    const nagoyaExams = pastExams.filter(exam => exam.university === '名古屋大学')
    console.log(`🏫 名古屋大学の過去問: ${nagoyaExams.length}件`)
    
    console.log('\\n📋 最新の投稿:')
    pastExams.slice(0, 5).forEach((exam, index) => {
      console.log(`\\n${index + 1}. ${exam.title || exam.course_name}`)
      console.log(`   🏫 ${exam.university} ${exam.faculty} ${exam.department}`)
      console.log(`   👨‍🏫 教員: ${exam.professor}`)
      console.log(`   📅 ${exam.year}年度 ${exam.semester}`)
      console.log(`   📄 ${exam.file_name}`)
      console.log(`   🕐 ${new Date(exam.created_at).toLocaleString('ja-JP')}`)
      console.log(`   🆔 ID: ${exam.id.substring(0, 8)}...`)
    })
    
    // ストレージのファイルも確認
    console.log('\\n📁 ストレージファイル確認中...')
    
    const { data: files, error: storageError } = await supabaseAdmin.storage
      .from('past-exams')
      .list('', { limit: 10, sortBy: { column: 'created_at', order: 'desc' } })
    
    if (storageError) {
      console.log('⚠️ ストレージ確認エラー:', storageError.message)
    } else {
      console.log(`📁 ストレージファイル数: ${files.length}件`)
      files.slice(0, 3).forEach((file, index) => {
        console.log(`   ${index + 1}. ${file.name} (${(file.metadata?.size / 1024 / 1024).toFixed(2)}MB)`)
      })
    }
    
    if (nagoyaExams.length > 0) {
      console.log('\\n✅ 名古屋大学の投稿成功を確認!')
      console.log('🎉 アップロード完了しています')
    } else {
      console.log('\\n⚠️ 名古屋大学の投稿が見つかりません')
    }
    
  } catch (error) {
    console.error('❌ 確認中にエラー:', error.message)
  }
}

checkUploadSuccess().catch(console.error)