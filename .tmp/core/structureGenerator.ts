import { IdeaAnalyzer, DesignStructure } from './ideaAnalyzer'
import * as fs from 'fs'
import * as path from 'path'

export interface GenerationStructure {
  meta: {
    generatedAt: string
    version: string
    userInput: string
  }
  design: DesignStructure
  generationPlan: {
    phase: string
    files: {
      path: string
      type: 'component' | 'store' | 'api' | 'handler' | 'config'
      dependencies: string[]
    }[]
  }[]
  validation: {
    requiredFiles: string[]
    dependencies: string[]
    checks: string[]
  }
}

export class StructureGenerator {
  private analyzer: IdeaAnalyzer

  constructor() {
    this.analyzer = new IdeaAnalyzer()
  }

  async generateStructure(userInput: string): Promise<GenerationStructure> {
    const design = this.analyzer.analyzeIdea(userInput)
    const generationPlan = this.createGenerationPlan(design)
    const validation = this.createValidationPlan(design)

    const structure: GenerationStructure = {
      meta: {
        generatedAt: new Date().toISOString(),
        version: '1.0.0',
        userInput
      },
      design,
      generationPlan,
      validation
    }

    // Save structure to file
    await this.saveStructure(structure)

    return structure
  }

  private createGenerationPlan(design: DesignStructure) {
    const phases = [
      {
        phase: 'Foundation',
        files: [
          {
            path: 'lib/types/index.ts',
            type: 'config' as const,
            dependencies: []
          },
          {
            path: 'lib/stores/appStore.ts',
            type: 'store' as const,
            dependencies: ['zustand', 'zustand/middleware']
          }
        ]
      },
      {
        phase: 'API Layer',
        files: design.apiEndpoints.map(endpoint => ({
          path: `app/api${endpoint.path}/route.ts`,
          type: 'api' as const,
          dependencies: ['next']
        }))
      },
      {
        phase: 'Components',
        files: this.generateComponentFiles(design)
      },
      {
        phase: 'Pages',
        files: design.pages.map(page => ({
          path: `app${page.path === '/' ? '' : page.path}/page.tsx`,
          type: 'component' as const,
          dependencies: ['react', '@/components/ui/*', '@/lib/stores/appStore']
        }))
      },
      {
        phase: 'Handlers',
        files: design.features.map(feature => ({
          path: `lib/handlers/${feature.name}Handlers.ts`,
          type: 'handler' as const,
          dependencies: ['@/lib/stores/appStore']
        }))
      }
    ]

    return phases
  }

  private generateComponentFiles(design: DesignStructure) {
    const components = []

    // Generate components for each feature
    for (const feature of design.features) {
      if (feature.crud.read) {
        components.push({
          path: `components/${feature.name}/${feature.name}List.tsx`,
          type: 'component' as const,
          dependencies: ['react', '@/components/ui/*']
        })
      }

      if (feature.crud.create || feature.crud.update) {
        components.push({
          path: `components/${feature.name}/${feature.name}Form.tsx`,
          type: 'component' as const,
          dependencies: ['react', '@/components/ui/*', 'react-hook-form']
        })
      }

      if (feature.crud.read) {
        components.push({
          path: `components/${feature.name}/${feature.name}Card.tsx`,
          type: 'component' as const,
          dependencies: ['react', '@/components/ui/*']
        })
      }
    }

    return components
  }

  private createValidationPlan(design: DesignStructure) {
    const requiredFiles = [
      'app/layout.tsx',
      'app/page.tsx',
      'components/ui/button.tsx',
      'components/ui/card.tsx',
      'components/ui/input.tsx',
      'lib/stores/appStore.ts'
    ]

    const dependencies = [
      'react',
      'next',
      'zustand',
      'tailwindcss',
      '@radix-ui/react-*'
    ]

    const checks = [
      'TypeScript compilation',
      'Component rendering',
      'Store functionality',
      'API endpoints',
      'Responsive design'
    ]

    return { requiredFiles, dependencies, checks }
  }

  private async saveStructure(structure: GenerationStructure) {
    const generatedDir = path.join(process.cwd(), 'generated')
    
    if (!fs.existsSync(generatedDir)) {
      fs.mkdirSync(generatedDir, { recursive: true })
    }

    const structurePath = path.join(generatedDir, 'structure.json')
    fs.writeFileSync(structurePath, JSON.stringify(structure, null, 2))

    console.log('✅ Structure saved to:', structurePath)
  }

  async loadStructure(): Promise<GenerationStructure | null> {
    const structurePath = path.join(process.cwd(), 'generated', 'structure.json')
    
    if (!fs.existsSync(structurePath)) {
      return null
    }

    const content = fs.readFileSync(structurePath, 'utf-8')
    return JSON.parse(content)
  }
}