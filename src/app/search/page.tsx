'use client'

import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { universityDataDetailed, type University, type Faculty, type Department } from '@/data/universityDataDetailed'
import { COURSE_CATEGORIES } from '@/constants/courses'

export default function SearchPage() {
  const [selectedUniversity, setSelectedUniversity] = useState<University | null>(null)
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null)
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null)
  const [universitySearchTerm, setUniversitySearchTerm] = useState('')
  const [facultySearchTerm, setFacultySearchTerm] = useState('')
  const [departmentSearchTerm, setDepartmentSearchTerm] = useState('')
  const [showUniversityDropdown, setShowUniversityDropdown] = useState(false)
  const [showFacultyDropdown, setShowFacultyDropdown] = useState(false)
  const [showDepartmentDropdown, setShowDepartmentDropdown] = useState(false)
  const [courseType, setCourseType] = useState<'faculty' | 'general' | ''>('')
  const [searchExecuted, setSearchExecuted] = useState(false)
  
  const universityRef = useRef<HTMLDivElement>(null)
  const facultyRef = useRef<HTMLDivElement>(null)
  const departmentRef = useRef<HTMLDivElement>(null)

  // ドロップダウンを閉じるイベントハンドラ
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (universityRef.current && !universityRef.current.contains(event.target as Node)) {
        setShowUniversityDropdown(false)
      }
      if (facultyRef.current && !facultyRef.current.contains(event.target as Node)) {
        setShowFacultyDropdown(false)
      }
      if (departmentRef.current && !departmentRef.current.contains(event.target as Node)) {
        setShowDepartmentDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // ローマ字・ひらがな変換マップ
  const searchMap = useMemo(() => ({
    // ローマ字
    'todai': ['東京大学', 'とうだい', 'トウダイ'],
    'waseda': ['早稲田大学', 'わせだ', 'ワセダ'],
    'keio': ['慶應義塾大学', 'けいお', 'ケイオ'],
    'kyodai': ['京都大学', 'きょうだい', 'キョウダイ'],
    'osaka': ['大阪大学', 'おおさか', 'オオサカ'],
    'tohoku': ['東北大学', 'とうほく', 'トウホク'],
    'nagoya': ['名古屋大学', 'なごや', 'ナゴヤ'],
    'hokudai': ['北海道大学', 'ほくだい', 'ホクダイ'],
    'kyushu': ['九州大学', 'きゅうしゅう', 'キュウシュウ'],
    'ichidai': ['一橋大学', 'いちだい', 'イチダイ'],
    'titech': ['東京工業大学', 'とうこうだい', 'トウコウダイ'],
    'tsukuba': ['筑波大学', 'つくば', 'ツクバ'],
    
    // ひらがな（部分一致も含む）
    // 東京系
    'とう': ['東京大学', '東北大学', '東京工業大学'],
    'とうき': ['東京大学', '東京工業大学'],
    'とうきょう': ['東京大学', '東京工業大学'],
    'とうだい': ['東京大学'],
    'ひがし': ['東京大学', '東北大学', '東京工業大学'],
    
    // 東北大学
    'とうほく': ['東北大学'],
    'みやぎ': ['東北大学'],
    'せんだい': ['東北大学'],
    
    // 東京工業大学  
    'とうこう': ['東京工業大学'],
    'とうこうだい': ['東京工業大学'],
    'こうぎょう': ['東京工業大学'],
    'てっく': ['東京工業大学'],
    
    // 早稲田大学
    'わせ': ['早稲田大学'],
    'わせだ': ['早稲田大学'],
    'わせだだいがく': ['早稲田大学'],
    
    // 慶應義塾大学
    'けいお': ['慶應義塾大学'],
    'けいおう': ['慶應義塾大学'],
    'けいおうぎじゅく': ['慶應義塾大学'],
    'ぎじゅく': ['慶應義塾大学'],
    
    // 京都大学
    'きょう': ['京都大学'],
    'きょうだい': ['京都大学'],
    'きょうと': ['京都大学'],
    'きょうとだいがく': ['京都大学'],
    
    // 大阪大学
    'おお': ['大阪大学'],
    'おおさか': ['大阪大学'],
    'おおさかだいがく': ['大阪大学'],
    'はんだい': ['大阪大学'],
    
    // 名古屋大学
    'なご': ['名古屋大学'],
    'なごや': ['名古屋大学'],
    'なごやだいがく': ['名古屋大学'],
    
    // 北海道大学
    'ほく': ['北海道大学'],
    'ほくだい': ['北海道大学'],
    'ほっかい': ['北海道大学'],
    'ほっかいどう': ['北海道大学'],
    'ほっかいどうだいがく': ['北海道大学'],
    'さっぽろ': ['北海道大学'],
    
    // 九州大学
    'きゅう': ['九州大学'],
    'きゅうしゅう': ['九州大学'],
    'きゅうしゅうだいがく': ['九州大学'],
    'きゅうだい': ['九州大学'],
    'ふくおか': ['九州大学'],
    
    // 一橋大学
    'いち': ['一橋大学'],
    'いちだい': ['一橋大学'],
    'いちばし': ['一橋大学'],
    'いちばしだいがく': ['一橋大学'],
    'ひとつばし': ['一橋大学'],
    
    // 筑波大学
    'つく': ['筑波大学'],
    'つくば': ['筑波大学'],
    'つくばだいがく': ['筑波大学'],
    'いばらき': ['筑波大学'],
    
    // 追加の私立大学
    'にほん': ['日本大学'],
    'にほんだいがく': ['日本大学'],
    'にちだい': ['日本大学'],
    
    'とうかい': ['東海大学'],
    'とうかいだいがく': ['東海大学'],
    
    'めいじ': ['明治大学'],
    'めいじだいがく': ['明治大学'],
    'めいだい': ['明治大学', '名古屋大学'],
    
    'りっきょう': ['立教大学'],
    'りっきょうだいがく': ['立教大学'],
    
    'あおがく': ['青山学院大学'],
    'あおやま': ['青山学院大学'],
    'あおやまがくいん': ['青山学院大学'],
    
    'ちゅうおう': ['中央大学'],
    'ちゅうおうだいがく': ['中央大学'],
    'ちゅうだい': ['中央大学'],
    
    'ほうせい': ['法政大学'],
    'ほうせいだいがく': ['法政大学'],
    
    // 学部のひらがな予測
    'りが': ['理学部', '理工学部'],
    'りがく': ['理学部'],
    'りこう': ['理工学部'],
    'ぶん': ['文学部', '文科一類', '文科二類', '文科三類'],
    'ぶんがく': ['文学部'],
    'ほう': ['法学部'],
    'ほうがく': ['法学部'],
    'けい': ['経済学部', '経営学部'],
    'けいざい': ['経済学部'],
    'けいえい': ['経営学部'],
    'こう': ['工学部'],
    'こうがく': ['工学部'],
    'い': ['医学部'],
    'いがく': ['医学部'],
    'やく': ['薬学部'],
    'やくがく': ['薬学部'],
  }), [])

  // ひらがな・カタカナ変換マップ
  const hiraganaToKatakana = (str: string): string => {
    return str.replace(/[\u3041-\u3096]/g, (match) => {
      const chr = match.charCodeAt(0) + 0x60
      return String.fromCharCode(chr)
    })
  }

  const katakanaToHiragana = (str: string): string => {
    return str.replace(/[\u30A1-\u30F6]/g, (match) => {
      const chr = match.charCodeAt(0) - 0x60
      return String.fromCharCode(chr)
    })
  }

  // ローマ字をひらがなに変換（基本的な変換のみ）
  const romajiToHiragana = (romaji: string): string => {
    const basicMap: Record<string, string> = {
      'a': 'あ', 'i': 'い', 'u': 'う', 'e': 'え', 'o': 'お',
      'ka': 'か', 'ki': 'き', 'ku': 'く', 'ke': 'け', 'ko': 'こ',
      'ga': 'が', 'gi': 'ぎ', 'gu': 'ぐ', 'ge': 'げ', 'go': 'ご',
      'sa': 'さ', 'si': 'し', 'shi': 'し', 'su': 'す', 'se': 'せ', 'so': 'そ',
      'za': 'ざ', 'zi': 'じ', 'ji': 'じ', 'zu': 'ず', 'ze': 'ぜ', 'zo': 'ぞ',
      'ta': 'た', 'ti': 'ち', 'chi': 'ち', 'tu': 'つ', 'tsu': 'つ', 'te': 'て', 'to': 'と',
      'da': 'だ', 'di': 'ぢ', 'du': 'づ', 'de': 'で', 'do': 'ど',
      'na': 'な', 'ni': 'に', 'nu': 'ぬ', 'ne': 'ね', 'no': 'の',
      'ha': 'は', 'hi': 'ひ', 'hu': 'ふ', 'fu': 'ふ', 'he': 'へ', 'ho': 'ほ',
      'ba': 'ば', 'bi': 'び', 'bu': 'ぶ', 'be': 'べ', 'bo': 'ぼ',
      'pa': 'ぱ', 'pi': 'ぴ', 'pu': 'ぷ', 'pe': 'ぺ', 'po': 'ぽ',
      'ma': 'ま', 'mi': 'み', 'mu': 'む', 'me': 'め', 'mo': 'も',
      'ya': 'や', 'yu': 'ゆ', 'yo': 'よ',
      'ra': 'ら', 'ri': 'り', 'ru': 'る', 're': 'れ', 'ro': 'ろ',
      'wa': 'わ', 'wi': 'ゐ', 'we': 'ゑ', 'wo': 'を',
      'n': 'ん',
      'kya': 'きゃ', 'kyu': 'きゅ', 'kyo': 'きょ',
      'gya': 'ぎゃ', 'gyu': 'ぎゅ', 'gyo': 'ぎょ',
      'sha': 'しゃ', 'shu': 'しゅ', 'sho': 'しょ',
      'ja': 'じゃ', 'ju': 'じゅ', 'jo': 'じょ',
      'cha': 'ちゃ', 'chu': 'ちゅ', 'cho': 'ちょ',
      'nya': 'にゃ', 'nyu': 'にゅ', 'nyo': 'にょ',
      'hya': 'ひゃ', 'hyu': 'ひゅ', 'hyo': 'ひょ',
      'bya': 'びゃ', 'byu': 'びゅ', 'byo': 'びょ',
      'pya': 'ぴゃ', 'pyu': 'ぴゅ', 'pyo': 'ぴょ',
      'mya': 'みゃ', 'myu': 'みゅ', 'myo': 'みょ',
      'rya': 'りゃ', 'ryu': 'りゅ', 'ryo': 'りょ'
    }

    let result = romaji.toLowerCase()
    // 長いものから順番に変換
    const sortedKeys = Object.keys(basicMap).sort((a, b) => b.length - a.length)
    for (const key of sortedKeys) {
      result = result.replace(new RegExp(key, 'g'), basicMap[key])
    }
    return result
  }

  // 日本語をひらがな、カタカナ、ローマ字に変換する関数
  const normalizeText = useCallback((text: string): string[] => {
    const variations = [text.toLowerCase()]
    
    // 検索マップから直接マッチするものを追加
    const lowerText = text.toLowerCase()
    Object.entries(searchMap).forEach(([key, translations]) => {
      // より柔軟な部分一致：キーが入力文字列の先頭に含まれる場合、または入力文字列がキーの先頭に含まれる場合
      if (key.startsWith(lowerText) || lowerText.startsWith(key) || 
          key.includes(lowerText) || lowerText.includes(key) || 
          key === lowerText) {
        variations.push(...translations.map(t => t.toLowerCase()))
      }
    })
    
    // ローマ字をひらがなに変換
    const hiraganaFromRomaji = romajiToHiragana(lowerText)
    if (hiraganaFromRomaji !== lowerText) {
      variations.push(hiraganaFromRomaji)
      variations.push(hiraganaToKatakana(hiraganaFromRomaji))
      
      // ローマ字から変換されたひらがなでも検索マップをチェック
      Object.entries(searchMap).forEach(([key, translations]) => {
        if (key.startsWith(hiraganaFromRomaji) || hiraganaFromRomaji.startsWith(key) ||
            key.includes(hiraganaFromRomaji) || hiraganaFromRomaji.includes(key)) {
          variations.push(...translations.map(t => t.toLowerCase()))
        }
      })
    }
    
    // カタカナをひらがなに変換
    const hiragana = katakanaToHiragana(text)
    if (hiragana !== text) variations.push(hiragana.toLowerCase())
    
    // ひらがなをカタカナに変換
    const katakana = hiraganaToKatakana(text)
    if (katakana !== text) variations.push(katakana.toLowerCase())
    
    return [...new Set(variations)] // 重複を除去
  }, [searchMap])

  // 検索フィルター関数
  const filterItems = useMemo(() => {
    return <T extends { name: string }>(items: T[], searchTerm: string): T[] => {
      if (!searchTerm.trim()) return items
      
      return items.filter(item => {
        const searchVariations = normalizeText(searchTerm)
        const nameVariations = normalizeText(item.name)
        
        return searchVariations.some(searchVar => 
          nameVariations.some(nameVar => 
            nameVar.includes(searchVar) || searchVar.includes(nameVar)
          )
        )
      })
    }
  }, [normalizeText])

  // フィルタリングされた大学リスト
  const filteredUniversities = useMemo(() => {
    return filterItems(universityDataDetailed, universitySearchTerm)
  }, [filterItems, universitySearchTerm])

  // フィルタリングされた学部リスト
  const filteredFaculties = useMemo(() => {
    if (!selectedUniversity) return []
    return filterItems(selectedUniversity.faculties, facultySearchTerm)
  }, [filterItems, selectedUniversity, facultySearchTerm])

  // フィルタリングされた学科リスト
  const filteredDepartments = useMemo(() => {
    if (!selectedFaculty) return []
    return filterItems(selectedFaculty.departments, departmentSearchTerm)
  }, [filterItems, selectedFaculty, departmentSearchTerm])

  // 大学選択時の処理
  const handleUniversitySelect = (university: University) => {
    setSelectedUniversity(university)
    setUniversitySearchTerm(university.name)
    setShowUniversityDropdown(false)
    setSelectedFaculty(null)
    setSelectedDepartment(null)
    setFacultySearchTerm('')
    setDepartmentSearchTerm('')
  }

  // 学部選択時の処理
  const handleFacultySelect = (faculty: Faculty) => {
    setSelectedFaculty(faculty)
    setFacultySearchTerm(faculty.name)
    setShowFacultyDropdown(false)
    setSelectedDepartment(null)
    setDepartmentSearchTerm('')
  }

  // 学科選択時の処理
  const handleDepartmentSelect = (department: Department) => {
    setSelectedDepartment(department)
    setDepartmentSearchTerm(department.name)
    setShowDepartmentDropdown(false)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6 group">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-indigo-800 to-indigo-600 bg-clip-text text-transparent group-hover:from-indigo-600 group-hover:to-purple-600 transition-all duration-200">
              過去問<span className="text-indigo-600">hub</span>
            </h1>
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">過去問を検索</h2>
          <p className="text-gray-600">大学・学部・学科から過去問を見つけよう（ローマ字・ひらがな対応）</p>
        </div>

        {/* 検索フィルター */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* 大学選択 */}
            <div className="relative" ref={universityRef}>
              <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2">
                大学を選択
              </label>
              <input
                id="university"
                type="text"
                value={universitySearchTerm}
                onChange={(e) => {
                  setUniversitySearchTerm(e.target.value)
                  setShowUniversityDropdown(true)
                }}
                onFocus={() => setShowUniversityDropdown(true)}
                placeholder="大学名を入力（ひらがな・ローマ字対応）"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {showUniversityDropdown && filteredUniversities.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredUniversities.map(uni => (
                    <button
                      key={uni.id}
                      onClick={() => handleUniversitySelect(uni)}
                      className="w-full text-left px-4 py-2 hover:bg-indigo-50 focus:bg-indigo-50 focus:outline-none"
                    >
                      {uni.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 学部選択 */}
            <div className="relative" ref={facultyRef}>
              <label htmlFor="faculty" className="block text-sm font-medium text-gray-700 mb-2">
                学部を選択
              </label>
              <input
                id="faculty"
                type="text"
                value={facultySearchTerm}
                onChange={(e) => {
                  setFacultySearchTerm(e.target.value)
                  setShowFacultyDropdown(true)
                }}
                onFocus={() => setShowFacultyDropdown(true)}
                placeholder={selectedUniversity ? "学部名を入力" : "まず大学を選択してください"}
                disabled={!selectedUniversity}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              {showFacultyDropdown && filteredFaculties.length > 0 && (
                <div className="absolute z-40 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredFaculties.map(faculty => (
                    <button
                      key={faculty.id}
                      onClick={() => handleFacultySelect(faculty)}
                      className="w-full text-left px-4 py-2 hover:bg-indigo-50 focus:bg-indigo-50 focus:outline-none"
                    >
                      {faculty.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 学科選択 */}
            <div className="relative" ref={departmentRef}>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-2">
                学科を選択
              </label>
              <input
                id="department"
                type="text"
                value={departmentSearchTerm}
                onChange={(e) => {
                  setDepartmentSearchTerm(e.target.value)
                  setShowDepartmentDropdown(true)
                }}
                onFocus={() => setShowDepartmentDropdown(true)}
                placeholder={selectedFaculty ? "学科名を入力" : "まず学部を選択してください"}
                disabled={!selectedFaculty}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              {showDepartmentDropdown && filteredDepartments.length > 0 && (
                <div className="absolute z-30 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {filteredDepartments.map(department => (
                    <button
                      key={department.id}
                      onClick={() => handleDepartmentSelect(department)}
                      className="w-full text-left px-4 py-2 hover:bg-indigo-50 focus:bg-indigo-50 focus:outline-none"
                    >
                      {department.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 選択された内容の表示 */}
          {selectedUniversity && (
            <div className="mb-4 p-3 bg-indigo-50 rounded-lg">
              <div className="text-sm text-indigo-800">
                <strong>選択中:</strong> {selectedUniversity.name}
                {selectedFaculty && <> → {selectedFaculty.name}</>}
                {selectedDepartment && <> → {selectedDepartment.name}</>}
              </div>
            </div>
          )}

          {/* 検索ボタンとクリアボタン */}
          <div className="flex justify-between items-center">
            <button
              onClick={() => {
                setSelectedUniversity(null)
                setSelectedFaculty(null)
                setSelectedDepartment(null)
                setUniversitySearchTerm('')
                setFacultySearchTerm('')
                setDepartmentSearchTerm('')
                setShowUniversityDropdown(false)
                setShowFacultyDropdown(false)
                setShowDepartmentDropdown(false)
              }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              選択をクリア
            </button>
            <button
              onClick={() => {
                if (selectedUniversity) {
                  setSearchExecuted(true)
                } else {
                  alert('大学を選択してください')
                }
              }}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-gray-400"
              disabled={!selectedUniversity}
            >
              過去問を検索
            </button>
          </div>
        </div>

        {/* 学部・全学共通選択エリア - 検索実行後に表示 */}
        {selectedUniversity && searchExecuted && !courseType && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="text-center py-12">
              <div className="text-indigo-400 text-6xl mb-4">📋</div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                どの種類の過去問をお探しですか？
              </h4>
              <p className="text-gray-600 mb-8">
                {selectedUniversity.name}{selectedFaculty && ` ${selectedFaculty.name}`}で探したい過去問の種類を選択してください
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                <button
                  onClick={() => setCourseType('faculty')}
                  className="group p-6 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🏫</div>
                  <h5 className="text-lg font-semibold text-gray-900 mb-2">学部専門科目</h5>
                  <p className="text-sm text-gray-600">
                    {selectedFaculty ? selectedFaculty.name : '学部'}の専門的な授業の過去問
                  </p>
                </button>
                
                <button
                  onClick={() => setCourseType('general')}
                  className="group p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200"
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🌐</div>
                  <h5 className="text-lg font-semibold text-gray-900 mb-2">全学共通科目</h5>
                  <p className="text-sm text-gray-600">
                    学部を問わず履修できる一般教養科目の過去問
                  </p>
                </button>
              </div>
              
              <button
                onClick={() => {
                  setSearchExecuted(false)
                  setCourseType('')
                }}
                className="mt-6 text-gray-500 hover:text-gray-700 transition-colors"
              >
                ← 検索条件に戻る
              </button>
            </div>
          </div>
        )}

        {/* 検索結果エリア - 科目タイプが選択された場合 */}
        {selectedUniversity && searchExecuted && courseType && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="text-center py-12">
              <div className="text-orange-400 text-6xl mb-4">📝</div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">
                過去問が見つかりませんでした
              </h4>
              <p className="text-gray-600 mb-6">
                {selectedUniversity.name}{selectedFaculty && ` ${selectedFaculty.name}`}の
                {courseType === 'faculty' ? '学部専門科目' : '全学共通科目'}の過去問はまだ投稿されていません
              </p>
              
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 mb-6">
                <div className="text-4xl mb-4">✨</div>
                <h5 className="text-lg font-semibold text-gray-900 mb-2">
                  あなたが最初の投稿者になりませんか？
                </h5>
                <p className="text-gray-700 mb-4">
                  勉強の記録や過去問を共有して、後輩たちの学習をサポートしましょう！<br />
                  あなたの投稿が誰かの試験対策に役立ちます。
                </p>
                <Link href="/upload" className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  過去問・勉強記録を投稿する
                </Link>
              </div>
              
              <div className="space-y-2 text-sm text-gray-500 mb-6">
                <p><strong>検索条件:</strong></p>
                <p>🏛️ {selectedUniversity.name}</p>
                {selectedFaculty && <p>🏫 {selectedFaculty.name}</p>}
                {selectedDepartment && <p>📚 {selectedDepartment.name}</p>}
                <p>📋 {courseType === 'faculty' ? '学部専門科目' : '全学共通科目'}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => setCourseType('')}
                  className="px-4 py-2 text-indigo-600 hover:text-indigo-800 transition-colors"
                >
                  ← 科目タイプ選択に戻る
                </button>
                <button
                  onClick={() => {
                    setSearchExecuted(false)
                    setCourseType('')
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ← 検索条件に戻る
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 初期状態 - 大学が選択されていない場合 */}
        {!selectedUniversity && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📚</div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">過去問を検索しよう</h4>
              <p className="text-gray-600 mb-6">上の検索フォームから大学を選択して、過去問を探してみてください</p>
            </div>
          </div>
        )}

        {/* 戻るボタン */}
        <div className="text-center mt-8">
          <Link href="/" className="inline-flex items-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
            ← ホームに戻る
          </Link>
        </div>
      </div>
    </main>
  )
}