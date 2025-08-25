export interface ServiceType {
  category: 'blog' | 'social' | 'dashboard' | 'chat' | 'ecommerce' | 'portfolio' | 'task' | 'content' | 'utility' | 'recipe' | 'finance' | 'inventory' | 'reservation' | 'education' | 'fitness' | 'other'
  subcategory: string
  confidence: number
}

export interface PageStructure {
  name: string
  path: string
  purpose: string
  required: boolean
  components: string[]
}

export interface Feature {
  name: string
  description: string
  priority: 'high' | 'medium' | 'low'
  crud: {
    create: boolean
    read: boolean
    update: boolean
    delete: boolean
  }
  realtime: boolean
  auth: boolean
}

export interface DesignStructure {
  serviceType: ServiceType
  title: string
  description: string
  pages: PageStructure[]
  features: Feature[]
  dataModels: {
    name: string
    fields: { name: string; type: string; required: boolean }[]
  }[]
  stateRequirements: {
    global: string[]
    local: string[]
    persistence: boolean
  }
  apiEndpoints: {
    path: string
    method: string
    purpose: string
    mockData: boolean
  }[]
}

export class IdeaAnalyzer {
  private servicePatterns = {
    blog: ['ブログ', 'blog', '記事', 'article', '投稿', 'post', 'ニュース', 'news'],
    social: ['SNS', 'social', 'ソーシャル', 'フォロー', 'follow', 'コミュニティ', 'community'],
    dashboard: ['ダッシュボード', 'dashboard', '管理', 'admin', '統計', 'analytics', 'レポート', 'report'],
    chat: ['チャット', 'chat', 'メッセージ', 'message', '会話', 'conversation'],
    ecommerce: ['EC', 'ecommerce', 'ショップ', 'shop', '商品', 'product', '購入', 'buy', 'カート', 'cart'],
    portfolio: ['ポートフォリオ', 'portfolio', '作品', 'work', 'ギャラリー', 'gallery'],
    task: ['タスク', 'task', 'todo', 'やること', '管理', 'プロジェクト', 'project'],
    content: ['コンテンツ', 'content', 'CMS', '投稿', 'メディア', 'media'],
    utility: ['ツール', 'tool', 'ユーティリティ', 'utility', '変換', 'convert', '計算', 'calc'],
    recipe: ['レシピ', 'recipe', '料理', 'cooking', '食材', 'ingredient', '調理', 'cook'],
    finance: ['家計簿', '財務', 'finance', '収支', 'budget', '支出', 'expense', '収入', 'income'],
    inventory: ['在庫', 'inventory', 'stock', '入庫', '出庫', '商品管理', '倉庫', 'warehouse'],
    reservation: ['予約', 'reservation', 'booking', '予定', 'appointment', 'スケジュール', 'schedule'],
    education: ['学習', 'study', '勉強', 'education', '記録', 'record', '進捗', 'progress'],
    fitness: ['フィットネス', 'fitness', '運動', 'exercise', 'トレーニング', 'training', '健康', 'health']
  }

  private featurePatterns = {
    create: ['作成', 'create', '追加', 'add', '新規', 'new', '投稿', 'post'],
    read: ['表示', 'view', '一覧', 'list', '閲覧', 'read', '検索', 'search'],
    update: ['編集', 'edit', '更新', 'update', '修正', 'modify'],
    delete: ['削除', 'delete', '除去', 'remove'],
    auth: ['ログイン', 'login', '認証', 'auth', 'ユーザー', 'user', '会員', 'member'],
    realtime: ['リアルタイム', 'realtime', 'live', 'ライブ', '同期', 'sync'],
    share: ['共有', 'share', 'シェア', '公開', 'publish'],
    comment: ['コメント', 'comment', '返信', 'reply', 'レビュー', 'review'],
    like: ['いいね', 'like', '評価', 'rate', 'お気に入り', 'favorite'],
    filter: ['フィルター', 'filter', '絞り込み', 'sort', 'ソート', 'カテゴリ', 'category']
  }

  analyzeIdea(userInput: string): DesignStructure {
    const serviceType = this.classifyService(userInput)
    const features = this.extractFeatures(userInput, serviceType)
    const pages = this.generatePages(serviceType, features)
    const dataModels = this.generateDataModels(serviceType, features)
    const stateRequirements = this.generateStateRequirements(features)
    const apiEndpoints = this.generateApiEndpoints(features, dataModels)

    return {
      serviceType,
      title: this.generateTitle(userInput, serviceType),
      description: userInput,
      pages,
      features,
      dataModels,
      stateRequirements,
      apiEndpoints
    }
  }

  private classifyService(input: string): ServiceType {
    const lowercaseInput = input.toLowerCase()
    let bestMatch = { category: 'other' as const, confidence: 0, subcategory: 'general' }

    console.log('🔍 Classifying input:', input)

    for (const [category, patterns] of Object.entries(this.servicePatterns)) {
      const matchCount = patterns.filter(pattern => 
        lowercaseInput.includes(pattern.toLowerCase())
      ).length
      
      if (matchCount > 0) {
        console.log(`📝 ${category}: ${matchCount} matches`)
      }
      
      if (matchCount > bestMatch.confidence) {
        bestMatch = {
          category: category as ServiceType['category'],
          confidence: matchCount,
          subcategory: this.getSubcategory(category, input)
        }
      }
    }

    console.log('🎯 Best match:', bestMatch)
    return bestMatch
  }

  private getSubcategory(category: string, input: string): string {
    const subcategories = {
      blog: ['tech', 'personal', 'news', 'tutorial'],
      social: ['network', 'messaging', 'community', 'dating'],
      dashboard: ['analytics', 'admin', 'monitoring', 'crm'],
      ecommerce: ['marketplace', 'store', 'subscription', 'booking'],
      portfolio: ['designer', 'developer', 'artist', 'photographer']
    }

    return subcategories[category as keyof typeof subcategories]?.[0] || 'general'
  }

  private extractFeatures(input: string, serviceType: ServiceType): Feature[] {
    const features: Feature[] = []
    const lowercaseInput = input.toLowerCase()

    // Base features by service type
    const baseFeatures = this.getBaseFeatures(serviceType.category)
    features.push(...baseFeatures)

    // Extract additional features from input
    for (const [featureName, patterns] of Object.entries(this.featurePatterns)) {
      const hasFeature = patterns.some(pattern => 
        lowercaseInput.includes(pattern.toLowerCase())
      )
      
      if (hasFeature && !features.some(f => f.name === featureName)) {
        features.push(this.createFeature(featureName, 'medium'))
      }
    }

    return features
  }

  private getBaseFeatures(category: ServiceType['category']): Feature[] {
    const baseFeatureMap = {
      blog: [
        this.createFeature('articles', 'high', { create: true, read: true, update: true, delete: true }),
        this.createFeature('comments', 'medium', { create: true, read: true, update: false, delete: true }),
        this.createFeature('categories', 'medium', { create: true, read: true, update: true, delete: true }),
        this.createFeature('search', 'medium', { create: false, read: true, update: false, delete: false })
      ],
      social: [
        this.createFeature('posts', 'high', { create: true, read: true, update: true, delete: true }),
        this.createFeature('follow', 'high', { create: true, read: true, update: false, delete: true }),
        this.createFeature('likes', 'medium', { create: true, read: true, update: false, delete: true }),
        this.createFeature('messages', 'medium', { create: true, read: true, update: false, delete: true })
      ],
      dashboard: [
        this.createFeature('analytics', 'high', { create: false, read: true, update: false, delete: false }),
        this.createFeature('charts', 'high', { create: true, read: true, update: true, delete: true }),
        this.createFeature('reports', 'medium', { create: true, read: true, update: true, delete: true })
      ],
      task: [
        this.createFeature('tasks', 'high', { create: true, read: true, update: true, delete: true }),
        this.createFeature('projects', 'medium', { create: true, read: true, update: true, delete: true }),
        this.createFeature('status', 'medium', { create: false, read: true, update: true, delete: false })
      ],
      ecommerce: [
        this.createFeature('products', 'high', { create: true, read: true, update: true, delete: true }),
        this.createFeature('cart', 'high', { create: true, read: true, update: true, delete: true }),
        this.createFeature('orders', 'high', { create: true, read: true, update: true, delete: false })
      ],
      recipe: [
        this.createFeature('recipes', 'high', { create: true, read: true, update: true, delete: true }),
        this.createFeature('ingredients', 'high', { create: true, read: true, update: true, delete: true }),
        this.createFeature('categories', 'medium', { create: true, read: true, update: true, delete: true }),
        this.createFeature('favorites', 'medium', { create: true, read: true, update: false, delete: true })
      ],
      finance: [
        this.createFeature('transactions', 'high', { create: true, read: true, update: true, delete: true }),
        this.createFeature('categories', 'high', { create: true, read: true, update: true, delete: true }),
        this.createFeature('budgets', 'medium', { create: true, read: true, update: true, delete: true }),
        this.createFeature('reports', 'medium', { create: false, read: true, update: false, delete: false })
      ],
      inventory: [
        this.createFeature('products', 'high', { create: true, read: true, update: true, delete: true }),
        this.createFeature('stock', 'high', { create: true, read: true, update: true, delete: false }),
        this.createFeature('suppliers', 'medium', { create: true, read: true, update: true, delete: true }),
        this.createFeature('transactions', 'medium', { create: true, read: true, update: false, delete: false })
      ],
      reservation: [
        this.createFeature('reservations', 'high', { create: true, read: true, update: true, delete: true }),
        this.createFeature('customers', 'high', { create: true, read: true, update: true, delete: true }),
        this.createFeature('availability', 'medium', { create: true, read: true, update: true, delete: true }),
        this.createFeature('notifications', 'medium', { create: true, read: true, update: false, delete: true })
      ],
      education: [
        this.createFeature('sessions', 'high', { create: true, read: true, update: true, delete: true }),
        this.createFeature('subjects', 'high', { create: true, read: true, update: true, delete: true }),
        this.createFeature('progress', 'medium', { create: false, read: true, update: true, delete: false }),
        this.createFeature('goals', 'medium', { create: true, read: true, update: true, delete: true })
      ],
      fitness: [
        this.createFeature('workouts', 'high', { create: true, read: true, update: true, delete: true }),
        this.createFeature('exercises', 'high', { create: true, read: true, update: true, delete: true }),
        this.createFeature('progress', 'medium', { create: true, read: true, update: true, delete: false }),
        this.createFeature('goals', 'medium', { create: true, read: true, update: true, delete: true })
      ]
    }

    return baseFeatureMap[category] || [
      this.createFeature('items', 'high', { create: true, read: true, update: true, delete: true })
    ]
  }

  private createFeature(
    name: string, 
    priority: 'high' | 'medium' | 'low' = 'medium',
    crud = { create: true, read: true, update: true, delete: true }
  ): Feature {
    return {
      name,
      description: `${name} management functionality`,
      priority,
      crud,
      realtime: ['messages', 'chat', 'live'].includes(name),
      auth: ['follow', 'messages', 'orders', 'profile'].includes(name)
    }
  }

  private generatePages(serviceType: ServiceType, features: Feature[]): PageStructure[] {
    const basePages: PageStructure[] = [
      {
        name: 'Home',
        path: '/',
        purpose: 'Landing page and main content display',
        required: true,
        components: ['Header', 'Hero', 'MainContent', 'Footer']
      }
    ]

    // Add feature-specific pages
    for (const feature of features) {
      if (feature.crud.create || feature.crud.update) {
        basePages.push({
          name: `${feature.name} Management`,
          path: `/${feature.name}`,
          purpose: `Manage ${feature.name}`,
          required: feature.priority === 'high',
          components: ['Header', `${feature.name}List`, `${feature.name}Form`, 'Footer']
        })
      }
    }

    return basePages
  }

  private generateDataModels(serviceType: ServiceType, features: Feature[]) {
    const models = []

    for (const feature of features) {
      if (feature.crud.create || feature.crud.read) {
        models.push({
          name: feature.name.charAt(0).toUpperCase() + feature.name.slice(1, -1),
          fields: this.getFieldsForFeature(feature.name)
        })
      }
    }

    return models
  }

  private getFieldsForFeature(featureName: string) {
    const fieldMap = {
      articles: [
        { name: 'id', type: 'string', required: true },
        { name: 'title', type: 'string', required: true },
        { name: 'content', type: 'string', required: true },
        { name: 'author', type: 'string', required: true },
        { name: 'publishedAt', type: 'Date', required: true },
        { name: 'category', type: 'string', required: false }
      ],
      tasks: [
        { name: 'id', type: 'string', required: true },
        { name: 'title', type: 'string', required: true },
        { name: 'description', type: 'string', required: false },
        { name: 'completed', type: 'boolean', required: true },
        { name: 'priority', type: 'string', required: false },
        { name: 'dueDate', type: 'Date', required: false }
      ],
      products: [
        { name: 'id', type: 'string', required: true },
        { name: 'name', type: 'string', required: true },
        { name: 'price', type: 'number', required: true },
        { name: 'description', type: 'string', required: false },
        { name: 'imageUrl', type: 'string', required: false },
        { name: 'category', type: 'string', required: false }
      ],
      recipes: [
        { name: 'id', type: 'string', required: true },
        { name: 'title', type: 'string', required: true },
        { name: 'description', type: 'string', required: false },
        { name: 'ingredients', type: 'string[]', required: true },
        { name: 'instructions', type: 'string', required: true },
        { name: 'cookingTime', type: 'number', required: false },
        { name: 'difficulty', type: 'string', required: false },
        { name: 'category', type: 'string', required: false }
      ],
      transactions: [
        { name: 'id', type: 'string', required: true },
        { name: 'amount', type: 'number', required: true },
        { name: 'type', type: 'string', required: true },
        { name: 'category', type: 'string', required: true },
        { name: 'description', type: 'string', required: false },
        { name: 'date', type: 'Date', required: true }
      ],
      stock: [
        { name: 'id', type: 'string', required: true },
        { name: 'productId', type: 'string', required: true },
        { name: 'quantity', type: 'number', required: true },
        { name: 'minQuantity', type: 'number', required: false },
        { name: 'location', type: 'string', required: false },
        { name: 'lastUpdated', type: 'Date', required: true }
      ],
      reservations: [
        { name: 'id', type: 'string', required: true },
        { name: 'customerName', type: 'string', required: true },
        { name: 'customerEmail', type: 'string', required: false },
        { name: 'date', type: 'Date', required: true },
        { name: 'time', type: 'string', required: true },
        { name: 'service', type: 'string', required: true },
        { name: 'status', type: 'string', required: true }
      ],
      sessions: [
        { name: 'id', type: 'string', required: true },
        { name: 'subject', type: 'string', required: true },
        { name: 'duration', type: 'number', required: true },
        { name: 'date', type: 'Date', required: true },
        { name: 'notes', type: 'string', required: false },
        { name: 'progress', type: 'number', required: false }
      ],
      workouts: [
        { name: 'id', type: 'string', required: true },
        { name: 'name', type: 'string', required: true },
        { name: 'duration', type: 'number', required: true },
        { name: 'exercises', type: 'string[]', required: true },
        { name: 'date', type: 'Date', required: true },
        { name: 'calories', type: 'number', required: false }
      ]
    }

    return fieldMap[featureName as keyof typeof fieldMap] || [
      { name: 'id', type: 'string', required: true },
      { name: 'title', type: 'string', required: true },
      { name: 'createdAt', type: 'Date', required: true }
    ]
  }

  private generateStateRequirements(features: Feature[]) {
    const global = ['loading', 'error']
    const local = []
    let persistence = false

    for (const feature of features) {
      global.push(feature.name)
      if (feature.crud.create || feature.crud.update) {
        local.push(`${feature.name}Form`)
        persistence = true
      }
      if (feature.auth) {
        global.push('user', 'auth')
      }
    }

    return { global: [...new Set(global)], local, persistence }
  }

  private generateApiEndpoints(features: Feature[], dataModels: any[]) {
    const endpoints = []

    for (const feature of features) {
      const basePath = `/${feature.name}`
      
      if (feature.crud.read) {
        endpoints.push({
          path: basePath,
          method: 'GET',
          purpose: `Get all ${feature.name}`,
          mockData: true
        })
      }
      
      if (feature.crud.create) {
        endpoints.push({
          path: basePath,
          method: 'POST',
          purpose: `Create new ${feature.name.slice(0, -1)}`,
          mockData: true
        })
      }

      if (feature.crud.update) {
        endpoints.push({
          path: `${basePath}/[id]`,
          method: 'PUT',
          purpose: `Update ${feature.name.slice(0, -1)}`,
          mockData: true
        })
      }

      if (feature.crud.delete) {
        endpoints.push({
          path: `${basePath}/[id]`,
          method: 'DELETE',
          purpose: `Delete ${feature.name.slice(0, -1)}`,
          mockData: false
        })
      }
    }

    return endpoints
  }

  private generateTitle(input: string, serviceType: ServiceType): string {
    const words = input.split(' ').slice(0, 3)
    const baseTitle = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    
    const suffixes = {
      blog: 'Blog',
      social: 'Social',
      dashboard: 'Dashboard',
      task: 'Manager',
      ecommerce: 'Store',
      portfolio: 'Portfolio',
      recipe: 'Recipe Manager',
      finance: 'Finance Tracker',
      inventory: 'Inventory System',
      reservation: 'Booking System',
      education: 'Learning Tracker',
      fitness: 'Fitness Tracker'
    }

    return `${baseTitle} ${suffixes[serviceType.category] || 'App'}`
  }
}