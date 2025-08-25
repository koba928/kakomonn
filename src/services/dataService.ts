export interface University {
  id: string
  name: string
  faculties: Faculty[]
}

export interface Faculty {
  id: string
  name: string
  departments: Department[]
}

export interface Department {
  id: string
  name: string
}

export interface Teacher {
  id: string
  name: string
  university: string
  faculty?: string
  department?: string
}

export const dataService = {
  async searchTeachers(query: string): Promise<Teacher[]> {
    // Mock implementation - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockTeachers: Teacher[] = [
          { id: '1', name: '田中教授', university: '東京大学', faculty: '工学部', department: '電子工学科' },
          { id: '2', name: '佐藤准教授', university: '早稲田大学', faculty: '理工学部', department: '数学科' }
        ]
        
        const filtered = mockTeachers.filter(teacher =>
          teacher.name.toLowerCase().includes(query.toLowerCase())
        )
        
        resolve(filtered)
      }, 500)
    })
  },

  async getUniversities(): Promise<University[]> {
    // Mock implementation - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([])
      }, 300)
    })
  }
}