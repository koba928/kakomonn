const { createClient } = require('@supabase/supabase-js');

// 環境変数を直接設定（.envファイルから読み取った値）
const supabaseUrl = "https://rgcbixnrlrohwcbxylyg.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnY2JpeG5ybHJvaHdjYnh5bHlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3Mzk0MzEsImV4cCI6MjA3MDMxNTQzMX0.sRGL-HqWUh9eKjPHEIXWBW7MJG_sfU4wXTpft9IkQ9c";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnY2JpeG5ybHJvaHdjYnh5bHlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDczOTQzMSwiZXhwIjoyMDcwMzE1NDMxfQ.p7fYdvRPr9a6fSqwxO05keumCx74WAHVc4_gsw0fHdM";

console.log('Environment variables:');
console.log('Supabase URL:', supabaseUrl);
console.log('Anon Key:', supabaseAnonKey ? `${supabaseAnonKey.substring(0, 20)}...` : 'Not found');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase credentials not found in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function debugUsers() {
  try {
    console.log('\n=== Supabase usersテーブルのデータ確認 ===');
    
    // 1. usersテーブルのデータを取得
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('*')
      .limit(5);
    
    if (usersError) {
      console.error('usersテーブル取得エラー:', usersError);
    } else {
      console.log('\nusersテーブルのデータ:');
      if (users.length === 0) {
        console.log('  データが存在しません');
      } else {
        users.forEach((user, index) => {
          console.log(`  [${index + 1}]`, {
            id: user.id.substring(0, 8) + '...',
            email: user.email,
            name: user.name || '未設定',
            university: user.university || '未設定',
            faculty: user.faculty || '未設定',
            department: user.department || '未設定',
            year: user.year || 0,
            pen_name: user.pen_name || '未設定'
          });
        });
      }
    }

    // 2. 管理者権限で認証ユーザー一覧を取得
    console.log('\n=== auth.usersテーブル（認証ユーザー）のデータ確認 ===');
    try {
      const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers({
        page: 1,
        perPage: 10
      });

      if (authError) {
        console.error('auth.users取得エラー:', authError);
      } else {
        console.log(`認証ユーザー数: ${authUsers.users.length}`);
        authUsers.users.forEach((user, index) => {
          console.log(`  [${index + 1}] Auth User:`, {
            id: user.id.substring(0, 8) + '...',
            email: user.email,
            email_confirmed_at: user.email_confirmed_at ? 'confirmed' : 'not confirmed',
            created_at: user.created_at,
            user_metadata: user.user_metadata || {}
          });
          
          if (user.user_metadata && Object.keys(user.user_metadata).length > 0) {
            console.log('    User Metadata:', {
              name: user.user_metadata.name || '未設定',
              university: user.user_metadata.university || '未設定',
              faculty: user.user_metadata.faculty || '未設定',
              department: user.user_metadata.department || '未設定',
              year: user.user_metadata.year || 0,
              pen_name: user.user_metadata.pen_name || '未設定'
            });
          } else {
            console.log('    User Metadata: なし');
          }
        });
      }
    } catch (adminError) {
      console.error('管理者権限でのauth.users取得エラー:', adminError);
    }

  } catch (error) {
    console.error('デバッグ実行エラー:', error);
  }
}

debugUsers();