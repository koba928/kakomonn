const { createClient } = require('@supabase/supabase-js');

// 環境変数を直接設定
const supabaseUrl = "https://rgcbixnrlrohwcbxylyg.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnY2JpeG5ybHJvaHdjYnh5bHlnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3Mzk0MzEsImV4cCI6MjA3MDMxNTQzMX0.sRGL-HqWUh9eKjPHEIXWBW7MJG_sfU4wXTpft9IkQ9c";
const supabaseServiceKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnY2JpeG5ybHJvaHdjYnh5bHlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDczOTQzMSwiZXhwIjoyMDcwMzE1NDMxfQ.p7fYdvRPr9a6fSqwxO05keumCx74WAHVc4_gsw0fHdM";

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// テスト用のuseAuth.fetchUserProfileロジックを再現
async function simulateFetchUserProfile(userId) {
  try {
    console.log(`=== fetchUserProfile シミュレーション ===`);
    console.log(`対象ユーザーID: ${userId.substring(0, 8)}...`);

    // 1. 管理者権限で認証ユーザー情報を取得
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.getUserById(userId);
    
    if (authError || !authData.user) {
      console.error('認証ユーザー取得エラー:', authError);
      return null;
    }

    const authUser = authData.user;
    console.log('\n🔍 認証ユーザーメタデータ:', {
      name: authUser.user_metadata?.name,
      university: authUser.user_metadata?.university,
      faculty: authUser.user_metadata?.faculty,
      department: authUser.user_metadata?.department,
      year: authUser.user_metadata?.year,
      pen_name: authUser.user_metadata?.pen_name
    });

    // 2. 認証メタデータを主要情報源として使用
    const userFromMetadata = {
      id: authUser.id,
      email: authUser.email || '',
      name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'ユーザー',
      university: authUser.user_metadata?.university || '未設定',
      faculty: authUser.user_metadata?.faculty || '未設定',
      department: authUser.user_metadata?.department || '未設定',
      year: authUser.user_metadata?.year || 1,
      pen_name: authUser.user_metadata?.pen_name || authUser.user_metadata?.name || 'ユーザー'
    };

    console.log('\n📝 認証メタデータから構築したユーザー情報:', {
      email: userFromMetadata.email,
      name: userFromMetadata.name,
      university: userFromMetadata.university,
      faculty: userFromMetadata.faculty,
      department: userFromMetadata.department,
      year: userFromMetadata.year
    });
    
    // 3. オプション: usersテーブルからの情報で補完を試行
    try {
      const { data: tableUser, error: tableError } = await supabaseAdmin
        .from('users')
        .select('university, faculty, department, year, name, pen_name')
        .eq('id', userId)
        .single();

      if (!tableError && tableUser) {
        console.log('\n📊 usersテーブルから補完情報取得:', tableUser);
        
        // テーブルに有効な情報がある場合のみ補完
        const enhancedUser = {
          ...userFromMetadata,
          university: (tableUser.university && tableUser.university !== '未設定') ? tableUser.university : userFromMetadata.university,
          faculty: (tableUser.faculty && tableUser.faculty !== '未設定') ? tableUser.faculty : userFromMetadata.faculty,
          department: (tableUser.department && tableUser.department !== '未設定') ? tableUser.department : userFromMetadata.department,
          year: tableUser.year || userFromMetadata.year,
          name: tableUser.name || userFromMetadata.name,
          pen_name: tableUser.pen_name || userFromMetadata.pen_name
        };
        
        console.log('\n✨ テーブル情報で補完したユーザー情報:', {
          university: enhancedUser.university,
          faculty: enhancedUser.faculty,
          department: enhancedUser.department
        });
        
        return enhancedUser;
      } else {
        console.log('\nℹ️ usersテーブルから情報取得できません（メタデータを使用）');
      }
    } catch (tableError) {
      console.log('\nℹ️ usersテーブル補完失敗（問題ありません）:', tableError.message);
    }
    
    return userFromMetadata;
    
  } catch (error) {
    console.error('fetchUserProfile シミュレーションエラー:', error);
    return null;
  }
}

async function testAuthFlow() {
  try {
    console.log('=== 認証フロー総合テスト ===');

    // 全認証ユーザーを取得
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers({
      page: 1,
      perPage: 10
    });

    if (authError) {
      console.error('認証ユーザー一覧取得エラー:', authError);
      return;
    }

    console.log(`\n対象ユーザー数: ${authUsers.users.length}`);

    // 各ユーザーでfetchUserProfileをテスト
    for (let i = 0; i < Math.min(authUsers.users.length, 3); i++) { // 最初の3人でテスト
      const authUser = authUsers.users[i];
      console.log(`\n\n>>> [${i + 1}] ${authUser.email} のテスト開始 <<<`);
      
      const userProfile = await simulateFetchUserProfile(authUser.id);
      
      if (userProfile) {
        // 過去問投稿ページでの判定ロジックをシミュレート
        const hasValidUniversity = userProfile.university && userProfile.university !== '未設定';
        const hasValidFaculty = userProfile.faculty && userProfile.faculty !== '未設定';
        const hasValidDepartment = userProfile.department && userProfile.department !== '未設定';
        const isComplete = hasValidUniversity && hasValidFaculty && hasValidDepartment;
        
        console.log('\n📊 過去問投稿ページでの判定結果:', {
          university: hasValidUniversity ? '✅ 設定済み' : '❌ 未設定',
          faculty: hasValidFaculty ? '✅ 設定済み' : '❌ 未設定',
          department: hasValidDepartment ? '✅ 設定済み' : '❌ 未設定',
          complete: isComplete ? '✅ 完了（科目情報へ）' : '❌ 不完全（大学選択から）'
        });
      } else {
        console.log('❌ ユーザープロフィール取得失敗');
      }
    }

  } catch (error) {
    console.error('認証フローテストエラー:', error);
  }
}

testAuthFlow();