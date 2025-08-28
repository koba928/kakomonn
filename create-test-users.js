// Supabase認証テストユーザー作成スクリプト
// Node.js環境で実行: node create-test-users.js

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rgcbixnrlrohwcbxylyg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnY2JpeG5ybHJvaHdjYnh5bHlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDczOTQzMSwiZXhwIjoyMDcwMzE1NDMxfQ.p7fYdvRPr9a6fSqwxO05keumCx74WAHVc4_gsw0fHdM';

// Service Role Key使用（管理者権限）
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const testUsers = [
  {
    email: 'test1@example.com',
    password: 'password123',
    user_metadata: {
      name: 'テストユーザー1',
      university: '東京大学',
      faculty: '経済学部',
      department: '経済学科',
      year: 2,
      pen_name: '経済マスター'
    }
  },
  {
    email: 'test2@example.com',
    password: 'password123',
    user_metadata: {
      name: 'テストユーザー2',
      university: '早稲田大学',
      faculty: '商学部',
      department: '商学科',
      year: 3,
      pen_name: '商学エキスパート'
    }
  },
  {
    email: 'test3@example.com',
    password: 'password123',
    user_metadata: {
      name: 'テストユーザー3',
      university: '慶應義塾大学',
      faculty: '理工学部',
      department: '情報工学科',
      year: 2,
      pen_name: 'プログラマー'
    }
  }
];

async function createTestUsers() {
  console.log('テストユーザーを作成中...');
  
  for (const userData of testUsers) {
    try {
      const { data, error } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: userData.password,
        user_metadata: userData.user_metadata,
        email_confirm: true // メール確認をスキップ
      });

      if (error) {
        console.error(`❌ ${userData.email} の作成に失敗:`, error.message);
      } else {
        console.log(`✅ ${userData.email} を作成しました (ID: ${data.user.id})`);
        
        // アプリケーションのusersテーブルにもデータを挿入
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: userData.email,
            name: userData.user_metadata.name,
            university: userData.user_metadata.university,
            faculty: userData.user_metadata.faculty,
            department: userData.user_metadata.department,
            year: userData.user_metadata.year,
            pen_name: userData.user_metadata.pen_name
          });

        if (insertError) {
          console.error(`⚠️ ${userData.email} のプロフィール作成に失敗:`, insertError.message);
        } else {
          console.log(`📝 ${userData.email} のプロフィールを作成しました`);
        }
      }
    } catch (error) {
      console.error(`❌ ${userData.email} の処理中にエラー:`, error);
    }
  }
}

// 既存ユーザーを確認
async function checkExistingUsers() {
  console.log('\n既存の認証ユーザーを確認中...');
  
  try {
    const { data, error } = await supabase.auth.admin.listUsers();
    
    if (error) {
      console.error('ユーザー一覧の取得に失敗:', error);
      return;
    }
    
    console.log(`現在の認証ユーザー数: ${data.users.length}`);
    data.users.forEach(user => {
      console.log(`- ${user.email} (ID: ${user.id}, 作成日: ${user.created_at})`);
    });
  } catch (error) {
    console.error('ユーザー確認中にエラー:', error);
  }
}

async function main() {
  console.log('🚀 Supabaseテストユーザー作成スクリプト開始\n');
  
  await checkExistingUsers();
  await createTestUsers();
  
  console.log('\n✨ 完了しました！');
  console.log('\nテストログイン情報:');
  testUsers.forEach(user => {
    console.log(`Email: ${user.email}, Password: ${user.password}`);
  });
}

main().catch(console.error);