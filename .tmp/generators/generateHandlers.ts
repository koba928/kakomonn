/**
 * MATURA Event Handlers Generation Engine
 * イベントハンドラを自動生成してUIに統合
 */

import { writeFileSync, readFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

interface HandlerGenerationOptions {
  appIdea: string
  handlerTypes?: string[]
  integrationMode?: 'patch' | 'generate'
  apiKey?: string
}

export class HandlersGenerator {
  private projectRoot: string
  private apiKey: string | null

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot
    this.apiKey = process.env.GEMINI_API_KEY || null
  }

  /**
   * Gemini APIを呼び出してハンドラ生成
   */
  private async callGeminiAPI(prompt: string): Promise<string> {
    if (!this.apiKey) {
      console.log('⚠️ GEMINI_API_KEY not found, using enhanced fallback generation')
      return this.generateEnhancedFallbackHandlers()
    }

    try {
      console.log('🔥 Calling Gemini API for Handlers generation...')
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 6144,
            topP: 0.8,
            topK: 10
          }
        })
      })

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`)
      }

      const data = await response.json()
      const generatedContent = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
      
      if (!generatedContent) {
        throw new Error('Empty response from Gemini API')
      }

      console.log('✅ Gemini API Handlers generation successful')
      return this.extractCodeFromResponse(generatedContent)

    } catch (error) {
      console.warn('⚠️ Gemini API call failed:', error)
      return this.generateEnhancedFallbackHandlers()
    }
  }

  /**
   * レスポンスからTypeScriptコードを抽出
   */
  private extractCodeFromResponse(response: string): string {
    const codeBlockRegex = /```(?:typescript|tsx|ts)?\n([\s\S]*?)\n```/g
    const matches = response.match(codeBlockRegex)
    
    if (matches && matches.length > 0) {
      const code = matches[0].replace(/```(?:typescript|tsx|ts)?\n?/g, '').replace(/\n```$/g, '')
      return code.trim()
    }

    return response.trim()
  }

  /**
   * 高度なフォールバックハンドラ生成
   */
  private generateEnhancedFallbackHandlers(): string {
    return `/**
 * MATURA Generated Event Handlers
 * 自動生成されたイベントハンドラ統合システム
 */

import { useFuyouStore } from '@/store/fuyouStore'

// ===== 型定義 =====

export interface HandlerContext {
  source: string
  timestamp: string
  userId?: string
}

export interface ApiCallOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  timeout?: number
  retries?: number
}

// ===== Core Event Handlers =====

/**
 * 収入更新ハンドラ
 */
export const useIncomeUpdateHandler = () => {
  const { income, updateIncome, calculateRemaining } = useFuyouStore()
  
  return {
    handleIncomeIncrease: (amount: number = 100000) => {
      console.log(\`💰 [Handler] Income increase triggered: +¥\${amount.toLocaleString()}\`)
      
      const newIncome = income + amount
      updateIncome(newIncome)
      calculateRemaining()
      
      console.log(\`📊 [Handler] New income: ¥\${newIncome.toLocaleString()}\`)
      
      // 画面更新をトリガー
      window.dispatchEvent(new CustomEvent('incomeUpdated', { 
        detail: { oldIncome: income, newIncome, increase: amount } 
      }))
    },
    
    handleIncomeDecrease: (amount: number = 50000) => {
      console.log(\`💸 [Handler] Income decrease triggered: -¥\${amount.toLocaleString()}\`)
      
      const newIncome = Math.max(0, income - amount)
      updateIncome(newIncome)
      calculateRemaining()
      
      console.log(\`📊 [Handler] New income: ¥\${newIncome.toLocaleString()}\`)
      
      window.dispatchEvent(new CustomEvent('incomeUpdated', { 
        detail: { oldIncome: income, newIncome, decrease: amount } 
      }))
    },
    
    handleIncomeSet: (newIncome: number) => {
      console.log(\`🎯 [Handler] Income set directly: ¥\${newIncome.toLocaleString()}\`)
      
      updateIncome(newIncome)
      calculateRemaining()
      
      console.log(\`✅ [Handler] Income updated successfully\`)
      
      window.dispatchEvent(new CustomEvent('incomeUpdated', { 
        detail: { oldIncome: income, newIncome, isDirectSet: true } 
      }))
    }
  }
}

/**
 * 扶養者管理ハンドラ
 */
export const useDependentHandler = () => {
  const { 
    dependents, 
    dependentCount, 
    addDependent, 
    removeDependent, 
    updateDependent,
    calculateRemaining 
  } = useFuyouStore()
  
  return {
    handleAddDependent: (dependentData?: any) => {
      console.log('👥 [Handler] Adding new dependent...')
      
      const newDependent = {
        id: Math.random().toString(36).substring(2, 11),
        name: dependentData?.name || \`扶養者\${dependentCount + 1}\`,
        age: dependentData?.age || 20,
        relationship: dependentData?.relationship || '子',
        income: dependentData?.income || 0,
        isSpecialDependent: false,
        createdAt: new Date().toISOString().split('T')[0],
        ...dependentData
      }
      
      addDependent(newDependent)
      calculateRemaining()
      
      console.log(\`✅ [Handler] Dependent added: \${newDependent.name}\`)
      console.log(\`👨‍👩‍👧‍👦 [Handler] Total dependents: \${dependentCount + 1}\`)
      
      // 扶養者追加イベント
      window.dispatchEvent(new CustomEvent('dependentAdded', { 
        detail: { dependent: newDependent, totalCount: dependentCount + 1 } 
      }))
    },
    
    handleRemoveDependent: (dependentId: string) => {
      const dependent = dependents.find(d => d?.id === dependentId)
      if (!dependent) {
        console.warn(\`⚠️ [Handler] Dependent not found: \${dependentId}\`)
        return
      }
      
      console.log(\`🗑️ [Handler] Removing dependent: \${dependent.name}\`)
      
      removeDependent(dependentId)
      calculateRemaining()
      
      console.log(\`✅ [Handler] Dependent removed\`)
      console.log(\`👨‍👩‍👧‍👦 [Handler] Remaining dependents: \${dependentCount - 1}\`)
      
      window.dispatchEvent(new CustomEvent('dependentRemoved', { 
        detail: { dependent, totalCount: dependentCount - 1 } 
      }))
    },
    
    handleQuickAddChild: () => {
      console.log('👶 [Handler] Quick adding child dependent...')
      
      const childData = {
        id: Math.random().toString(36).substring(2, 11),
        name: \`子\${dependents.filter(d => d?.relationship === '子').length + 1}\`,
        age: Math.floor(Math.random() * 18) + 5, // 5-22歳
        relationship: '子' as const,
        income: 0,
        isSpecialDependent: false,
        createdAt: new Date().toISOString().split('T')[0]
      }
      
      addDependent(childData)
      calculateRemaining()
      
      console.log(\`👶 [Handler] Child added: \${childData.name}, Age: \${childData.age}\`)
      
      window.dispatchEvent(new CustomEvent('dependentAdded', { 
        detail: { dependent: childData, type: 'child' } 
      }))
    },
    
    handleQuickAddSpouse: () => {
      // 配偶者がすでにいるかチェック
      if (dependents.some(d => d?.relationship === '配偶者')) {
        console.warn('⚠️ [Handler] Spouse already exists')
        return
      }
      
      console.log('💑 [Handler] Quick adding spouse dependent...')
      
      const spouseData = {
        id: Math.random().toString(36).substring(2, 11),
        name: '配偶者',
        age: 35,
        relationship: '配偶者' as const,
        income: Math.floor(Math.random() * 1000000), // 0-100万円
        isSpecialDependent: false,
        createdAt: new Date().toISOString().split('T')[0]
      }
      
      addDependent(spouseData)
      calculateRemaining()
      
      console.log(\`💑 [Handler] Spouse added: Income ¥\${spouseData.income.toLocaleString()}\`)
      
      window.dispatchEvent(new CustomEvent('dependentAdded', { 
        detail: { dependent: spouseData, type: 'spouse' } 
      }))
    }
  }
}

/**
 * 計算実行ハンドラ
 */
export const useCalculationHandler = () => {
  const { 
    calculateRemaining, 
    performCalculation, 
    clearCalculation,
    currentCalculation,
    isCalculating 
  } = useFuyouStore()
  
  return {
    handleQuickCalculation: () => {
      console.log('⚡ [Handler] Quick calculation triggered...')
      
      calculateRemaining()
      
      console.log('✅ [Handler] Quick calculation completed')
      
      window.dispatchEvent(new CustomEvent('calculationCompleted', { 
        detail: { type: 'quick', timestamp: new Date().toISOString() } 
      }))
    },
    
    handleFullCalculation: async () => {
      console.log('🧮 [Handler] Full calculation with API call...')
      
      try {
        await performCalculation()
        
        console.log('✅ [Handler] Full calculation completed successfully')
        
        window.dispatchEvent(new CustomEvent('calculationCompleted', { 
          detail: { type: 'full', timestamp: new Date().toISOString() } 
        }))
        
      } catch (error) {
        console.error('💥 [Handler] Full calculation failed:', error)
        
        window.dispatchEvent(new CustomEvent('calculationError', { 
          detail: { error: error instanceof Error ? error.message : 'Unknown error' } 
        }))
      }
    },
    
    handleCalculationReset: () => {
      console.log('🔄 [Handler] Calculation reset triggered...')
      
      clearCalculation()
      
      console.log('✅ [Handler] Calculation reset completed')
      
      window.dispatchEvent(new CustomEvent('calculationReset', { 
        detail: { timestamp: new Date().toISOString() } 
      }))
    },
    
    handleRecalculateWithDelay: (delay: number = 2000) => {
      console.log(\`⏰ [Handler] Delayed recalculation scheduled: \${delay}ms\`)
      
      setTimeout(() => {
        console.log('⚡ [Handler] Executing delayed recalculation...')
        calculateRemaining()
        
        window.dispatchEvent(new CustomEvent('calculationCompleted', { 
          detail: { type: 'delayed', delay, timestamp: new Date().toISOString() } 
        }))
      }, delay)
    }
  }
}

/**
 * API統合ハンドラ
 */
export const useAPIHandler = () => {
  const { income, dependentCount, updateIncome } = useFuyouStore()
  
  return {
    handleAPICall: async (endpoint: string = '/api/fuyouCheck', options: ApiCallOptions = {}) => {
      console.log(\`📡 [Handler] API call initiated: \${endpoint}\`)
      
      const { method = 'POST', timeout = 5000, retries = 3 } = options
      
      const payload = {
        income,
        dependentCount,
        timestamp: new Date().toISOString(),
        source: 'handler'
      }
      
      console.log('📤 [Handler] Sending payload:', payload)
      
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeout)
        
        const response = await fetch(endpoint, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        
        if (!response.ok) {
          throw new Error(\`API error: \${response.status} \${response.statusText}\`)
        }
        
        const result = await response.json()
        
        console.log('✅ [Handler] API call successful:', result)
        
        // API結果を反映
        if (result.adjustedIncome && result.adjustedIncome !== income) {
          console.log(\`🔄 [Handler] Updating income from API: ¥\${result.adjustedIncome.toLocaleString()}\`)
          updateIncome(result.adjustedIncome)
        }
        
        window.dispatchEvent(new CustomEvent('apiCallCompleted', { 
          detail: { endpoint, result, success: true } 
        }))
        
        return result
        
      } catch (error) {
        console.error('💥 [Handler] API call failed:', error)
        
        window.dispatchEvent(new CustomEvent('apiCallError', { 
          detail: { endpoint, error: error instanceof Error ? error.message : 'Unknown error' } 
        }))
        
        throw error
      }
    },
    
    handleMockAPICall: async () => {
      console.log('🎭 [Handler] Mock API call for testing...')
      
      // モックレスポンス生成
      const mockDelay = Math.random() * 1000 + 500 // 500-1500ms
      
      await new Promise(resolve => setTimeout(resolve, mockDelay))
      
      const mockResult = {
        success: true,
        adjustedIncome: income * (0.95 + Math.random() * 0.1), // ±5%調整
        deductionSuggestions: [
          '医療費控除の検討',
          'ふるさと納税の活用',
          '個人型確定拠出年金（iDeCo）の利用'
        ],
        calculatedAt: new Date().toISOString()
      }
      
      console.log('✅ [Handler] Mock API call completed:', mockResult)
      
      if (mockResult.adjustedIncome !== income) {
        updateIncome(mockResult.adjustedIncome)
      }
      
      window.dispatchEvent(new CustomEvent('apiCallCompleted', { 
        detail: { endpoint: 'mock', result: mockResult, success: true } 
      }))
      
      return mockResult
    }
  }
}

/**
 * UI統合ハンドラ
 */
export const useUIHandler = () => {
  const { remainingLimit, currentCalculation } = useFuyouStore()
  
  return {
    handleDisplayUpdate: () => {
      console.log('📺 [Handler] Updating display elements...')
      
      // 残り控除額の表示更新
      const limitElements = document.querySelectorAll('[data-remaining-limit]')
      limitElements.forEach(element => {
        element.textContent = \`¥\${remainingLimit.toLocaleString()}\`
      })
      
      // 計算結果の表示更新
      if (currentCalculation) {
        const taxElements = document.querySelectorAll('[data-estimated-tax]')
        taxElements.forEach(element => {
          element.textContent = \`¥\${currentCalculation.estimatedTax.toLocaleString()}\`
        })
      }
      
      console.log('✅ [Handler] Display updated')
    },
    
    handleProgressAnimation: (duration: number = 2000) => {
      console.log(\`🎨 [Handler] Starting progress animation: \${duration}ms\`)
      
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        
        // プログレスバー更新
        const progressBars = document.querySelectorAll('[data-progress]')
        progressBars.forEach(bar => {
          const progressElement = bar as HTMLElement
          progressElement.style.width = \`\${progress}%\`
        })
        
        console.log(\`🎭 [Handler] Animation progress: \${progress}%\`)
        
        if (progress >= 100) {
          clearInterval(interval)
          console.log('✅ [Handler] Animation completed')
          
          window.dispatchEvent(new CustomEvent('animationCompleted', { 
            detail: { duration, type: 'progress' } 
          }))
        }
      }, duration / 10)
    },
    
    handleNotification: (message: string, type: 'success' | 'warning' | 'error' = 'success') => {
      console.log(\`📢 [Handler] Showing notification: [\${type.toUpperCase()}] \${message}\`)
      
      // 通知要素を作成
      const notification = document.createElement('div')
      notification.className = \`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 \${
        type === 'success' ? 'bg-green-500 text-white' :
        type === 'warning' ? 'bg-yellow-500 text-black' :
        'bg-red-500 text-white'
      }\`
      notification.textContent = message
      
      document.body.appendChild(notification)
      
      // 3秒後に削除
      setTimeout(() => {
        notification.remove()
        console.log('📢 [Handler] Notification removed')
      }, 3000)
      
      window.dispatchEvent(new CustomEvent('notificationShown', { 
        detail: { message, type } 
      }))
    }
  }
}

/**
 * 統合イベントハンドラシステム
 */
export const useMasterHandler = () => {
  const incomeHandlers = useIncomeUpdateHandler()
  const dependentHandlers = useDependentHandler()
  const calculationHandlers = useCalculationHandler()
  const apiHandlers = useAPIHandler()
  const uiHandlers = useUIHandler()
  
  return {
    // すべてのハンドラを統合
    ...incomeHandlers,
    ...dependentHandlers,
    ...calculationHandlers,
    ...apiHandlers,
    ...uiHandlers,
    
    // マスターアクション
    handleMasterUpdate: async () => {
      console.log('🌟 [Master Handler] Executing complete update cycle...')
      
      try {
        // 1. 計算実行
        calculationHandlers.handleQuickCalculation()
        
        // 2. API呼び出し
        await apiHandlers.handleMockAPICall()
        
        // 3. UI更新
        uiHandlers.handleDisplayUpdate()
        
        // 4. アニメーション
        uiHandlers.handleProgressAnimation(1500)
        
        // 5. 成功通知
        setTimeout(() => {
          uiHandlers.handleNotification('更新が完了しました！', 'success')
        }, 1600)
        
        console.log('✅ [Master Handler] Complete update cycle finished')
        
      } catch (error) {
        console.error('💥 [Master Handler] Update cycle failed:', error)
        uiHandlers.handleNotification('更新中にエラーが発生しました', 'error')
      }
    },
    
    handleResetAll: () => {
      console.log('🔄 [Master Handler] Resetting all data...')
      
      calculationHandlers.handleCalculationReset()
      uiHandlers.handleDisplayUpdate()
      uiHandlers.handleNotification('データをリセットしました', 'success')
      
      console.log('✅ [Master Handler] Reset completed')
    }
  }
}

/**
 * ページ初期化時のイベントリスナー設定
 */
export const setupEventListeners = () => {
  console.log('👂 [Handlers] Setting up global event listeners...')
  
  // カスタムイベントリスナー
  window.addEventListener('incomeUpdated', (event: any) => {
    console.log('📊 [Event] Income updated:', event.detail)
  })
  
  window.addEventListener('dependentAdded', (event: any) => {
    console.log('👥 [Event] Dependent added:', event.detail)
  })
  
  window.addEventListener('calculationCompleted', (event: any) => {
    console.log('🧮 [Event] Calculation completed:', event.detail)
  })
  
  window.addEventListener('apiCallCompleted', (event: any) => {
    console.log('📡 [Event] API call completed:', event.detail)
  })
  
  // エラーハンドリング
  window.addEventListener('apiCallError', (event: any) => {
    console.error('💥 [Event] API call error:', event.detail)
  })
  
  window.addEventListener('calculationError', (event: any) => {
    console.error('💥 [Event] Calculation error:', event.detail)
  })
  
  console.log('✅ [Handlers] Event listeners setup completed')
}

// デフォルトエクスポート
export default {
  useIncomeUpdateHandler,
  useDependentHandler,
  useCalculationHandler,
  useAPIHandler,
  useUIHandler,
  useMasterHandler,
  setupEventListeners
}`
  }

  /**
   * ハンドラ生成プロンプトを構築
   */
  private buildHandlerPrompt(appIdea: string, options: HandlerGenerationOptions): string {
    const { handlerTypes = [], integrationMode = 'generate' } = options

    return `
Generate a comprehensive event handler system for the following application:

APPLICATION IDEA: ${appIdea}

REQUIREMENTS:
1. Create custom hooks for different handler categories based on the app idea
2. Each handler must integrate with the appropriate store
3. Include console.log statements with emoji prefixes for all actions
4. Implement real functionality (not just mock functions)
5. Include TypeScript interfaces and proper typing

DYNAMIC HANDLER CATEGORIES:
- Analyze the application idea and create appropriate handler categories
- Create CRUD operation handlers for main entities
- Add UI interaction handlers
- Include API/async operation handlers
- Create state management handlers
- Add a master handler that combines operations

CORE FUNCTIONALITY:
- Each handler must call appropriate store actions
- Update UI elements in real-time
- Make API calls to appropriate endpoints
- Include error handling and loading states
- Trigger custom DOM events for integration
- Include animations and notifications where appropriate

ADVANCED FEATURES:
- Delayed recalculation with setTimeout
- Progress bar animations
- Toast notifications with auto-removal
- Custom event dispatching and listening
- Timeout handling for API calls
- Retry logic for failed operations

INTEGRATION REQUIREMENTS:
- Setup global event listeners function
- DOM element updates using data attributes
- Window custom events for cross-component communication
- Proper TypeScript typing throughout
- Production-ready error handling

CONSOLE LOGGING:
- Every action must log with descriptive emoji prefixes
- Include parameter values and results
- Log API call payloads and responses
- Track timing for delayed operations

OUTPUT REQUIREMENTS:
- Return ONLY the complete TypeScript handler code
- Include all necessary imports and types
- Add comprehensive JSDoc comments
- Export all handlers and setup functions
- Make it production-ready

Generate the complete event handler system now:
`
  }

  /**
   * ハンドラ生成メイン実行関数
   */
  async generateHandlers(options: HandlerGenerationOptions): Promise<string> {
    console.log('🚀 Starting Handlers generation...')
    console.log(`📋 Options: ${JSON.stringify(options)}`)
    console.log(`💡 App Idea: ${options.appIdea}`)

    try {
      // プロンプト構築
      const prompt = this.buildHandlerPrompt(options.appIdea, options)
      
      // Gemini API呼び出し
      const generatedCode = await this.callGeminiAPI(prompt)
      
      // ファイル保存
      const outputPath = this.saveGeneratedHandlers(generatedCode)
      
      // 既存UIファイルへの統合
      if (options.integrationMode === 'patch') {
        await this.integrateHandlersIntoUI()
      }
      
      console.log('✅ Handlers generation completed successfully!')
      console.log(`📁 Generated file: ${outputPath}`)
      
      return outputPath

    } catch (error) {
      console.error('💥 Handlers generation failed:', error)
      throw error
    }
  }

  /**
   * 生成されたハンドラをファイルに保存
   */
  private saveGeneratedHandlers(code: string): string {
    const outputDir = join(this.projectRoot, 'lib', 'handlers')
    const outputPath = join(outputDir, 'eventHandlers.ts')

    // ディレクトリ確認・作成
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true })
    }

    // ファイル保存
    writeFileSync(outputPath, code, 'utf8')
    
    console.log(`💾 Saved generated Handlers to: ${outputPath}`)
    return outputPath
  }

  /**
   * 既存UIファイルにハンドラを統合
   */
  private async integrateHandlersIntoUI(): Promise<void> {
    console.log('🔗 Integrating handlers into existing UI...')
    
    try {
      const uiFilePath = join(this.projectRoot, 'app', 'GeneratedUI.tsx')
      
      if (!existsSync(uiFilePath)) {
        console.warn('⚠️ UI file not found, skipping integration')
        return
      }

      const content = readFileSync(uiFilePath, 'utf8')
      
      // ハンドラインポートを追加
      const importStatement = "import { useMasterHandler, setupEventListeners } from '@/lib/handlers/eventHandlers'"
      
      // useEffect追加でイベントリスナー設定
      const useEffectStatement = `
  // Event listeners setup
  React.useEffect(() => {
    setupEventListeners()
  }, [])`

      // ハンドラフック追加
      const handlerHook = `
  // Master handlers
  const masterHandlers = useMasterHandler()`

      // インポート追加
      let updatedContent = content.replace(
        /import.*from.*$/m,
        match => `${match}\n${importStatement}`
      )

      // ハンドラフック追加
      updatedContent = updatedContent.replace(
        /const { [^}]+ } = useFuyouStore\(\)/,
        match => `${match}\n${handlerHook}\n${useEffectStatement}`
      )

      // ファイル更新
      writeFileSync(uiFilePath, updatedContent, 'utf8')
      
      console.log('✅ Handlers integrated into UI successfully')

    } catch (error) {
      console.warn('⚠️ Handler integration failed:', error)
    }
  }

  /**
   * 生成結果の検証
   */
  async validateGeneratedHandlers(filePath: string): Promise<boolean> {
    try {
      console.log('🔍 Validating generated Handlers...')
      
      if (!existsSync(filePath)) {
        throw new Error(`Generated file not found: ${filePath}`)
      }

      const content = readFileSync(filePath, 'utf8')
      
      const requiredElements = [
        'useIncomeUpdateHandler',
        'useDependentHandler',
        'useCalculationHandler',
        'useAPIHandler',
        'useMasterHandler',
        'console.log',
        'useFuyouStore',
        'setupEventListeners'
      ]

      const missingElements = requiredElements.filter(element => !content.includes(element))
      
      if (missingElements.length > 0) {
        console.warn('⚠️ Handlers validation warnings:', missingElements)
      } else {
        console.log('✅ Handlers validation passed')
      }

      return missingElements.length === 0

    } catch (error) {
      console.error('💥 Handlers validation failed:', error)
      return false
    }
  }
}

/**
 * エクスポート関数
 */
export async function generateHandlers(options: HandlerGenerationOptions): Promise<string> {
  const generator = new HandlersGenerator()
  return await generator.generateHandlers(options)
}

export default HandlersGenerator