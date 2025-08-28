const { createClient } = require('@supabase/supabase-js');

// 環境変数を直接設定
const supabaseUrl = "https://rgcbixnrlrohwcbxylyg.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnY2JpeG5ybHJvaHdjYnh5bHlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3Mzk0MzEsImV4cCI6MjA3MDMxNTQzMX0.sRGL-HqWUh9eKjPHEIXWBW7MJG_sfU4wXTpft9IkQ9c";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkActualTable() {
  try {
    console.log('=== 実際のusersテーブル構造確認 ===');

    // 1. usersテーブルから全カラムを取得してみる（最初の1行）
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    console.log('\nusersテーブル select * 結果:');
    if (userError) {
      console.log('エラー:', userError.message);
    } else {
      console.log('データ:', userData);
      console.log('データ件数:', userData.length);
      if (userData.length > 0) {
        console.log('カラム名:', Object.keys(userData[0]));
      }
    }

    // 2. 最小限のカラムで試行
    const { data: minimalData, error: minimalError } = await supabase
      .from('users')
      .select('id, email')
      .limit(1);

    console.log('\nusersテーブル select id, email 結果:');
    if (minimalError) {
      console.log('エラー:', minimalError.message);
    } else {
      console.log('データ:', minimalData);
    }

    // 3. usersテーブルにレコードを挿入してみる（最小限）
    const testUserId = '00000000-0000-0000-0000-000000000001';
    const { data: insertData, error: insertError } = await supabase
      .from('users')
      .insert({
        id: testUserId,
        email: 'test-structure@example.com'
      });

    console.log('\nusersテーブル insert 結果:');
    if (insertError) {
      console.log('エラー:', insertError.message);
      console.log('詳細:', insertError.details);
    } else {
      console.log('挿入成功:', insertData);
    }

    // 4. テストレコード削除
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', testUserId);

    if (deleteError) {
      console.log('テストレコード削除エラー:', deleteError.message);
    } else {
      console.log('テストレコード削除成功');
    }

  } catch (error) {
    console.error('テーブル構造確認エラー:', error);
  }
}

checkActualTable();