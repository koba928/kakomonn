#!/usr/bin/env node

// This script will help identify potential frontend issues by examining the rendered HTML
// and checking for common React/JavaScript problems

async function debugFrontend() {
  console.log('🔍 Frontend Debug Analysis');
  console.log('==========================');
  
  try {
    // 1. Check initial HTML structure
    console.log('📄 Analyzing initial HTML structure...');
    const response = await fetch('http://localhost:3000');
    const html = await response.text();
    
    // Look for potential issues
    const checks = {
      hasReactErrors: html.includes('react-error') || html.includes('Error:'),
      hasJavaScriptErrors: html.includes('SyntaxError') || html.includes('ReferenceError'),
      hasNextJSErrors: html.includes('_next-error'),
      hasHydrationIssues: html.includes('hydration'),
      hasFreeTalkComponent: html.includes('FreeTalk'),
      hasDebugPanel: html.includes('UI-DEBUG'),
      hasTextarea: html.includes('textarea'),
      hasSendButton: html.includes('Send') || html.includes('button'),
      hasMaturaProvider: html.includes('MaturaProvider') || html.includes('useMaturaState'),
      hasClientSideCode: html.includes('_next/static'),
      hasStylesheets: html.includes('.css'),
      reactScriptsLoaded: html.includes('react') && html.includes('_next'),
    };
    
    console.log('📋 HTML Structure Check:');
    Object.entries(checks).forEach(([key, value]) => {
      console.log(`  ${value ? '✅' : '❌'} ${key}: ${value}`);
    });
    
    // 2. Look for specific patterns that might indicate issues
    console.log('\n🔍 Searching for potential issue patterns...');
    
    const patterns = {
      'Client-side hydration errors': /<script[^>]*>.*hydrat.*error/i,
      'React development warnings': /Warning.*React/i,
      'Console error patterns': /console\.error|console\.warn/i,
      'Uncaught exceptions': /Uncaught|TypeError|ReferenceError/i,
      'State management issues': /useState.*undefined|useEffect.*error/i,
      'API call failures': /fetch.*failed|XMLHttpRequest.*error/i,
    };
    
    Object.entries(patterns).forEach(([description, pattern]) => {
      const found = pattern.test(html);
      console.log(`  ${found ? '⚠️' : '✅'} ${description}: ${found ? 'FOUND' : 'OK'}`);
    });
    
    // 3. Extract and analyze key script elements
    console.log('\n📜 Analyzing JavaScript loading...');
    
    const scriptMatches = html.match(/<script[^>]*src="([^"]*)"[^>]*>/g) || [];
    console.log(`  Found ${scriptMatches.length} external scripts`);
    
    const scriptSources = scriptMatches.map(script => {
      const match = script.match(/src="([^"]*)"/);
      return match ? match[1] : null;
    }).filter(Boolean);
    
    const keyScripts = {
      mainApp: scriptSources.find(src => src.includes('main-app')),
      webpackRuntime: scriptSources.find(src => src.includes('webpack')),
      pageScript: scriptSources.find(src => src.includes('/page.')),
      layoutScript: scriptSources.find(src => src.includes('/layout.')),
    };
    
    console.log('  Key scripts:');
    Object.entries(keyScripts).forEach(([name, src]) => {
      console.log(`    ${src ? '✅' : '❌'} ${name}: ${src || 'MISSING'}`);
    });
    
    // 4. Check for specific component rendering
    console.log('\n🎨 Component Rendering Analysis...');
    
    // Look for the FreeTalk component structure
    const hasFreeTalkHeader = html.includes('FreeTalk - 自由対話');
    const hasPlaceholderText = html.includes('アイデアを入力');
    const hasDebugInfo = html.includes('Conversations count:');
    const hasLoadingState = html.includes('Loading:');
    const hasErrorState = html.includes('Error:');
    
    console.log('  FreeTalk Component Elements:');
    console.log(`    ✅ Header: ${hasFreeTalkHeader}`);
    console.log(`    ✅ Input placeholder: ${hasPlaceholderText}`);
    console.log(`    ✅ Debug panel: ${hasDebugInfo}`);
    console.log(`    ✅ Loading indicator: ${hasLoadingState}`);
    console.log(`    ✅ Error handling: ${hasErrorState}`);
    
    // 5. Extract and analyze inline script content
    console.log('\n⚙️ Analyzing inline scripts...');
    
    const inlineScripts = html.match(/<script[^>]*>(.*?)<\/script>/gs) || [];
    const hasReactCode = inlineScripts.some(script => script.includes('react') || script.includes('React'));
    const hasStateManagement = inlineScripts.some(script => script.includes('useState') || script.includes('useEffect'));
    const hasNextJSCode = inlineScripts.some(script => script.includes('__next') || script.includes('next'));
    
    console.log(`  Contains React code: ${hasReactCode}`);
    console.log(`  Contains state management: ${hasStateManagement}`);
    console.log(`  Contains Next.js bootstrap: ${hasNextJSCode}`);
    
    // 6. Final assessment
    console.log('\n🎯 Assessment & Recommendations:');
    console.log('================================');
    
    if (!checks.hasFreeTalkComponent) {
      console.log('❌ CRITICAL: FreeTalk component not found in HTML');
      console.log('   → Check if the component is being rendered correctly');
      console.log('   → Verify Next.js routing is working');
    }
    
    if (!checks.hasDebugPanel) {
      console.log('❌ WARNING: Debug panel not found');
      console.log('   → Debug information may not be accessible');
    }
    
    if (!checks.reactScriptsLoaded) {
      console.log('❌ CRITICAL: React scripts not properly loaded');
      console.log('   → Check Next.js build and client-side hydration');
    }
    
    if (checks.hasReactErrors) {
      console.log('❌ ERROR: React errors detected in HTML');
      console.log('   → Check browser console for detailed error messages');
    }
    
    if (!checks.hasTextarea || !checks.hasSendButton) {
      console.log('❌ UI ISSUE: Input elements missing');
      console.log('   → FreeTalk form may not be rendering correctly');
    }
    
    console.log('\n📝 Recommended Next Steps:');
    console.log('1. Open browser developer tools and check Console tab');
    console.log('2. Look for JavaScript errors during page load');
    console.log('3. Monitor Network tab for failed resource loading');
    console.log('4. Check React Developer Tools for component state');
    console.log('5. Verify that state updates trigger UI re-renders');
    
  } catch (error) {
    console.error('❌ Debug analysis failed:', error.message);
  }
}

debugFrontend().catch(console.error);