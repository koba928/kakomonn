/**
 * MATURA 30分プレミアム戦略立案 - Gemini相談スクリプト
 */

import { writeFileSync } from 'fs';

async function consultWithGemini() {
  console.log('🤝 Geminiと30分プレミアム戦略を相談開始...');
  
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('❌ GEMINI_API_KEY が設定されていません');
    return { success: false, error: 'API key not found' };
  }

  const strategyPrompt = `
# MATURA プロジェクト戦略相談

あなたはGoogle Geminiです。MATURAプロジェクトの30分プレミアム戦略について相談します。

## 現状分析
### 既存システムの状況
- 評価: 6.6/10 (競合平均8.2/10)
- 生成時間: 20秒 (競合数秒)
- 主な課題: UI品質、TypeScript対応、機能完成度

### 競合状況
- v0.dev (Vercel): 8.5/10 - 高速生成、洗練されたUI
- Bolt.new (StackBlitz): 8.2/10 - 完全なプロジェクト生成
- Cursor AI: 8.0/10 - AI統合開発環境
- Claude Artifacts: 7.8/10 - インタラクティブ生成

### ユーザーの意図
「生成時間は30分くらいかかってもいい。ただ、ui品質も高く、しっかり機能としてもすぐれたものが完成したらいいなと思う」

## 戦略相談項目

1. **時間vs品質トレードオフ戦略**
   - 30分で何を実現すべきか？
   - 各フェーズの時間配分は？
   - 品質保証のチェックポイントは？

2. **差別化戦略**
   - 競合との明確な違いをどう作るか？
   - 「プロトタイプ vs プロダクション品質」の訴求力は？
   - ターゲット市場の絞り込みは？

3. **技術実装戦略**
   - 5フェーズ設計の妥当性は？
   - Gemini活用の最適化方法は？
   - 品質評価指標の設計は？

4. **ビジネス戦略**
   - 品質重視ユーザーの獲得方法は？
   - 30分待つ価値の伝え方は？
   - 競合に対する優位性の維持方法は？

5. **実装優先順位**
   - 最初に取り組むべき改善点は？
   - MVP vs フル機能の判断は？
   - リスク管理の方法は？

以下の観点で詳細な戦略提案をしてください：

### 求める回答形式
1. **現状診断と課題分析**
2. **30分プレミアム戦略の妥当性評価**
3. **具体的な実装ロードマップ**
4. **成功指標とKPI設定**
5. **リスク要因と対策**
6. **Gemini活用の最適化提案**

戦略アドバイザーとして、率直で実践的な提案をお願いします。
`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: strategyPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4000,
          topP: 0.8,
          topK: 40
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Gemini API error:', errorData);
      return { success: false, error: `API error: ${response.status}` };
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      return { success: false, error: 'Invalid response structure' };
    }

    const strategy = data.candidates[0].content.parts[0].text;

    console.log('\n📋 Gemini戦略提案:\n');
    console.log(strategy);
    
    // 結果をファイルに保存
    const timestamp = new Date().toISOString();
    const content = `# MATURA 30分プレミアム戦略 - Gemini相談結果

${strategy}

---
*Generated: ${timestamp}*`;

    writeFileSync('./strategy-result.md', content);
    console.log('\n✅ 戦略相談完了');
    console.log('💾 strategy-result.md に保存されました');
    
    return {
      success: true,
      strategy,
      timestamp
    };

  } catch (error) {
    console.error('💥 戦略相談失敗:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// 戦略相談実行
consultWithGemini();