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

export interface University {
  id: string
  name: string
  faculties: Faculty[]
}

// import { additionalUniversities } from './additionalUniversities'

const baseUniversities: University[] = [
  // 国立大学
  {
    id: 'todai',
    name: '東京大学',
    faculties: [
      {
        id: 'todai-bunka1',
        name: '文科一類',
        deviationValue: 70,
        departments: [
          { id: 'todai-bunka1-law', name: '法学部進学予定' },
          { id: 'todai-bunka1-other', name: 'その他学部進学可能' },
          { id: 'todai-bunka1-undecided', name: '進学先未定' }
        ]
      },
      {
        id: 'todai-bunka2',
        name: '文科二類',
        deviationValue: 69,
        departments: [
          { id: 'todai-bunka2-economics', name: '経済学部進学予定' },
          { id: 'todai-bunka2-other', name: 'その他学部進学可能' },
          { id: 'todai-bunka2-undecided', name: '進学先未定' }
        ]
      },
      {
        id: 'todai-bunka3',
        name: '文科三類',
        deviationValue: 68,
        departments: [
          { id: 'todai-bunka3-literature', name: '文学部進学予定' },
          { id: 'todai-bunka3-education', name: '教育学部進学予定' },
          { id: 'todai-bunka3-liberal', name: '教養学部進学予定' },
          { id: 'todai-bunka3-other', name: 'その他学部進学可能' },
          { id: 'todai-bunka3-undecided', name: '進学先未定' }
        ]
      },
      {
        id: 'todai-rika1',
        name: '理科一類',
        deviationValue: 68,
        departments: [
          { id: 'todai-rika1-engineering', name: '工学部進学予定' },
          { id: 'todai-rika1-science', name: '理学部進学可能' },
          { id: 'todai-rika1-other', name: 'その他学部進学可能' },
          { id: 'todai-rika1-undecided', name: '進学先未定' }
        ]
      },
      {
        id: 'todai-rika2',
        name: '理科二類',
        deviationValue: 67,
        departments: [
          { id: 'todai-rika2-agriculture', name: '農学部進学予定' },
          { id: 'todai-rika2-pharmacy', name: '薬学部進学予定' },
          { id: 'todai-rika2-science', name: '理学部進学可能' },
          { id: 'todai-rika2-other', name: 'その他学部進学可能' },
          { id: 'todai-rika2-undecided', name: '進学先未定' }
        ]
      },
      {
        id: 'todai-rika3',
        name: '理科三類',
        deviationValue: 75,
        departments: [
          { id: 'todai-rika3-medicine', name: '医学部医学科進学予定' },
          { id: 'todai-rika3-health', name: '医学部健康総合科学科進学可能' },
          { id: 'todai-rika3-other', name: 'その他学部進学可能' },
          { id: 'todai-rika3-undecided', name: '進学先未定' }
        ]
      }
    ]
  },
  {
    id: 'kyoto',
    name: '京都大学',
    faculties: [
      {
        id: 'kyoto-integrated-human-studies',
        name: '総合人間学部',
        deviationValue: 65,
        departments: [
          { id: 'kyoto-ihs-integrated-human', name: '総合人間学科' },
          { id: 'kyoto-ihs-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'kyoto-literature',
        name: '文学部',
        deviationValue: 68,
        departments: [
          { id: 'kyoto-lit-humanities', name: '人文学科' },
          { id: 'kyoto-lit-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'kyoto-education',
        name: '教育学部',
        deviationValue: 66,
        departments: [
          { id: 'kyoto-edu-educational-science', name: '教育科学科' },
          { id: 'kyoto-edu-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'kyoto-law',
        name: '法学部',
        deviationValue: 70,
        departments: [
          { id: 'kyoto-law-law', name: '法学科' },
          { id: 'kyoto-law-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'kyoto-economics',
        name: '経済学部',
        deviationValue: 69,
        departments: [
          { id: 'kyoto-econ-economics', name: '経済経営学科' },
          { id: 'kyoto-econ-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'kyoto-science',
        name: '理学部',
        deviationValue: 67,
        departments: [
          { id: 'kyoto-sci-math', name: '数学科' },
          { id: 'kyoto-sci-physics', name: '物理学科' },
          { id: 'kyoto-sci-astronomy', name: '宇宙物理学科' },
          { id: 'kyoto-sci-geophysics', name: '地球惑星科学科' },
          { id: 'kyoto-sci-chemistry', name: '化学科' },
          { id: 'kyoto-sci-biology', name: '生物科学科' },
          { id: 'kyoto-sci-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'kyoto-medicine',
        name: '医学部',
        deviationValue: 74,
        departments: [
          { id: 'kyoto-med-medicine', name: '医学科' },
          { id: 'kyoto-med-health', name: '人間健康科学科' },
          { id: 'kyoto-med-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'kyoto-pharmacy',
        name: '薬学部',
        deviationValue: 67,
        departments: [
          { id: 'kyoto-pharm-pharmacy', name: '薬学科（6年制）' },
          { id: 'kyoto-pharm-pharmaceutical', name: '薬科学科（4年制）' },
          { id: 'kyoto-pharm-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'kyoto-engineering',
        name: '工学部',
        deviationValue: 66,
        departments: [
          { id: 'kyoto-eng-architecture', name: '建築学科' },
          { id: 'kyoto-eng-industrial-chem', name: '工業化学科' },
          { id: 'kyoto-eng-info-elec', name: '情報学科' },
          { id: 'kyoto-eng-electrical', name: '電気電子工学科' },
          { id: 'kyoto-eng-mechanical', name: '機械工学科' },
          { id: 'kyoto-eng-materials', name: '物理工学科' },
          { id: 'kyoto-eng-resource', name: '地球工学科' },
          { id: 'kyoto-eng-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'kyoto-agriculture',
        name: '農学部',
        deviationValue: 64,
        departments: [
          { id: 'kyoto-agri-resource-bio', name: '資源生物科学科' },
          { id: 'kyoto-agri-applied-life', name: '応用生命科学科' },
          { id: 'kyoto-agri-environment', name: '地域環境工学科' },
          { id: 'kyoto-agri-food-environment', name: '食料・環境経済学科' },
          { id: 'kyoto-agri-forest', name: '森林科学科' },
          { id: 'kyoto-agri-food-bio', name: '食品生物科学科' },
          { id: 'kyoto-agri-undecided', name: '学科未定' }
        ]
      }
    ]
  },
  {
    id: 'osaka',
    name: '大阪大学',
    faculties: [
      {
        id: 'osaka-literature',
        name: '文学部',
        deviationValue: 66,
        departments: [
          { id: 'osaka-lit-humanities', name: '人文学科' },
          { id: 'osaka-lit-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'osaka-human-sciences',
        name: '人間科学部',
        deviationValue: 64,
        departments: [
          { id: 'osaka-human-human-sciences', name: '人間科学科' },
          { id: 'osaka-human-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'osaka-foreign-studies',
        name: '外国語学部',
        deviationValue: 62,
        departments: [
          { id: 'osaka-foreign-foreign-studies', name: '外国語学科' },
          { id: 'osaka-foreign-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'osaka-law',
        name: '法学部',
        deviationValue: 68,
        departments: [
          { id: 'osaka-law-law', name: '法学科' },
          { id: 'osaka-law-international-public-policy', name: '国際公共政策学科' },
          { id: 'osaka-law-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'osaka-economics',
        name: '経済学部',
        deviationValue: 67,
        departments: [
          { id: 'osaka-econ-economics', name: '経済・経営学科' },
          { id: 'osaka-econ-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'osaka-science',
        name: '理学部',
        deviationValue: 65,
        departments: [
          { id: 'osaka-sci-math', name: '数学科' },
          { id: 'osaka-sci-physics', name: '物理学科' },
          { id: 'osaka-sci-chemistry', name: '化学科' },
          { id: 'osaka-sci-biology', name: '生物科学科' },
          { id: 'osaka-sci-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'osaka-medicine',
        name: '医学部',
        deviationValue: 73,
        departments: [
          { id: 'osaka-med-medicine', name: '医学科' },
          { id: 'osaka-med-health', name: '保健学科' },
          { id: 'osaka-med-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'osaka-dentistry',
        name: '歯学部',
        deviationValue: 68,
        departments: [
          { id: 'osaka-dent-dentistry', name: '歯学科' },
          { id: 'osaka-dent-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'osaka-pharmacy',
        name: '薬学部',
        deviationValue: 66,
        departments: [
          { id: 'osaka-pharm-pharmacy', name: '薬学科（6年制）' },
          { id: 'osaka-pharm-pharmaceutical', name: '薬科学科（4年制）' },
          { id: 'osaka-pharm-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'osaka-engineering',
        name: '工学部',
        deviationValue: 64,
        departments: [
          { id: 'osaka-eng-applied-science', name: '応用自然科学科' },
          { id: 'osaka-eng-applied-chemistry', name: '応用理工学科' },
          { id: 'osaka-eng-electronics-info', name: '電子情報工学科' },
          { id: 'osaka-eng-environment-energy', name: '環境・エネルギー工学科' },
          { id: 'osaka-eng-ground-architecture', name: '地球総合工学科' },
          { id: 'osaka-eng-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'osaka-engineering-science',
        name: '基礎工学部',
        deviationValue: 63,
        departments: [
          { id: 'osaka-eng-sci-electronic-physical-science', name: '電子物理科学科' },
          { id: 'osaka-eng-sci-chemistry-bio-engineering', name: '化学応用科学科' },
          { id: 'osaka-eng-sci-systems-science', name: 'システム科学科' },
          { id: 'osaka-eng-sci-info-science', name: '情報科学科' },
          { id: 'osaka-eng-sci-undecided', name: '学科未定' }
        ]
      }
    ]
  },
  {
    id: 'nagoya',
    name: '名古屋大学',
    faculties: [
      {
        id: 'nagoya-literature',
        name: '文学部',
        deviationValue: 64,
        departments: [
          { id: 'nagoya-lit-humanities', name: '人文学科' },
          { id: 'nagoya-lit-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'nagoya-education',
        name: '教育学部',
        deviationValue: 62,
        departments: [
          { id: 'nagoya-edu-education', name: '人間発達科学科' },
          { id: 'nagoya-edu-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'nagoya-law',
        name: '法学部',
        deviationValue: 66,
        departments: [
          { id: 'nagoya-law-law', name: '法律・政治学科' },
          { id: 'nagoya-law-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'nagoya-economics',
        name: '経済学部',
        deviationValue: 65,
        departments: [
          { id: 'nagoya-econ-economics', name: '経済学科' },
          { id: 'nagoya-econ-management', name: '経営学科' },
          { id: 'nagoya-econ-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'nagoya-informatics',
        name: '情報学部',
        deviationValue: 64,
        departments: [
          { id: 'nagoya-info-natural-informatics', name: '自然情報学科' },
          { id: 'nagoya-info-human-social-informatics', name: '人間・社会情報学科' },
          { id: 'nagoya-info-computer-science', name: 'コンピュータ科学科' },
          { id: 'nagoya-info-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'nagoya-science',
        name: '理学部',
        deviationValue: 63,
        departments: [
          { id: 'nagoya-sci-math', name: '数理学科' },
          { id: 'nagoya-sci-physics', name: '物理学科' },
          { id: 'nagoya-sci-chemistry', name: '化学科' },
          { id: 'nagoya-sci-biology', name: '生命理学科' },
          { id: 'nagoya-sci-earth', name: '地球惑星科学科' },
          { id: 'nagoya-sci-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'nagoya-medicine',
        name: '医学部',
        deviationValue: 71,
        departments: [
          { id: 'nagoya-med-medicine', name: '医学科' },
          { id: 'nagoya-med-health', name: '保健学科' },
          { id: 'nagoya-med-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'nagoya-engineering',
        name: '工学部',
        deviationValue: 62,
        departments: [
          { id: 'nagoya-eng-chemical-bio', name: '化学生命工学科' },
          { id: 'nagoya-eng-materials', name: '物理工学科' },
          { id: 'nagoya-eng-mechanical-aerospace', name: '機械・航空宇宙工学科' },
          { id: 'nagoya-eng-energy', name: 'エネルギー理工学科' },
          { id: 'nagoya-eng-environmental-civil', name: '環境土木・建築学科' },
          { id: 'nagoya-eng-electrical-electronics-info', name: '電気電子情報学科' },
          { id: 'nagoya-eng-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'nagoya-agriculture',
        name: '農学部',
        deviationValue: 61,
        departments: [
          { id: 'nagoya-agri-bio-environmental', name: '生物環境科学科' },
          { id: 'nagoya-agri-resource-bio', name: '資源生物科学科' },
          { id: 'nagoya-agri-applied-bio', name: '応用生命科学科' },
          { id: 'nagoya-agri-undecided', name: '学科未定' }
        ]
      }
    ]
  },
  {
    id: 'tohoku',
    name: '東北大学',
    faculties: [
      {
        id: 'tohoku-literature',
        name: '文学部',
        deviationValue: 63,
        departments: [
          { id: 'tohoku-lit-humanities', name: '人文社会学科' },
          { id: 'tohoku-lit-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'tohoku-education',
        name: '教育学部',
        deviationValue: 61,
        departments: [
          { id: 'tohoku-edu-education', name: '教育科学科' },
          { id: 'tohoku-edu-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'tohoku-law',
        name: '法学部',
        deviationValue: 64,
        departments: [
          { id: 'tohoku-law-law', name: '法学科' },
          { id: 'tohoku-law-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'tohoku-economics',
        name: '経済学部',
        deviationValue: 63,
        departments: [
          { id: 'tohoku-econ-economics', name: '経済学科' },
          { id: 'tohoku-econ-management', name: '経営学科' },
          { id: 'tohoku-econ-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'tohoku-science',
        name: '理学部',
        deviationValue: 62,
        departments: [
          { id: 'tohoku-sci-math', name: '数学科' },
          { id: 'tohoku-sci-physics', name: '物理学科' },
          { id: 'tohoku-sci-astronomy', name: '宇宙地球物理学科' },
          { id: 'tohoku-sci-chemistry', name: '化学科' },
          { id: 'tohoku-sci-earth', name: '地圏環境科学科' },
          { id: 'tohoku-sci-biology', name: '生物学科' },
          { id: 'tohoku-sci-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'tohoku-medicine',
        name: '医学部',
        deviationValue: 70,
        departments: [
          { id: 'tohoku-med-medicine', name: '医学科' },
          { id: 'tohoku-med-health', name: '保健学科' },
          { id: 'tohoku-med-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'tohoku-dentistry',
        name: '歯学部',
        deviationValue: 64,
        departments: [
          { id: 'tohoku-dent-dentistry', name: '歯学科' },
          { id: 'tohoku-dent-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'tohoku-pharmacy',
        name: '薬学部',
        deviationValue: 64,
        departments: [
          { id: 'tohoku-pharm-pharmacy', name: '薬学科（6年制）' },
          { id: 'tohoku-pharm-pharmaceutical', name: '創薬科学科（4年制）' },
          { id: 'tohoku-pharm-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'tohoku-engineering',
        name: '工学部',
        deviationValue: 61,
        departments: [
          { id: 'tohoku-eng-mechanical-aerospace', name: '機械知能・航空工学科' },
          { id: 'tohoku-eng-electrical-info-physics', name: '電気情報物理工学科' },
          { id: 'tohoku-eng-applied-chem-chem-engineering', name: '化学・バイオ工学科' },
          { id: 'tohoku-eng-materials-science', name: '材料科学総合学科' },
          { id: 'tohoku-eng-civil-environment', name: '建築・社会環境工学科' },
          { id: 'tohoku-eng-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'tohoku-agriculture',
        name: '農学部',
        deviationValue: 59,
        departments: [
          { id: 'tohoku-agri-bio-production', name: '生物生産科学科' },
          { id: 'tohoku-agri-applied-bio', name: '応用生物化学科' },
          { id: 'tohoku-agri-undecided', name: '学科未定' }
        ]
      }
    ]
  },
  {
    id: 'hokkaido',
    name: '北海道大学',
    faculties: [
      {
        id: 'hokkaido-literature',
        name: '文学部',
        deviationValue: 61,
        departments: [
          { id: 'hokkaido-lit-humanities', name: '人文科学科' },
          { id: 'hokkaido-lit-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'hokkaido-education',
        name: '教育学部',
        deviationValue: 59,
        departments: [
          { id: 'hokkaido-edu-education', name: '教育学科' },
          { id: 'hokkaido-edu-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'hokkaido-law',
        name: '法学部',
        deviationValue: 62,
        departments: [
          { id: 'hokkaido-law-law', name: '法学課程' },
          { id: 'hokkaido-law-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'hokkaido-economics',
        name: '経済学部',
        deviationValue: 61,
        departments: [
          { id: 'hokkaido-econ-economics', name: '経済学科' },
          { id: 'hokkaido-econ-management', name: '経営学科' },
          { id: 'hokkaido-econ-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'hokkaido-science',
        name: '理学部',
        deviationValue: 60,
        departments: [
          { id: 'hokkaido-sci-math', name: '数学科' },
          { id: 'hokkaido-sci-physics', name: '物理学科' },
          { id: 'hokkaido-sci-chemistry', name: '化学科' },
          { id: 'hokkaido-sci-biology', name: '生物科学科' },
          { id: 'hokkaido-sci-earth', name: '地球惑星科学科' },
          { id: 'hokkaido-sci-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'hokkaido-medicine',
        name: '医学部',
        deviationValue: 69,
        departments: [
          { id: 'hokkaido-med-medicine', name: '医学科' },
          { id: 'hokkaido-med-health', name: '保健学科' },
          { id: 'hokkaido-med-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'hokkaido-dentistry',
        name: '歯学部',
        deviationValue: 62,
        departments: [
          { id: 'hokkaido-dent-dentistry', name: '歯学科' },
          { id: 'hokkaido-dent-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'hokkaido-pharmacy',
        name: '薬学部',
        deviationValue: 62,
        departments: [
          { id: 'hokkaido-pharm-pharmacy', name: '薬学科（6年制）' },
          { id: 'hokkaido-pharm-pharmaceutical', name: '薬科学科（4年制）' },
          { id: 'hokkaido-pharm-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'hokkaido-engineering',
        name: '工学部',
        deviationValue: 59,
        departments: [
          { id: 'hokkaido-eng-applied-science', name: '応用理工系学科' },
          { id: 'hokkaido-eng-info-electronics', name: '情報エレクトロニクス学科' },
          { id: 'hokkaido-eng-mechanical-aerospace', name: '機械知能工学科' },
          { id: 'hokkaido-eng-environment-social-infrastructure', name: '環境社会工学科' },
          { id: 'hokkaido-eng-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'hokkaido-agriculture',
        name: '農学部',
        deviationValue: 58,
        departments: [
          { id: 'hokkaido-agri-bio-production', name: '生物生産学科' },
          { id: 'hokkaido-agri-applied-bio', name: '応用生命科学科' },
          { id: 'hokkaido-agri-bio-functional-chem', name: '生物機能化学科' },
          { id: 'hokkaido-agri-forest-science', name: '森林科学科' },
          { id: 'hokkaido-agri-bioresource', name: '畜産科学科' },
          { id: 'hokkaido-agri-bio-environmental', name: '生物環境工学科' },
          { id: 'hokkaido-agri-agriculture-economics', name: '農業経済学科' },
          { id: 'hokkaido-agri-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'hokkaido-veterinary',
        name: '獣医学部',
        deviationValue: 65,
        departments: [
          { id: 'hokkaido-vet-veterinary', name: '獣医学科' },
          { id: 'hokkaido-vet-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'hokkaido-fisheries',
        name: '水産学部',
        deviationValue: 56,
        departments: [
          { id: 'hokkaido-fish-marine-bio-production', name: '海洋生物科学科' },
          { id: 'hokkaido-fish-marine-resources', name: '海洋資源科学科' },
          { id: 'hokkaido-fish-aquaculture', name: '増殖生命科学科' },
          { id: 'hokkaido-fish-aquatic-bioscience', name: '資源機能化学科' },
          { id: 'hokkaido-fish-undecided', name: '学科未定' }
        ]
      }
    ]
  },
  {
    id: 'kyushu',
    name: '九州大学',
    faculties: [
      {
        id: 'kyushu-kyoso',
        name: '共創学部',
        deviationValue: 61,
        departments: [
          { id: 'kyushu-kyoso-kyoso', name: '共創学科' },
          { id: 'kyushu-kyoso-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'kyushu-literature',
        name: '文学部',
        deviationValue: 62,
        departments: [
          { id: 'kyushu-lit-humanities', name: '人文学科' },
          { id: 'kyushu-lit-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'kyushu-education',
        name: '教育学部',
        deviationValue: 60,
        departments: [
          { id: 'kyushu-edu-education', name: '教育学科' },
          { id: 'kyushu-edu-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'kyushu-law',
        name: '法学部',
        deviationValue: 63,
        departments: [
          { id: 'kyushu-law-law', name: '法学科' },
          { id: 'kyushu-law-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'kyushu-economics',
        name: '経済学部',
        deviationValue: 62,
        departments: [
          { id: 'kyushu-econ-economics', name: '経済・経営学科' },
          { id: 'kyushu-econ-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'kyushu-science',
        name: '理学部',
        deviationValue: 60,
        departments: [
          { id: 'kyushu-sci-math', name: '数学科' },
          { id: 'kyushu-sci-physics', name: '物理学科' },
          { id: 'kyushu-sci-chemistry', name: '化学科' },
          { id: 'kyushu-sci-earth-planetary', name: '地球惑星科学科' },
          { id: 'kyushu-sci-biology', name: '生物学科' },
          { id: 'kyushu-sci-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'kyushu-medicine',
        name: '医学部',
        deviationValue: 69,
        departments: [
          { id: 'kyushu-med-medicine', name: '医学科' },
          { id: 'kyushu-med-health', name: '保健学科' },
          { id: 'kyushu-med-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'kyushu-dentistry',
        name: '歯学部',
        deviationValue: 61,
        departments: [
          { id: 'kyushu-dent-dentistry', name: '歯学科' },
          { id: 'kyushu-dent-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'kyushu-pharmacy',
        name: '薬学部',
        deviationValue: 63,
        departments: [
          { id: 'kyushu-pharm-pharmacy', name: '薬学科（6年制）' },
          { id: 'kyushu-pharm-pharmaceutical', name: '創薬科学科（4年制）' },
          { id: 'kyushu-pharm-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'kyushu-engineering',
        name: '工学部',
        deviationValue: 59,
        departments: [
          { id: 'kyushu-eng-architecture', name: '建築学科' },
          { id: 'kyushu-eng-applied-chem', name: '応用化学科' },
          { id: 'kyushu-eng-chemical-engineering', name: '化学工学科' },
          { id: 'kyushu-eng-electrical-electronics', name: '電気情報工学科' },
          { id: 'kyushu-eng-mechanical-aerospace', name: '機械航空工学科' },
          { id: 'kyushu-eng-energy-science', name: 'エネルギー科学科' },
          { id: 'kyushu-eng-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'kyushu-design',
        name: '芸術工学部',
        deviationValue: 58,
        departments: [
          { id: 'kyushu-design-env-design', name: '環境設計学科' },
          { id: 'kyushu-design-industrial-design', name: '工業設計学科' },
          { id: 'kyushu-design-visual-design', name: '画像設計学科' },
          { id: 'kyushu-design-acoustic-design', name: '音響設計学科' },
          { id: 'kyushu-design-art-info', name: '芸術情報設計学科' },
          { id: 'kyushu-design-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'kyushu-agriculture',
        name: '農学部',
        deviationValue: 58,
        departments: [
          { id: 'kyushu-agri-bio-resource-environment', name: '生物資源環境学科' },
          { id: 'kyushu-agri-undecided', name: '学科未定' }
        ]
      }
    ]
  },
  {
    id: 'hitotsubashi',
    name: '一橋大学',
    faculties: [
      {
        id: 'hitotsubashi-commerce',
        name: '商学部',
        deviationValue: 67,
        departments: [
          { id: 'hitotsubashi-comm-commerce', name: '商学科' },
          { id: 'hitotsubashi-comm-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'hitotsubashi-economics',
        name: '経済学部',
        deviationValue: 68,
        departments: [
          { id: 'hitotsubashi-econ-economics', name: '経済学科' },
          { id: 'hitotsubashi-econ-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'hitotsubashi-law',
        name: '法学部',
        deviationValue: 67,
        departments: [
          { id: 'hitotsubashi-law-law', name: '法律学科' },
          { id: 'hitotsubashi-law-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'hitotsubashi-social',
        name: '社会学部',
        deviationValue: 66,
        departments: [
          { id: 'hitotsubashi-social-social', name: '社会学科' },
          { id: 'hitotsubashi-social-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'hitotsubashi-sds',
        name: 'ソーシャル・データサイエンス学部',
        deviationValue: 68,
        departments: [
          { id: 'hitotsubashi-sds-sds', name: 'ソーシャル・データサイエンス学科' },
          { id: 'hitotsubashi-sds-undecided', name: '学科未定' }
        ]
      }
    ]
  },
  {
    id: 'keio',
    name: '慶應義塾大学',
    faculties: [
      {
        id: 'keio-literature',
        name: '文学部',
        deviationValue: 65,
        departments: [
          { id: 'keio-lit-philosophy', name: '哲学専攻' },
          { id: 'keio-lit-ethics', name: '倫理学専攻' },
          { id: 'keio-lit-aesthetics', name: '美学美術史学専攻' },
          { id: 'keio-lit-japanese-history', name: '日本史学専攻' },
          { id: 'keio-lit-oriental-history', name: '東洋史学専攻' },
          { id: 'keio-lit-western-history', name: '西洋史学専攻' },
          { id: 'keio-lit-anthropology', name: '民族学考古学専攻' },
          { id: 'keio-lit-japanese-lit', name: '国文学専攻' },
          { id: 'keio-lit-chinese-lit', name: '中国文学専攻' },
          { id: 'keio-lit-english-lit', name: '英米文学専攻' },
          { id: 'keio-lit-german-lit', name: '独文学専攻' },
          { id: 'keio-lit-french-lit', name: '仏文学専攻' },
          { id: 'keio-lit-library-info', name: '図書館・情報学専攻' },
          { id: 'keio-lit-sociology', name: '社会学専攻' },
          { id: 'keio-lit-psychology', name: '心理学専攻' },
          { id: 'keio-lit-education', name: '教育学専攻' },
          { id: 'keio-lit-human-science', name: '人間科学専攻' },
          { id: 'keio-lit-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'keio-economics',
        name: '経済学部',
        deviationValue: 68,
        departments: [
          { id: 'keio-econ-economics', name: '経済学科' },
          { id: 'keio-econ-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'keio-law',
        name: '法学部',
        deviationValue: 67,
        departments: [
          { id: 'keio-law-law', name: '法律学科' },
          { id: 'keio-law-politics', name: '政治学科' },
          { id: 'keio-law-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'keio-commerce',
        name: '商学部',
        deviationValue: 66,
        departments: [
          { id: 'keio-comm-commerce', name: '商学科' },
          { id: 'keio-comm-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'keio-medicine',
        name: '医学部',
        deviationValue: 72,
        departments: [
          { id: 'keio-med-medicine', name: '医学科' },
          { id: 'keio-med-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'keio-science-tech',
        name: '理工学部',
        deviationValue: 64,
        departments: [
          { id: 'keio-sci-mechanical', name: '機械工学科' },
          { id: 'keio-sci-electrical-info', name: '電気情報工学科' },
          { id: 'keio-sci-applied-chem', name: '応用化学科' },
          { id: 'keio-sci-physics-info', name: '物理情報工学科' },
          { id: 'keio-sci-management', name: '管理工学科' },
          { id: 'keio-sci-math', name: '数理科学科' },
          { id: 'keio-sci-physics', name: '物理学科' },
          { id: 'keio-sci-chemistry', name: '化学科' },
          { id: 'keio-sci-system-design', name: 'システムデザイン工学科' },
          { id: 'keio-sci-information', name: '情報工学科' },
          { id: 'keio-sci-bioinformatics', name: '生命情報学科' },
          { id: 'keio-sci-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'keio-policy',
        name: '総合政策学部',
        deviationValue: 65,
        departments: [
          { id: 'keio-policy-policy', name: '総合政策学科' },
          { id: 'keio-policy-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'keio-environment-info',
        name: '環境情報学部',
        deviationValue: 63,
        departments: [
          { id: 'keio-env-environment-info', name: '環境情報学科' },
          { id: 'keio-env-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'keio-nursing',
        name: '看護医療学部',
        deviationValue: 60,
        departments: [
          { id: 'keio-nursing-nursing', name: '看護学科' },
          { id: 'keio-nursing-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'keio-pharmacy',
        name: '薬学部',
        deviationValue: 67,
        departments: [
          { id: 'keio-pharm-pharmacy', name: '薬学科（6年制）' },
          { id: 'keio-pharm-pharmaceutical', name: '薬科学科（4年制）' },
          { id: 'keio-pharm-undecided', name: '学科未定' }
        ]
      }
    ]
  },
  {
    id: 'waseda',
    name: '早稲田大学',
    faculties: [
      {
        id: 'waseda-politics-economics',
        name: '政治経済学部',
        deviationValue: 67,
        departments: [
          { id: 'waseda-pe-politics', name: '政治学科' },
          { id: 'waseda-pe-economics', name: '経済学科' },
          { id: 'waseda-pe-international', name: '国際政治経済学科' },
          { id: 'waseda-pe-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'waseda-law',
        name: '法学部',
        deviationValue: 65,
        departments: [
          { id: 'waseda-law-law', name: '法学科' },
          { id: 'waseda-law-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'waseda-education',
        name: '教育学部',
        deviationValue: 62,
        departments: [
          { id: 'waseda-edu-education', name: '教育学科' },
          { id: 'waseda-edu-japanese', name: '国語国文学科' },
          { id: 'waseda-edu-english', name: '英語英文学科' },
          { id: 'waseda-edu-social', name: '社会科' },
          { id: 'waseda-edu-science', name: '理学科' },
          { id: 'waseda-edu-math', name: '数学科' },
          { id: 'waseda-edu-complex-culture', name: '複合文化学科' },
          { id: 'waseda-edu-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'waseda-commerce',
        name: '商学部',
        deviationValue: 65,
        departments: [
          { id: 'waseda-comm-management', name: '経営トラック' },
          { id: 'waseda-comm-accounting', name: '会計トラック' },
          { id: 'waseda-comm-marketing', name: 'マーケティング・国際ビジネストラック' },
          { id: 'waseda-comm-finance', name: '金融・保険トラック' },
          { id: 'waseda-comm-economics', name: '経済トラック' },
          { id: 'waseda-comm-industry', name: '産業トラック' },
          { id: 'waseda-comm-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'waseda-social-sciences',
        name: '社会科学部',
        deviationValue: 64,
        departments: [
          { id: 'waseda-social-social', name: '社会科学科' },
          { id: 'waseda-social-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'waseda-international-liberal-arts',
        name: '国際教養学部',
        deviationValue: 68,
        departments: [
          { id: 'waseda-ila-liberal-arts', name: '国際教養学科' },
          { id: 'waseda-ila-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'waseda-cultural-studies',
        name: '文化構想学部',
        deviationValue: 63,
        departments: [
          { id: 'waseda-culture-cultural-studies', name: '文化構想学科' },
          { id: 'waseda-culture-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'waseda-literature',
        name: '文学部',
        deviationValue: 63,
        departments: [
          { id: 'waseda-lit-literature', name: '文学科' },
          { id: 'waseda-lit-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'waseda-fundamental-science',
        name: '基幹理工学部',
        deviationValue: 64,
        departments: [
          { id: 'waseda-fundamental-math', name: '数学科' },
          { id: 'waseda-fundamental-applied-math', name: '応用数理学科' },
          { id: 'waseda-fundamental-info-theory', name: '情報理工学科' },
          { id: 'waseda-fundamental-mechanical', name: '機械科学・航空宇宙学科' },
          { id: 'waseda-fundamental-electrical', name: '電子物理システム学科' },
          { id: 'waseda-fundamental-express', name: '表現工学科' },
          { id: 'waseda-fundamental-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'waseda-creative-science',
        name: '創造理工学部',
        deviationValue: 64,
        departments: [
          { id: 'waseda-creative-architecture', name: '建築学科' },
          { id: 'waseda-creative-comprehensive-mechanical', name: '総合機械工学科' },
          { id: 'waseda-creative-management', name: '経営システム工学科' },
          { id: 'waseda-creative-social-environment', name: '社会環境工学科' },
          { id: 'waseda-creative-environment-resource', name: '環境資源工学科' },
          { id: 'waseda-creative-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'waseda-advanced-science',
        name: '先進理工学部',
        deviationValue: 64,
        departments: [
          { id: 'waseda-advanced-physics', name: '物理学科' },
          { id: 'waseda-advanced-applied-physics', name: '応用物理学科' },
          { id: 'waseda-advanced-chemistry', name: '化学・生命化学科' },
          { id: 'waseda-advanced-applied-chemistry', name: '応用化学科' },
          { id: 'waseda-advanced-life-medical', name: '生命医科学科' },
          { id: 'waseda-advanced-electrical-info', name: '電気・情報生命工学科' },
          { id: 'waseda-advanced-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'waseda-human-sciences',
        name: '人間科学部',
        deviationValue: 62,
        departments: [
          { id: 'waseda-human-human-environment', name: '人間環境科学科' },
          { id: 'waseda-human-health-welfare', name: '健康福祉科学科' },
          { id: 'waseda-human-human-info', name: '人間情報科学科' },
          { id: 'waseda-human-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'waseda-sport-sciences',
        name: 'スポーツ科学部',
        deviationValue: 60,
        departments: [
          { id: 'waseda-sport-sport-science', name: 'スポーツ科学科' },
          { id: 'waseda-sport-undecided', name: '学科未定' }
        ]
      }
    ]
  },
  {
    id: 'jochi',
    name: '上智大学',
    faculties: [
      {
        id: 'jochi-theology',
        name: '神学部',
        deviationValue: 58,
        departments: [
          { id: 'jochi-theology-theology', name: '神学科' },
          { id: 'jochi-theology-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'jochi-literature',
        name: '文学部',
        deviationValue: 63,
        departments: [
          { id: 'jochi-lit-philosophy', name: '哲学科' },
          { id: 'jochi-lit-history', name: '史学科' },
          { id: 'jochi-lit-japanese', name: '国文学科' },
          { id: 'jochi-lit-english', name: '英文学科' },
          { id: 'jochi-lit-german', name: 'ドイツ文学科' },
          { id: 'jochi-lit-french', name: 'フランス文学科' },
          { id: 'jochi-lit-journalism', name: '新聞学科' },
          { id: 'jochi-lit-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'jochi-economics',
        name: '経済学部',
        deviationValue: 65,
        departments: [
          { id: 'jochi-econ-economics', name: '経済学科' },
          { id: 'jochi-econ-management', name: '経営学科' },
          { id: 'jochi-econ-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'jochi-law',
        name: '法学部',
        deviationValue: 66,
        departments: [
          { id: 'jochi-law-law', name: '法律学科' },
          { id: 'jochi-law-international', name: '国際関係法学科' },
          { id: 'jochi-law-global', name: '地球環境法学科' },
          { id: 'jochi-law-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'jochi-foreign-studies',
        name: '外国語学部',
        deviationValue: 64,
        departments: [
          { id: 'jochi-foreign-english', name: '英語学科' },
          { id: 'jochi-foreign-german', name: 'ドイツ語学科' },
          { id: 'jochi-foreign-french', name: 'フランス語学科' },
          { id: 'jochi-foreign-hispanic', name: 'イスパニア語学科' },
          { id: 'jochi-foreign-russian', name: 'ロシア語学科' },
          { id: 'jochi-foreign-portuguese', name: 'ポルトガル語学科' },
          { id: 'jochi-foreign-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'jochi-science-tech',
        name: '理工学部',
        deviationValue: 62,
        departments: [
          { id: 'jochi-sci-math', name: '数学科' },
          { id: 'jochi-sci-physics', name: '物理学科' },
          { id: 'jochi-sci-chemistry', name: '化学科' },
          { id: 'jochi-sci-biology', name: '生物科学科' },
          { id: 'jochi-sci-mechanical', name: '機能創造理工学科' },
          { id: 'jochi-sci-info', name: '情報理工学科' },
          { id: 'jochi-sci-green-science', name: 'グリーンサイエンス学科' },
          { id: 'jochi-sci-green-engineering', name: 'グリーンエンジニアリング学科' },
          { id: 'jochi-sci-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'jochi-global-studies',
        name: '総合グローバル学部',
        deviationValue: 67,
        departments: [
          { id: 'jochi-global-global', name: '総合グローバル学科' },
          { id: 'jochi-global-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'jochi-international-liberal-arts',
        name: '国際教養学部',
        deviationValue: 69,
        departments: [
          { id: 'jochi-ila-liberal-arts', name: '国際教養学科' },
          { id: 'jochi-ila-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'jochi-total-human-sciences',
        name: '総合人間科学部',
        deviationValue: 62,
        departments: [
          { id: 'jochi-human-education', name: '教育学科' },
          { id: 'jochi-human-psychology', name: '心理学科' },
          { id: 'jochi-human-sociology', name: '社会学科' },
          { id: 'jochi-human-welfare', name: '社会福祉学科' },
          { id: 'jochi-human-nursing', name: '看護学科' },
          { id: 'jochi-human-undecided', name: '学科未定' }
        ]
      }
    ]
  },
  {
    id: 'meiji',
    name: '明治大学',
    faculties: [
      {
        id: 'meiji-law',
        name: '法学部',
        deviationValue: 63,
        departments: [
          { id: 'meiji-law-law', name: '法律学科' },
          { id: 'meiji-law-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'meiji-commerce',
        name: '商学部',
        deviationValue: 64,
        departments: [
          { id: 'meiji-comm-commerce', name: '商学科' },
          { id: 'meiji-comm-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'meiji-politics-economics',
        name: '政治経済学部',
        deviationValue: 64,
        departments: [
          { id: 'meiji-pe-politics', name: '政治学科' },
          { id: 'meiji-pe-economics', name: '経済学科' },
          { id: 'meiji-pe-regional', name: '地域行政学科' },
          { id: 'meiji-pe-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'meiji-literature',
        name: '文学部',
        deviationValue: 61,
        departments: [
          { id: 'meiji-lit-japanese', name: '日本文学専攻' },
          { id: 'meiji-lit-english-american', name: '英米文学専攻' },
          { id: 'meiji-lit-german', name: 'ドイツ文学専攻' },
          { id: 'meiji-lit-french', name: 'フランス文学専攻' },
          { id: 'meiji-lit-theater', name: '演劇学専攻' },
          { id: 'meiji-lit-literary', name: '文芸メディア専攻' },
          { id: 'meiji-lit-japanese-history', name: '日本史学専攻' },
          { id: 'meiji-lit-asian-history', name: 'アジア史専攻' },
          { id: 'meiji-lit-western-history', name: '西洋史学専攻' },
          { id: 'meiji-lit-archeology', name: '考古学専攻' },
          { id: 'meiji-lit-geography', name: '地理学専攻' },
          { id: 'meiji-lit-psychology', name: '心理社会学専攻' },
          { id: 'meiji-lit-sociology', name: '社会学専攻' },
          { id: 'meiji-lit-philosophy', name: '哲学専攻' },
          { id: 'meiji-lit-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'meiji-science-tech',
        name: '理工学部',
        deviationValue: 60,
        departments: [
          { id: 'meiji-sci-electronics', name: '電気電子生命学科' },
          { id: 'meiji-sci-mechanical', name: '機械工学科' },
          { id: 'meiji-sci-mechanical-info', name: '機械情報工学科' },
          { id: 'meiji-sci-architecture', name: '建築学科' },
          { id: 'meiji-sci-applied-chem', name: '応用化学科' },
          { id: 'meiji-sci-info', name: '情報科学科' },
          { id: 'meiji-sci-math', name: '数学科' },
          { id: 'meiji-sci-physics', name: '物理学科' },
          { id: 'meiji-sci-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'meiji-agriculture',
        name: '農学部',
        deviationValue: 58,
        departments: [
          { id: 'meiji-agri-agricultural', name: '農学科' },
          { id: 'meiji-agri-agricultural-chem', name: '農芸化学科' },
          { id: 'meiji-agri-agricultural-econ', name: '農業経済学科' },
          { id: 'meiji-agri-food-environment', name: '食料環境政策学科' },
          { id: 'meiji-agri-life-science', name: '生命科学科' },
          { id: 'meiji-agri-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'meiji-business',
        name: '経営学部',
        deviationValue: 67,
        departments: [
          { id: 'meiji-business-management', name: '経営学科' },
          { id: 'meiji-business-accounting', name: '会計学科' },
          { id: 'meiji-business-public', name: '公共経営学科' },
          { id: 'meiji-business-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'meiji-information-com',
        name: '情報コミュニケーション学部',
        deviationValue: 61,
        departments: [
          { id: 'meiji-info-com-info-com', name: '情報コミュニケーション学科' },
          { id: 'meiji-info-com-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'meiji-international-japanese',
        name: '国際日本学部',
        deviationValue: 62,
        departments: [
          { id: 'meiji-intl-japanese-intl-japanese', name: '国際日本学科' },
          { id: 'meiji-intl-japanese-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'meiji-interdisciplinary-math',
        name: '総合数理学部',
        deviationValue: 59,
        departments: [
          { id: 'meiji-interdisciplinary-math-phenomena', name: '現象数理学科' },
          { id: 'meiji-interdisciplinary-math-network', name: 'ネットワークデザイン学科' },
          { id: 'meiji-interdisciplinary-math-advanced-math', name: '先端メディアサイエンス学科' },
          { id: 'meiji-interdisciplinary-math-undecided', name: '学科未定' }
        ]
      }
    ]
  },
  {
    id: 'rikkyo',
    name: '立教大学',
    faculties: [
      {
        id: 'rikkyo-literature',
        name: '文学部',
        deviationValue: 61,
        departments: [
          { id: 'rikkyo-lit-christian', name: 'キリスト教学科' },
          { id: 'rikkyo-lit-japanese', name: '日本文学科' },
          { id: 'rikkyo-lit-english-american', name: '英米文学科' },
          { id: 'rikkyo-lit-german', name: 'ドイツ文学科' },
          { id: 'rikkyo-lit-french', name: 'フランス文学科' },
          { id: 'rikkyo-lit-history', name: '史学科' },
          { id: 'rikkyo-lit-education', name: '教育学科' },
          { id: 'rikkyo-lit-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'rikkyo-economics',
        name: '経済学部',
        deviationValue: 62,
        departments: [
          { id: 'rikkyo-econ-economics', name: '経済学科' },
          { id: 'rikkyo-econ-economic-policy', name: '経済政策学科' },
          { id: 'rikkyo-econ-accounting-finance', name: '会計ファイナンス学科' },
          { id: 'rikkyo-econ-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'rikkyo-business',
        name: '経営学部',
        deviationValue: 65,
        departments: [
          { id: 'rikkyo-business-management', name: '経営学科' },
          { id: 'rikkyo-business-international-business', name: '国際経営学科' },
          { id: 'rikkyo-business-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'rikkyo-science',
        name: '理学部',
        deviationValue: 58,
        departments: [
          { id: 'rikkyo-sci-math', name: '数学科' },
          { id: 'rikkyo-sci-physics', name: '物理学科' },
          { id: 'rikkyo-sci-chemistry', name: '化学科' },
          { id: 'rikkyo-sci-life-science', name: '生命理学科' },
          { id: 'rikkyo-sci-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'rikkyo-social',
        name: '社会学部',
        deviationValue: 61,
        departments: [
          { id: 'rikkyo-social-sociology', name: '社会学科' },
          { id: 'rikkyo-social-modern-culture', name: '現代文化学科' },
          { id: 'rikkyo-social-media-society', name: 'メディア社会学科' },
          { id: 'rikkyo-social-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'rikkyo-law',
        name: '法学部',
        deviationValue: 61,
        departments: [
          { id: 'rikkyo-law-law', name: '法学科' },
          { id: 'rikkyo-law-international-comparative-law', name: '国際ビジネス法学科' },
          { id: 'rikkyo-law-politics', name: '政治学科' },
          { id: 'rikkyo-law-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'rikkyo-intercultural-communication',
        name: '異文化コミュニケーション学部',
        deviationValue: 68,
        departments: [
          { id: 'rikkyo-intercultural-intercultural-communication', name: '異文化コミュニケーション学科' },
          { id: 'rikkyo-intercultural-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'rikkyo-tourism',
        name: '観光学部',
        deviationValue: 61,
        departments: [
          { id: 'rikkyo-tourism-tourism', name: '観光学科' },
          { id: 'rikkyo-tourism-exchange-culture', name: '交流文化学科' },
          { id: 'rikkyo-tourism-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'rikkyo-community-human-services',
        name: 'コミュニティ福祉学部',
        deviationValue: 58,
        departments: [
          { id: 'rikkyo-chs-community-policy', name: 'コミュニティ政策学科' },
          { id: 'rikkyo-chs-welfare', name: '福祉学科' },
          { id: 'rikkyo-chs-sport-wellness', name: 'スポーツウエルネス学科' },
          { id: 'rikkyo-chs-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'rikkyo-global-liberal-arts',
        name: 'グローバル・リベラルアーツ・プログラム',
        deviationValue: 64,
        departments: [
          { id: 'rikkyo-gla-global-liberal-arts', name: 'グローバル・リベラルアーツ学科' },
          { id: 'rikkyo-gla-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'rikkyo-artificial-intelligence-science',
        name: '人工知能科学研究科',
        deviationValue: 60,
        departments: [
          { id: 'rikkyo-ai-artificial-intelligence', name: '人工知能科学専攻' },
          { id: 'rikkyo-ai-undecided', name: '学科未定' }
        ]
      }
    ]
  },
  {
    id: 'aoyama',
    name: '青山学院大学',
    faculties: [
      {
        id: 'aoyama-literature',
        name: '文学部',
        deviationValue: 59,
        departments: [
          { id: 'aoyama-lit-english', name: '英米文学科' },
          { id: 'aoyama-lit-french', name: 'フランス文学科' },
          { id: 'aoyama-lit-japanese', name: '日本文学科' },
          { id: 'aoyama-lit-history', name: '史学科' },
          { id: 'aoyama-lit-comparative-art', name: '比較芸術学科' },
          { id: 'aoyama-lit-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'aoyama-education-human-sciences',
        name: '教育人間科学部',
        deviationValue: 58,
        departments: [
          { id: 'aoyama-edu-education', name: '教育学科' },
          { id: 'aoyama-edu-psychology', name: '心理学科' },
          { id: 'aoyama-edu-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'aoyama-economics',
        name: '経済学部',
        deviationValue: 60,
        departments: [
          { id: 'aoyama-econ-economics', name: '経済学科' },
          { id: 'aoyama-econ-modern-economics', name: '現代経済デザイン学科' },
          { id: 'aoyama-econ-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'aoyama-business',
        name: '経営学部',
        deviationValue: 61,
        departments: [
          { id: 'aoyama-business-management', name: '経営学科' },
          { id: 'aoyama-business-marketing', name: 'マーケティング学科' },
          { id: 'aoyama-business-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'aoyama-law',
        name: '法学部',
        deviationValue: 60,
        departments: [
          { id: 'aoyama-law-law', name: '法学科' },
          { id: 'aoyama-law-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'aoyama-international-politics-economics-communication',
        name: '国際政治経済学部',
        deviationValue: 63,
        departments: [
          { id: 'aoyama-intl-international-politics', name: '国際政治学科' },
          { id: 'aoyama-intl-international-economics', name: '国際経済学科' },
          { id: 'aoyama-intl-international-communication', name: '国際コミュニケーション学科' },
          { id: 'aoyama-intl-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'aoyama-science-engineering',
        name: '理工学部',
        deviationValue: 56,
        departments: [
          { id: 'aoyama-sci-physics-mathematics', name: '物理・数理学科' },
          { id: 'aoyama-sci-chemistry-life-science', name: '化学・生命科学科' },
          { id: 'aoyama-sci-electrical-electronics', name: '電気電子工学科' },
          { id: 'aoyama-sci-mechanical-creation', name: '機械創造工学科' },
          { id: 'aoyama-sci-management-systems', name: '経営システム工学科' },
          { id: 'aoyama-sci-information-telematics', name: '情報テクノロジー学科' },
          { id: 'aoyama-sci-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'aoyama-social-informatics',
        name: '社会情報学部',
        deviationValue: 59,
        departments: [
          { id: 'aoyama-social-info-social-informatics', name: '社会情報学科' },
          { id: 'aoyama-social-info-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'aoyama-global-studies-collaboration',
        name: '地球社会共生学部',
        deviationValue: 61,
        departments: [
          { id: 'aoyama-global-earth-social-collaboration', name: '地球社会共生学科' },
          { id: 'aoyama-global-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'aoyama-community-human-services',
        name: 'コミュニティ人間科学部',
        deviationValue: 57,
        departments: [
          { id: 'aoyama-chs-community-human-sciences', name: 'コミュニティ人間科学科' },
          { id: 'aoyama-chs-undecided', name: '学科未定' }
        ]
      }
    ]
  },
  {
    id: 'chuo',
    name: '中央大学',
    faculties: [
      {
        id: 'chuo-law',
        name: '法学部',
        deviationValue: 61,
        departments: [
          { id: 'chuo-law-law', name: '法律学科' },
          { id: 'chuo-law-international-corporate-strategy', name: '国際企業関係法学科' },
          { id: 'chuo-law-politics', name: '政治学科' },
          { id: 'chuo-law-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'chuo-economics',
        name: '経済学部',
        deviationValue: 58,
        departments: [
          { id: 'chuo-econ-economics', name: '経済学科' },
          { id: 'chuo-econ-economic-information-systems', name: '経済情報システム学科' },
          { id: 'chuo-econ-international-economics', name: '国際経済学科' },
          { id: 'chuo-econ-public-environmental-economics', name: '公共・環境経済学科' },
          { id: 'chuo-econ-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'chuo-commerce',
        name: '商学部',
        deviationValue: 59,
        departments: [
          { id: 'chuo-comm-management', name: '経営学科' },
          { id: 'chuo-comm-accounting', name: '会計学科' },
          { id: 'chuo-comm-commerce', name: '商業・貿易学科' },
          { id: 'chuo-comm-finance', name: '金融学科' },
          { id: 'chuo-comm-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'chuo-literature',
        name: '文学部',
        deviationValue: 58,
        departments: [
          { id: 'chuo-lit-japanese', name: '国文学科' },
          { id: 'chuo-lit-english', name: '英語文学文化学科' },
          { id: 'chuo-lit-german', name: 'ドイツ語文学文化学科' },
          { id: 'chuo-lit-french', name: 'フランス語文学文化学科' },
          { id: 'chuo-lit-chinese', name: '中国言語文化学科' },
          { id: 'chuo-lit-japanese-history', name: '日本史学科' },
          { id: 'chuo-lit-oriental-history', name: '東洋史学科' },
          { id: 'chuo-lit-western-history', name: '西洋史学科' },
          { id: 'chuo-lit-philosophy', name: '哲学科' },
          { id: 'chuo-lit-sociology', name: '社会学科' },
          { id: 'chuo-lit-social-info', name: '社会情報学科' },
          { id: 'chuo-lit-psychology', name: '心理学科' },
          { id: 'chuo-lit-education', name: '学びのパスポートプログラム学科' },
          { id: 'chuo-lit-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'chuo-science-engineering',
        name: '理工学部',
        deviationValue: 56,
        departments: [
          { id: 'chuo-sci-math', name: '数学科' },
          { id: 'chuo-sci-physics', name: '物理学科' },
          { id: 'chuo-sci-chemistry', name: '化学科' },
          { id: 'chuo-sci-life-science', name: '生命科学科' },
          { id: 'chuo-sci-info-engineering', name: '情報工学科' },
          { id: 'chuo-sci-human-total-systems', name: 'ヒューマンメディア工学科' },
          { id: 'chuo-sci-electrical-electronics', name: '電気電子情報通信工学科' },
          { id: 'chuo-sci-applied-chemistry', name: '応用化学科' },
          { id: 'chuo-sci-bioscience-biotechnology', name: 'ビジネスデータサイエンス学科' },
          { id: 'chuo-sci-management-systems-engineering', name: '数理・物理サイエンス学科' },
          { id: 'chuo-sci-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'chuo-policy-studies',
        name: '総合政策学部',
        deviationValue: 58,
        departments: [
          { id: 'chuo-policy-policy-sciences', name: '政策科学科' },
          { id: 'chuo-policy-international-policy', name: '国際政策文化学科' },
          { id: 'chuo-policy-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'chuo-international-management',
        name: '国際経営学部',
        deviationValue: 60,
        departments: [
          { id: 'chuo-intl-management-international-management', name: '国際経営学科' },
          { id: 'chuo-intl-management-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'chuo-international-info',
        name: '国際情報学部',
        deviationValue: 57,
        departments: [
          { id: 'chuo-intl-info-international-info', name: '国際情報学科' },
          { id: 'chuo-intl-info-undecided', name: '学科未定' }
        ]
      }
    ]
  },
  {
    id: 'hosei',
    name: '法政大学',
    faculties: [
      {
        id: 'hosei-law',
        name: '法学部',
        deviationValue: 58,
        departments: [
          { id: 'hosei-law-law', name: '法律学科' },
          { id: 'hosei-law-politics', name: '政治学科' },
          { id: 'hosei-law-international-politics', name: '国際政治学科' },
          { id: 'hosei-law-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'hosei-literature',
        name: '文学部',
        deviationValue: 58,
        departments: [
          { id: 'hosei-lit-philosophy', name: '哲学科' },
          { id: 'hosei-lit-japanese', name: '日本文学科' },
          { id: 'hosei-lit-english', name: '英文学科' },
          { id: 'hosei-lit-history', name: '史学科' },
          { id: 'hosei-lit-geography', name: '地理学科' },
          { id: 'hosei-lit-psychology', name: '心理学科' },
          { id: 'hosei-lit-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'hosei-economics',
        name: '経済学部',
        deviationValue: 57,
        departments: [
          { id: 'hosei-econ-economics', name: '経済学科' },
          { id: 'hosei-econ-international-economics', name: '国際経済学科' },
          { id: 'hosei-econ-modern-business', name: '現代ビジネス学科' },
          { id: 'hosei-econ-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'hosei-social',
        name: '社会学部',
        deviationValue: 58,
        departments: [
          { id: 'hosei-social-sociology', name: '社会政策科学科' },
          { id: 'hosei-social-sociology-studies', name: '社会学科' },
          { id: 'hosei-social-media-studies', name: 'メディア社会学科' },
          { id: 'hosei-social-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'hosei-business-administration',
        name: '経営学部',
        deviationValue: 58,
        departments: [
          { id: 'hosei-business-management', name: '経営学科' },
          { id: 'hosei-business-management-strategy', name: '経営戦略学科' },
          { id: 'hosei-business-market-management', name: '市場経営学科' },
          { id: 'hosei-business-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'hosei-international-culture',
        name: '国際文化学部',
        deviationValue: 60,
        departments: [
          { id: 'hosei-intl-culture-international-culture', name: '国際文化学科' },
          { id: 'hosei-intl-culture-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'hosei-human-environment',
        name: '人間環境学部',
        deviationValue: 57,
        departments: [
          { id: 'hosei-human-env-human-environment', name: '人間環境学科' },
          { id: 'hosei-human-env-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'hosei-career-design',
        name: 'キャリアデザイン学部',
        deviationValue: 58,
        departments: [
          { id: 'hosei-career-career-design', name: 'キャリアデザイン学科' },
          { id: 'hosei-career-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'hosei-design-engineering',
        name: 'デザイン工学部',
        deviationValue: 55,
        departments: [
          { id: 'hosei-design-architecture', name: '建築学科' },
          { id: 'hosei-design-urban-environment-design', name: '都市環境デザイン工学科' },
          { id: 'hosei-design-systems-design', name: 'システムデザイン学科' },
          { id: 'hosei-design-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'hosei-global-interdisciplinary-studies',
        name: 'グローバル教養学部',
        deviationValue: 61,
        departments: [
          { id: 'hosei-gis-global-interdisciplinary-studies', name: 'グローバル教養学科' },
          { id: 'hosei-gis-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'hosei-sport-health',
        name: 'スポーツ健康学部',
        deviationValue: 55,
        departments: [
          { id: 'hosei-sport-sport-health', name: 'スポーツ健康学科' },
          { id: 'hosei-sport-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'hosei-info-sciences',
        name: '情報科学部',
        deviationValue: 55,
        departments: [
          { id: 'hosei-info-computer-science', name: 'コンピュータ科学科' },
          { id: 'hosei-info-digital-media', name: 'ディジタルメディア学科' },
          { id: 'hosei-info-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'hosei-science-engineering',
        name: '理工学部',
        deviationValue: 55,
        departments: [
          { id: 'hosei-sci-mechanical-engineering', name: '機械工学科' },
          { id: 'hosei-sci-electrical-electronics', name: '電気電子工学科' },
          { id: 'hosei-sci-applied-informatics', name: '応用情報工学科' },
          { id: 'hosei-sci-applied-chemistry', name: '創生科学科' },
          { id: 'hosei-sci-undecided', name: '学科未定' }
        ]
      },
      {
        id: 'hosei-life-sciences',
        name: '生命科学部',
        deviationValue: 55,
        departments: [
          { id: 'hosei-life-life-functions', name: '生命機能学科' },
          { id: 'hosei-life-environmental-applied-chemistry', name: '環境応用化学科' },
          { id: 'hosei-life-applied-plant-sciences', name: '応用植物科学科' },
          { id: 'hosei-life-undecided', name: '学科未定' }
        ]
      }
    ]
  }
]

// 偏差値55以上の大学・学部を取得する関数
export const getUniversitiesWithDeviationAbove = (minDeviation: number = 55): University[] => {
  return universityDataDetailed
    .map(university => ({
      ...university,
      faculties: university.faculties.filter(faculty => faculty.deviationValue >= minDeviation)
    }))
    .filter(university => university.faculties.length > 0)
}

// 特定の大学の偏差値55以上の学部を取得する関数
export const getFacultiesWithDeviationAbove = (universityId: string, minDeviation: number = 55): Faculty[] => {
  const university = universityDataDetailed.find(u => u.id === universityId)
  if (!university) return []
  
  return university.faculties.filter(faculty => faculty.deviationValue >= minDeviation)
}

// 特定の学部の学科を取得する関数
export const getDepartmentsByFaculty = (universityId: string, facultyId: string): Department[] => {
  const university = universityDataDetailed.find(u => u.id === universityId)
  if (!university) return []
  
  const faculty = university.faculties.find(f => f.id === facultyId)
  if (!faculty) return []
  
  return faculty.departments
}

// 全大学データの統合
export const universityDataDetailed: University[] = baseUniversities