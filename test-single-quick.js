/**
 * 修正後の単一テスト
 */

async function testSingleQuick() {
  console.log('🧪 修正後の単一テスト開始');
  
  try {
    const response = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idea: 'レシピ共有×料理動画SNSアプリ',
        mode: 'balanced'
      }),
      signal: AbortSignal.timeout(45000) // 45秒
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ テスト成功！');
      console.log('📊 結果:');
      console.log('  - 成功:', result.success);
      console.log('  - テーブル名:', result.tableName);
      console.log('  - カテゴリ:', result.category || 'null');
      console.log('  - 機能数:', result.idea?.keyFeatures?.length || 0);
      if (result.idea?.keyFeatures) {
        console.log('  - 主要機能:', result.idea.keyFeatures.slice(0, 3));
      }
      console.log('  - UIコンポーネント数:', result.idea?.specificComponents?.length || 0);
      console.log('  - カラーパレット:', result.ui?.colorPalette?.slice(0, 3) || []);
      console.log('  - 生成されたコード長:', result.generatedCode?.length || 0, '文字');
    } else {
      console.log('❌ API失敗:', response.status);
    }
    
  } catch (error) {
    if (error.name === 'TimeoutError') {
      console.log('❌ 45秒でタイムアウト');
    } else {
      console.log('❌ エラー:', error.message);
    }
  }
}

testSingleQuick();