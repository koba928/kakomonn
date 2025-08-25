// ひらがな・カタカナ・ローマ字変換ユーティリティ

// ひらがなをカタカナに変換
export function hiraganaToKatakana(str: string): string {
  return str.replace(/[\u3041-\u3096]/g, (match) => {
    const chr = match.charCodeAt(0) + 0x60
    return String.fromCharCode(chr)
  })
}

// カタカナをひらがなに変換
export function katakanaToHiragana(str: string): string {
  return str.replace(/[\u30a1-\u30f6]/g, (match) => {
    const chr = match.charCodeAt(0) - 0x60
    return String.fromCharCode(chr)
  })
}

// 基本的なローマ字マッピング
const romajiMap: Record<string, string[]> = {
  'あ': ['a'], 'い': ['i'], 'う': ['u'], 'え': ['e'], 'お': ['o'],
  'か': ['ka'], 'き': ['ki'], 'く': ['ku'], 'け': ['ke'], 'こ': ['ko'],
  'が': ['ga'], 'ぎ': ['gi'], 'ぐ': ['gu'], 'げ': ['ge'], 'ご': ['go'],
  'さ': ['sa'], 'し': ['shi', 'si'], 'す': ['su'], 'せ': ['se'], 'そ': ['so'],
  'ざ': ['za'], 'じ': ['zi', 'ji'], 'ず': ['zu'], 'ぜ': ['ze'], 'ぞ': ['zo'],
  'た': ['ta'], 'ち': ['chi', 'ti'], 'つ': ['tsu', 'tu'], 'て': ['te'], 'と': ['to'],
  'だ': ['da'], 'ぢ': ['di'], 'づ': ['du'], 'で': ['de'], 'ど': ['do'],
  'な': ['na'], 'に': ['ni'], 'ぬ': ['nu'], 'ね': ['ne'], 'の': ['no'],
  'は': ['ha'], 'ひ': ['hi'], 'ふ': ['fu', 'hu'], 'へ': ['he'], 'ほ': ['ho'],
  'ば': ['ba'], 'び': ['bi'], 'ぶ': ['bu'], 'べ': ['be'], 'ぼ': ['bo'],
  'ぱ': ['pa'], 'ぴ': ['pi'], 'ぷ': ['pu'], 'ぺ': ['pe'], 'ぽ': ['po'],
  'ま': ['ma'], 'み': ['mi'], 'む': ['mu'], 'め': ['me'], 'も': ['mo'],
  'や': ['ya'], 'ゆ': ['yu'], 'よ': ['yo'],
  'ら': ['ra'], 'り': ['ri'], 'る': ['ru'], 'れ': ['re'], 'ろ': ['ro'],
  'わ': ['wa'], 'を': ['wo'], 'ん': ['n'],
  'きょ': ['kyo'], 'きゅ': ['kyu'], 'きゃ': ['kya'],
  'しょ': ['sho', 'syo'], 'しゅ': ['shu', 'syu'], 'しゃ': ['sha', 'sya'],
  'ちょ': ['cho', 'tyo'], 'ちゅ': ['chu', 'tyu'], 'ちゃ': ['cha', 'tya'],
  'にょ': ['nyo'], 'にゅ': ['nyu'], 'にゃ': ['nya'],
  'ひょ': ['hyo'], 'ひゅ': ['hyu'], 'ひゃ': ['hya'],
  'みょ': ['myo'], 'みゅ': ['myu'], 'みゃ': ['mya'],
  'りょ': ['ryo'], 'りゅ': ['ryu'], 'りゃ': ['rya'],
  'ぎょ': ['gyo'], 'ぎゅ': ['gyu'], 'ぎゃ': ['gya'],
  'じょ': ['jo', 'zyo'], 'じゅ': ['ju', 'zyu'], 'じゃ': ['ja', 'zya'],
  'びょ': ['byo'], 'びゅ': ['byu'], 'びゃ': ['bya'],
  'ぴょ': ['pyo'], 'ぴゅ': ['pyu'], 'ぴゃ': ['pya']
}

// ローマ字からひらがなへの逆マッピングを生成
const reverseRomajiMap: Record<string, string> = {}
Object.entries(romajiMap).forEach(([kana, romajis]) => {
  romajis.forEach(romaji => {
    reverseRomajiMap[romaji] = kana
  })
})

// 文字列が部分的にローマ字マッチするかチェック
export function matchesRomaji(text: string, query: string): boolean {
  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()
  
  // 直接マッチ
  if (lowerText.includes(lowerQuery)) return true
  
  // ひらがな/カタカナのテキストをローマ字に変換してマッチ
  const hiraganaText = katakanaToHiragana(lowerText)
  let romajiText = ''
  
  for (let i = 0; i < hiraganaText.length; i++) {
    // 2文字の組み合わせをチェック（拗音など）
    if (i < hiraganaText.length - 1) {
      const twoChars = hiraganaText.substring(i, i + 2)
      if (romajiMap[twoChars]) {
        romajiText += romajiMap[twoChars][0]
        i++ // 2文字処理したので1つスキップ
        continue
      }
    }
    
    // 1文字をチェック
    const oneChar = hiraganaText[i]
    if (oneChar && romajiMap[oneChar]) {
      romajiText += romajiMap[oneChar][0]
    } else if (oneChar) {
      romajiText += oneChar // ローマ字変換できない場合はそのまま
    }
  }
  
  return romajiText.includes(lowerQuery)
}

// 柔軟な検索マッチング関数
export function flexibleMatch(text: string, query: string): boolean {
  if (!query) return true
  
  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase()
  
  // 1. 直接マッチ（部分一致）
  if (lowerText.includes(lowerQuery)) return true
  
  // 2. ひらがな・カタカナの相互変換マッチ
  const hiraganaText = katakanaToHiragana(lowerText)
  const katakanaText = hiraganaToKatakana(lowerText)
  const hiraganaQuery = katakanaToHiragana(lowerQuery)
  const katakanaQuery = hiraganaToKatakana(lowerQuery)
  
  if (hiraganaText.includes(hiraganaQuery) || 
      katakanaText.includes(katakanaQuery) ||
      hiraganaText.includes(lowerQuery) ||
      katakanaText.includes(lowerQuery)) {
    return true
  }
  
  // 3. ローマ字マッチ
  return matchesRomaji(text, query)
}