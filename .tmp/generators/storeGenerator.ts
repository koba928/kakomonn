import { DesignStructure, Feature } from '../core/ideaAnalyzer'

export class StoreGenerator {
  generateStore(design: DesignStructure): string {
    const imports = this.generateImports(design)
    const interfaces = this.generateInterfaces(design)
    const store = this.generateStoreImplementation(design)

    return `${imports}

${interfaces}

${store}`
  }

  private generateImports(design: DesignStructure): string {
    const baseImports = [
      "import { create } from 'zustand'",
      "import { persist, createJSONStorage } from 'zustand/middleware'"
    ]

    if (design.stateRequirements.global.includes('auth')) {
      baseImports.push("import { immer } from 'zustand/middleware/immer'")
    }

    return baseImports.join('\n')
  }

  private generateInterfaces(design: DesignStructure): string {
    const interfaces = []

    // Generate data model interfaces
    for (const model of design.dataModels) {
      const fields = model.fields.map(field => 
        `  ${field.name}${field.required ? '' : '?'}: ${field.type === 'Date' ? 'string' : field.type}`
      ).join('\n')

      interfaces.push(`interface ${model.name} {
${fields}
}`)
    }

    // Generate state interface
    const stateFields = design.stateRequirements.global.map(state => {
      if (design.features.some(f => f.name === state)) {
        const feature = design.features.find(f => f.name === state)!
        const modelName = design.dataModels.find(m => 
          m.name.toLowerCase().includes(feature.name.slice(0, -1))
        )?.name || 'any'
        return `  ${state}: ${modelName}[]`
      }
      
      const stateTypeMap: Record<string, string> = {
        loading: 'boolean',
        error: 'string | null',
        user: 'User | null',
        auth: 'boolean'
      }
      
      return `  ${state}: ${stateTypeMap[state] || 'any'}`
    }).join('\n')

    interfaces.push(`interface AppState {
${stateFields}
}`)

    // Generate actions interface
    const actionFields = this.generateActionFields(design)
    interfaces.push(`interface AppActions {
${actionFields}
}`)

    return interfaces.join('\n\n')
  }

  private generateActionFields(design: DesignStructure): string {
    const actions = []

    for (const feature of design.features) {
      const modelName = design.dataModels.find(m => 
        m.name.toLowerCase().includes(feature.name.slice(0, -1))
      )?.name || 'any'

      if (feature.crud.create) {
        actions.push(`  add${modelName}: (item: Omit<${modelName}, 'id'>) => void`)
      }
      if (feature.crud.update) {
        actions.push(`  update${modelName}: (id: string, updates: Partial<${modelName}>) => void`)
      }
      if (feature.crud.delete) {
        actions.push(`  delete${modelName}: (id: string) => void`)
      }
      if (feature.crud.read) {
        actions.push(`  get${feature.name.charAt(0).toUpperCase() + feature.name.slice(1)}: () => ${modelName}[]`)
      }
    }

    // Add common actions
    actions.push('  setLoading: (loading: boolean) => void')
    actions.push('  setError: (error: string | null) => void')

    return actions.join('\n')
  }

  private generateStoreImplementation(design: DesignStructure): string {
    const initialState = this.generateInitialState(design)
    const actions = this.generateActions(design)

    return `export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set, get) => ({
${initialState},
${actions}
    }),
    {
      name: '${design.title.toLowerCase().replace(/\s+/g, '-')}-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)`
  }

  private generateInitialState(design: DesignStructure): string {
    const stateValues = design.stateRequirements.global.map(state => {
      if (design.features.some(f => f.name === state)) {
        return `      ${state}: []`
      }
      
      const initialValues: Record<string, string> = {
        loading: 'false',
        error: 'null',
        user: 'null',
        auth: 'false'
      }
      
      return `      ${state}: ${initialValues[state] || 'null'}`
    }).join(',\n')

    return stateValues
  }

  private generateActions(design: DesignStructure): string {
    const actions = []

    for (const feature of design.features) {
      const modelName = design.dataModels.find(m => 
        m.name.toLowerCase().includes(feature.name.slice(0, -1))
      )?.name || 'Item'

      if (feature.crud.create) {
        actions.push(`      add${modelName}: (item) => {
        const newItem = {
          id: Math.random().toString(36).substring(2, 11),
          ...item,
          createdAt: new Date().toISOString().split('T')[0]
        }
        set((state) => ({ ${feature.name}: [newItem, ...state.${feature.name}] }))
      }`)
      }

      if (feature.crud.update) {
        actions.push(`      update${modelName}: (id, updates) => {
        set((state) => ({
          ${feature.name}: state.${feature.name}.map(item =>
            item?.id === id ? { ...item, ...updates } : item
          )
        }))
      }`)
      }

      if (feature.crud.delete) {
        actions.push(`      delete${modelName}: (id) => {
        set((state) => ({
          ${feature.name}: state.${feature.name}.filter(item => item?.id !== id)
        }))
      }`)
      }

      if (feature.crud.read) {
        actions.push(`      get${feature.name.charAt(0).toUpperCase() + feature.name.slice(1)}: () => {
        return get().${feature.name}
      }`)
      }
    }

    // Add common actions
    actions.push(`      setLoading: (loading) => set({ loading })`)
    actions.push(`      setError: (error) => set({ error })`)

    return actions.join(',\n')
  }
}