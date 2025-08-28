const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rgcbixnrlrohwcbxylyg.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnY2JpeG5ybHJvaHdjYnh5bHlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3Mzk0MzEsImV4cCI6MjA3MDMxNTQzMX0.sRGL-HqWUh9eKjPHEIXWBW7MJG_sfU4wXTpft9IkQ9c';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testLogin() {
  console.log('🔐 テストログイン実行中...');
  console.log('URL:', supabaseUrl);
  console.log('AnonKey:', supabaseAnonKey.substring(0, 20) + '...');
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: 'test1@example.com',
      password: 'password123'
    });
    
    if (error) {
      console.error('❌ ログインエラー:', {
        message: error.message,
        status: error.status,
        name: error.name
      });
    } else {
      console.log('✅ ログイン成功:', {
        user: data.user?.email,
        hasSession: !!data.session,
        userId: data.user?.id
      });
    }
  } catch (err) {
    console.error('❌ 例外エラー:', err);
  }
}

testLogin();