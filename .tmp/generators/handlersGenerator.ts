import { DesignStructure, Feature } from '../core/ideaAnalyzer'

export class HandlersGenerator {
  generateHandlers(design: DesignStructure): { [path: string]: string } {
    const handlers: { [path: string]: string } = {}

    for (const feature of design.features) {
      const handlerPath = `lib/handlers/${feature.name}Handlers.ts`
      handlers[handlerPath] = this.generateFeatureHandlers(feature, design)
    }

    return handlers
  }

  private generateFeatureHandlers(feature: Feature, design: DesignStructure): string {
    const modelName = design.dataModels.find(m => 
      m.name.toLowerCase().includes(feature.name.slice(0, -1))
    )?.name || 'Item'

    const imports = this.generateImports(feature)
    const handlers = this.generateHandlerFunctions(feature, modelName)

    return `${imports}

${handlers}`
  }

  private generateImports(feature: Feature): string {
    const baseImports = [
      "import { useAppStore } from '@/lib/stores/appStore'",
      "import { toast } from 'sonner'"
    ]

    if (feature.auth) {
      baseImports.push("import { useAuth } from '@/lib/auth'")
    }

    return baseImports.join('\n')
  }

  private generateHandlerFunctions(feature: Feature, modelName: string): string {
    const handlers = []

    if (feature.crud.create) {
      handlers.push(this.generateCreateHandler(feature, modelName))
    }

    if (feature.crud.read) {
      handlers.push(this.generateReadHandler(feature, modelName))
    }

    if (feature.crud.update) {
      handlers.push(this.generateUpdateHandler(feature, modelName))
    }

    if (feature.crud.delete) {
      handlers.push(this.generateDeleteHandler(feature, modelName))
    }

    return handlers.join('\n\n')
  }

  private generateCreateHandler(feature: Feature, modelName: string): string {
    const capitalizedFeature = feature.name.charAt(0).toUpperCase() + feature.name.slice(1)
    const singularModel = modelName.slice(0, -1)

    return `export const use${capitalizedFeature}Handlers = () => {
  const { add${modelName}, setLoading, setError } = useAppStore()

  const create${singularModel} = async (data: any) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/${feature.name}', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Failed to create ${singularModel.toLowerCase()}')
      }

      const new${singularModel} = await response.json()
      add${modelName}(new${singularModel})
      
      toast.success('${singularModel} created successfully!')
      return new${singularModel}
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { create${singularModel} }
}`
  }

  private generateReadHandler(feature: Feature, modelName: string): string {
    const capitalizedFeature = feature.name.charAt(0).toUpperCase() + feature.name.slice(1)
    const singularModel = modelName.slice(0, -1)

    return `export const useFetch${capitalizedFeature} = () => {
  const { ${feature.name}, setLoading, setError } = useAppStore()

  const fetch${capitalizedFeature} = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/${feature.name}')
      
      if (!response.ok) {
        throw new Error('Failed to fetch ${feature.name}')
      }

      const data = await response.json()
      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const fetch${singularModel}ById = async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/${feature.name}/${id}')
      
      if (!response.ok) {
        throw new Error('Failed to fetch ${singularModel.toLowerCase()}')
      }

      const data = await response.json()
      return data
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { fetch${capitalizedFeature}, fetch${singularModel}ById, ${feature.name} }
}`
  }

  private generateUpdateHandler(feature: Feature, modelName: string): string {
    const capitalizedFeature = feature.name.charAt(0).toUpperCase() + feature.name.slice(1)
    const singularModel = modelName.slice(0, -1)

    return `export const useUpdate${singularModel} = () => {
  const { update${modelName}, setLoading, setError } = useAppStore()

  const update${singularModel} = async (id: string, updates: Partial<${singularModel}>) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/${feature.name}/${id}', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Failed to update ${singularModel.toLowerCase()}')
      }

      const updated${singularModel} = await response.json()
      update${modelName}(id, updated${singularModel})
      
      toast.success('${singularModel} updated successfully!')
      return updated${singularModel}
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { update${singularModel} }
}`
  }

  private generateDeleteHandler(feature: Feature, modelName: string): string {
    const capitalizedFeature = feature.name.charAt(0).toUpperCase() + feature.name.slice(1)
    const singularModel = modelName.slice(0, -1)

    return `export const useDelete${singularModel} = () => {
  const { delete${modelName}, setLoading, setError } = useAppStore()

  const delete${singularModel} = async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/${feature.name}/${id}', {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete ${singularModel.toLowerCase()}')
      }

      delete${modelName}(id)
      
      toast.success('${singularModel} deleted successfully!')
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred'
      setError(errorMessage)
      toast.error(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }

  return { delete${singularModel} }
}`
  }
}