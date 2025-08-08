export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export function validateFile(file: File): ValidationResult {
  const errors: string[] = []
  
  // File size validation (10MB max)
  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    errors.push('ファイルサイズは10MB以下である必要があります')
  }
  
  // File type validation
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']
  if (!allowedTypes.includes(file.type)) {
    errors.push('PDF、JPEG、PNGファイルのみアップロード可能です')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export function validateCourseData(data: any): ValidationResult {
  const errors: string[] = []
  
  if (!data.courseName?.trim()) {
    errors.push('授業名は必須です')
  }
  
  if (!data.teacher?.trim()) {
    errors.push('教員名は必須です')
  }
  
  if (!data.university?.trim()) {
    errors.push('大学名は必須です')
  }
  
  if (!data.year || data.year < 2020 || data.year > new Date().getFullYear()) {
    errors.push('有効な年度を選択してください')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

export const validationSchemas = {
  courseName: { required: true, minLength: 1, maxLength: 100 },
  teacher: { required: true, minLength: 1, maxLength: 50 },
  university: { required: true },
  year: { required: true, min: 2020, max: new Date().getFullYear() }
}

export const validationRules = {
  required: (value: any) => !!value,
  minLength: (value: string, min: number) => value.length >= min,
  maxLength: (value: string, max: number) => value.length <= max,
  min: (value: number, min: number) => value >= min,
  max: (value: number, max: number) => value <= max
}

export function validateField(value: any, rules: any): ValidationResult {
  const errors: string[] = []
  
  if (rules.required && !validationRules.required(value)) {
    errors.push('この項目は必須です')
    return { isValid: false, errors }
  }
  
  if (typeof value === 'string') {
    if (rules.minLength && !validationRules.minLength(value, rules.minLength)) {
      errors.push(`${rules.minLength}文字以上で入力してください`)
    }
    if (rules.maxLength && !validationRules.maxLength(value, rules.maxLength)) {
      errors.push(`${rules.maxLength}文字以下で入力してください`)
    }
  }
  
  if (typeof value === 'number') {
    if (rules.min && !validationRules.min(value, rules.min)) {
      errors.push(`${rules.min}以上の値を入力してください`)
    }
    if (rules.max && !validationRules.max(value, rules.max)) {
      errors.push(`${rules.max}以下の値を入力してください`)
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}