const { createClient } = require('@supabase/supabase-js');

// 環境変数を直接設定
const supabaseUrl = "https://rgcbixnrlrohwcbxylyg.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnY2JpeG5ybHJvaHdjYnh5bHlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDczOTQzMSwiZXhwIjoyMDcwMzE1NDMxfQ.p7fYdvRPr9a6fSqwxO05keumCx74WAHVc4_gsw0fHdM";

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function checkTableSchema() {
  try {
    console.log('=== Supabaseテーブルスキーマの確認 ===');

    // 1. usersテーブルの存在確認
    try {
      const { data: usersData, error: usersError } = await supabaseAdmin
        .from('users')
        .select('*')
        .limit(1);

      console.log('\n1. usersテーブル:');
      if (usersError) {
        console.error('  エラー:', usersError.message);
        console.log('  テーブルが存在しないか、権限がありません');
      } else {
        console.log('  テーブル存在: ✅');
        console.log('  データ数:', usersData?.length || 0);
      }
    } catch (error) {
      console.log('  テーブルが存在しません:', error.message);
    }

    // 2. past_examsテーブルの存在確認
    try {
      const { data: examsData, error: examsError } = await supabaseAdmin
        .from('past_exams')
        .select('*')
        .limit(1);

      console.log('\n2. past_examsテーブル:');
      if (examsError) {
        console.error('  エラー:', examsError.message);
      } else {
        console.log('  テーブル存在: ✅');
        console.log('  データ数:', examsData?.length || 0);
      }
    } catch (error) {
      console.log('  テーブルが存在しません:', error.message);
    }

    // 3. 全テーブル一覧を取得（PostgreSQL情報スキーマから）
    try {
      const { data: tablesData, error: tablesError } = await supabaseAdmin
        .rpc('get_tables_info');

      console.log('\n3. テーブル一覧 (RPC):');
      if (tablesError) {
        console.log('  RPC関数が利用できません:', tablesError.message);
      } else {
        console.log('  テーブル一覧:', tablesData);
      }
    } catch (error) {
      console.log('  RPC実行エラー:', error.message);
    }

    // 4. 直接SQLでテーブル構造を確認
    try {
      const { data: columnData, error: columnError } = await supabaseAdmin
        .from('information_schema.columns')
        .select('table_name, column_name, data_type, is_nullable')
        .eq('table_schema', 'public')
        .in('table_name', ['users', 'past_exams']);

      console.log('\n4. テーブル構造の詳細:');
      if (columnError) {
        console.log('  情報スキーマアクセスエラー:', columnError.message);
      } else {
        const groupedColumns = columnData?.reduce((acc, col) => {
          if (!acc[col.table_name]) acc[col.table_name] = [];
          acc[col.table_name].push(col);
          return acc;
        }, {});

        Object.entries(groupedColumns || {}).forEach(([tableName, columns]) => {
          console.log(`\n  ${tableName}テーブルのカラム:`);
          columns.forEach(col => {
            console.log(`    ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'NULL可' : 'NOT NULL'})`);
          });
        });
      }
    } catch (error) {
      console.log('  情報スキーマアクセス失敗:', error.message);
    }

    // 5. 最終的に、テーブルが存在しない場合の作成提案
    console.log('\n=== テーブル作成の必要性チェック ===');
    const createUsersTableSQL = `
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  university VARCHAR(100),
  faculty VARCHAR(100),
  department VARCHAR(100),
  year INTEGER,
  pen_name VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);`;

    console.log('usersテーブルを作成するSQL:');
    console.log(createUsersTableSQL);

  } catch (error) {
    console.error('スキーマチェックエラー:', error);
  }
}

checkTableSchema();