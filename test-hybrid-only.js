/**
 * Test only the hybrid AI orchestrator directly
 */

import { hybridAI } from './lib/hybrid-ai-orchestrator.js';

async function testHybridDirectly() {
  console.log('🧪 Testing hybrid AI orchestrator directly');
  
  try {
    console.log('Starting generation...');
    
    const result = await hybridAI.generateApp('test app', {
      mode: 'balanced',
      useDesignSystem: false, // Disable to avoid API calls
      creativityLevel: 'medium',
      qualityPriority: 'speed'
    });
    
    console.log('✅ Success!');
    console.log('Features:', result.idea?.keyFeatures?.slice(0, 3));
    console.log('Table name:', result.schema?.tableName);
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

testHybridDirectly();