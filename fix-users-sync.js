const { createClient } = require('@supabase/supabase-js');

// 環境変数を直接設定
const supabaseUrl = "https://rgcbixnrlrohwcbxylyg.supabase.co";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnY2JpeG5ybHJvaHdjYnh5bHlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDczOTQzMSwiZXhwIjoyMDcwMzE1NDMxfQ.p7fYdvRPr9a6fSqwxO05keumCx74WAHVc4_gsw0fHdM";

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

async function syncAuthUsersToUsersTable() {
  try {
    console.log('=== 認証ユーザーをusersテーブルに同期開始 ===');

    // 1. 全ての認証ユーザーを取得
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 1000
    });

    if (authError) {
      console.error('認証ユーザー取得エラー:', authError);
      return;
    }

    console.log(`同期対象ユーザー数: ${authUsers.users.length}`);

    // 2. 各認証ユーザーをusersテーブルに同期
    for (let i = 0; i < authUsers.users.length; i++) {
      const authUser = authUsers.users[i];
      console.log(`\n[${i + 1}/${authUsers.users.length}] 同期中: ${authUser.email}`);

      const userData = {
        id: authUser.id,
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

      console.log('  ユーザーデータ:', {
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
      .select('email, university, faculty, department')
      .limit(10);

    if (checkError) {
      console.error('同期結果確認エラー:', checkError);
    } else {
      console.log(`usersテーブルのユーザー数: ${syncedUsers.length}`);
      syncedUsers.forEach(user => {
        console.log(`  ${user.email}: ${user.university} / ${user.faculty} / ${user.department}`);
      });
    }

  } catch (error) {
    console.error('同期処理エラー:', error);
  }
}

syncAuthUsersToUsersTable();