// Manual test to verify the API works correctly
const { autoFillStructure } = require('./lib/structure-autofill.ts');

// Test different inputs to see what's actually being generated
const testCases = [
  'カフェのWebサイトを作りたい',
  'オンラインショップを作りたい',
  'ブログサイトを作りたい',
  'ニュースサイトを作りたい',
  'コミュニティサイトを作りたい',
  'イベント管理システムを作りたい',
  'レストラン予約システムを作りたい',
  'フィットネスアプリを作りたい'
];

console.log('=== 様々なアイデアでテスト ===\n');

testCases.forEach((input, index) => {
  console.log(`テスト ${index + 1}: "${input}"`);
  try {
    const result = autoFillStructure(input);
    console.log('結果:');
    console.log(`  Why: ${result.why}`);
    console.log(`  Who: ${result.who}`);
    console.log(`  What: ${JSON.stringify(result.what)}`);
    console.log(`  How: ${result.how}`);
    console.log(`  Impact: ${result.impact}`);
  } catch (error) {
    console.log(`  エラー: ${error.message}`);
  }
  console.log('---\n');
});

console.log('テスト完了');