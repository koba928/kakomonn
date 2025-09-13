export interface UserProfile {
  id: string
  name: string
  email?: string
  university: string
  faculty: string
  department: string
  year: string // 学年 (1年-4年 for undergraduate)
  createdAt: string
  updatedAt: string
}

export interface UserRegistrationData {
  name: string
  university: string
  faculty: string
  department: string
  year: string
  email: string
  password?: string
  pen_name?: string
}