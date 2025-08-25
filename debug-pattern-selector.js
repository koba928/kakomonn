// Debug script to test pattern selector
const fs = require('fs');
const path = require('path');

// Read the industry patterns file
const patternsPath = path.join(__dirname, 'lib', 'industry-specialized-patterns.ts');
const content = fs.readFileSync(patternsPath, 'utf8');

// Extract the selectBestPattern logic
console.log('🔍 Testing pattern selector logic...');

const testInput = '病院の診療予約システムを作りたい';
console.log('Input:', testInput);

// Test keyword extraction
const industryKeywords = {
  'healthcare': ['医療', '病院', 'クリニック', '薬局', '患者', '診療', '予約', '健康'],
  'education': ['学校', '教育', '学習', '授業', '学生', '先生', 'eラーニング', 'LMS'],
  'finance': ['金融', '投資', '経費', '家計簿', '予算', '資産', 'ポートフォリオ', '銀行'],
  'hospitality': ['ホテル', 'レストラン', '予約', '宿泊', '料理', '接客', '旅館', 'POS'],
  'logistics': ['配送', '物流', '倉庫', '在庫', 'トラッキング', '運送', '配達'],
  'real-estate': ['不動産', '物件', '賃貸', '売買', '管理', 'マンション', '土地'],
  'ecommerce': ['ECサイト', 'ネットショップ', '通販', 'オンラインストア', '商品', '決済']
};

const found = [];
Object.entries(industryKeywords).forEach(([industry, keywords]) => {
  const matches = keywords.filter(keyword => testInput.includes(keyword));
  if (matches.length > 0) {
    found.push(industry);
    console.log(`✅ ${industry}: matched keywords [${matches.join(', ')}]`);
  }
});

console.log('Found industries:', found);

// Test healthcare pattern
const medicalPattern = {
  id: 'medical-appointment',
  name: '医療予約管理システム',
  industry: 'healthcare',
  useCase: '病院・クリニックの予約管理',
  keyFeatures: ['患者情報管理', '予約スケジューリング', '診療履歴', '通知システム'],
  mvpScore: 9
};

const structuredData = { what: '病院の診療予約システムを作りたい' };

// Calculate score with new algorithm
let score = 0;

// Industry matching (50%)
if (found.includes(medicalPattern.industry)) {
  score += 0.5;
  console.log('✅ Industry match: +0.5');
} else {
  console.log('❌ No industry match');
}

// Use case matching (20%) - simple text similarity
const useCaseWords = structuredData.what.toLowerCase().split(/\s+/);
const patternUseCaseWords = medicalPattern.useCase.toLowerCase().split(/\s+/);
const intersection = useCaseWords.filter(word => patternUseCaseWords.includes(word));
const useCaseMatch = intersection.length / Math.max(useCaseWords.length, patternUseCaseWords.length);
score += useCaseMatch * 0.2;
console.log(`Use case match: ${useCaseMatch.toFixed(3)} (+${(useCaseMatch * 0.2).toFixed(3)})`);

// Feature matching (15%)
const featureMatch = medicalPattern.keyFeatures.some(feature => 
  structuredData.what.includes(feature)
);
if (featureMatch) {
  score += 0.15;
  console.log('✅ Feature match: +0.15');
} else {
  console.log('❌ No feature match');
}

// Keyword density bonus (10%)
const healthcareKeywords = ['医療', '病院', 'クリニック', '薬局', '患者', '診療', '予約', '健康'];
const matchedKeywords = healthcareKeywords.filter(keyword => testInput.includes(keyword));
const keywordDensity = matchedKeywords.length / healthcareKeywords.length;
const keywordBonus = keywordDensity * 0.1;
score += keywordBonus;
console.log(`Keyword density: ${matchedKeywords.length}/${healthcareKeywords.length} = ${keywordDensity.toFixed(3)} (+${keywordBonus.toFixed(3)})`);

// MVP score (5%)
const mvpBonus = (medicalPattern.mvpScore / 10) * 0.05;
score += mvpBonus;
console.log(`MVP bonus: +${mvpBonus.toFixed(3)}`);

console.log(`\nTotal score: ${score.toFixed(3)}`);
console.log(`Threshold check (0.4): ${score >= 0.4 ? 'PASS ✅' : 'FAIL ❌'}`);

if (score >= 0.4) {
  console.log(`🎉 Should select: ${medicalPattern.name}`);
} else {
  console.log(`💡 Score still too low. Need further adjustment.`);
}