/**
 * Single test case for debugging
 */

async function testSingle() {
  console.log('🧪 Testing single case: AR教育×SNS融合学習プラットフォームを作りたい');
  
  try {
    const response = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idea: 'AR教育×SNS融合学習プラットフォームを作りたい',
        mode: 'balanced'
      })
    });

    console.log('Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API request failed:', response.status);
      console.error('Error details:', errorText.substring(0, 500));
      return;
    }

    const result = await response.json();
    console.log('✅ Success! Generated app with features:');
    console.log('- Features:', result.idea?.keyFeatures?.slice(0, 3));
    console.log('- Table name:', result.tableName);
    console.log('- Category removed:', result.category === null ? 'Yes' : 'No');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

testSingle().catch(console.error);