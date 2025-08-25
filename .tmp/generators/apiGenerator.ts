import { DesignStructure } from '../core/ideaAnalyzer'

export class ApiGenerator {
  generateApiRoutes(design: DesignStructure): { [path: string]: string } {
    const routes: { [path: string]: string } = {}

    for (const endpoint of design.apiEndpoints) {
      const routePath = this.getRoutePath(endpoint.path)
      routes[routePath] = this.generateRoute(endpoint, design)
    }

    return routes
  }

  private getRoutePath(path: string): string {
    return `app/api${path}/route.ts`
  }

  private generateRoute(endpoint: any, design: DesignStructure): string {
    const feature = design.features.find(f => 
      endpoint.path.includes(f.name)
    )
    
    const model = design.dataModels.find(m => 
      feature && m.name.toLowerCase().includes(feature.name.slice(0, -1))
    )

    return `import { NextRequest, NextResponse } from 'next/server'

${this.generateMockData(feature, model)}

${this.generateRouteHandlers(endpoint, feature, model)}`
  }

  private generateMockData(feature: any, model: any): string {
    if (!feature || !model) return ''

    const sampleData = this.getSampleData(feature.name, model)
    
    return `let ${feature.name}Data = ${JSON.stringify(sampleData, null, 2)}`
  }

  private getSampleData(featureName: string, model: any): any[] {
    const samples = {
      articles: [
        {
          id: '1',
          title: 'Getting Started with Development',
          content: 'A comprehensive guide to modern development practices.',
          author: 'John Doe',
          publishedAt: '2024-01-15',
          category: 'Technology'
        },
        {
          id: '2',
          title: 'Advanced Techniques',
          content: 'Exploring advanced development concepts and patterns.',
          author: 'Jane Smith',
          publishedAt: '2024-01-12',
          category: 'Tutorial'
        }
      ],
      tasks: [
        {
          id: '1',
          title: 'Complete project setup',
          description: 'Initialize the development environment',
          completed: false,
          priority: 'high',
          dueDate: '2024-01-20'
        },
        {
          id: '2',
          title: 'Write documentation',
          description: 'Create comprehensive user guides',
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
      }
    ]
  }

  private generateRouteHandlers(endpoint: any, feature: any, model: any): string {
    const methods = []

    if (endpoint.method === 'GET') {
      methods.push(this.generateGetHandler(feature))
    }
    
    if (endpoint.method === 'POST') {
      methods.push(this.generatePostHandler(feature, model))
    }
    
    if (endpoint.method === 'PUT') {
      methods.push(this.generatePutHandler(feature))
    }
    
    if (endpoint.method === 'DELETE') {
      methods.push(this.generateDeleteHandler(feature))
    }

    return methods.join('\n\n')
  }

  private generateGetHandler(feature: any): string {
    if (!feature) return ''

    if (feature.name.endsWith('s')) {
      return `export async function GET() {
  try {
    return NextResponse.json(` + feature.name + `Data)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch ` + feature.name + `' },
      { status: 500 }
    )
  }
}`
    } else {
      return `export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!params?.id) {
      return NextResponse.json(
        { error: 'ID parameter is required' },
        { status: 400 }
      )
    }
    
    const item = ` + feature.name + `Data.find(item => item.id === params.id)
    
    if (!item) {
      return NextResponse.json(
        { error: '` + feature.name.slice(0, -1) + ` not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(item)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch ` + feature.name.slice(0, -1) + `' },
      { status: 500 }
    )
  }
}`
    }
  }

  private generatePostHandler(feature: any, model: any): string {
    if (!feature) return ''

    const validationFields = model?.fields
      .filter((f: any) => f.required && f.name !== 'id')
      .map((f: any) => f.name) || ['title']

    return `export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validation
    ${validationFields.map(field => 
      `if (!body.${field}) {
      return NextResponse.json(
        { error: '${field} is required' },
        { status: 400 }
      )
    }`
    ).join('\n    ')}
    
    const newItem = {
      id: Math.random().toString(36).substring(2, 11),
      ...body,
      createdAt: new Date().toISOString().split('T')[0]
    }
    
    ` + feature.name + `Data.push(newItem)
    
    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create ${feature.name.slice(0, -1)}' },
      { status: 500 }
    )
  }
}`
  }

  private generatePutHandler(feature: any): string {
    if (!feature) return ''

    return `export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!params?.id) {
      return NextResponse.json(
        { error: 'ID parameter is required' },
        { status: 400 }
      )
    }
    
    const body = await request.json()
    const index = ` + feature.name + `Data.findIndex(item => item.id === params.id)
    
    if (index === -1) {
      return NextResponse.json(
        { error: '` + feature.name.slice(0, -1) + ` not found' },
        { status: 404 }
      )
    }
    
    ` + feature.name + `Data[index] = { ...` + feature.name + `Data[index], ...body }
    
    return NextResponse.json(` + feature.name + `Data[index])
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update ` + feature.name.slice(0, -1) + `' },
      { status: 500 }
    )
  }
}`
  }

  private generateDeleteHandler(feature: any): string {
    if (!feature) return ''

    return `export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!params?.id) {
      return NextResponse.json(
        { error: 'ID parameter is required' },
        { status: 400 }
      )
    }
    
    const index = ` + feature.name + `Data.findIndex(item => item.id === params.id)
    
    if (index === -1) {
      return NextResponse.json(
        { error: '` + feature.name.slice(0, -1) + ` not found' },
        { status: 404 }
      )
    }
    
    ` + feature.name + `Data.splice(index, 1)
    
    return NextResponse.json({ message: '` + feature.name.slice(0, -1) + ` deleted successfully' })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete ` + feature.name.slice(0, -1) + `' },
      { status: 500 }
    )
  }
}`
  }
}