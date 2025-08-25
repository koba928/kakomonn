#!/usr/bin/env node

/**
 * Figma Design Parser - Node.js実行スクリプト
 * Usage: node parseFigma.js [fileId]
 * 
 * FigmaのデザインデータをパースしてReactコンポーネントを生成
 */

const fs = require('fs')
const fsPromises = fs.promises
const path = require('path')

// 環境変数の読み込み（dotenvなしで手動実装）

function loadEnvFile() {
  try {
    const envPath = path.join(__dirname, '.env.local')
    const envContent = fs.readFileSync(envPath, 'utf-8')
    
    envContent.split('\n').forEach(line => {
      const [key, ...values] = line.split('=')
      if (key && values.length > 0) {
        const value = values.join('=').trim()
        if (!process.env[key]) {
          process.env[key] = value
        }
      }
    })
  } catch (error) {
    console.log('⚠️ Warning: Could not load .env.local file')
  }
}

loadEnvFile()

async function fetchFigmaData(fileId) {
  const apiKey = process.env.FIGMA_API_KEY
  if (!apiKey) {
    throw new Error('FIGMA_API_KEY environment variable is required')
  }

  console.log(`🎨 Fetching Figma data for file: ${fileId}`)
  
  const response = await fetch(`https://api.figma.com/v1/files/${fileId}`, {
    headers: {
      'X-Figma-Token': apiKey,
      'User-Agent': 'MATURA-Parser/1.0'
    }
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(`Figma API error: ${response.status} ${response.statusText}\n${JSON.stringify(errorData, null, 2)}`)
  }

  return await response.json()
}

// FigmaDesignParserのNode.js版実装
class FigmaDesignParser {
  static parseDesign(figmaData) {
    console.log('🎨 Starting Figma design parsing...')
    
    if (!figmaData || !figmaData.document) {
      throw new Error('Invalid Figma data: missing document')
    }

    const elements = []
    const dominantColors = []

    // 第1階層のページをチェック
    const pages = figmaData.document.children || []
    
    for (const page of pages) {
      if (page.children) {
        // ページ内の第1階層要素を解析
        for (const child of page.children) {
          const parsed = this.parseElement(child)
          if (parsed) {
            elements.push(parsed)
            
            // 色情報を収集
            if (parsed.styles.backgroundColor) {
              dominantColors.push(parsed.styles.backgroundColor)
            }
            if (parsed.styles.color) {
              dominantColors.push(parsed.styles.color)
            }
          }
        }
      }
    }

    const metadata = {
      totalElements: elements.length,
      hasText: elements.some(el => el.type === 'text'),
      hasFrames: elements.some(el => el.type === 'frame'),
      dominantColors: [...new Set(dominantColors)].slice(0, 5)
    }

    console.log(`✅ Parsed ${elements.length} elements from Figma design`)
    
    return {
      name: figmaData.name || 'Untitled Design',
      elements,
      metadata
    }
  }

  static parseElement(element) {
    if (!element || !element.type) {
      return null
    }

    const baseElement = {
      type: this.mapElementType(element.type),
      id: element.id,
      name: element.name || 'Unnamed',
      styles: {}
    }

    // 位置・サイズ情報の解析
    if (element.absoluteBoundingBox) {
      baseElement.styles.width = Math.round(element.absoluteBoundingBox.width)
      baseElement.styles.height = Math.round(element.absoluteBoundingBox.height)
      baseElement.styles.x = Math.round(element.absoluteBoundingBox.x)
      baseElement.styles.y = Math.round(element.absoluteBoundingBox.y)
    }

    // 背景色の解析
    if (element.fills && element.fills.length > 0) {
      const fill = element.fills[0]
      if (fill.type === 'SOLID' && fill.color) {
        baseElement.styles.backgroundColor = this.rgbaToHex(fill.color)
      }
    }

    // テキスト要素の特別処理
    if (element.type === 'TEXT') {
      baseElement.content = element.characters || ''
      
      // フォントスタイルの解析
      if (element.style) {
        baseElement.styles.fontSize = element.style.fontSize || 16
        baseElement.styles.fontWeight = element.style.fontWeight || 400
        
        // テキスト色の解析
        if (element.fills && element.fills[0]?.color) {
          baseElement.styles.color = this.rgbaToHex(element.fills[0].color)
        }
      }
    }

    // フレーム要素の特別処理
    if (element.type === 'FRAME' || element.type === 'GROUP') {
      // パディング情報の解析
      if (element.paddingLeft || element.paddingTop) {
        baseElement.styles.padding = {
          top: element.paddingTop || 0,
          right: element.paddingRight || 0,
          bottom: element.paddingBottom || 0,
          left: element.paddingLeft || 0
        }
      }
    }

    // 角丸の解析
    if (element.cornerRadius) {
      baseElement.styles.borderRadius = element.cornerRadius
    }

    return baseElement
  }

  static mapElementType(figmaType) {
    switch (figmaType) {
      case 'FRAME':
        return 'frame'
      case 'TEXT':
        return 'text'
      case 'RECTANGLE':
      case 'ELLIPSE':
        return 'rectangle'
      case 'GROUP':
        return 'group'
      default:
        return 'frame'
    }
  }

  static rgbaToHex(color) {
    const toHex = (n) => {
      const hex = Math.round(n * 255).toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }

    return `#${toHex(color.r)}${toHex(color.g)}${toHex(color.b)}`
  }

  static generateReactComponent(parsedDesign) {
    console.log('🔧 Generating React component from parsed design...')
    
    const elements = parsedDesign.elements.map(element => {
      return this.elementToJSX(element)
    }).join('\n      ')

    const component = `'use client'

import React from 'react'

// Generated from Figma design: ${parsedDesign.name}
// Elements: ${parsedDesign.metadata.totalElements} (Text: ${parsedDesign.metadata.hasText}, Frames: ${parsedDesign.metadata.hasFrames})
// Colors: ${parsedDesign.metadata.dominantColors.join(', ')}

export default function FigmaGeneratedPage() {
  return (
    <div className="figma-generated-container" style={{ 
      minHeight: '100vh',
      position: 'relative',
      backgroundColor: '${parsedDesign.metadata.dominantColors[0] || '#ffffff'}'
    }}>
      <div className="figma-elements">
        ${elements}
      </div>
    </div>
  )
}`

    return component
  }

  static elementToJSX(element) {
    const styles = this.stylesToCSS(element.styles)
    
    switch (element.type) {
      case 'text':
        return `<p style={${JSON.stringify(styles)}} data-figma-id="${element.id}">${element.content || ''}</p>`
      
      case 'frame':
      case 'group':
        return `<div style={${JSON.stringify(styles)}} data-figma-id="${element.id}" data-figma-name="${element.name}">
          {/* Frame: ${element.name} */}
        </div>`
      
      case 'rectangle':
        return `<div style={${JSON.stringify(styles)}} data-figma-id="${element.id}" data-figma-name="${element.name}"></div>`
      
      default:
        return `<div style={${JSON.stringify(styles)}} data-figma-id="${element.id}"><!-- ${element.type}: ${element.name} --></div>`
    }
  }

  static stylesToCSS(styles) {
    const css = {}

    if (styles.backgroundColor) css.backgroundColor = styles.backgroundColor
    if (styles.color) css.color = styles.color
    if (styles.fontSize) css.fontSize = `${styles.fontSize}px`
    if (styles.fontWeight) css.fontWeight = styles.fontWeight
    if (styles.width) css.width = `${styles.width}px`
    if (styles.height) css.height = `${styles.height}px`
    if (styles.borderRadius) css.borderRadius = `${styles.borderRadius}px`
    
    // 位置情報（absolute positioning）
    if (styles.x !== undefined || styles.y !== undefined) {
      css.position = 'absolute'
      if (styles.x !== undefined) css.left = `${styles.x}px`
      if (styles.y !== undefined) css.top = `${styles.y}px`
    }

    // パディング
    if (styles.padding) {
      const p = styles.padding
      css.padding = `${p.top || 0}px ${p.right || 0}px ${p.bottom || 0}px ${p.left || 0}px`
    }

    return css
  }
}

async function main() {
  try {
    // コマンドライン引数またはデフォルトファイルIDを取得
    const fileId = process.argv[2] || process.env.DEFAULT_FIGMA_FILE_ID
    
    if (!fileId) {
      console.error('❌ Error: File ID is required')
      console.log('Usage: node parseFigma.js [fileId]')
      console.log('Or set DEFAULT_FIGMA_FILE_ID in .env.local')
      process.exit(1)
    }

    console.log('🚀 Starting Figma design parsing...')
    console.log(`📁 File ID: ${fileId}`)

    // 1. Figmaデータを取得
    const figmaData = await fetchFigmaData(fileId)
    console.log(`✅ Fetched data for: ${figmaData.name}`)

    // 2. デザインを解析
    const parsedDesign = FigmaDesignParser.parseDesign(figmaData)
    
    // 3. 結果をファイルに保存
    const outputDir = './generated'
    await fsPromises.mkdir(outputDir, { recursive: true })

    // 解析結果をJSONで保存
    const jsonFile = path.join(outputDir, `parsed-design-${fileId}.json`)
    await fsPromises.writeFile(jsonFile, JSON.stringify(parsedDesign, null, 2))
    console.log(`💾 Parsed data saved to: ${jsonFile}`)

    // Reactコンポーネントを生成
    const reactComponent = FigmaDesignParser.generateReactComponent(parsedDesign)
    const componentFile = path.join(outputDir, `GeneratedPage-${fileId}.tsx`)
    await fsPromises.writeFile(componentFile, reactComponent)
    console.log(`🔧 React component saved to: ${componentFile}`)

    // 3. 統計情報を表示
    console.log('\n📊 Parsing Results:')
    console.log(`   📐 Total Elements: ${parsedDesign.metadata.totalElements}`)
    console.log(`   📝 Has Text: ${parsedDesign.metadata.hasText}`)
    console.log(`   🖼️  Has Frames: ${parsedDesign.metadata.hasFrames}`)
    console.log(`   🎨 Dominant Colors: ${parsedDesign.metadata.dominantColors.join(', ')}`)

    console.log('\n✅ Figma design parsing completed successfully!')
    console.log(`\n🎯 Next steps:`)
    console.log(`   1. Copy the generated component to your app/components/ directory`)
    console.log(`   2. Import and use in your Next.js app`)
    console.log(`   3. Customize styles and layout as needed`)

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

// スクリプトとして実行された場合のみmain()を実行
if (require.main === module) {
  main()
}

module.exports = { FigmaDesignParser, fetchFigmaData }