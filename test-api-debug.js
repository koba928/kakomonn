/**
 * API Timeout問題のデバッグ用テスト
 */

async function testAPIDebug() {
  console.log('🔍 API Timeout問題のデバッグを開始');
  
  // 1. ヘルスチェック
  try {
    console.log('📡 ヘルスチェック: GET /api/generate');
    const healthResponse = await fetch('http://localhost:3000/api/generate', {
      method: 'GET',
      signal: AbortSignal.timeout(5000)
    });
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ ヘルスチェック成功:', healthData.service);
    } else {
      console.log('❌ ヘルスチェック失敗:', healthResponse.status);
    }
  } catch (error) {
    console.log('❌ ヘルスチェックエラー:', error.message);
    return;
  }
  
  // 2. 最小限のPOSTテスト
  try {
    console.log('\n🧪 最小限POSTテスト開始');
    const startTime = Date.now();
    
    const postResponse = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idea: 'test'
      }),
      signal: AbortSignal.timeout(15000) // 15秒タイムアウト
    });
    
    const endTime = Date.now();
    console.log(`⏱️ APIレスポンス時間: ${endTime - startTime}ms`);
    
    if (postResponse.ok) {
      const result = await postResponse.json();
      console.log('✅ POST成功');
      console.log('📊 結果サマリー:');
      console.log('  - Success:', result.success);
      console.log('  - Table Name:', result.tableName);
      console.log('  - Message:', result.message?.substring(0, 50));
    } else {
      const errorText = await postResponse.text();
      console.log('❌ POST失敗:', postResponse.status);
      console.log('エラー詳細:', errorText.substring(0, 200));
    }
    
  } catch (error) {
    if (error.name === 'TimeoutError') {
      console.log('❌ 15秒でタイムアウト - APIが応答しない');
    } else {
      console.log('❌ POSTエラー:', error.message);
    }
  }
}

testAPIDebug();