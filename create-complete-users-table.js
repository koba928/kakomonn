// 完全なusersテーブルを作成するスクリプト
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rgcbixnrlrohwcbxylyg.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnY2JpeG5ybHJvaHdjYnh5bHlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDczOTQzMSwiZXhwIjoyMDcwMzE1NDMxfQ.p7fYdvRPr9a6fSqwxO05keumCx74WAHVc4_gsw0fHdM';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testUsersTableOperations() {
  console.log('🔧 usersテーブル操作テスト開始...\n');

  // 1. 既存のテーブル構造確認
  console.log('📋 現在のテーブル構造確認...');
  try {
    const { data: existingData, error: selectError } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (selectError) {
      console.log('⚠️ usersテーブル確認エラー:', selectError.message);
    } else {
      console.log('✅ usersテーブル存在確認完了');
    }
  } catch (error) {
    console.log('❌ テーブル確認中にエラー:', error.message);
  }

  // 2. テストユーザーでのinsert操作テスト
  console.log('\n📝 テストユーザー作成テスト...');
  
  const testUser = {
    id: '123e4567-e89b-12d3-a456-426614174999', // テスト用固定UUID
    email: 'test-schema@example.com',
    name: 'テストユーザー',
    university: '東京大学',
    faculty: '工学部',
    department: '情報理工学系研究科',
    year: 2,
    pen_name: 'テスター',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  try {
    // 既存のテストユーザーがいれば削除
    await supabase
      .from('users')
      .delete()
      .eq('email', 'test-schema@example.com');

    // 新規作成テスト
    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert(testUser)
      .select();

    if (insertError) {
      console.log('❌ テストユーザー作成エラー:', insertError);
      
      // エラーの詳細分析
      if (insertError.message.includes('column') && insertError.message.includes('does not exist')) {
        console.log('\n📊 不足しているカラムが検出されました');
        console.log('💡 Supabase Dashboard でテーブル構造を手動で修正する必要があります\n');
        
        console.log('🛠️ 手動修正手順:');
        console.log('1. https://supabase.com/dashboard → プロジェクト選択');
        console.log('2. Table Editor → users テーブル選択');
        console.log('3. 以下のカラムを追加:');
        console.log('   - department (text, not null)');
        console.log('   - pen_name (text, not null)');  
        console.log('   - year (int4, not null)');
        console.log('   - university (text, not null)');
        console.log('   - faculty (text, not null)');
        console.log('   - name (text, not null)');
        console.log('   - created_at (timestamptz, default: now())');
        console.log('   - updated_at (timestamptz, default: now())');
      }
    } else {
      console.log('✅ テストユーザー作成成功:', insertData);
      
      // テストユーザー削除
      await supabase
        .from('users')
        .delete()
        .eq('email', 'test-schema@example.com');
      
      console.log('✅ テストデータクリーンアップ完了');
      console.log('\n🎉 usersテーブルのスキーマは正常です！');
    }

  } catch (error) {
    console.log('❌ テスト中にエラー:', error);
  }
}

async function main() {
  await testUsersTableOperations();
}

main();