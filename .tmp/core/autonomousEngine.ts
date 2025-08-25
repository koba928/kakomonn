import { IdeaAnalyzer } from './ideaAnalyzer'
import { StructureGenerator, GenerationStructure } from './structureGenerator'
import { UIGenerator } from '../generators/uiGenerator'
import { StoreGenerator } from '../generators/storeGenerator'
import { ApiGenerator } from '../generators/apiGenerator'
import { HandlersGenerator } from '../generators/handlersGenerator'
import { ValidationSystem } from './validationSystem'
import * as fs from 'fs'
import * as path from 'path'

export interface GenerationResult {
  success: boolean
  structure: GenerationStructure
  files: { [path: string]: string }
  validationResult: any
  errors: string[]
  warnings: string[]
}

export class AutonomousEngine {
  private analyzer: IdeaAnalyzer
  private structureGenerator: StructureGenerator
  private uiGenerator: UIGenerator
  private storeGenerator: StoreGenerator
  private apiGenerator: ApiGenerator
  private handlersGenerator: HandlersGenerator
  private validationSystem: ValidationSystem

  constructor() {
    this.analyzer = new IdeaAnalyzer()
    this.structureGenerator = new StructureGenerator()
    this.uiGenerator = new UIGenerator()
    this.storeGenerator = new StoreGenerator()
    this.apiGenerator = new ApiGenerator()
    this.handlersGenerator = new HandlersGenerator()
    this.validationSystem = new ValidationSystem()
  }

  async generateApplication(userInput: string, maxRetries: number = 3): Promise<GenerationResult> {
    console.log('🚀 Starting autonomous application generation...')
    console.log('💡 User input:', userInput)
    
    try {
      console.log('🔍 Testing basic operations...')
      const testId = Math.random().toString(36).substring(2, 11)
      console.log('✅ ID generation test passed:', testId)
    } catch (error) {
      console.error('❌ Basic ID generation failed:', error)
      return {
        success: false,
        structure: {} as GenerationStructure,
        files: {},
        validationResult: null,
        errors: [`Basic ID generation failed: ${error.message}`],
        warnings: []
      }
    }

    let attempts = 0
    let lastError: string[] = []

    while (attempts < maxRetries) {
      attempts++
      console.log(`🔄 Attempt ${attempts}/${maxRetries}`)

      try {
        // Phase 1: Analyze and Structure
        console.log('📊 Phase 1: Analyzing idea and generating structure...')
        let structure: GenerationStructure
        try {
          structure = await this.structureGenerator.generateStructure(userInput)
          console.log('✅ Structure generated successfully:', structure.design.title)
        } catch (error) {
          console.error('❌ Structure generation failed:', error)
          throw error
        }
        
        // Phase 2: Generate Code
        console.log('🏗️  Phase 2: Generating application code...')
        let generatedFiles: { [path: string]: string }
        try {
          let mainUI: string
          try {
            console.log('📝 Generating main UI...')
            mainUI = this.uiGenerator.generateMainPage(structure.design)
            console.log('✅ Main UI generated successfully')
          } catch (error) {
            console.error('❌ UI generation failed:', error)
            throw new Error(`UI generation failed: ${error.message}`)
          }
          
          let store: string
          try {
            console.log('🏪 Generating store...')
            store = this.storeGenerator.generateStore(structure.design)
            console.log('✅ Store generated successfully')
          } catch (error) {
            console.error('❌ Store generation failed:', error)
            throw new Error(`Store generation failed: ${error.message}`)
          }
          
          let apiRoutes: { [path: string]: string }
          try {
            console.log('🌐 Generating API routes...')
            apiRoutes = this.apiGenerator.generateApiRoutes(structure.design)
            console.log('✅ API routes generated successfully')
          } catch (error) {
            console.error('❌ API generation failed:', error)
            throw new Error(`API generation failed: ${error.message}`)
          }
          
          let handlers: { [path: string]: string }
          try {
            console.log('🔧 Generating handlers...')
            handlers = this.handlersGenerator.generateHandlers(structure.design)
            console.log('✅ Handlers generated successfully')
          } catch (error) {
            console.error('❌ Handler generation failed:', error)
            throw new Error(`Handler generation failed: ${error.message}`)
          }
          
          generatedFiles = {
            'app/generated-app/page.tsx': mainUI,
            'lib/stores/appStore.ts': store,
            ...apiRoutes,
            ...handlers
          }
          
          console.log('✅ All files generated:', Object.keys(generatedFiles))
        } catch (error) {
          console.error('❌ File generation failed:', error)
          throw error
        }
        
        // Phase 3: Validate
        console.log('✅ Phase 3: Validating generated code...')
        const outputPath = path.join(process.cwd(), 'app', 'generated-app')
        this.ensureDirectoryExists(outputPath)
        
        // Write main app file for validation
        const mainAppPath = path.join(outputPath, 'page.tsx')
        fs.writeFileSync(mainAppPath, generatedFiles['app/generated-app/page.tsx'], 'utf-8')
        
        const validationResult = await this.validationSystem.validateGeneration(structure, outputPath)
        
        if (validationResult.isValid) {
          console.log('🎉 Generation successful!')
          
          // Phase 4: Write All Files
          console.log('💾 Phase 4: Writing all generated files...')
          await this.writeAllFiles(generatedFiles)
          
          return {
            success: true,
            structure,
            files: generatedFiles,
            validationResult,
            errors: [],
            warnings: validationResult.warnings
          }
        } else {
          console.log('⚠️  Validation failed, attempting auto-fix...')
          
          // Try auto-fix
          const fixSuccess = await this.validationSystem.autoFix(structure, outputPath)
          
          if (fixSuccess) {
            // Re-validate after fix
            const reValidation = await this.validationSystem.validateGeneration(structure, outputPath)
            
            if (reValidation.isValid) {
              console.log('🔧 Auto-fix successful!')
              
              // Read the fixed content and update files
              const fixedContent = fs.readFileSync(mainAppPath, 'utf-8')
              generatedFiles['app/generated-app/page.tsx'] = fixedContent
              
              await this.writeAllFiles(generatedFiles)
              
              return {
                success: true,
                structure,
                files: generatedFiles,
                validationResult: reValidation,
                errors: [],
                warnings: reValidation.warnings
              }
            }
          }
          
          lastError = validationResult.errors
          console.log('❌ Validation failed:', validationResult.errors)
        }
        
      } catch (error) {
        console.error('❌ Generation error:', error)
        console.error('❌ Full error stack:', error instanceof Error ? error.stack : error)
        lastError = [error instanceof Error ? error.message : String(error)]
      }
    }

    // If we get here, all attempts failed
    console.log('💥 All generation attempts failed')
    
    return {
      success: false,
      structure: {} as GenerationStructure,
      files: {},
      validationResult: null,
      errors: lastError,
      warnings: []
    }
  }

  private async generateAllFiles(structure: GenerationStructure): Promise<{ [path: string]: string }> {
    const files: { [path: string]: string } = {}
    
    // Generate main UI
    const mainUI = this.uiGenerator.generateMainPage(structure.design)
    files['app/generated-app/page.tsx'] = mainUI
    
    // Generate store
    const store = this.storeGenerator.generateStore(structure.design)
    files['lib/stores/appStore.ts'] = store
    
    // Generate API routes
    const apiRoutes = this.apiGenerator.generateApiRoutes(structure.design)
    Object.assign(files, apiRoutes)
    
    // Generate handlers
    const handlers = this.handlersGenerator.generateHandlers(structure.design)
    Object.assign(files, handlers)
    
    // Generate types
    const types = this.generateTypes(structure.design)
    files['lib/types/index.ts'] = types
    
    return files
  }

  private generateTypes(design: any): string {
    const interfaces = design.dataModels.map((model: any) => {
      const fields = model.fields.map((field: any) => 
        `  ${field.name}${field.required ? '' : '?'}: ${field.type === 'Date' ? 'string' : field.type}`
      ).join('\n')
      
      return `export interface ${model.name} {\n${fields}\n}`
    }).join('\n\n')
    
    return `// Generated types for ${design.title}\n\n${interfaces}`
  }

  private async writeAllFiles(files: { [path: string]: string }): Promise<void> {
    for (const [filePath, content] of Object.entries(files)) {
      const fullPath = path.join(process.cwd(), filePath)
      const dir = path.dirname(fullPath)
      
      this.ensureDirectoryExists(dir)
      fs.writeFileSync(fullPath, content, 'utf-8')
      console.log('📝 Generated:', filePath)
    }
  }

  private ensureDirectoryExists(dirPath: string): void {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true })
    }
  }

  async getGenerationHistory(): Promise<GenerationStructure[]> {
    const historyDir = path.join(process.cwd(), 'generated', 'history')
    
    if (!fs.existsSync(historyDir)) {
      return []
    }
    
    const historyFiles = fs.readdirSync(historyDir)
      .filter(file => file.endsWith('.json'))
      .sort()
    
    const history: GenerationStructure[] = []
    
    for (const file of historyFiles) {
      try {
        const content = fs.readFileSync(path.join(historyDir, file), 'utf-8')
        const structure = JSON.parse(content)
        history.push(structure)
      } catch (error) {
        console.warn('Failed to parse history file:', file)
      }
    }
    
    return history
  }

  async saveGenerationHistory(structure: GenerationStructure): Promise<void> {
    const historyDir = path.join(process.cwd(), 'generated', 'history')
    this.ensureDirectoryExists(historyDir)
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const fileName = `generation-${timestamp}.json`
    const filePath = path.join(historyDir, fileName)
    
    fs.writeFileSync(filePath, JSON.stringify(structure, null, 2), 'utf-8')
    console.log('📚 Generation history saved:', fileName)
  }

  async reuseStructure(targetInput: string): Promise<GenerationStructure | null> {
    const history = await this.getGenerationHistory()
    
    // Find similar structures based on service type and features
    const analyzed = this.analyzer.analyzeIdea(targetInput)
    
    for (const pastStructure of history) {
      const similarity = this.calculateSimilarity(analyzed, pastStructure.design)
      
      if (similarity > 0.7) {
        console.log('🔄 Reusing similar structure from history')
        return pastStructure
      }
    }
    
    return null
  }

  private calculateSimilarity(design1: any, design2: any): number {
    let score = 0
    let maxScore = 0
    
    // Compare service types
    maxScore += 1
    if (design1.serviceType.category === design2.serviceType.category) {
      score += 1
    }
    
    // Compare features
    maxScore += 1
    const commonFeatures = design1.features.filter((f1: any) => 
      design2.features.some((f2: any) => f1.name === f2.name)
    )
    score += commonFeatures.length / Math.max(design1.features.length, design2.features.length)
    
    // Compare data models
    maxScore += 1
    const commonModels = design1.dataModels.filter((m1: any) => 
      design2.dataModels.some((m2: any) => m1.name === m2.name)
    )
    score += commonModels.length / Math.max(design1.dataModels.length, design2.dataModels.length)
    
    return score / maxScore
  }
}