import { DesignStructure, Feature } from '../core/ideaAnalyzer'

export class UIGenerator {
  generateMainPage(design: DesignStructure): string {
    const imports = this.generateImports(design)
    const interfaces = this.generateInterfaces(design)
    const component = this.generateMainComponent(design)

    return `'use client'

${imports}

${interfaces}

${component}`
  }

  private generateImports(design: DesignStructure): string {
    const baseImports = [
      "import React, { useState, useEffect } from 'react'",
      "import { Button } from '@/components/ui/button'",
      "import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'",
      "import { Input } from '@/components/ui/input'",
      "import { Badge } from '@/components/ui/badge'"
    ]

    const hasTextarea = design.features.some(f => 
      f.name.includes('post') || f.name.includes('article') || f.name.includes('content')
    )
    
    if (hasTextarea) {
      baseImports.push("import { Textarea } from '@/components/ui/textarea'")
    }

    return baseImports.join('\n')
  }

  private generateInterfaces(design: DesignStructure): string {
    return design.dataModels.map(model => {
      const fields = model.fields.map(field => 
        `  ${field.name}${field.required ? '' : '?'}: ${field.type === 'Date' ? 'string' : field.type}`
      ).join('\n')

      return `interface ${model.name} {
${fields}
}`
    }).join('\n\n')
  }

  private generateMainComponent(design: DesignStructure): string {
    const mainFeature = design.features.find(f => f.priority === 'high') || design.features[0]
    const stateName = mainFeature.name
    const modelName = design.dataModels[0]?.name || 'Item'

    return `export default function GeneratedApp() {
  const [${stateName}, set${stateName.charAt(0).toUpperCase() + stateName.slice(1)}] = useState<${modelName}[]>([])
  ${this.generateFormState(mainFeature, design.dataModels[0])}

  useEffect(() => {
    ${this.generateInitialData(mainFeature, design.dataModels[0])}
  }, [])

  ${this.generateHandlers(mainFeature, modelName)}

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      ${this.generateHeader(design)}
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        ${this.generateHeroSection(design)}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          ${this.generateMainContent(mainFeature, design)}
          ${this.generateSidebar(design, stateName)}
        </div>

        ${this.generateItemsList(mainFeature, stateName, modelName)}
      </main>
    </div>
  )
}`
  }

  private generateFormState(feature: Feature, model: any): string {
    if (!model || !feature.crud.create) return ''

    const fields = model.fields
      .filter((f: any) => f.name !== 'id' && f.type !== 'Date')
      .map((f: any) => `${f.name}: ${f.type === 'number' ? '0' : f.type === 'boolean' ? 'false' : "''"}`)
      .join(',\n    ')

    return `  const [newItem, setNewItem] = useState({
    ${fields}
  })`
  }

  private generateInitialData(feature: Feature, model: any): string {
    if (!model) return ''

    const sampleData = this.generateSampleData(model, feature.name)
    
    return `const initialData = ${JSON.stringify(sampleData, null, 6)}
    set${feature.name.charAt(0).toUpperCase() + feature.name.slice(1)}(initialData)`
  }

  private generateSampleData(model: any, featureName: string): any[] {
    const samples = {
      articles: [
        {
          id: '1',
          title: 'Getting Started with Modern Development',
          content: 'Learn the latest technologies and best practices.',
          author: 'John Doe',
          publishedAt: '2024-01-15',
          category: 'Technology'
        },
        {
          id: '2',
          title: 'Advanced Techniques',
          content: 'Dive deep into advanced development concepts.',
          author: 'Jane Smith',
          publishedAt: '2024-01-12',
          category: 'Tutorial'
        }
      ],
      tasks: [
        {
          id: '1',
          title: 'Complete project setup',
          description: 'Set up the development environment',
          completed: false,
          priority: 'high',
          dueDate: '2024-01-20'
        },
        {
          id: '2',
          title: 'Write documentation',
          description: 'Create user guides and API docs',
          completed: true,
          priority: 'medium',
          dueDate: '2024-01-18'
        }
      ],
      products: [
        {
          id: '1',
          name: 'Premium Product',
          price: 99.99,
          description: 'High-quality product with premium features',
          imageUrl: '/product1.jpg',
          category: 'Premium'
        },
        {
          id: '2',
          name: 'Standard Product',
          price: 49.99,
          description: 'Reliable product for everyday use',
          imageUrl: '/product2.jpg',
          category: 'Standard'
        }
      ]
    }

    return samples[featureName as keyof typeof samples] || [
      {
        id: '1',
        title: 'Sample Item 1',
        createdAt: '2024-01-15'
      },
      {
        id: '2',
        title: 'Sample Item 2',
        createdAt: '2024-01-12'
      }
    ]
  }

  private generateHandlers(feature: Feature, modelName: string): string {
    const handlers = []

    if (feature.crud.create) {
      handlers.push(`  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newItem.title?.trim()) return
    
    const item = {
      id: Math.random().toString(36).substring(2, 11),
      ...newItem,
      createdAt: new Date().toISOString().split('T')[0]
    }
    
    set${feature.name.charAt(0).toUpperCase() + feature.name.slice(1)}(prev => [item, ...prev])
    setNewItem(${this.getResetObject(feature)})
  }`)
    }

    if (feature.crud.update) {
      handlers.push(`  const toggleStatus = (id: string) => {
    set${feature.name.charAt(0).toUpperCase() + feature.name.slice(1)}(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ))
  }`)
    }

    if (feature.crud.delete) {
      handlers.push(`  const deleteItem = (id: string) => {
    set${feature.name.charAt(0).toUpperCase() + feature.name.slice(1)}(prev => prev.filter(item => item.id !== id))
  }`)
    }

    return handlers.join('\n\n')
  }

  private getResetObject(feature: Feature): string {
    const resetMap = {
      articles: "{ title: '', content: '', author: '', category: '' }",
      tasks: "{ title: '', description: '', completed: false, priority: 'medium' }",
      products: "{ name: '', price: 0, description: '', category: '' }"
    }

    return resetMap[feature.name as keyof typeof resetMap] || "{ title: '' }"
  }

  private generateHeader(design: DesignStructure): string {
    return `<header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">${design.title}</h1>
              <p className="text-gray-600 mt-1">${design.description}</p>
            </div>
            <nav className="hidden md:flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-gray-900">Home</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">About</a>
            </nav>
          </div>
        </div>
      </header>`
  }

  private generateHeroSection(design: DesignStructure): string {
    return `<section className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to ${design.title}
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            ${design.description}
          </p>
        </section>`
  }

  private generateMainContent(feature: Feature, design: DesignStructure): string {
    if (!feature.crud.create) return ''

    const model = design.dataModels[0]
    const formFields = this.generateFormFields(model)

    return `<div className="lg:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Create New ${feature.name.slice(0, -1)}</CardTitle>
                <CardDescription>Add a new item to your collection</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  ${formFields}
                  <Button type="submit" className="w-full">Create ${feature.name.slice(0, -1)}</Button>
                </form>
              </CardContent>
            </Card>
          </div>`
  }

  private generateFormFields(model: any): string {
    if (!model) return '<Input placeholder="Title" />'

    return model.fields
      .filter((f: any) => f.name !== 'id' && f.type !== 'Date')
      .map((field: any) => {
        if (field.name === 'content' || field.name === 'description') {
          return `<Textarea
                    placeholder="${field.name.charAt(0).toUpperCase() + field.name.slice(1)}"
                    value={newItem.${field.name} || ''}
                    onChange={(e) => setNewItem(prev => ({ ...prev, ${field.name}: e.target.value }))}
                    rows={4}
                  />`
        }

        return `<Input
                    placeholder="${field.name.charAt(0).toUpperCase() + field.name.slice(1)}"
                    ${field.type === 'number' ? 'type="number"' : ''}
                    value={newItem.${field.name} || ${field.type === 'number' ? '0' : "''"}}
                    onChange={(e) => setNewItem(prev => ({ ...prev, ${field.name}: ${field.type === 'number' ? 'Number(e.target.value)' : 'e.target.value'} }))}
                  />`
      }).join('\n                  ')
  }

  private generateSidebar(design: DesignStructure, stateName: string): string {
    return `<div>
            <Card>
              <CardHeader>
                <CardTitle>Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Items</span>
                  <Badge variant="secondary">{${stateName}.length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active</span>
                  <Badge variant="default">{${stateName}.filter(item => !item.completed).length}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Completed</span>
                  <Badge variant="outline">{${stateName}.filter(item => item.completed).length}</Badge>
                </div>
              </CardContent>
            </Card>
          </div>`
  }

  private generateItemsList(feature: Feature, stateName: string, modelName: string): string {
    return `{${stateName}.length > 0 && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>All ${feature.name.charAt(0).toUpperCase() + feature.name.slice(1)}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {${stateName}.map((item, index) => (
                    <div
                      key={item.id || \`item-\${index}\`}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-gray-900">{item.title}</h3>
                          {item.description && (
                            <p className="text-gray-600 mt-1">{item.description}</p>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          ${feature.crud.update ? `<Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => item.id && toggleStatus(item.id)}
                          >
                            Toggle
                          </Button>` : ''}
                          ${feature.crud.delete ? `<Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => item.id && deleteItem(item.id)}
                          >
                            Delete
                          </Button>` : ''}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}`
  }
}