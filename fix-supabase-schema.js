// Supabaseテーブル自動修正スクリプト
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rgcbixnrlrohwcbxylyg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnY2JpeG5ybHJvaHdjYnh5bHlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDczOTQzMSwiZXhwIjoyMDcwMzE1NDMxfQ.p7fYdvRPr9a6fSqwxO05keumCx74WAHVc4_gsw0fHdM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixUsersTableSchema() {
  console.log('🔧 Supabase usersテーブルスキーマ修正開始...\n');

  const alterTableSQL = `
-- 不足しているカラムを追加
DO $$
BEGIN
    -- departmentカラムが存在しない場合は追加
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'department'
    ) THEN
        ALTER TABLE users ADD COLUMN department VARCHAR(100);
        RAISE NOTICE 'Added department column to users table';
    END IF;

    -- pen_nameカラムが存在しない場合は追加
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'pen_name'
    ) THEN
        ALTER TABLE users ADD COLUMN pen_name VARCHAR(100);
        RAISE NOTICE 'Added pen_name column to users table';
    END IF;

    -- yearカラムが存在しない場合は追加
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'year'
    ) THEN
        ALTER TABLE users ADD COLUMN year INTEGER;
        RAISE NOTICE 'Added year column to users table';
    END IF;

    -- universityカラムが存在しない場合は追加
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'university'
    ) THEN
        ALTER TABLE users ADD COLUMN university VARCHAR(100);
        RAISE NOTICE 'Added university column to users table';
    END IF;

    -- facultyカラムが存在しない場合は追加
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'faculty'
    ) THEN
        ALTER TABLE users ADD COLUMN faculty VARCHAR(100);
        RAISE NOTICE 'Added faculty column to users table';
    END IF;

    -- nameカラムが存在しない場合は追加
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'name'
    ) THEN
        ALTER TABLE users ADD COLUMN name VARCHAR(100);
        RAISE NOTICE 'Added name column to users table';
    END IF;

    -- created_atカラムが存在しない場合は追加
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE users ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Added created_at column to users table';
    END IF;

    -- updated_atカラムが存在しない場合は追加
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE users ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Added updated_at column to users table';
    END IF;
END $$;
  `;

  try {
    console.log('📝 テーブル構造を修正中...');
    const { data, error } = await supabase.rpc('exec_sql', { query: alterTableSQL });
    
    if (error) {
      console.error('❌ テーブル修正エラー:', error);
      throw error;
    }

    console.log('✅ テーブル構造の修正が完了しました');

    // デフォルト値を設定
    console.log('📝 デフォルト値を設定中...');
    const updateQuery = `
UPDATE users 
SET 
    department = COALESCE(department, '未設定'),
    pen_name = COALESCE(pen_name, name, 'ユーザー'),
    year = COALESCE(year, 1),
    university = COALESCE(university, '未設定'),
    faculty = COALESCE(faculty, '未設定'),
    name = COALESCE(name, 'ユーザー'),
    created_at = COALESCE(created_at, NOW()),
    updated_at = COALESCE(updated_at, NOW())
WHERE 
    department IS NULL 
    OR pen_name IS NULL 
    OR year IS NULL 
    OR university IS NULL 
    OR faculty IS NULL 
    OR name IS NULL 
    OR created_at IS NULL 
    OR updated_at IS NULL;
    `;

    const { error: updateError } = await supabase.rpc('exec_sql', { query: updateQuery });
    
    if (updateError) {
      console.error('⚠️ デフォルト値設定エラー:', updateError);
    } else {
      console.log('✅ デフォルト値の設定が完了しました');
    }

  } catch (error) {
    console.error('❌ スキーマ修正中にエラーが発生しました:', error);
    throw error;
  }
}

async function verifySchema() {
  console.log('\n🔍 テーブル構造を確認中...');
  
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(0);

    if (error) {
      console.error('❌ スキーマ確認エラー:', error);
      return false;
    }

    console.log('✅ usersテーブルのスキーマ確認完了');
    return true;

  } catch (error) {
    console.error('❌ スキーマ確認中にエラー:', error);
    return false;
  }
}

async function main() {
  try {
    await fixUsersTableSchema();
    const success = await verifySchema();
    
    if (success) {
      console.log('\n🎉 Supabaseテーブル修正が完了しました！');
      console.log('これでアカウント作成エラーが解消されるはずです。');
    } else {
      console.log('\n❌ スキーマの確認に失敗しました');
    }

  } catch (error) {
    console.error('\n💥 修正プロセスでエラーが発生しました:', error);
    process.exit(1);
  }
}

main();