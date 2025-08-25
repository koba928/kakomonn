/**
 * 改善されたシステムの実動作確認テスト
 */

const testCases = [
  {
    name: "AR教育SNSプラットフォーム",
    idea: "AR教育×SNS融合学習プラットフォームを作りたい",
    expectedFeatures: ["AR", "学習", "SNS", "進捗"],
    expectedTableType: "learning_content"
  },
  {
    name: "扶養控除チェッカー", 
    idea: "扶養控除チェッカーアプリを開発したい。年収と家族構成から最適な働き方を提案",
    expectedFeatures: ["控除計算", "税金", "シミュレーション"],
    expectedTableType: "tax_calculations"
  },
  {
    name: "レシピ動画SNS",
    idea: "レシピ共有×料理動画SNSアプリ",
    expectedFeatures: ["レシピ", "動画", "評価", "投稿"],
    expectedTableType: "recipes"
  }
];

async function testImprovedSystem() {
  console.log('🧪 改善されたシステムの実動作確認を開始\n');
  
  let passedTests = 0;
  
  for (const testCase of testCases) {
    console.log(`========================================`);
    console.log(`🎯 テスト: ${testCase.name}`);
    console.log(`💡 アイデア: ${testCase.idea}`);
    console.log(`========================================`);
    
    try {
      const startTime = Date.now();
      
      const response = await fetch('http://localhost:3000/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idea: testCase.idea,
          mode: 'balanced'
        }),
        signal: AbortSignal.timeout(30000) // 30秒に延長
      });

      const endTime = Date.now();
      console.log(`⏱️ 生成時間: ${(endTime - startTime) / 1000}秒`);
      
      if (!response.ok) {
        console.log(`❌ API失敗: ${response.status}`);
        continue;
      }

      const result = await response.json();
      
      console.log('\n📊 === 生成結果分析 ===');
      console.log(`✅ 成功: ${result.success}`);
      console.log(`📦 テーブル名: ${result.tableName}`);
      console.log(`🎯 カテゴリ: ${result.category || 'null (カテゴリ廃止済み)'}`);
      
      // 機能抽出の確認
      if (result.idea?.keyFeatures) {
        console.log(`\n🔧 抽出された機能 (${result.idea.keyFeatures.length}個):`);
        result.idea.keyFeatures.slice(0, 6).forEach((feature, index) => {
          console.log(`  ${index + 1}. ${feature}`);
        });
        
        // 期待される機能が含まれているかチェック
        const hasExpectedFeatures = testCase.expectedFeatures.some(expected => 
          result.idea.keyFeatures.some(actual => 
            actual.toLowerCase().includes(expected.toLowerCase())
          )
        );
        
        if (hasExpectedFeatures) {
          console.log('✅ 期待される機能が含まれています');
        } else {
          console.log('⚠️ 期待される機能が見つかりません');
        }
      }
      
      // UIコンポーネントの確認
      if (result.idea?.specificComponents) {
        console.log(`\n🧩 UIコンポーネント (${result.idea.specificComponents.length}個):`);
        result.idea.specificComponents.slice(0, 4).forEach((component, index) => {
          console.log(`  ${index + 1}. ${component}`);
        });
      }
      
      // データ構造の確認
      if (result.idea?.dataStructure) {
        console.log(`\n📊 データ構造 (${result.idea.dataStructure.length}個):`);
        result.idea.dataStructure.forEach((entity, index) => {
          console.log(`  ${index + 1}. ${entity}`);
        });
      }
      
      // Figmaデザインの確認
      if (result.ui?.colorPalette) {
        console.log(`\n🎨 カラーパレット:`);
        result.ui.colorPalette.slice(0, 4).forEach((color, index) => {
          console.log(`  ${index + 1}. ${color}`);
        });
      }
      
      // 品質スコア
      const qualityScore = calculateQualityScore(result, testCase);
      console.log(`\n📈 品質スコア: ${qualityScore}/100`);
      
      if (qualityScore >= 70) {
        passedTests++;
        console.log('✅ テスト合格');
      } else {
        console.log('❌ テスト不合格');
      }
      
    } catch (error) {
      if (error.name === 'TimeoutError') {
        console.log('❌ 30秒でタイムアウト');
      } else {
        console.log('❌ エラー:', error.message);
      }
    }
    
    console.log('\n');
    // API負荷軽減のため2秒待機
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('========================================');
  console.log(`📊 最終結果: ${passedTests}/${testCases.length} 合格`);
  console.log('========================================');
  
  if (passedTests === testCases.length) {
    console.log('🎉 全テスト合格！改善されたシステムは正常に動作しています。');
  } else {
    console.log('⚠️ 一部テストが失敗しました。さらなる調整が必要です。');
  }
}

function calculateQualityScore(result, testCase) {
  let score = 0;
  
  // 基本成功 (20点)
  if (result.success) score += 20;
  
  // 機能抽出の品質 (30点)
  if (result.idea?.keyFeatures?.length >= 6) score += 15;
  const hasRelevantFeatures = testCase.expectedFeatures.some(expected => 
    result.idea?.keyFeatures?.some(actual => 
      actual.toLowerCase().includes(expected.toLowerCase())
    )
  );
  if (hasRelevantFeatures) score += 15;
  
  // UI コンポーネント (20点)
  if (result.idea?.specificComponents?.length >= 4) score += 20;
  
  // テーブル名の妥当性 (15点)
  if (result.tableName && result.tableName !== 'tasks' && result.tableName !== 'items') score += 15;
  
  // デザイン情報 (15点)
  if (result.ui?.colorPalette?.length >= 3) score += 15;
  
  return Math.min(score, 100);
}

testImprovedSystem();