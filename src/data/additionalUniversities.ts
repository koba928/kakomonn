export interface AdditionalUniversityData {
  id: string
  name: string
  shortName?: string
  region: string
  type: 'national' | 'public' | 'private'
  establishedYear?: number
  faculties: {
    id: string
    name: string
    departments: {
      id: string
      name: string
    }[]
  }[]
}

export const additionalUniversities: AdditionalUniversityData[] = [
  // 重複を避けるため、keioとwasedaはuniversityDataDetailed.tsで定義済み
  // 必要に応じて他の大学を追加
]