export interface University {
  id: string
  name: string
  faculties: Faculty[]
}

export interface Department {
  id: string
  name: string
}

export interface Faculty {
  id: string
  name: string
  deviationValue: number
  departments: Department[]
}

export const universityData: University[] = [
  {
    id: 'todai',
    name: '東京大学',
    faculties: [
      { 
        id: 'todai-law', 
        name: '法学部', 
        deviationValue: 72,
        departments: [
          { id: 'todai-law-law', name: '法学科' },
          { id: 'todai-law-politics', name: '政治学科' }
        ]
      },
      { 
        id: 'todai-economics', 
        name: '経済学部', 
        deviationValue: 70,
        departments: [
          { id: 'todai-econ-economics', name: '経済学科' },
          { id: 'todai-econ-management', name: '経営学科' }
        ]
      },
      { 
        id: 'todai-literature', 
        name: '文学部', 
        deviationValue: 69,
        departments: [
          { id: 'todai-lit-japanese', name: '日本文学科' },
          { id: 'todai-lit-history', name: '歴史学科' },
          { id: 'todai-lit-philosophy', name: '哲学科' }
        ]
      },
      { 
        id: 'todai-science', 
        name: '理学部', 
        deviationValue: 68,
        departments: [
          { id: 'todai-sci-physics', name: '物理学科' },
          { id: 'todai-sci-chemistry', name: '化学科' },
          { id: 'todai-sci-biology', name: '生物学科' },
          { id: 'todai-sci-math', name: '数学科' }
        ]
      },
      { 
        id: 'todai-engineering', 
        name: '工学部', 
        deviationValue: 67,
        departments: [
          { id: 'todai-eng-civil', name: '土木工学科' },
          { id: 'todai-eng-mechanical', name: '機械工学科' },
          { id: 'todai-eng-electrical', name: '電気工学科' },
          { id: 'todai-eng-chemical', name: '化学工学科' }
        ]
      },
      { 
        id: 'todai-medicine', 
        name: '医学部', 
        deviationValue: 75,
        departments: [
          { id: 'todai-med-medicine', name: '医学科' },
          { id: 'todai-med-health', name: '健康科学科' }
        ]
      },
      { 
        id: 'todai-pharmacy', 
        name: '薬学部', 
        deviationValue: 68,
        departments: [
          { id: 'todai-pharm-pharmacy', name: '薬学科' },
          { id: 'todai-pharm-pharmaceutical', name: '薬科学科' }
        ]
      },
      { 
        id: 'todai-agriculture', 
        name: '農学部', 
        deviationValue: 65,
        departments: [
          { id: 'todai-agri-agriculture', name: '農学科' },
          { id: 'todai-agri-forest', name: '森林科学科' },
          { id: 'todai-agri-veterinary', name: '獣医学科' }
        ]
      },
      { 
        id: 'todai-education', 
        name: '教育学部', 
        deviationValue: 66,
        departments: [
          { id: 'todai-edu-education', name: '教育学科' },
          { id: 'todai-edu-psychology', name: '心理学科' }
        ]
      }
    ]
  },
  {
    id: 'kyodai',
    name: '京都大学',
    faculties: [
      { id: 'kyodai-law', name: '法学部', deviationValue: 70 },
      { id: 'kyodai-economics', name: '経済学部', deviationValue: 69 },
      { id: 'kyodai-literature', name: '文学部', deviationValue: 67 },
      { id: 'kyodai-science', name: '理学部', deviationValue: 66 },
      { id: 'kyodai-engineering', name: '工学部', deviationValue: 65 },
      { id: 'kyodai-medicine', name: '医学部', deviationValue: 73 },
      { id: 'kyodai-pharmacy', name: '薬学部', deviationValue: 67 },
      { id: 'kyodai-agriculture', name: '農学部', deviationValue: 63 }
    ]
  },
  {
    id: 'waseda',
    name: '早稲田大学',
    faculties: [
      { id: 'waseda-law', name: '法学部', deviationValue: 65 },
      { id: 'waseda-politics', name: '政治経済学部', deviationValue: 67 },
      { id: 'waseda-literature', name: '文学部', deviationValue: 63 },
      { id: 'waseda-science', name: '理工学部', deviationValue: 64 },
      { id: 'waseda-commerce', name: '商学部', deviationValue: 65 },
      { id: 'waseda-social', name: '社会科学部', deviationValue: 64 },
      { id: 'waseda-education', name: '教育学部', deviationValue: 62 },
      { id: 'waseda-international', name: '国際教養学部', deviationValue: 68 }
    ]
  },
  {
    id: 'keio',
    name: '慶應義塾大学',
    faculties: [
      { id: 'keio-law', name: '法学部', deviationValue: 67 },
      { id: 'keio-economics', name: '経済学部', deviationValue: 68 },
      { id: 'keio-literature', name: '文学部', deviationValue: 65 },
      { id: 'keio-commerce', name: '商学部', deviationValue: 66 },
      { id: 'keio-medicine', name: '医学部', deviationValue: 72 },
      { id: 'keio-science', name: '理工学部', deviationValue: 64 },
      { id: 'keio-policy', name: '総合政策学部', deviationValue: 65 },
      { id: 'keio-environment', name: '環境情報学部', deviationValue: 63 }
    ]
  },
  {
    id: 'osaka',
    name: '大阪大学',
    faculties: [
      { id: 'osaka-law', name: '法学部', deviationValue: 66 },
      { id: 'osaka-economics', name: '経済学部', deviationValue: 65 },
      { id: 'osaka-literature', name: '文学部', deviationValue: 64 },
      { id: 'osaka-science', name: '理学部', deviationValue: 63 },
      { id: 'osaka-engineering', name: '工学部', deviationValue: 62 },
      { id: 'osaka-medicine', name: '医学部', deviationValue: 70 },
      { id: 'osaka-pharmacy', name: '薬学部', deviationValue: 65 },
      { id: 'osaka-human', name: '人間科学部', deviationValue: 61 }
    ]
  },
  {
    id: 'nagoya',
    name: '名古屋大学',
    faculties: [
      { id: 'nagoya-law', name: '法学部', deviationValue: 64 },
      { id: 'nagoya-economics', name: '経済学部', deviationValue: 63 },
      { id: 'nagoya-literature', name: '文学部', deviationValue: 62 },
      { id: 'nagoya-science', name: '理学部', deviationValue: 61 },
      { id: 'nagoya-engineering', name: '工学部', deviationValue: 60 },
      { id: 'nagoya-medicine', name: '医学部', deviationValue: 68 },
      { id: 'nagoya-agriculture', name: '農学部', deviationValue: 60 },
      { id: 'nagoya-education', name: '教育学部', deviationValue: 61 }
    ]
  },
  {
    id: 'tohoku',
    name: '東北大学',
    faculties: [
      { id: 'tohoku-law', name: '法学部', deviationValue: 63 },
      { id: 'tohoku-economics', name: '経済学部', deviationValue: 62 },
      { id: 'tohoku-literature', name: '文学部', deviationValue: 61 },
      { id: 'tohoku-science', name: '理学部', deviationValue: 60 },
      { id: 'tohoku-engineering', name: '工学部', deviationValue: 60 },
      { id: 'tohoku-medicine', name: '医学部', deviationValue: 67 },
      { id: 'tohoku-pharmacy', name: '薬学部', deviationValue: 63 },
      { id: 'tohoku-agriculture', name: '農学部', deviationValue: 60 }
    ]
  },
  {
    id: 'hokudai',
    name: '北海道大学',
    faculties: [
      { id: 'hokudai-law', name: '法学部', deviationValue: 61 },
      { id: 'hokudai-economics', name: '経済学部', deviationValue: 60 },
      { id: 'hokudai-literature', name: '文学部', deviationValue: 60 },
      { id: 'hokudai-science', name: '理学部', deviationValue: 60 },
      { id: 'hokudai-engineering', name: '工学部', deviationValue: 60 },
      { id: 'hokudai-medicine', name: '医学部', deviationValue: 65 },
      { id: 'hokudai-agriculture', name: '農学部', deviationValue: 60 },
      { id: 'hokudai-education', name: '教育学部', deviationValue: 60 }
    ]
  },
  {
    id: 'kyushu',
    name: '九州大学',
    faculties: [
      { id: 'kyushu-law', name: '法学部', deviationValue: 62 },
      { id: 'kyushu-economics', name: '経済学部', deviationValue: 61 },
      { id: 'kyushu-literature', name: '文学部', deviationValue: 60 },
      { id: 'kyushu-science', name: '理学部', deviationValue: 60 },
      { id: 'kyushu-engineering', name: '工学部', deviationValue: 60 },
      { id: 'kyushu-medicine', name: '医学部', deviationValue: 66 },
      { id: 'kyushu-pharmacy', name: '薬学部', deviationValue: 62 },
      { id: 'kyushu-agriculture', name: '農学部', deviationValue: 60 }
    ]
  },
  {
    id: 'hitotsubashi',
    name: '一橋大学',
    faculties: [
      { id: 'hitotsubashi-commerce', name: '商学部', deviationValue: 67 },
      { id: 'hitotsubashi-economics', name: '経済学部', deviationValue: 67 },
      { id: 'hitotsubashi-law', name: '法学部', deviationValue: 66 },
      { id: 'hitotsubashi-social', name: '社会学部', deviationValue: 65 }
    ]
  }
]

// 偏差値60以上の大学・学部を取得する関数
export const getUniversitiesWithDeviationAbove = (minDeviation: number = 60): University[] => {
  return universityData
    .map(university => ({
      ...university,
      faculties: university.faculties.filter(faculty => faculty.deviationValue >= minDeviation)
    }))
    .filter(university => university.faculties.length > 0)
}

// 特定の大学の偏差値60以上の学部を取得する関数
export const getFacultiesWithDeviationAbove = (universityId: string, minDeviation: number = 60): Faculty[] => {
  const university = universityData.find(u => u.id === universityId)
  if (!university) return []
  
  return university.faculties.filter(faculty => faculty.deviationValue >= minDeviation)
}