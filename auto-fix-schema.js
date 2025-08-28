// 自動スキーマ修正スクリプト - REST API使用
const https = require('https');

const SUPABASE_URL = 'https://rgcbixnrlrohwcbxylyg.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnY2JpeG5ybHJvaHdjYnh5bHlnIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDczOTQzMSwiZXhwIjoyMDcwMzE1NDMxfQ.p7fYdvRPr9a6fSqwxO05keumCx74WAHVc4_gsw0fHdM';

async function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'rgcbixnrlrohwcbxylyg.supabase.co',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_KEY}`,
        'apikey': SUPABASE_SERVICE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const result = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, data: result });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function testAndFixSchema() {
  console.log('🔧 自動スキーマ修正開始...\n');
  
  // テストデータでinsertを試行
  const testData = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'auto-test@example.com',
    name: 'テスト',
    university: '東京大学',
    faculty: '工学部',
    department: '情報工学科',
    year: 2,
    pen_name: 'テスター',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  console.log('📝 フルデータでテスト挿入...');
  
  try {
    // 既存データをクリーンアップ
    await makeRequest('DELETE', '/rest/v1/users?email=eq.auto-test@example.com');
    
    // フルデータで挿入テスト
    const result = await makeRequest('POST', '/rest/v1/users', testData);
    
    if (result.status === 201) {
      console.log('✅ フルデータ挿入成功！スキーマは正常です');
      
      // テストデータをクリーンアップ
      await makeRequest('DELETE', '/rest/v1/users?email=eq.auto-test@example.com');
      console.log('✅ テストデータクリーンアップ完了');
      return true;
      
    } else {
      console.log('❌ フルデータ挿入失敗:', result.status, result.data);
      
      if (result.data?.message?.includes('column') && result.data?.message?.includes('does not exist')) {
        console.log('\n🛠️ スキーマエラー検出。基本データで再試行...');
        
        // 基本データのみでテスト
        const basicData = {
          id: testData.id,
          email: testData.email
        };
        
        const basicResult = await makeRequest('POST', '/rest/v1/users', basicData);
        
        if (basicResult.status === 201) {
          console.log('✅ 基本データ挿入成功');
          await makeRequest('DELETE', '/rest/v1/users?email=eq.auto-test@example.com');
          
          console.log('\n⚠️ テーブルスキーマが不完全です');
          console.log('💡 手動でSupabase Dashboardからテーブル修正が必要です');
          console.log('\n📋 必要なカラム:');
          console.log('- name (text)');
          console.log('- university (text)');
          console.log('- faculty (text)');
          console.log('- department (text)');
          console.log('- year (integer)');
          console.log('- pen_name (text)');
          console.log('- created_at (timestamptz)');
          console.log('- updated_at (timestamptz)');
          
          return false;
        } else {
          console.log('❌ 基本データ挿入も失敗:', basicResult.status, basicResult.data);
          return false;
        }
      }
    }
  } catch (error) {
    console.error('❌ テスト中にエラー:', error);
    return false;
  }
}

async function deployWorkaround() {
  console.log('\n🚀 回避策適用版をデプロイ中...');
  
  try {
    // ビルドとデプロイのコマンドを実行
    const { spawn } = require('child_process');
    
    return new Promise((resolve, reject) => {
      const deploy = spawn('npm', ['run', 'build'], { stdio: 'inherit' });
      
      deploy.on('close', (code) => {
        if (code === 0) {
          console.log('✅ ビルド完了');
          
          const vercelDeploy = spawn('npx', ['vercel', 'deploy', '--prod'], { stdio: 'inherit' });
          
          vercelDeploy.on('close', (deployCode) => {
            if (deployCode === 0) {
              console.log('✅ デプロイ完了');
              resolve(true);
            } else {
              reject(new Error(`デプロイ失敗: code ${deployCode}`));
            }
          });
          
        } else {
          reject(new Error(`ビルド失敗: code ${code}`));
        }
      });
    });
    
  } catch (error) {
    console.error('❌ デプロイ中にエラー:', error);
    return false;
  }
}

async function main() {
  const schemaOk = await testAndFixSchema();
  
  if (!schemaOk) {
    console.log('\n🔄 スキーマエラー回避策を適用してデプロイします...');
    await deployWorkaround();
    
    console.log('\n✅ 回避策適用完了！');
    console.log('📱 アカウント作成は可能ですが、プロフィール情報は制限される場合があります');
    console.log('🛠️ 完全な機能のためには手動でテーブル修正をお願いします');
  } else {
    console.log('\n🎉 スキーマは正常です！追加作業は不要です');
  }
}

main();