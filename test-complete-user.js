const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(
  'https://rgcbixnrlrohwcbxylyg.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnY2JpeG5ybHJvaHdjYnh5bHlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDczOTQzMSwiZXhwIjoyMDcwMzE1NDMxfQ.p7fYdvRPr9a6fSqwxO05keumCx74WAHVc4_gsw0fHdM'
);

async function testCompleteUser() {
  const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers();
  const testUser = authUsers.users.find(u => u.email === 'test1@example.com');
  
  if (testUser) {
    console.log('テストユーザー1のメタデータ:');
    console.log({
      name: testUser.user_metadata?.name,
      university: testUser.user_metadata?.university,
      faculty: testUser.user_metadata?.faculty,
      department: testUser.user_metadata?.department,
      year: testUser.user_metadata?.year
    });
    
    const hasValidUniversity = testUser.user_metadata?.university && testUser.user_metadata?.university !== '未設定';
    const hasValidFaculty = testUser.user_metadata?.faculty && testUser.user_metadata?.faculty !== '未設定';
    const hasValidDepartment = testUser.user_metadata?.department && testUser.user_metadata?.department !== '未設定';
    
    console.log('判定結果:', {
      university: hasValidUniversity ? '✅' : '❌',
      faculty: hasValidFaculty ? '✅' : '❌',
      department: hasValidDepartment ? '✅' : '❌',
      complete: (hasValidUniversity && hasValidFaculty && hasValidDepartment) ? '✅ 科目情報へ' : '❌ 大学選択から'
    });
  }
}

testCompleteUser();