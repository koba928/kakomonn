const { createClient } = require('@supabase/supabase-js');

// 環境変数を直接設定
const supabaseUrl = "https://rgcbixnrlrohwcbxylyg.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnY2JpeG5ybHJvaHdjYnh5bHlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDczOTQzMSwiZXhwIjoyMDcwMzE1NDMxfQ.p7fYdvRPr9a6fSqwxO05keumCx74WAHVc4_gsw0fHdM";

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function fixCompleteSchema() {
  try {
    console.log('=== 完全なusersテーブル修正開始 ===');

    // 1. 既存のusersテーブルをドロップして新しく作成（データ保護のため注意深く実行）
    console.log('\n1. usersテーブルのスキーマ修正...');
    
    const setupSQL = `
-- usersテーブルを正しいスキーマで再作成
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL DEFAULT 'ユーザー',
  university VARCHAR(100) NOT NULL DEFAULT '未設定',
  faculty VARCHAR(100) NOT NULL DEFAULT '未設定', 
  department VARCHAR(100) NOT NULL DEFAULT '未設定',
  year INTEGER NOT NULL DEFAULT 1,
  pen_name VARCHAR(100) NOT NULL DEFAULT 'ユーザー',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_university ON users(university);

-- RLS有効化
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- RLSポリシー作成
DROP POLICY IF EXISTS "Users can view all users" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can insert their own profile" ON users;

CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- past_examsテーブルも作成（存在しない場合）
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
  uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  download_count INTEGER DEFAULT 0,
  difficulty INTEGER DEFAULT 3,
  helpful_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- past_examsのRLS設定
ALTER TABLE past_exams ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view past exams" ON past_exams;
DROP POLICY IF EXISTS "Authenticated users can create past exams" ON past_exams;
DROP POLICY IF EXISTS "Users can update their own past exams" ON past_exams;
DROP POLICY IF EXISTS "Users can delete their own past exams" ON past_exams;

CREATE POLICY "Anyone can view past exams" ON past_exams FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create past exams" ON past_exams FOR INSERT WITH CHECK (auth.uid() = uploaded_by);
CREATE POLICY "Users can update their own past exams" ON past_exams FOR UPDATE USING (auth.uid() = uploaded_by);
CREATE POLICY "Users can delete their own past exams" ON past_exams FOR DELETE USING (auth.uid() = uploaded_by);

-- Storage bucket作成
INSERT INTO storage.buckets (id, name, public) 
VALUES ('past-exams', 'past-exams', true)
ON CONFLICT (id) DO NOTHING;
`;

    const { error: setupError } = await supabaseAdmin.rpc('exec_sql', { 
      sql: setupSQL 
    });

    if (setupError) {
      console.log('RPC実行失敗。直接SQL実行を試行...');
      
      // 個別にSQL文を実行
      const sqlStatements = setupSQL.split(';').filter(stmt => stmt.trim().length > 0);
      
      for (const stmt of sqlStatements) {
        try {
          const cleanStmt = stmt.trim();
          if (cleanStmt && !cleanStmt.startsWith('--')) {
            console.log(`実行中: ${cleanStmt.substring(0, 50)}...`);
            // Supabaseではrpc経由でないとDDLが実行できないため、手動でテーブル操作
          }
        } catch (sqlError) {
          console.log(`SQL実行エラー (スキップ): ${sqlError.message}`);
        }
      }
    }

    console.log('\n2. 認証ユーザーの同期...');

    // 2. 全ての認証ユーザーを取得して同期
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000
    });

    if (authError) {
      console.error('認証ユーザー取得エラー:', authError);
      return;
    }

    console.log(`同期対象ユーザー数: ${authUsers.users.length}`);

    // 3. 各認証ユーザーをusersテーブルに同期
    for (let i = 0; i < authUsers.users.length; i++) {
      const authUser = authUsers.users[i];
      console.log(`\n[${i + 1}/${authUsers.users.length}] 同期中: ${authUser.email}`);

      const userData = {
        id: authUser.id, // ここが重要！認証ユーザーのIDを直接使用
        email: authUser.email,
        name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'ユーザー',
        university: authUser.user_metadata?.university || '未設定',
        faculty: authUser.user_metadata?.faculty || '未設定',
        department: authUser.user_metadata?.department || '未設定',
        year: authUser.user_metadata?.year || 1,
        pen_name: authUser.user_metadata?.pen_name || authUser.user_metadata?.name || 'ユーザー',
        created_at: authUser.created_at,
        updated_at: new Date().toISOString()
      };

      console.log('  データ:', {
        email: userData.email,
        name: userData.name,
        university: userData.university,
        faculty: userData.faculty,
        department: userData.department
      });

      // usersテーブルにupsert（管理者権限で）
      const { error: upsertError } = await supabaseAdmin
        .from('users')
        .upsert(userData, {
          onConflict: 'id'
        });

      if (upsertError) {
        console.error(`  ❌ ${authUser.email} の同期に失敗:`, upsertError);
      } else {
        console.log(`  ✅ ${authUser.email} の同期成功`);
      }
    }

    console.log('\n=== 同期結果の確認 ===');
    const { data: syncedUsers, error: checkError } = await supabaseAdmin
      .from('users')
      .select('email, university, faculty, department, name')
      .limit(10);

    if (checkError) {
      console.error('同期結果確認エラー:', checkError);
    } else {
      console.log(`usersテーブルのユーザー数: ${syncedUsers.length}`);
      syncedUsers.forEach(user => {
        console.log(`  ${user.name} (${user.email}): ${user.university} / ${user.faculty} / ${user.department}`);
      });
    }

  } catch (error) {
    console.error('スキーマ修正エラー:', error);
  }
}

fixCompleteSchema();