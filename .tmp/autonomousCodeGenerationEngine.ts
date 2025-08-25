/**
 * MATURA Autonomous Code Generation Engine
 * 
 * 完全自律型コード生成エンジン - ユーザー確認なしで最適なアプリケーションを生成
 */

import { execSync } from 'child_process'
import { writeFileSync, readFileSync, existsSync, mkdirSync, readdirSync } from 'fs'
import { join } from 'path'

export interface ServiceRequirement {
  domain: string
  vision: string
  userStories: string[]
  technicalRequirements: {
    frontend: string[]
    backend: string[]
    database: string[]
    external: string[]
  }
  qualityRequirements: {
    performance: string[]
    security: string[]
    accessibility: string[]
    maintainability: string[]
  }
}

export interface GenerationPhaseConfig {
  phase: string
  description: string
  dependencies: string[]
  outputs: string[]
  estimatedTime: number // minutes
  retryLimit: number
}

export interface CodeGenerationResult {
  success: boolean
  generatedFiles: string[]
  errors: string[]
  warnings: string[]
  metrics: {
    totalFiles: number
    totalLines: number
    testsGenerated: number
    componentsGenerated: number
    duration: number
  }
}

export class AutonomousCodeGenerationEngine {
  private projectRoot: string
  private serviceRequirement: ServiceRequirement
  private phases: GenerationPhaseConfig[]
  private generatedFiles: string[] = []
  private errors: string[] = []
  private warnings: string[] = []

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot
    this.serviceRequirement = this.analyzeAndStructureRequirements()
    this.phases = this.designGenerationPhases()
  }

  /**
   * 1️⃣ サービス要件の自動解析と構造化
   */
  private analyzeAndStructureRequirements(): ServiceRequirement {
    console.log('📋 Analyzing and structuring service requirements...')

    // 既存プロジェクトの解析
    const packageJson = this.readPackageJson()
    const existingFiles = this.scanExistingFiles()
    
    // インテリジェントな要件推定
    const requirement: ServiceRequirement = {
      domain: this.inferDomain(packageJson, existingFiles),
      vision: this.inferVision(packageJson, existingFiles),
      userStories: this.generateUserStories(),
      technicalRequirements: {
        frontend: [
          'Next.js 14 App Router',
          'TypeScript strict mode',
          'shadcn/ui component library',
          'Tailwind CSS v3.4+',
          'Lucide React icons',
          'React Hook Form + Zod validation'
        ],
        backend: [
          'Next.js API Routes',
          'Server Actions',
          'Edge Runtime support',
          'Type-safe API layer'
        ],
        database: [
          'Local Storage for persistence',
          'JSON data structures',
          'Type-safe data models'
        ],
        external: [
          'Vercel deployment',
          'Environment variable support',
          'Analytics ready'
        ]
      },
      qualityRequirements: {
        performance: [
          'Page load time < 2 seconds',
          'Core Web Vitals optimization',
          'Code splitting and lazy loading',
          'Image optimization'
        ],
        security: [
          'Input validation and sanitization',
          'XSS protection',
          'CSRF protection',
          'Secure data handling'
        ],
        accessibility: [
          'WCAG 2.1 AA compliance',
          'Keyboard navigation',
          'Screen reader support',
          'High contrast support'
        ],
        maintainability: [
          'TypeScript strict mode',
          'ESLint + Prettier',
          'Component testing',
          'Documentation generation'
        ]
      }
    }

    console.log(`✅ Service requirement structured for domain: ${requirement.domain}`)
    return requirement
  }

  /**
   * 2️⃣ コード生成フェーズの段階設計
   */
  private designGenerationPhases(): GenerationPhaseConfig[] {
    console.log('🏗️ Designing code generation phases...')

    const phases: GenerationPhaseConfig[] = [
      {
        phase: 'Foundation Setup',
        description: 'Project structure, dependencies, and configuration',
        dependencies: [],
        outputs: [
          'package.json updates',
          'tsconfig.json optimization',
          'tailwind.config.ts',
          'components.json',
          '.eslintrc.json',
          'prettier.config.js'
        ],
        estimatedTime: 5,
        retryLimit: 2
      },
      {
        phase: 'UI Component Architecture',
        description: 'shadcn/ui based component system with Tailwind',
        dependencies: ['Foundation Setup'],
        outputs: [
          'components/ui/enhanced components',
          'lib/utils.ts',
          'app/globals.css',
          'components/layout/AppLayout.tsx',
          'components/common/LoadingSpinner.tsx',
          'components/common/ErrorBoundary.tsx'
        ],
        estimatedTime: 15,
        retryLimit: 3
      },
      {
        phase: 'State Management System',
        description: 'Zustand-based state management with persistence',
        dependencies: ['UI Component Architecture'],
        outputs: [
          'lib/store/index.ts',
          'lib/store/slices/*.ts',
          'lib/types/index.ts',
          'hooks/useStore.ts',
          'hooks/usePersistence.ts'
        ],
        estimatedTime: 20,
        retryLimit: 3
      },
      {
        phase: 'Core Application Logic',
        description: 'Main application features and business logic',
        dependencies: ['State Management System'],
        outputs: [
          'app/dashboard/page.tsx',
          'app/features/*/page.tsx',
          'components/features/*.tsx',
          'lib/services/dataService.ts',
          'lib/utils/validation.ts'
        ],
        estimatedTime: 30,
        retryLimit: 3
      },
      {
        phase: 'API Integration Layer',
        description: 'API routes, data fetching, and external integrations',
        dependencies: ['Core Application Logic'],
        outputs: [
          'app/api/*/route.ts',
          'lib/api/client.ts',
          'lib/api/types.ts',
          'lib/hooks/useAPI.ts',
          'middleware.ts'
        ],
        estimatedTime: 20,
        retryLimit: 3
      },
      {
        phase: 'Testing Infrastructure',
        description: 'Comprehensive testing setup and test generation',
        dependencies: ['API Integration Layer'],
        outputs: [
          'jest.config.js',
          'jest.setup.js',
          '__tests__/components/*.test.tsx',
          '__tests__/api/*.test.ts',
          '__tests__/utils/*.test.ts'
        ],
        estimatedTime: 25,
        retryLimit: 2
      },
      {
        phase: 'Quality Assurance',
        description: 'Linting, type checking, and automated fixes',
        dependencies: ['Testing Infrastructure'],
        outputs: [
          'Fixed TypeScript errors',
          'Fixed ESLint warnings',
          'Formatted code',
          'Optimized imports'
        ],
        estimatedTime: 10,
        retryLimit: 5
      },
      {
        phase: 'Deployment Preparation',
        description: 'Vercel-ready configuration and optimization',
        dependencies: ['Quality Assurance'],
        outputs: [
          'vercel.json',
          'next.config.js optimization',
          '.env.example',
          'README.md',
          'public/manifest.json'
        ],
        estimatedTime: 10,
        retryLimit: 2
      }
    ]

    console.log(`✅ Designed ${phases.length} generation phases`)
    return phases
  }

  /**
   * 🚀 メイン実行：完全自律生成
   */
  async executeAutonomousGeneration(): Promise<CodeGenerationResult> {
    const startTime = Date.now()
    console.log('\n🚀 Starting Autonomous Code Generation Engine')
    console.log('═══════════════════════════════════════════════════')
    console.log(`📂 Project: ${this.projectRoot}`)
    console.log(`🎯 Domain: ${this.serviceRequirement.domain}`)
    console.log(`📋 Vision: ${this.serviceRequirement.vision}`)
    console.log(`📊 Phases: ${this.phases.length}`)
    console.log('⚡ Mode: FULLY AUTONOMOUS (No user confirmation)')
    
    try {
      // 各フェーズを順次実行
      for (let i = 0; i < this.phases.length; i++) {
        const phase = this.phases[i]
        console.log(`\n📍 Phase ${i + 1}/${this.phases.length}: ${phase.phase}`)
        console.log(`   📝 ${phase.description}`)
        console.log(`   ⏱️ Estimated: ${phase.estimatedTime}min`)
        
        const success = await this.executePhase(phase, i + 1)
        
        if (!success) {
          throw new Error(`Phase ${i + 1} (${phase.phase}) failed after ${phase.retryLimit} retries`)
        }
        
        console.log(`   ✅ Phase ${i + 1} completed successfully`)
      }

      // 最終検証
      await this.performFinalValidation()

      const duration = Date.now() - startTime
      const result: CodeGenerationResult = {
        success: true,
        generatedFiles: this.generatedFiles,
        errors: this.errors,
        warnings: this.warnings,
        metrics: {
          totalFiles: this.generatedFiles.length,
          totalLines: this.countTotalLines(),
          testsGenerated: this.countGeneratedTests(),
          componentsGenerated: this.countGeneratedComponents(),
          duration: duration
        }
      }

      console.log('\n🎉 AUTONOMOUS GENERATION COMPLETED SUCCESSFULLY!')
      this.printFinalReport(result)
      
      // 詳細レポート生成
      await this.generateDetailedReport(result)
      
      return result

    } catch (error) {
      const duration = Date.now() - startTime
      console.error('\n💥 Autonomous generation failed:', error)
      
      return {
        success: false,
        generatedFiles: this.generatedFiles,
        errors: [...this.errors, error instanceof Error ? error.message : String(error)],
        warnings: this.warnings,
        metrics: {
          totalFiles: this.generatedFiles.length,
          totalLines: this.countTotalLines(),
          testsGenerated: this.countGeneratedTests(),
          componentsGenerated: this.countGeneratedComponents(),
          duration: duration
        }
      }
    }
  }

  /**
   * フェーズ実行（リトライ機能付き）
   */
  private async executePhase(phase: GenerationPhaseConfig, phaseNumber: number): Promise<boolean> {
    for (let attempt = 1; attempt <= phase.retryLimit; attempt++) {
      try {
        console.log(`   🔄 Attempt ${attempt}/${phase.retryLimit}`)
        
        switch (phase.phase) {
          case 'Foundation Setup':
            await this.executeFoundationSetup()
            break
          case 'UI Component Architecture':
            await this.executeUIComponentArchitecture()
            break
          case 'State Management System':
            await this.executeStateManagementSystem()
            break
          case 'Core Application Logic':
            await this.executeCoreApplicationLogic()
            break
          case 'API Integration Layer':
            await this.executeAPIIntegrationLayer()
            break
          case 'Testing Infrastructure':
            await this.executeTestingInfrastructure()
            break
          case 'Quality Assurance':
            await this.executeQualityAssurance()
            break
          case 'Deployment Preparation':
            await this.executeDeploymentPreparation()
            break
          default:
            throw new Error(`Unknown phase: ${phase.phase}`)
        }
        
        return true // 成功
        
      } catch (error) {
        console.warn(`   ⚠️ Attempt ${attempt} failed:`, error instanceof Error ? error.message : String(error))
        
        if (attempt === phase.retryLimit) {
          this.errors.push(`Phase ${phaseNumber} failed: ${error instanceof Error ? error.message : String(error)}`)
          return false
        }
        
        // リトライ前の待機
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt))
      }
    }
    
    return false
  }

  // ヘルパーメソッド
  private readPackageJson(): any {
    try {
      const packagePath = join(this.projectRoot, 'package.json')
      if (existsSync(packagePath)) {
        return JSON.parse(readFileSync(packagePath, 'utf-8'))
      }
    } catch (error) {
      console.warn('Could not read package.json:', error)
    }
    return {}
  }

  private scanExistingFiles(): string[] {
    try {
      const files: string[] = []
      const scanDir = (dir: string) => {
        const items = readdirSync(dir, { withFileTypes: true })
        for (const item of items) {
          if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
            scanDir(join(dir, item.name))
          } else if (item.isFile() && (item.name.endsWith('.ts') || item.name.endsWith('.tsx'))) {
            files.push(join(dir, item.name))
          }
        }
      }
      scanDir(this.projectRoot)
      return files
    } catch (error) {
      return []
    }
  }

  private inferDomain(packageJson: any, files: string[]): string {
    // パッケージ名やファイル構造から推測
    const name = packageJson.name || 'application'
    if (name.includes('ecommerce') || files.some(f => f.includes('product'))) return 'E-commerce'
    if (name.includes('blog') || files.some(f => f.includes('post'))) return 'Blog'
    if (name.includes('dashboard') || files.some(f => f.includes('dashboard'))) return 'Dashboard'
    if (name.includes('task') || files.some(f => f.includes('task'))) return 'Task Management'
    return 'Business Application'
  }

  private inferVision(packageJson: any, files: string[]): string {
    const domain = this.inferDomain(packageJson, files)
    const visions = {
      'E-commerce': 'Modern, user-friendly online shopping platform',
      'Blog': 'Content-rich blogging platform with modern UX',
      'Dashboard': 'Comprehensive data visualization and management dashboard',
      'Task Management': 'Efficient task and project management system',
      'Business Application': 'Professional business process management application'
    }
    return visions[domain as keyof typeof visions] || 'Innovative web application'
  }

  private generateUserStories(): string[] {
    const domain = this.serviceRequirement?.domain || 'Business Application'
    const stories = {
      'E-commerce': [
        'As a customer, I want to browse products easily',
        'As a customer, I want to add items to cart and checkout',
        'As an admin, I want to manage product inventory',
        'As a customer, I want to track my orders'
      ],
      'Blog': [
        'As a reader, I want to browse and read articles',
        'As an author, I want to create and publish posts',
        'As a reader, I want to search for specific content',
        'As an admin, I want to manage content and users'
      ],
      'Dashboard': [
        'As a user, I want to view key metrics at a glance',
        'As a user, I want to filter and analyze data',
        'As an admin, I want to configure dashboard settings',
        'As a user, I want to export reports'
      ],
      'Task Management': [
        'As a user, I want to create and organize tasks',
        'As a team member, I want to collaborate on projects',
        'As a manager, I want to track progress and deadlines',
        'As a user, I want to set priorities and notifications'
      ]
    }
    return stories[domain as keyof typeof stories] || [
      'As a user, I want to access the main features easily',
      'As a user, I want a responsive and intuitive interface',
      'As an admin, I want to manage application settings',
      'As a user, I want reliable data persistence'
    ]
  }

  // フェーズ実行メソッド（PhaseImplementationsを使用）
  private async executeFoundationSetup(): Promise<void> {
    console.log('      🔧 Setting up project foundation...')
    const { PhaseImplementations } = await import('./phaseImplementations')
    const phaseImpl = new PhaseImplementations(this.projectRoot)
    await phaseImpl.executeFoundationSetup()
    this.generatedFiles.push(...phaseImpl.getGeneratedFiles())
  }

  private async executeUIComponentArchitecture(): Promise<void> {
    console.log('      🎨 Building UI component architecture...')
    const { PhaseImplementations } = await import('./phaseImplementations')
    const phaseImpl = new PhaseImplementations(this.projectRoot)
    await phaseImpl.executeUIComponentArchitecture()
    this.generatedFiles.push(...phaseImpl.getGeneratedFiles())
  }

  private async executeStateManagementSystem(): Promise<void> {
    console.log('      🔄 Implementing state management...')
    const { PhaseImplementations } = await import('./phaseImplementations')
    const phaseImpl = new PhaseImplementations(this.projectRoot)
    await phaseImpl.executeStateManagementSystem()
    this.generatedFiles.push(...phaseImpl.getGeneratedFiles())
  }

  private async executeCoreApplicationLogic(): Promise<void> {
    console.log('      🏗️ Developing core application logic...')
    const { PhaseImplementations } = await import('./phaseImplementations')
    const phaseImpl = new PhaseImplementations(this.projectRoot)
    await phaseImpl.executeCoreApplicationLogic()
    this.generatedFiles.push(...phaseImpl.getGeneratedFiles())
  }

  private async executeAPIIntegrationLayer(): Promise<void> {
    console.log('      📡 Creating API integration layer...')
    const { PhaseImplementations } = await import('./phaseImplementations')
    const phaseImpl = new PhaseImplementations(this.projectRoot)
    await phaseImpl.executeAPIIntegrationLayer()
    this.generatedFiles.push(...phaseImpl.getGeneratedFiles())
  }

  private async executeTestingInfrastructure(): Promise<void> {
    console.log('      🧪 Setting up testing infrastructure...')
    const { PhaseImplementations } = await import('./phaseImplementations')
    const phaseImpl = new PhaseImplementations(this.projectRoot)
    await phaseImpl.executeTestingInfrastructure()
    this.generatedFiles.push(...phaseImpl.getGeneratedFiles())
  }

  private async executeQualityAssurance(): Promise<void> {
    console.log('      ✨ Running quality assurance...')
    const { PhaseImplementations } = await import('./phaseImplementations')
    const phaseImpl = new PhaseImplementations(this.projectRoot)
    await phaseImpl.executeQualityAssurance()
    this.generatedFiles.push(...phaseImpl.getGeneratedFiles())
  }

  private async executeDeploymentPreparation(): Promise<void> {
    console.log('      🚀 Preparing for deployment...')
    const { PhaseImplementations } = await import('./phaseImplementations')
    const phaseImpl = new PhaseImplementations(this.projectRoot)
    await phaseImpl.executeDeploymentPreparation()
    this.generatedFiles.push(...phaseImpl.getGeneratedFiles())
  }

  private async performFinalValidation(): Promise<void> {
    console.log('\n🔍 Performing final validation...')
    
    // 生成されたファイルの検証
    const validFiles = this.generatedFiles.filter(file => {
      try {
        const content = readFileSync(file, 'utf-8')
        return content.length > 0
      } catch {
        return false
      }
    })
    
    console.log(`   ✅ Validated ${validFiles.length}/${this.generatedFiles.length} files`)
    
    if (validFiles.length < this.generatedFiles.length) {
      const invalidFiles = this.generatedFiles.filter(f => !validFiles.includes(f))
      this.warnings.push(`Some files could not be validated: ${invalidFiles.join(', ')}`)
    }
    
    // 基本的なプロジェクト構造の確認
    const requiredFiles = [
      'package.json',
      'tsconfig.json',
      'tailwind.config.ts',
      'app/layout.tsx',
      'app/page.tsx'
    ]
    
    const missingFiles = requiredFiles.filter(file => 
      !this.generatedFiles.some(genFile => genFile.endsWith(file))
    )
    
    if (missingFiles.length > 0) {
      this.warnings.push(`Missing required files: ${missingFiles.join(', ')}`)
    }
    
    console.log('   ✅ Final validation completed')
  }

  private countTotalLines(): number {
    return this.generatedFiles.reduce((total, file) => {
      try {
        const content = readFileSync(file, 'utf-8')
        return total + content.split('\n').length
      } catch {
        return total
      }
    }, 0)
  }

  private countGeneratedTests(): number {
    return this.generatedFiles.filter(file => file.includes('.test.') || file.includes('__tests__')).length
  }

  private countGeneratedComponents(): number {
    return this.generatedFiles.filter(file => file.includes('/components/') && file.endsWith('.tsx')).length
  }

  private printFinalReport(result: CodeGenerationResult): void {
    console.log('\n📊 GENERATION REPORT')
    console.log('═══════════════════════════════════════')
    console.log(`✅ Success: ${result.success}`)
    console.log(`📁 Files Generated: ${result.metrics.totalFiles}`)
    console.log(`📝 Lines of Code: ${result.metrics.totalLines}`)
    console.log(`🧪 Tests Generated: ${result.metrics.testsGenerated}`)
    console.log(`🎨 Components Generated: ${result.metrics.componentsGenerated}`)
    console.log(`⏱️ Duration: ${Math.round(result.metrics.duration / 1000)}s`)
    
    if (result.warnings.length > 0) {
      console.log(`⚠️ Warnings: ${result.warnings.length}`)
      result.warnings.forEach(warning => console.log(`   • ${warning}`))
    }
    
    if (result.errors.length > 0) {
      console.log(`❌ Errors: ${result.errors.length}`)
      result.errors.forEach(error => console.log(`   • ${error}`))
    }
    
    console.log('\n📄 Reports Generated:')
    console.log('   • GENERATION_REPORT.html - 詳細HTMLレポート')
    console.log('   • GENERATION_REPORT.md - Markdownレポート')
    console.log('   • generation-report.json - JSON詳細データ')
  }
  
  /**
   * 詳細レポート生成
   */
  private async generateDetailedReport(result: CodeGenerationResult): Promise<void> {
    try {
      console.log('\n📊 Generating detailed reports...')
      const { ReportGenerator } = await import('./reportGenerator')
      const reportGenerator = new ReportGenerator(this.projectRoot)
      await reportGenerator.generateCompleteReport(result)
      console.log('✅ Detailed reports generated successfully')
    } catch (error) {
      console.warn('⚠️ Could not generate detailed reports:', error)
      this.warnings.push('Report generation failed')
    }
  }
}

export default AutonomousCodeGenerationEngine