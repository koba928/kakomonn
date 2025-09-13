export const APP_CONFIG = {
  name: '過去問hub',
  description: '大学生のための過去問共有プラットフォーム',
  tagline: '過去問を探せて、話せる。',
  fullDescription: '',
  version: '0.1.2'
}

export const UI_CONFIG = {
  stepIndicator: {
    steps: [
      { key: 'email', number: 1, label: 'アカウント' },
      { key: 'university', number: 2, label: '大学' },
      { key: 'faculty', number: 3, label: '学部' },
      { key: 'department', number: 4, label: '学科' },
      { key: 'year', number: 5, label: '学年' },
      { key: 'name', number: 6, label: '名前' }
    ]
  },
  yearOptions: [
    { value: '1年', label: '1年生' },
    { value: '2年', label: '2年生' },
    { value: '3年', label: '3年生' },
    { value: '4年', label: '4年生' },
    { value: '5年', label: '5年生' },
    { value: '6年', label: '6年生' }
  ]
}

export const MESSAGES = {
  success: {
    registrationComplete: '登録が完了しました！'
  },
  navigation: {
    back: '戻る',
    next: '次へ',
    complete: '完了',
    startUsing: 'はじめる'
  },
  loading: {
    registering: '登録中...'
  }
}

export const STORAGE_KEYS = {
  userProfile: 'userProfile'
}

export const FORM_CONFIG = {
  debounceDelay: 300,
  maxRetries: 3,
  timeout: 10000
}

export const THEME_CONFIG = {
  storageKey: 'theme-preference',
  defaultTheme: 'light' as const,
  themes: ['light', 'dark', 'system'] as const,
  labels: {
    light: 'ライト',
    dark: 'ダーク',
    system: 'システム'
  }
}