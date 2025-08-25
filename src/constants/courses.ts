export const COURSE_CATEGORIES = [
  { id: 'math', name: '数学', subjects: ['微積分', '線形代数', '統計学', '確率論'] },
  { id: 'physics', name: '物理学', subjects: ['力学', '電磁気学', '熱力学', '量子力学'] },
  { id: 'chemistry', name: '化学', subjects: ['有機化学', '無機化学', '物理化学', '分析化学'] },
  { id: 'biology', name: '生物学', subjects: ['細胞生物学', '分子生物学', '生化学', '遺伝学'] },
  { id: 'economics', name: '経済学', subjects: ['ミクロ経済学', 'マクロ経済学', '計量経済学', '国際経済学'] },
  { id: 'language', name: '語学', subjects: ['英語', '中国語', 'ドイツ語', 'フランス語'] },
  { id: 'liberal', name: '教養', subjects: ['哲学', '心理学', '社会学', '歴史学'] },
  { id: 'engineering', name: '工学', subjects: ['機械工学', '電気工学', '情報工学', '建築学'] }
]

export const EXAM_TYPES = [
  { id: 'midterm', name: '中間試験' },
  { id: 'final', name: '期末試験' },
  { id: 'quiz', name: '小テスト' },
  { id: 'assignment', name: '課題' }
]

export const ACADEMIC_YEARS = [
  { value: 2024, label: '2024年度' },
  { value: 2023, label: '2023年度' },
  { value: 2022, label: '2022年度' },
  { value: 2021, label: '2021年度' },
  { value: 2020, label: '2020年度' }
]

export const COURSE_CONFIG = {
  maxFileSize: 10 * 1024 * 1024,
  allowedFileTypes: ['application/pdf', 'image/jpeg', 'image/png'],
  fileTypeLabels: {
    'application/pdf': 'PDF',
    'image/jpeg': 'JPEG画像',
    'image/png': 'PNG画像'
  }
}

export const COURSE_CLASSIFICATIONS = [
  { id: 'required', name: '必修科目' },
  { id: 'elective', name: '選択科目' },
  { id: 'specialized', name: '専門科目' },
  { id: 'general', name: '一般教養' }
]