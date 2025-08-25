#!/usr/bin/env node

/**
 * OpenAI修正後のテストスクリプト
 */

import { openai } from './lib/openai.js';

async function testOpenAIConnection() {
  console.log('🧪 [TEST] Testing OpenAI connection...');
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: "Hello, respond with 'API working'" }
      ],
      max_tokens: 10
    });
    
    console.log('✅ [TEST] OpenAI connection successful');
    console.log('📋 [TEST] Response:', response.choices[0].message.content);
    return true;
  } catch (error) {
    console.error('❌ [TEST] OpenAI connection failed:', error.message);
    return false;
  }
}

async function testToolsAPI() {
  console.log('🔧 [TEST] Testing OpenAI Tools API...');
  
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: "Test the function call with a simple calculation" }
      ],
      tools: [
        {
          type: "function",
          function: {
            name: "calculate",
            description: "Perform a simple calculation",
            parameters: {
              type: "object",
              properties: {
                operation: {
                  type: "string",
                  enum: ["add", "subtract", "multiply", "divide"]
                },
                a: { type: "number" },
                b: { type: "number" }
              },
              required: ["operation", "a", "b"]
            }
          }
        }
      ],
      tool_choice: { type: "function", function: { name: "calculate" } }
    });
    
    const toolCall = response.choices[0]?.message?.tool_calls?.[0];
    if (toolCall?.function?.arguments) {
      console.log('✅ [TEST] Tools API working correctly');
      console.log('📋 [TEST] Tool call:', JSON.parse(toolCall.function.arguments));
      return true;
    } else {
      console.error('❌ [TEST] No tool call received');
      return false;
    }
  } catch (error) {
    console.error('❌ [TEST] Tools API failed:', error.message);
    return false;
  }
}

async function testUniversalGenerator() {
  console.log('🚀 [TEST] Testing Universal App Generator...');
  
  try {
    const { universalGenerator } = await import('./lib/universal-app-generator.js');
    
    // Simple test case
    const result = await universalGenerator.generateApp("簡単なToDoアプリを作りたい");
    
    console.log('✅ [TEST] Universal Generator working');
    console.log('📋 [TEST] Generated app category:', result.intent.category);
    console.log('📋 [TEST] Schema table:', result.schema.tableName);
    console.log('📋 [TEST] Confidence:', result.confidence);
    return true;
  } catch (error) {
    console.error('❌ [TEST] Universal Generator failed:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🎯 [TEST] Starting comprehensive test suite...\n');
  
  const results = {
    openai: await testOpenAIConnection(),
    tools: await testToolsAPI(),
    generator: await testUniversalGenerator()
  };
  
  console.log('\n📊 [TEST] Test Results Summary:');
  console.log('━'.repeat(40));
  console.log(`OpenAI Connection: ${results.openai ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Tools API: ${results.tools ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Universal Generator: ${results.generator ? '✅ PASS' : '❌ FAIL'}`);
  
  const passCount = Object.values(results).filter(Boolean).length;
  const totalCount = Object.keys(results).length;
  
  console.log(`\n🎯 [TEST] Overall: ${passCount}/${totalCount} tests passed`);
  
  if (passCount === totalCount) {
    console.log('🎉 [TEST] All systems operational!');
    process.exit(0);
  } else {
    console.log('⚠️ [TEST] Some systems need attention');
    process.exit(1);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(console.error);
}

export { testOpenAIConnection, testToolsAPI, testUniversalGenerator };