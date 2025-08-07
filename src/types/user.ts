export interface UserProfile {
  id: string
  name: string
  email?: string
  university: string
  faculty: string
  department: string
  year: number // 学年 (1-4 for undergraduate, 5-6 for graduate)
  createdAt: string
  updatedAt: string
}

export interface UserRegistrationData {
  name: string
  university: string
  faculty: string
  department: string
  year: number
  email?: string
}