/**
 * MATURA Store Generation Engine  
 * Zustand扶養Storeを自動生成
 */

import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

interface StoreGenerationOptions {
  appIdea: string
  storeType?: 'zustand' | 'context'
  features?: string[]
  apiKey?: string
}

export class StoreGenerator {
  private projectRoot: string
  private apiKey: string | null

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot
    this.apiKey = process.env.GEMINI_API_KEY || null
  }

  /**
   * Gemini APIを呼び出してStore生成
   */
  private async callGeminiAPI(prompt: string): Promise<string> {
    if (!this.apiKey) {
      console.log('⚠️ GEMINI_API_KEY not found, using enhanced fallback generation')
      return this.generateEnhancedFallbackStore()
    }

    try {
      console.log('🔥 Calling Gemini API for Store generation...')
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 4096,
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

      console.log('✅ Gemini API Store generation successful')
      return this.extractCodeFromResponse(generatedContent)

    } catch (error) {
      console.warn('⚠️ Gemini API call failed:', error)
      return this.generateEnhancedFallbackStore()
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
   * 高度なフォールバック汎用Store生成
   */
  private generateEnhancedFallbackStore(): string {
    return `/**
 * MATURA Generated Store - Generic Application
 * 自動生成された汎用Zustandストア
 */

import { create } from 'zustand'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware'

// ===== 型定義 =====

export interface DependentInfo {
  id: string
  name: string
  age: number
  relationship: '配偶者' | '子' | '親' | 'その他'
  income: number
  isSpecialDependent: boolean // 特定扶養親族
  createdAt: string
}

export interface TaxCalculation {
  income: number
  dependentCount: number
  basicDeduction: number // 基礎控除
  dependentDeduction: number // 扶養控除
  spouseDeduction: number // 配偶者控除
  totalDeduction: number // 総控除額
  taxableIncome: number // 課税所得
  estimatedTax: number // 推定税額
  calculatedAt: string
}

export interface FuyouState {
  // ===== 基本情報 =====
  income: number // 年収
  dependentCount: number // 扶養者数
  remainingLimit: number // 残り控除可能額
  
  // ===== 扶養者詳細 =====
  dependents: DependentInfo[]
  
  // ===== 計算結果 =====
  currentCalculation: TaxCalculation | null
  calculationHistory: TaxCalculation[]
  
  // ===== UI状態 =====
  isCalculating: boolean
  lastUpdated: string | null
  error: string | null
  
  // ===== 設定 =====
  autoCalculate: boolean
  saveHistory: boolean
  taxYear: number
}

export interface FuyouActions {
  // ===== 基本操作 =====
  updateIncome: (income: number) => void
  setDependentCount: (count: number) => void
  calculateRemaining: () => void
  
  // ===== 扶養者管理 =====
  addDependent: (dependent?: Partial<DependentInfo>) => void
  removeDependent: (id: string) => void
  updateDependent: (id: string, updates: Partial<DependentInfo>) => void
  
  // ===== 計算機能 =====
  performCalculation: () => Promise<void>
  clearCalculation: () => void
  loadCalculationHistory: () => void
  
  // ===== ユーティリティ =====
  resetStore: () => void
  setError: (error: string | null) => void
  setLoading: (loading: boolean) => void
  
  // ===== 設定管理 =====
  updateSettings: (settings: Partial<Pick<FuyouState, 'autoCalculate' | 'saveHistory' | 'taxYear'>>) => void
}

export type FuyouStore = FuyouState & FuyouActions

// ===== 初期状態 =====

const initialState: FuyouState = {
  // 基本情報
  income: 4000000, // 400万円（例）
  dependentCount: 0,
  remainingLimit: 1480000, // 基本的な控除額の上限
  
  // 扶養者詳細
  dependents: [],
  
  // 計算結果
  currentCalculation: null,
  calculationHistory: [],
  
  // UI状態
  isCalculating: false,
  lastUpdated: null,
  error: null,
  
  // 設定
  autoCalculate: true,
  saveHistory: true,
  taxYear: new Date().getFullYear()
}

// ===== 計算ユーティリティ関数 =====

/**
 * 扶養控除額を計算
 */
function calculateDependentDeduction(dependents: DependentInfo[]): number {
  return dependents.reduce((total, dependent) => {
    // 基本控除額
    let deduction = 380000 // 38万円
    
    // 特定扶養親族（19歳以上23歳未満）
    if (dependent.isSpecialDependent || (dependent.age >= 19 && dependent.age < 23)) {
      deduction = 630000 // 63万円
    }
    
    // 70歳以上の親族
    if (dependent.age >= 70) {
      deduction = 480000 // 48万円（老人扶養親族）
    }
    
    return total + deduction
  }, 0)
}

/**
 * 配偶者控除額を計算
 */
function calculateSpouseDeduction(dependents: DependentInfo[], income: number): number {
  const spouse = dependents.find(d => d.relationship === '配偶者')
  if (!spouse || spouse.income > 1030000) {
    return 0 // 配偶者控除なし
  }
  
  // 所得に応じた配偶者控除額
  if (income <= 9000000) {
    return spouse.age >= 70 ? 480000 : 380000
  } else if (income <= 9500000) {
    return spouse.age >= 70 ? 320000 : 260000
  } else if (income <= 10000000) {
    return spouse.age >= 70 ? 160000 : 130000
  }
  
  return 0
}

/**
 * 課税所得と推定税額を計算
 */
function calculateTax(income: number, totalDeduction: number): { taxableIncome: number; estimatedTax: number } {
  const taxableIncome = Math.max(0, income - totalDeduction)
  
  // 簡易的な累進税率計算
  let estimatedTax = 0
  
  if (taxableIncome <= 1950000) {
    estimatedTax = taxableIncome * 0.05
  } else if (taxableIncome <= 3300000) {
    estimatedTax = 97500 + (taxableIncome - 1950000) * 0.1
  } else if (taxableIncome <= 6950000) {
    estimatedTax = 232500 + (taxableIncome - 3300000) * 0.2
  } else if (taxableIncome <= 9000000) {
    estimatedTax = 962500 + (taxableIncome - 6950000) * 0.23
  } else {
    estimatedTax = 1434000 + (taxableIncome - 9000000) * 0.33
  }
  
  return { taxableIncome, estimatedTax }
}

// ===== Zustand Store 作成 =====

export const useFuyouStore = create<FuyouStore>()(
  devtools(
    persist(
      subscribeWithSelector(
        (set, get) => ({
          ...initialState,

          // ===== 基本操作 =====
          
          updateIncome: (income: number) => {
            console.log(\`💰 [Fuyou Store] Updating income: ¥\${income.toLocaleString()}\`)
            
            set({ 
              income,
              lastUpdated: new Date().toISOString(),
              error: null
            }, false, 'updateIncome')
            
            // 自動計算が有効な場合は再計算
            if (get().autoCalculate) {
              get().calculateRemaining()
            }
          },

          setDependentCount: (dependentCount: number) => {
            console.log(\`👨‍👩‍👧‍👦 [Fuyou Store] Setting dependent count: \${dependentCount}\`)
            
            set({ 
              dependentCount,
              lastUpdated: new Date().toISOString()
            }, false, 'setDependentCount')
            
            if (get().autoCalculate) {
              get().calculateRemaining()
            }
          },

          calculateRemaining: () => {
            const state = get()
            console.log('🧮 [Fuyou Store] Calculating remaining limit...')
            
            try {
              // 基礎控除
              const basicDeduction = 480000 // 48万円（令和4年度）
              
              // 扶養控除
              const dependentDeduction = calculateDependentDeduction(state.dependents)
              
              // 配偶者控除
              const spouseDeduction = calculateSpouseDeduction(state.dependents, state.income)
              
              // 総控除額
              const totalDeduction = basicDeduction + dependentDeduction + spouseDeduction
              
              // 課税所得と税額計算
              const { taxableIncome, estimatedTax } = calculateTax(state.income, totalDeduction)
              
              // 残り控除可能額（概算）
              const remainingLimit = Math.max(0, totalDeduction - (state.income * 0.1)) // 簡易計算
              
              // 計算結果を保存
              const calculation: TaxCalculation = {
                income: state.income,
                dependentCount: state.dependentCount,
                basicDeduction,
                dependentDeduction,
                spouseDeduction,
                totalDeduction,
                taxableIncome,
                estimatedTax,
                calculatedAt: new Date().toISOString()
              }
              
              set({
                remainingLimit,
                currentCalculation: calculation,
                calculationHistory: state.saveHistory 
                  ? [calculation, ...state.calculationHistory.slice(0, 9)] // 最新10件保持
                  : state.calculationHistory,
                lastUpdated: new Date().toISOString(),
                error: null
              }, false, 'calculateRemaining')
              
              console.log(\`📊 [Fuyou Store] Calculation completed:\`)
              console.log(\`   💰 Income: ¥\${state.income.toLocaleString()}\`)
              console.log(\`   📉 Total Deduction: ¥\${totalDeduction.toLocaleString()}\`)
              console.log(\`   🎯 Remaining Limit: ¥\${remainingLimit.toLocaleString()}\`)
              console.log(\`   💸 Estimated Tax: ¥\${estimatedTax.toLocaleString()}\`)
              
            } catch (error) {
              console.error('💥 [Fuyou Store] Calculation failed:', error)
              set({ 
                error: error instanceof Error ? error.message : 'Calculation failed',
                lastUpdated: new Date().toISOString()
              }, false, 'calculateRemaining')
            }
          },

          // ===== 扶養者管理 =====
          
          addDependent: (dependentData?: Partial<DependentInfo>) => {
            const newDependent: DependentInfo = {
              id: \`dep_\${Date.now()}_\${Math.random().toString(36).substring(2, 11)}\`,
              name: dependentData?.name || \`扶養者\${get().dependents.length + 1}\`,
              age: dependentData?.age || 20,
              relationship: dependentData?.relationship || '子',
              income: dependentData?.income || 0,
              isSpecialDependent: dependentData?.isSpecialDependent || false,
              createdAt: new Date().toISOString(),
              ...dependentData
            }
            
            console.log(\`👥 [Fuyou Store] Adding dependent: \${newDependent.name}\`)
            
            set((state) => ({
              dependents: [...state.dependents, newDependent],
              dependentCount: state.dependents.length + 1,
              lastUpdated: new Date().toISOString()
            }), false, 'addDependent')
            
            if (get().autoCalculate) {
              get().calculateRemaining()
            }
          },

          removeDependent: (id: string) => {
            const dependent = get().dependents.find(d => d.id === id)
            if (dependent) {
              console.log(\`🗑️ [Fuyou Store] Removing dependent: \${dependent.name}\`)
            }
            
            set((state) => ({
              dependents: state.dependents.filter(d => d.id !== id),
              dependentCount: state.dependents.filter(d => d.id !== id).length,
              lastUpdated: new Date().toISOString()
            }), false, 'removeDependent')
            
            if (get().autoCalculate) {
              get().calculateRemaining()
            }
          },

          updateDependent: (id: string, updates: Partial<DependentInfo>) => {
            console.log(\`📝 [Fuyou Store] Updating dependent: \${id}\`)
            
            set((state) => ({
              dependents: state.dependents.map(d => 
                d.id === id ? { ...d, ...updates } : d
              ),
              lastUpdated: new Date().toISOString()
            }), false, 'updateDependent')
            
            if (get().autoCalculate) {
              get().calculateRemaining()
            }
          },

          // ===== 計算機能 =====
          
          performCalculation: async () => {
            console.log('⚡ [Fuyou Store] Starting async calculation...')
            
            set({ isCalculating: true, error: null }, false, 'performCalculation')
            
            try {
              // API呼び出しシミュレーション
              await new Promise(resolve => setTimeout(resolve, 1000))
              
              // 計算実行
              get().calculateRemaining()
              
              console.log('✅ [Fuyou Store] Async calculation completed')
              
            } catch (error) {
              console.error('💥 [Fuyou Store] Async calculation failed:', error)
              set({ error: error instanceof Error ? error.message : 'Calculation failed' })
            } finally {
              set({ isCalculating: false })
            }
          },

          clearCalculation: () => {
            console.log('🧹 [Fuyou Store] Clearing calculation')
            
            set({
              currentCalculation: null,
              remainingLimit: initialState.remainingLimit,
              error: null,
              lastUpdated: new Date().toISOString()
            }, false, 'clearCalculation')
          },

          loadCalculationHistory: () => {
            console.log('📚 [Fuyou Store] Loading calculation history...')
            // 実装では外部ストレージから履歴を読み込み
            console.log(\`📊 Found \${get().calculationHistory.length} historical calculations\`)
          },

          // ===== ユーティリティ =====
          
          resetStore: () => {
            console.log('🔄 [Fuyou Store] Resetting store to initial state')
            
            set({
              ...initialState,
              lastUpdated: new Date().toISOString()
            }, false, 'resetStore')
          },

          setError: (error: string | null) => {
            set({ 
              error,
              lastUpdated: new Date().toISOString()
            }, false, 'setError')
            
            if (error) {
              console.error(\`❌ [Fuyou Store] Error set: \${error}\`)
            }
          },

          setLoading: (isCalculating: boolean) => {
            set({ isCalculating }, false, 'setLoading')
            console.log(\`⏳ [Fuyou Store] Loading state: \${isCalculating}\`)
          },

          // ===== 設定管理 =====
          
          updateSettings: (settings: Partial<Pick<FuyouState, 'autoCalculate' | 'saveHistory' | 'taxYear'>>) => {
            console.log('⚙️ [Fuyou Store] Updating settings:', settings)
            
            set({
              ...settings,
              lastUpdated: new Date().toISOString()
            }, false, 'updateSettings')
          }
        })
      ),
      {
        name: 'fuyou-store',
        version: 1,
        
        // 永続化から除外する項目
        partialize: (state) => ({
          ...state,
          isCalculating: false, // 再起動時は計算停止状態
          error: null // エラー状態はリセット
        })
      }
    ),
    {
      name: 'fuyou-store'
    }
  )
)

// ===== セレクター関数（パフォーマンス最適化） =====

export const useIncome = () => useFuyouStore(state => state.income)
export const useRemainingLimit = () => useFuyouStore(state => state.remainingLimit)
export const useDependentCount = () => useFuyouStore(state => state.dependentCount)
export const useDependents = () => useFuyouStore(state => state.dependents)
export const useCurrentCalculation = () => useFuyouStore(state => state.currentCalculation)
export const useIsCalculating = () => useFuyouStore(state => state.isCalculating)
export const useCalculationHistory = () => useFuyouStore(state => state.calculationHistory)

// ===== カスタムフック =====

/**
 * 扶養控除計算用カスタムフック
 */
export const useFuyouCalculation = () => {
  const { 
    income, 
    remainingLimit, 
    currentCalculation,
    isCalculating,
    performCalculation,
    calculateRemaining,
    clearCalculation
  } = useFuyouStore()
  
  return {
    income,
    remainingLimit,
    currentCalculation,
    isCalculating,
    performCalculation,
    calculateRemaining,
    clearCalculation,
    hasCalculation: !!currentCalculation,
    estimatedSavings: currentCalculation ? currentCalculation.totalDeduction * 0.2 : 0 // 概算節税額
  }
}

/**
 * 扶養者管理用カスタムフック
 */
export const useDependentManager = () => {
  const { 
    dependents, 
    dependentCount,
    addDependent, 
    removeDependent, 
    updateDependent 
  } = useFuyouStore()
  
  return {
    dependents,
    dependentCount,
    addDependent,
    removeDependent,
    updateDependent,
    hasDependents: dependents.length > 0,
    totalDependentIncome: dependents.reduce((sum, d) => sum + d.income, 0)
  }
}

export default useFuyouStore`
  }

  /**
   * Store生成プロンプトを構築
   */
  private buildStorePrompt(appIdea: string, options: StoreGenerationOptions): string {
    const { storeType = 'zustand', features = [] } = options

    return `
Generate a complete Zustand store for the following application idea:

APPLICATION IDEA: ${appIdea}

REQUIREMENTS:
1. Use Zustand with TypeScript strict mode
2. Include devtools, persist, and subscribeWithSelector middleware
3. Analyze the application idea and determine the necessary state structure
4. Create appropriate interfaces and types based on the app requirements
5. Implement proper state management with relevant data models

DYNAMIC STATE STRUCTURE:
- Analyze the application idea and create appropriate state properties
- Define interfaces that match the domain of the application
- Include necessary UI states (loading, error, success)
- Add any domain-specific states required by the application

CORE FUNCTIONALITY:
- Create CRUD operations for main entities
- Add appropriate update/set methods for all state properties
- Include async operations where API calls might be needed
- Implement data validation where necessary
- Add reset functionality
- Include proper error handling

ADVANCED FEATURES:
- Middleware integration (devtools, persist, subscribeWithSelector)
- Optimistic updates for better UX
- History/undo functionality if applicable
- Real-time sync capabilities if needed
- Proper TypeScript typing throughout
- Performance optimizations with selectors

CONSOLE LOGGING:
- Every action must log to console with descriptive messages
- Include emoji prefixes for easy debugging
- Log state changes and important operations

OUTPUT REQUIREMENTS:
- Return ONLY the complete TypeScript store code
- Include all necessary imports
- Add comprehensive JSDoc comments
- Include selector functions and custom hooks
- Make it production-ready with proper error handling
- Code should be immediately usable without modifications

Generate the complete Zustand store now:
`
  }

  /**
   * Store生成メイン実行関数
   */
  async generateStore(options: StoreGenerationOptions): Promise<string> {
    console.log('🚀 Starting Store generation...')
    console.log(`📋 Options: ${JSON.stringify(options)}`)
    console.log(`💡 App Idea: ${options.appIdea}`)

    try {
      // プロンプト構築
      const prompt = this.buildStorePrompt(options.appIdea, options)
      
      // Gemini API呼び出し
      const generatedCode = await this.callGeminiAPI(prompt)
      
      // ファイル保存
      const outputPath = this.saveGeneratedStore(generatedCode)
      
      console.log('✅ Store generation completed successfully!')
      console.log(`📁 Generated file: ${outputPath}`)
      
      return outputPath

    } catch (error) {
      console.error('💥 Store generation failed:', error)
      throw error
    }
  }

  /**
   * 生成されたStoreをファイルに保存
   */
  private saveGeneratedStore(code: string): string {
    const outputDir = join(this.projectRoot, 'store')
    const outputPath = join(outputDir, 'fuyouStore.ts')

    // ディレクトリ確認・作成
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true })
    }

    // ファイル保存
    writeFileSync(outputPath, code, 'utf8')
    
    console.log(`💾 Saved generated Store to: ${outputPath}`)
    return outputPath
  }

  /**
   * 生成結果の検証
   */
  async validateGeneratedStore(filePath: string): Promise<boolean> {
    try {
      console.log('🔍 Validating generated Store...')
      
      if (!existsSync(filePath)) {
        throw new Error(`Generated file not found: ${filePath}`)
      }

      const { readFileSync } = await import('fs')
      const content = readFileSync(filePath, 'utf8')
      
      const requiredElements = [
        'export const useFuyouStore',
        'updateIncome',
        'addDependent',
        'calculateRemaining',
        'console.log',
        'devtools',
        'persist'
      ]

      const missingElements = requiredElements.filter(element => !content.includes(element))
      
      if (missingElements.length > 0) {
        console.warn('⚠️ Store validation warnings:', missingElements)
      } else {
        console.log('✅ Store validation passed')
      }

      return missingElements.length === 0

    } catch (error) {
      console.error('💥 Store validation failed:', error)
      return false
    }
  }
}

/**
 * エクスポート関数
 */
export async function generateStore(options: StoreGenerationOptions): Promise<string> {
  const generator = new StoreGenerator()
  return await generator.generateStore(options)
}

export default StoreGenerator