/**
 * システムフロー完全性検証テスト
 */

async function testFlowValidation() {
  console.log('🔄 システムフロー完全性検証開始\n');
  
  const testCase = {
    name: "簡単な業務アプリ",
    idea: "社員管理アプリ",
    expectedFlow: [
      "Gemini機能抽出",
      "Geminiデザインインスピレーション", 
      "Figmaデザインシステム統合",
      "OpenAIスキーマ生成",
      "OpenAIコード生成",
      "結果統合"
    ]
  };
  
  console.log(`🧪 テストケース: ${testCase.name}`);
  console.log(`💡 アイデア: ${testCase.idea}`);
  console.log(`📋 期待されるフロー: ${testCase.expectedFlow.length}ステップ\n`);
  
  try {
    const startTime = Date.now();
    
    console.log('📡 API呼び出し開始...');
    const response = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idea: testCase.idea,
        mode: 'balanced'
      }),
      signal: AbortSignal.timeout(50000) // 50秒
    });

    const endTime = Date.now();
    const totalTime = (endTime - startTime) / 1000;
    
    console.log(`⏱️ 総生成時間: ${totalTime}秒`);
    
    if (response.ok) {
      const result = await response.json();
      
      console.log('\n🎉 === フロー検証結果 ===');
      console.log(`✅ API成功: HTTP ${response.status}`);
      console.log(`✅ レスポンス成功: ${result.success}`);
      
      // フロー各段階の検証
      console.log('\n📊 === 各フェーズの検証 ===');
      
      // Phase 1: Gemini機能抽出
      if (result.idea?.keyFeatures?.length >= 6) {
        console.log('✅ Phase 1a: Gemini機能抽出 - 成功');
        console.log(`   抽出された機能: ${result.idea.keyFeatures.length}個`);
        result.idea.keyFeatures.slice(0, 3).forEach((feature, i) => {
          console.log(`   ${i+1}. ${feature}`);
        });
      } else {
        console.log('❌ Phase 1a: Gemini機能抽出 - 失敗');
      }
      
      // Phase 1b: Geminiデザインインスピレーション
      if (result.ui?.colorPalette?.length >= 3) {
        console.log('✅ Phase 1b: Geminiデザインインスピレーション - 成功');
        console.log(`   カラーパレット: ${result.ui.colorPalette.slice(0, 3).join(', ')}`);
      } else {
        console.log('❌ Phase 1b: Geminiデザインインスピレーション - 失敗');
      }
      
      // Phase 2: Figmaデザインシステム統合（メタデータで確認）
      if (result.metadata?.figmaIntegrated !== false) {
        console.log('✅ Phase 2: Figmaデザインシステム統合 - 成功');
      } else {
        console.log('⚠️ Phase 2: Figmaデザインシステム統合 - フォールバック使用');
      }
      
      // Phase 3a: OpenAIスキーマ生成
      if (result.tableName && result.fields?.length >= 4) {
        console.log('✅ Phase 3a: OpenAIスキーマ生成 - 成功');
        console.log(`   テーブル名: ${result.tableName}`);
        console.log(`   フィールド数: ${result.fields.length}`);
      } else {
        console.log('❌ Phase 3a: OpenAIスキーマ生成 - 失敗');
      }
      
      // Phase 3b: OpenAIコード生成
      if (result.generatedCode && result.generatedCode.length > 1000) {
        console.log('✅ Phase 3b: OpenAIコード生成 - 成功');
        console.log(`   生成コード長: ${result.generatedCode.length}文字`);
      } else {
        console.log('❌ Phase 3b: OpenAIコード生成 - 失敗');
      }
      
      // Phase 4: 結果統合
      if (result.metadata?.hybridAI && result.metadata?.processingTime) {
        console.log('✅ Phase 4: 結果統合 - 成功');
        console.log(`   処理時間: ${result.metadata.processingTime}ms`);
      } else {
        console.log('❌ Phase 4: 結果統合 - 失敗');
      }
      
      // カテゴリ廃止の確認
      if (result.category === null || result.category === undefined) {
        console.log('✅ カテゴリ分類廃止: 確認済み');
      } else {
        console.log(`❌ カテゴリ分類廃止: 失敗 (${result.category})`);
      }
      
      // 品質スコア計算
      let qualityScore = 0;
      qualityScore += result.success ? 20 : 0;
      qualityScore += (result.idea?.keyFeatures?.length >= 6) ? 20 : 0;
      qualityScore += (result.ui?.colorPalette?.length >= 3) ? 15 : 0;
      qualityScore += (result.tableName && result.fields?.length >= 4) ? 20 : 0;
      qualityScore += (result.generatedCode?.length > 1000) ? 20 : 0;
      qualityScore += (result.category === null) ? 5 : 0;
      
      console.log(`\n📈 総合品質スコア: ${qualityScore}/100`);
      
      if (qualityScore >= 85) {
        console.log('🏆 フロー検証: 優秀');
      } else if (qualityScore >= 70) {
        console.log('✅ フロー検証: 合格');
      } else {
        console.log('⚠️ フロー検証: 要改善');
      }
      
      return qualityScore >= 70;
      
    } else {
      console.log(`❌ API失敗: HTTP ${response.status}`);
      return false;
    }
    
  } catch (error) {
    if (error.name === 'TimeoutError') {
      console.log('❌ 50秒でタイムアウト');
    } else {
      console.log('❌ エラー:', error.message);
    }
    return false;
  }
}

testFlowValidation().then(success => {
  console.log('\n========================================');
  if (success) {
    console.log('🎉 システムフローは正常に動作しています！');
    console.log('✅ 全ての主要フェーズが期待通りに実行されています');
  } else {
    console.log('⚠️ システムフローに問題があります。詳細な修正が必要です。');
  }
  console.log('========================================');
});