/**
 * Test the API endpoint with minimal data
 */

async function testSimpleAPI() {
  console.log('🧪 Testing API with simple request');
  
  try {
    const response = await fetch('http://localhost:3000/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idea: 'simple todo app'
      }),
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    console.log('Response status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Got response');
      console.log('Success:', result.success);
      console.log('Table name:', result.tableName);
    } else {
      const errorText = await response.text();
      console.error('❌ Error response:', errorText.substring(0, 200));
    }
    
  } catch (error) {
    if (error.name === 'TimeoutError') {
      console.error('❌ Request timed out after 10 seconds');
    } else {
      console.error('❌ Test failed:', error.message);
    }
  }
}

testSimpleAPI();