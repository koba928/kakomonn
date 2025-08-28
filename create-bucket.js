const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function createBucket() {
  const envContent = fs.readFileSync('.env', 'utf8');
  const lines = envContent.split('\n');
  let supabaseUrl, supabaseServiceKey;
  
  for (const line of lines) {
    if (line.includes('=')) {
      const [key, value] = line.split('=', 2);
      if (key === 'NEXT_PUBLIC_SUPABASE_URL') {
        supabaseUrl = value.replace(/"/g, '').trim();
      }
      if (key === 'SUPABASE_SERVICE_ROLE_KEY') {
        supabaseServiceKey = value.replace(/"/g, '').trim();
      }
    }
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  const { data, error } = await supabase.storage.createBucket('past-exams', {
    public: true,
    fileSizeLimit: 26214400,
    allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png']
  });
  
  if (error && !error.message.includes('already exists')) {
    console.log('❌ バケット作成エラー:', error.message);
  } else {
    console.log('✅ past-examsバケット作成完了');
  }
}

createBucket().catch(console.error);