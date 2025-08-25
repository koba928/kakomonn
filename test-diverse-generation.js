/**
 * 多様なアプリ生成テスト
 * GPTがタスク管理以外のアプリを正しく生成できるかテスト
 */

const testCases = [
  {
    idea: "AR教育×SNS融合学習プラットフォームを作りたい",
    expectedCategory: "education",
    expectedFeatures: ["ARコンテンツ", "SNS機能", "学習進捗"],
    shouldNotContain: ["タスク管理", "TODO"]
  },
  {
    idea: "扶養控除チェッカーアプリを開発したい。年収と家族構成から最適な働き方を提案",
    expectedCategory: "finance", 
    expectedFeatures: ["税金計算", "収入シミュレーション", "控除額表示"],
    shouldNotContain: ["タスク", "進捗"]
  },
  {
    idea: "レシピ共有×料理動画SNSアプリ",
    expectedCategory: "creative",
    expectedFeatures: ["レシピ投稿", "動画アップロード", "評価システム"],
    shouldNotContain: ["タスク管理", "TODO", "進捗管理"]
  },
  {
    idea: "健康データ×AIアドバイザーアプリ。睡眠・運動・食事を総合管理",
    expectedCategory: "health",
    expectedFeatures: ["健康データ入力", "AIアドバイス", "グラフ表示"],
    shouldNotContain: ["タスク", "TODO"]
  },
  {
    idea: "ブログ記事管理CMS。Markdownエディタ付き",
    expectedCategory: "social",
    expectedFeatures: ["記事エディタ", "Markdown対応", "公開管理"],
    shouldNotContain: ["タスク管理"]
  }
];

async function testGeneration(testCase) {
  console.log('\n========================================');
  console.log('🧪 Testing:', testCase.idea);
  console.log('Expected category:', testCase.expectedCategory);
  console.log('========================================\n');

  try {
    const response = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idea: testCase.idea,
        mode: 'balanced'
      })
    });

    if (!response.ok) {
      console.error('❌ API request failed:', response.status);
      return false;
    }

    const result = await response.json();
    
    // 検証
    let passed = true;
    
    // カテゴリチェック
    if (result.category !== testCase.expectedCategory) {
      console.log(`❌ Category mismatch: expected ${testCase.expectedCategory}, got ${result.category}`);
      passed = false;
    } else {
      console.log(`✅ Category correct: ${result.category}`);
    }

    // 生成されたコードの分析
    const generatedCode = result.code?.component || '';
    
    // 期待される機能が含まれているか
    for (const feature of testCase.expectedFeatures) {
      if (!generatedCode.toLowerCase().includes(feature.toLowerCase()) &&
          !result.keyFeatures?.some(f => f.toLowerCase().includes(feature.toLowerCase()))) {
        console.log(`❌ Missing expected feature: ${feature}`);
        passed = false;
      } else {
        console.log(`✅ Feature found: ${feature}`);
      }
    }

    // タスク管理要素が含まれていないか
    for (const forbidden of testCase.shouldNotContain) {
      if (generatedCode.toLowerCase().includes(forbidden.toLowerCase())) {
        console.log(`❌ Contains forbidden element: ${forbidden}`);
        passed = false;
      }
    }

    // スキーマチェック
    const tableName = result.schema?.tableName || '';
    if (tableName === 'tasks' || tableName === 'todos') {
      console.log(`❌ Generic table name: ${tableName}`);
      passed = false;
    } else {
      console.log(`✅ Specific table name: ${tableName}`);
    }

    // Figmaトークンの活用チェック
    if (result.design?.figmaTokens || result.design?.spacing) {
      console.log('✅ Figma design tokens detected');
    } else {
      console.log('⚠️  No Figma design tokens found');
    }

    return passed;

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting diverse app generation tests...\n');
  
  let passedCount = 0;
  
  for (const testCase of testCases) {
    const passed = await testGeneration(testCase);
    if (passed) passedCount++;
    
    // API rate limiting対策
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log('\n========================================');
  console.log(`📊 Test Results: ${passedCount}/${testCases.length} passed`);
  console.log('========================================');
  
  if (passedCount === testCases.length) {
    console.log('🎉 All tests passed! System generates diverse apps correctly.');
  } else {
    console.log('⚠️  Some tests failed. System still generating generic apps.');
  }
}

// メイン実行
runAllTests().catch(console.error);