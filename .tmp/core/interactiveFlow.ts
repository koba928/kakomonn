/**
 * MATURA Interactive Flow Manager
 * ユーザーとの対話を管理するシステム
 */

import readline from 'readline'

export interface AppRequirement {
  appType: string
  description: string
  features: string[]
  theme: 'modern' | 'minimal' | 'colorful' | 'professional'
  complexity: 'simple' | 'medium' | 'advanced'
  apiNeeds: boolean
  storeNeeds: boolean
  category?: string
  targetUser?: string
  primaryColor?: string
  dataStructure?: {
    mainEntity: string
    fields: string[]
  }
}

export class InteractiveFlow {
  private rl: readline.Interface

  constructor() {
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
  }

  async gatherRequirements(): Promise<AppRequirement> {
    console.log('🚀 ======================================')
    console.log('🚀 MATURA 対話式アプリ生成システム')
    console.log('🚀 ======================================')
    console.log('💬 いくつかの質問にお答えください。最適なアプリを自動生成します。\n')

    // 1. アプリの種類
    const appType = await this.selectAppType()
    
    // 2. 詳細説明
    const description = await this.getDescription(appType)
    
    // 3. 機能選択
    const features = await this.selectFeatures(appType)
    
    // 4. UIテーマ
    const theme = await this.selectTheme()
    
    // 5. 複雑度
    const complexity = await this.selectComplexity()
    
    // 6. API・Store必要性（自動判定 + 確認）
    const { apiNeeds, storeNeeds } = await this.confirmTechnicalNeeds(appType, features)

    const requirements: AppRequirement = {
      appType,
      description,
      features,
      theme,
      complexity,
      apiNeeds,
      storeNeeds
    }

    // 7. 最終確認
    await this.confirmRequirements(requirements)

    this.close()
    return requirements
  }

  private async selectAppType(): Promise<string> {
    console.log('📱 1. どのような種類のアプリを作成しますか？\n')
    console.log('   1) タスク・ToDo管理アプリ')
    console.log('   2) 家計簿・金融管理アプリ')
    console.log('   3) ブログ・コンテンツサイト')
    console.log('   4) ECサイト・ショッピングサイト')
    console.log('   5) SNS・コミュニティアプリ')
    console.log('   6) 予約・スケジュール管理')
    console.log('   7) 学習・教育アプリ')
    console.log('   8) その他（カスタム）')

    const choice = await this.question('\n🎯 選択してください (1-8): ')
    
    const appTypes = {
      '1': 'タスク・ToDo管理アプリ',
      '2': '家計簿・金融管理アプリ',
      '3': 'ブログ・コンテンツサイト',
      '4': 'ECサイト・ショッピングサイト',
      '5': 'SNS・コミュニティアプリ',
      '6': '予約・スケジュール管理',
      '7': '学習・教育アプリ',
      '8': 'カスタムアプリ'
    }

    const selected = appTypes[choice as keyof typeof appTypes] || 'カスタムアプリ'
    
    if (selected === 'カスタムアプリ') {
      const custom = await this.question('💡 どのようなアプリですか？詳しく教えてください: ')
      return custom
    }

    console.log(`✅ 選択: ${selected}\n`)
    return selected
  }

  private async getDescription(appType: string): Promise<string> {
    console.log('📝 2. アプリの詳細を教えてください\n')
    
    const suggestion = this.getDescriptionSuggestion(appType)
    if (suggestion) {
      console.log(`💡 提案: ${suggestion}`)
      const useDescription = await this.question('\n❓ この説明を使用しますか？ (y/N): ')
      
      if (useDescription.toLowerCase() === 'y' || useDescription.toLowerCase() === 'yes') {
        console.log(`✅ 説明: ${suggestion}\n`)
        return suggestion
      }
    }

    const description = await this.question('📋 アプリの目的や主な機能を詳しく説明してください: ')
    console.log(`✅ 説明: ${description}\n`)
    return description
  }

  private async selectFeatures(appType: string): Promise<string[]> {
    console.log('⚙️ 3. 必要な機能を選択してください（複数選択可）\n')
    
    const availableFeatures = this.getAvailableFeatures(appType)
    availableFeatures.forEach((feature, index) => {
      console.log(`   ${index + 1}) ${feature}`)
    })

    const selection = await this.question('\n🎯 選択してください (例: 1,3,5 または all): ')
    
    let selectedFeatures: string[] = []
    
    if (selection.toLowerCase() === 'all') {
      selectedFeatures = availableFeatures
    } else {
      const indices = selection.split(',').map(s => parseInt(s.trim()) - 1)
      selectedFeatures = indices
        .filter(i => i >= 0 && i < availableFeatures.length)
        .map(i => availableFeatures[i])
    }

    console.log(`✅ 選択された機能: ${selectedFeatures.join(', ')}\n`)
    return selectedFeatures
  }

  private async selectTheme(): Promise<'modern' | 'minimal' | 'professional'> {
    console.log('🎨 4. UIテーマを選択してください\n')
    console.log('   1) Modern - モダン・グラデーション・アニメーション')
    console.log('   2) Minimal - ミニマル・シンプル・クリーン')
    console.log('   3) Professional - プロフェッショナル・ビジネス向け')

    const choice = await this.question('\n🎯 選択してください (1-3): ')
    
    const themes = {
      '1': 'modern' as const,
      '2': 'minimal' as const,
      '3': 'professional' as const
    }

    const selected = themes[choice as keyof typeof themes] || 'modern'
    console.log(`✅ テーマ: ${selected}\n`)
    return selected
  }

  private async selectComplexity(): Promise<'simple' | 'medium' | 'advanced'> {
    console.log('🔧 5. アプリの複雑度を選択してください\n')
    console.log('   1) Simple - 基本機能のみ、シンプル構成')
    console.log('   2) Medium - 中程度の機能、バランス重視')
    console.log('   3) Advanced - 高機能、フル装備')

    const choice = await this.question('\n🎯 選択してください (1-3): ')
    
    const complexities = {
      '1': 'simple' as const,
      '2': 'medium' as const,
      '3': 'advanced' as const
    }

    const selected = complexities[choice as keyof typeof complexities] || 'medium'
    console.log(`✅ 複雑度: ${selected}\n`)
    return selected
  }

  private async confirmTechnicalNeeds(appType: string, features: string[]): Promise<{ apiNeeds: boolean; storeNeeds: boolean }> {
    console.log('🔍 6. 技術要件の確認\n')
    
    // 自動判定
    const autoApiNeeds = this.needsAPI(appType, features)
    const autoStoreNeeds = this.needsStore(appType, features)

    console.log(`💡 自動判定:`)
    console.log(`   API (バックエンド処理): ${autoApiNeeds ? '必要' : '不要'}`)
    console.log(`   Store (状態管理): ${autoStoreNeeds ? '必要' : '不要'}`)

    const confirmApi = await this.question(`\n❓ APIを含めますか？ (${autoApiNeeds ? 'Y' : 'y'}/n): `)
    const confirmStore = await this.question(`❓ 状態管理を含めますか？ (${autoStoreNeeds ? 'Y' : 'y'}/n): `)

    const apiNeeds = autoApiNeeds ? 
      (confirmApi.toLowerCase() !== 'n' && confirmApi.toLowerCase() !== 'no') :
      (confirmApi.toLowerCase() === 'y' || confirmApi.toLowerCase() === 'yes')

    const storeNeeds = autoStoreNeeds ?
      (confirmStore.toLowerCase() !== 'n' && confirmStore.toLowerCase() !== 'no') :
      (confirmStore.toLowerCase() === 'y' || confirmStore.toLowerCase() === 'yes')

    console.log(`✅ API: ${apiNeeds ? '含める' : '含めない'}`)
    console.log(`✅ Store: ${storeNeeds ? '含める' : '含めない'}\n`)

    return { apiNeeds, storeNeeds }
  }

  private async confirmRequirements(requirements: AppRequirement): Promise<void> {
    console.log('📋 7. 最終確認\n')
    console.log('生成されるアプリの仕様:')
    console.log(`   📱 種類: ${requirements.appType}`)
    console.log(`   📝 説明: ${requirements.description}`)
    console.log(`   ⚙️ 機能: ${requirements.features.join(', ')}`)
    console.log(`   🎨 テーマ: ${requirements.theme}`)
    console.log(`   🔧 複雑度: ${requirements.complexity}`)
    console.log(`   📡 API: ${requirements.apiNeeds ? 'あり' : 'なし'}`)
    console.log(`   🗄️ Store: ${requirements.storeNeeds ? 'あり' : 'なし'}`)

    const confirm = await this.question('\n❓ この仕様でアプリを生成しますか？ (Y/n): ')
    
    if (confirm.toLowerCase() === 'n' || confirm.toLowerCase() === 'no') {
      console.log('❌ 生成をキャンセルしました。')
      process.exit(0)
    }

    console.log('✅ アプリ生成を開始します！\n')
  }

  private getDescriptionSuggestion(appType: string): string {
    const suggestions: Record<string, string> = {
      'タスク・ToDo管理アプリ': 'タスクの作成・編集・削除・完了状態管理、カテゴリ分類、期限設定、優先度管理機能を持つアプリ',
      '家計簿・金融管理アプリ': '収入・支出の記録、カテゴリ別集計、月次レポート、予算管理、グラフ表示機能を持つアプリ',
      'ブログ・コンテンツサイト': '記事の投稿・編集・削除、コメント機能、カテゴリ・タグ管理、検索機能を持つブログサイト',
      'ECサイト・ショッピングサイト': '商品一覧・詳細表示、カート機能、注文管理、決済システム、ユーザー管理機能を持つECサイト',
      'SNS・コミュニティアプリ': '投稿・コメント・いいね機能、フォロー・フォロワー管理、タイムライン表示機能を持つSNSアプリ',
      '予約・スケジュール管理': '予約の作成・変更・キャンセル、カレンダー表示、リマインダー機能、空き時間管理アプリ',
      '学習・教育アプリ': 'コース管理、進捗追跡、テスト・クイズ機能、成績管理、学習履歴機能を持つ教育アプリ'
    }
    
    return suggestions[appType] || ''
  }

  private getAvailableFeatures(appType: string): string[] {
    const featureMap: Record<string, string[]> = {
      'タスク・ToDo管理アプリ': [
        'タスク作成・編集・削除',
        '期限・優先度設定',
        'カテゴリ・タグ分類',
        '進捗管理・完了率表示',
        'リマインダー・通知',
        'チーム共有・協力機能',
        'ダッシュボード・統計表示'
      ],
      '家計簿・金融管理アプリ': [
        '収入・支出記録',
        'カテゴリ別集計',
        '月次・年次レポート',
        'グラフ・チャート表示',
        '予算設定・管理',
        'レシート読み取り',
        '銀行口座連携'
      ],
      'ブログ・コンテンツサイト': [
        '記事投稿・編集',
        'コメント・評価システム',
        'カテゴリ・タグ管理',
        '検索・フィルター機能',
        'ユーザー管理・認証',
        'SEO最適化',
        'ソーシャル連携'
      ],
      'ECサイト・ショッピングサイト': [
        '商品一覧・詳細表示',
        'ショッピングカート',
        '注文・決済システム',
        'ユーザーアカウント',
        '在庫管理',
        'レビュー・評価',
        '管理者ダッシュボード'
      ],
      'SNS・コミュニティアプリ': [
        '投稿・コメント機能',
        'いいね・シェア機能',
        'フォロー・フォロワー',
        'タイムライン表示',
        'プロフィール管理',
        'チャット・メッセージ',
        'グループ・コミュニティ'
      ]
    }

    return featureMap[appType] || [
      '基本CRUD操作',
      'ユーザー認証',
      'データ管理',
      'レスポンシブデザイン',
      '検索・フィルター',
      'ダッシュボード',
      'API連携'
    ]
  }

  private needsAPI(appType: string, features: string[]): boolean {
    const apiIndicators = [
      '決済', '認証', '連携', '通知', 'レポート', '集計', 
      '検索', 'データ', '管理', 'チャット', 'メッセージ'
    ]
    
    const text = appType + ' ' + features.join(' ')
    return apiIndicators.some(indicator => text.includes(indicator))
  }

  private needsStore(appType: string, features: string[]): boolean {
    const storeIndicators = [
      'カート', '状態', '管理', '設定', '進捗', '履歴',
      'アカウント', 'プロフィール', 'フォロー', 'いいね'
    ]
    
    const text = appType + ' ' + features.join(' ')
    return storeIndicators.some(indicator => text.includes(indicator))
  }

  private question(prompt: string): Promise<string> {
    return new Promise((resolve) => {
      this.rl.question(prompt, (answer) => {
        resolve(answer.trim())
      })
    })
  }

  private close(): void {
    this.rl.close()
  }
}

export default InteractiveFlow