/**
 * MATURA Generate All
 * 全自動生成システムのメインコントローラー
 */

const UIGenerator = require('./generateUI')
const StoreGenerator = require('./generateStore')
const HandlersGenerator = require('./generateHandlers')
const ApiMockGenerator = require('./generateApiMock')
const AutoFixer = require('../core/autoFixer').default
const FileManager = require('../core/fileManager').default

class GenerateAllSystem {
  constructor(userInput, options = {}) {
    this.userInput = userInput
    this.options = {
      geminiApiKey: options.geminiApiKey || process.env.GEMINI_API_KEY,
      maxRetries: options.maxRetries || 3,
      autoFix: options.autoFix !== false, // Default true
      ...options
    }
    
    this.fileManager = new FileManager()
    this.autoFixer = new AutoFixer(this.options.geminiApiKey)
    this.results = {
      ui: null,
      store: null,
      handlers: null,
      api: null,
      autoFix: null,
      success: false,
      totalTime: 0,
      errors: []
    }
  }

  async executeAll() {
    const startTime = Date.now()
    
    console.log('🚀 ======================================')
    console.log('🚀 MATURA 完全自動生成システム開始')
    console.log('🚀 ======================================')
    console.log(`💡 User Input: ${this.userInput}`)
    console.log(`⚙️ Auto Fix: ${this.options.autoFix}`)
    console.log('')

    try {
      // Setup project structure
      this.fileManager.ensureAppStructure()
      
      // Execute generation phases with retry logic
      await this.executeWithRetry('UI Generation', () => this.generateUI())
      await this.executeWithRetry('Store Generation', () => this.generateStore())
      await this.executeWithRetry('Handlers Generation', () => this.generateHandlers())
      await this.executeWithRetry('API Mock Generation', () => this.generateAPI())
      
      // Auto-fix if enabled
      if (this.options.autoFix) {
        await this.executeWithRetry('Auto Fix', () => this.runAutoFix())
      }

      // Calculate results
      this.results.totalTime = Date.now() - startTime
      this.results.success = this.isGenerationSuccessful()

      // Print results
      this.printResults()

      return this.results

    } catch (error) {
      console.error('💥 [Generate All] Critical failure:', error)
      this.results.errors.push(error.message)
      this.results.totalTime = Date.now() - startTime
      return this.results
    }
  }

  async executeWithRetry(phaseName, phaseFunction) {
    console.log(`\\n🎯 [${phaseName}] Starting...`)
    
    let attempt = 0
    while (attempt < this.options.maxRetries) {
      attempt++
      
      try {
        const result = await phaseFunction()
        
        if (result && result.success) {
          console.log(`✅ [${phaseName}] Completed successfully`)
          return result
        } else {
          throw new Error(result?.error || 'Phase failed')
        }
        
      } catch (error) {
        console.warn(`⚠️ [${phaseName}] Attempt ${attempt} failed:`, error.message)
        
        if (attempt >= this.options.maxRetries) {
          console.error(`💥 [${phaseName}] All attempts failed`)
          this.results.errors.push(`${phaseName}: ${error.message}`)
          return { success: false, error: error.message }
        }
        
        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 2000))
        console.log(`🔄 [${phaseName}] Retrying... (${attempt + 1}/${this.options.maxRetries})`)
      }
    }
  }

  async generateUI() {
    const generator = new UIGenerator(this.userInput, this.options.geminiApiKey)
    this.results.ui = await generator.generate()
    return this.results.ui
  }

  async generateStore() {
    const generator = new StoreGenerator(this.userInput, this.options.geminiApiKey)
    this.results.store = await generator.generate()
    return this.results.store
  }

  async generateHandlers() {
    const generator = new HandlersGenerator(this.userInput, this.options.geminiApiKey)
    this.results.handlers = await generator.generate()
    return this.results.handlers
  }

  async generateAPI() {
    const generator = new ApiMockGenerator(this.userInput, this.options.geminiApiKey)
    this.results.api = await generator.generate()
    return this.results.api
  }

  async runAutoFix() {
    console.log('🔧 [Auto Fix] Running lint and type checks...')
    this.results.autoFix = await this.autoFixer.runFullAutoFix()
    return this.results.autoFix
  }

  isGenerationSuccessful() {
    const phases = [this.results.ui, this.results.store, this.results.handlers, this.results.api]
    const successfulPhases = phases.filter(phase => phase && phase.success).length
    
    // Consider successful if at least 3 out of 4 phases succeeded
    return successfulPhases >= 3
  }

  printResults() {
    console.log('\\n🎉 ======================================')
    console.log('🎉 MATURA 生成完了!')
    console.log('🎉 ======================================')
    
    console.log(`⏱️ 総実行時間: ${Math.round(this.results.totalTime / 1000)}秒`)
    console.log(`✅ 総合結果: ${this.results.success ? '成功' : '部分的成功'}`)
    
    console.log('\\n📊 フェーズ別結果:')
    console.log(`  🎨 UI: ${this.results.ui?.success ? '✅' : '❌'}`)
    console.log(`  🗄️ Store: ${this.results.store?.success ? '✅' : '❌'}`)
    console.log(`  ⚡ Handlers: ${this.results.handlers?.success ? '✅' : '❌'}`)
    console.log(`  📡 API: ${this.results.api?.success ? '✅' : '❌'}`)
    
    if (this.options.autoFix) {
      console.log(`  🔧 Auto Fix: ${this.results.autoFix?.success ? '✅' : '❌'}`)
      if (this.results.autoFix) {
        console.log(`     - Lint errors: ${this.results.autoFix.lintErrors.length}`)
        console.log(`     - Type errors: ${this.results.autoFix.typeErrors.length}`)
        console.log(`     - Fixes applied: ${this.results.autoFix.fixesApplied.length}`)
      }
    }
    
    if (this.results.errors.length > 0) {
      console.log('\\n⚠️ エラー:')
      this.results.errors.forEach(error => console.log(`  - ${error}`))
    }
    
    console.log('\\n📁 生成されたファイル:')
    console.log('  - app/page.tsx (メインページ)')
    console.log('  - app/components/ (UIコンポーネント)')
    console.log('  - lib/store/ (状態管理)')
    console.log('  - lib/handlers/ (イベントハンドラ)')
    console.log('  - app/api/ (APIエンドポイント)')
    
    console.log('\\n🚀 アプリケーション準備完了!')
  }
}

// CLI実行用のエントリーポイント
async function runGenerateAll(userInput, options = {}) {
  if (!userInput) {
    console.error('❌ ユーザー入力が必要です')
    process.exit(1)
  }

  const system = new GenerateAllSystem(userInput, options)
  const results = await system.executeAll()
  
  // Exit with appropriate code
  process.exit(results.success ? 0 : 1)
}

// Export for programmatic use
module.exports = {
  GenerateAllSystem,
  runGenerateAll
}

// CLI execution
if (require.main === module) {
  const userInput = process.argv[2]
  
  if (!userInput) {
    console.log('使用方法: node generateAll.js "あなたのアプリアイデア"')
    console.log('例: node generateAll.js "タスク管理アプリを作りたい"')
    process.exit(1)
  }
  
  runGenerateAll(userInput)
}