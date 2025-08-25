/**
 * Report Generator
 * 
 * 生成されたファイル構造とシステム情報のレポート作成
 */

import { writeFileSync, readFileSync, existsSync, statSync } from 'fs'
import { join, relative, extname } from 'path'
import { CodeGenerationResult } from './autonomousCodeGenerationEngine'

export interface FileAnalysis {
  path: string
  size: number
  lines: number
  type: 'component' | 'page' | 'api' | 'config' | 'style' | 'test' | 'utility' | 'other'
  language: 'typescript' | 'javascript' | 'css' | 'json' | 'markdown' | 'other'
}

export interface ProjectStructure {
  totalFiles: number
  totalLines: number
  totalSize: number
  filesByType: Record<string, number>
  filesByLanguage: Record<string, number>
  structure: string
  analysis: FileAnalysis[]
}

export class ReportGenerator {
  private projectRoot: string

  constructor(projectRoot: string) {
    this.projectRoot = projectRoot
  }

  /**
   * 完全なプロジェクトレポート生成
   */
  async generateCompleteReport(result: CodeGenerationResult): Promise<void> {
    console.log('📊 Generating comprehensive project report...')

    const projectStructure = this.analyzeProjectStructure(result.generatedFiles)
    const performanceMetrics = this.analyzePerformanceMetrics(result)
    const qualityMetrics = this.analyzeQualityMetrics(result.generatedFiles)
    
    // HTMLレポート生成
    await this.generateHTMLReport(result, projectStructure, performanceMetrics, qualityMetrics)
    
    // Markdownレポート生成
    await this.generateMarkdownReport(result, projectStructure, performanceMetrics, qualityMetrics)
    
    // JSON詳細レポート生成
    await this.generateJSONReport(result, projectStructure, performanceMetrics, qualityMetrics)

    console.log('✅ Complete project report generated')
  }

  /**
   * プロジェクト構造分析
   */
  private analyzeProjectStructure(generatedFiles: string[]): ProjectStructure {
    const analysis: FileAnalysis[] = []
    let totalLines = 0
    let totalSize = 0
    const filesByType: Record<string, number> = {}
    const filesByLanguage: Record<string, number> = {}

    for (const filePath of generatedFiles) {
      if (existsSync(filePath)) {
        try {
          const content = readFileSync(filePath, 'utf-8')
          const stats = statSync(filePath)
          const lines = content.split('\n').length
          const size = stats.size

          const fileAnalysis: FileAnalysis = {
            path: relative(this.projectRoot, filePath),
            size,
            lines,
            type: this.determineFileType(filePath),
            language: this.determineFileLanguage(filePath)
          }

          analysis.push(fileAnalysis)
          totalLines += lines
          totalSize += size

          // 統計更新
          filesByType[fileAnalysis.type] = (filesByType[fileAnalysis.type] || 0) + 1
          filesByLanguage[fileAnalysis.language] = (filesByLanguage[fileAnalysis.language] || 0) + 1
        } catch (error) {
          // ファイル読み込みエラーは無視
        }
      }
    }

    const structure = this.generateFileTree(analysis)

    return {
      totalFiles: analysis.length,
      totalLines,
      totalSize,
      filesByType,
      filesByLanguage,
      structure,
      analysis
    }
  }

  /**
   * ファイルタイプ判定
   */
  private determineFileType(filePath: string): FileAnalysis['type'] {
    const relativePath = relative(this.projectRoot, filePath)
    
    if (relativePath.includes('/components/')) return 'component'
    if (relativePath.includes('/app/') && relativePath.endsWith('page.tsx')) return 'page'
    if (relativePath.includes('/api/')) return 'api'
    if (relativePath.includes('.test.') || relativePath.includes('__tests__')) return 'test'
    if (relativePath.endsWith('.css') || relativePath.includes('globals.css')) return 'style'
    if (relativePath.includes('.config.') || relativePath.includes('tsconfig') || relativePath.includes('package.json')) return 'config'
    if (relativePath.includes('/lib/') || relativePath.includes('/hooks/')) return 'utility'
    
    return 'other'
  }

  /**
   * ファイル言語判定
   */
  private determineFileLanguage(filePath: string): FileAnalysis['language'] {
    const ext = extname(filePath)
    
    switch (ext) {
      case '.ts':
      case '.tsx':
        return 'typescript'
      case '.js':
      case '.jsx':
        return 'javascript'
      case '.css':
        return 'css'
      case '.json':
        return 'json'
      case '.md':
        return 'markdown'
      default:
        return 'other'
    }
  }

  /**
   * ファイルツリー生成
   */
  private generateFileTree(analysis: FileAnalysis[]): string {
    const tree: Record<string, any> = {}
    
    // ファイルパスをツリー構造に変換
    for (const file of analysis) {
      const parts = file.path.split('/')
      let current = tree
      
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i]
        if (i === parts.length - 1) {
          // ファイル
          current[part] = {
            type: 'file',
            size: file.size,
            lines: file.lines,
            language: file.language
          }
        } else {
          // ディレクトリ
          if (!current[part]) {
            current[part] = { type: 'directory' }
          }
          current = current[part]
        }
      }
    }
    
    return this.renderTree(tree, '')
  }

  /**
   * ツリー構造を文字列でレンダリング
   */
  private renderTree(node: any, prefix: string): string {
    let result = ''
    const entries = Object.entries(node).filter(([key]) => key !== 'type')
    
    entries.forEach(([key, value], index) => {
      const isLast = index === entries.length - 1
      const currentPrefix = isLast ? '└── ' : '├── '
      const nextPrefix = isLast ? '    ' : '│   '
      
      if (value && typeof value === 'object') {
        if (value.type === 'file') {
          result += `${prefix}${currentPrefix}${key} (${value.lines} lines, ${Math.round(value.size / 1024)}KB)\n`
        } else {
          result += `${prefix}${currentPrefix}${key}/\n`
          result += this.renderTree(value, prefix + nextPrefix)
        }
      }
    })
    
    return result
  }

  /**
   * パフォーマンスメトリクス分析
   */
  private analyzePerformanceMetrics(result: CodeGenerationResult) {
    return {
      generationTime: result.metrics.duration,
      filesPerSecond: Math.round(result.metrics.totalFiles / (result.metrics.duration / 1000)),
      linesPerSecond: Math.round(result.metrics.totalLines / (result.metrics.duration / 1000)),
      averageFileSize: Math.round(result.metrics.totalLines / result.metrics.totalFiles),
      efficiency: this.calculateEfficiencyScore(result)
    }
  }

  /**
   * 効率性スコア計算
   */
  private calculateEfficiencyScore(result: CodeGenerationResult): number {
    const baseScore = 100
    
    // エラーがあるとスコア減点
    const errorPenalty = result.errors.length * 10
    
    // 警告があるとスコア減点
    const warningPenalty = result.warnings.length * 5
    
    // 生成速度によるボーナス
    const speedBonus = result.metrics.duration < 60000 ? 10 : 0
    
    return Math.max(0, baseScore - errorPenalty - warningPenalty + speedBonus)
  }

  /**
   * 品質メトリクス分析
   */
  private analyzeQualityMetrics(generatedFiles: string[]) {
    let typescriptFiles = 0
    let testFiles = 0
    let componentFiles = 0
    let apiFiles = 0
    
    for (const file of generatedFiles) {
      const relativePath = relative(this.projectRoot, file)
      
      if (file.endsWith('.ts') || file.endsWith('.tsx')) typescriptFiles++
      if (file.includes('.test.') || file.includes('__tests__')) testFiles++
      if (relativePath.includes('/components/')) componentFiles++
      if (relativePath.includes('/api/')) apiFiles++
    }
    
    return {
      typescriptCoverage: Math.round((typescriptFiles / generatedFiles.length) * 100),
      testCoverage: testFiles > 0 ? Math.round((testFiles / componentFiles) * 100) : 0,
      componentCount: componentFiles,
      apiEndpoints: apiFiles,
      qualityScore: this.calculateQualityScore(typescriptFiles, testFiles, generatedFiles.length)
    }
  }

  /**
   * 品質スコア計算
   */
  private calculateQualityScore(typescriptFiles: number, testFiles: number, totalFiles: number): number {
    const tsRatio = typescriptFiles / totalFiles
    const testRatio = testFiles / Math.max(1, typescriptFiles)
    
    return Math.round((tsRatio * 50) + (testRatio * 50))
  }

  /**
   * HTMLレポート生成
   */
  private async generateHTMLReport(
    result: CodeGenerationResult,
    structure: ProjectStructure,
    performance: any,
    quality: any
  ): Promise<void> {
    const html = `<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MATURA Code Generation Report</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; max-width: 1200px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 40px; }
        .logo { font-size: 2.5em; font-weight: bold; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .subtitle { color: #666; margin-top: 10px; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .card { background: white; border-radius: 12px; padding: 20px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); border: 1px solid #e5e5e5; }
        .card h3 { margin-top: 0; color: #2d3748; border-bottom: 2px solid #667eea; padding-bottom: 10px; }
        .metric { display: flex; justify-content: space-between; margin: 10px 0; }
        .metric-value { font-weight: bold; color: #667eea; }
        .success { color: #48bb78; }
        .warning { color: #ed8936; }
        .error { color: #f56565; }
        .file-tree { background: #f7fafc; padding: 15px; border-radius: 8px; font-family: 'Monaco', 'Menlo', monospace; font-size: 12px; overflow-x: auto; }
        .badge { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; margin: 2px; }
        .badge-primary { background: #667eea; color: white; }
        .badge-success { background: #48bb78; color: white; }
        .badge-warning { background: #ed8936; color: white; }
        .progress-bar { background: #e2e8f0; height: 20px; border-radius: 10px; overflow: hidden; }
        .progress-fill { height: 100%; background: linear-gradient(90deg, #667eea, #764ba2); transition: width 0.3s ease; }
        .timestamp { text-align: center; color: #666; font-size: 14px; margin-top: 40px; }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo">🚀 MATURA</div>
        <div class="subtitle">Autonomous Code Generation Report</div>
        <div style="margin-top: 10px;">
            <span class="badge badge-${result.success ? 'success' : 'error'}">
                ${result.success ? '✅ SUCCESS' : '❌ FAILED'}
            </span>
            <span class="badge badge-primary">v1.0.0</span>
        </div>
    </div>

    <div class="grid">
        <div class="card">
            <h3>📊 Generation Summary</h3>
            <div class="metric">
                <span>Status:</span>
                <span class="metric-value ${result.success ? 'success' : 'error'}">
                    ${result.success ? 'Completed Successfully' : 'Failed'}
                </span>
            </div>
            <div class="metric">
                <span>Files Generated:</span>
                <span class="metric-value">${result.metrics.totalFiles}</span>
            </div>
            <div class="metric">
                <span>Lines of Code:</span>
                <span class="metric-value">${result.metrics.totalLines.toLocaleString()}</span>
            </div>
            <div class="metric">
                <span>Components:</span>
                <span class="metric-value">${result.metrics.componentsGenerated}</span>
            </div>
            <div class="metric">
                <span>Duration:</span>
                <span class="metric-value">${Math.round(result.metrics.duration / 1000)}s</span>
            </div>
        </div>

        <div class="card">
            <h3>⚡ Performance Metrics</h3>
            <div class="metric">
                <span>Generation Speed:</span>
                <span class="metric-value">${performance.filesPerSecond} files/sec</span>
            </div>
            <div class="metric">
                <span>Code Generation Rate:</span>
                <span class="metric-value">${performance.linesPerSecond} lines/sec</span>
            </div>
            <div class="metric">
                <span>Average File Size:</span>
                <span class="metric-value">${performance.averageFileSize} lines</span>
            </div>
            <div class="metric">
                <span>Efficiency Score:</span>
                <span class="metric-value">${performance.efficiency}/100</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${performance.efficiency}%"></div>
            </div>
        </div>

        <div class="card">
            <h3>✨ Quality Metrics</h3>
            <div class="metric">
                <span>TypeScript Coverage:</span>
                <span class="metric-value">${quality.typescriptCoverage}%</span>
            </div>
            <div class="metric">
                <span>Test Coverage:</span>
                <span class="metric-value">${quality.testCoverage}%</span>
            </div>
            <div class="metric">
                <span>API Endpoints:</span>
                <span class="metric-value">${quality.apiEndpoints}</span>
            </div>
            <div class="metric">
                <span>Quality Score:</span>
                <span class="metric-value">${quality.qualityScore}/100</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${quality.qualityScore}%"></div>
            </div>
        </div>

        <div class="card">
            <h3>📁 File Types</h3>
            ${Object.entries(structure.filesByType).map(([type, count]) => `
                <div class="metric">
                    <span>${type}:</span>
                    <span class="metric-value">${count} files</span>
                </div>
            `).join('')}
        </div>
    </div>

    ${result.warnings.length > 0 ? `
    <div class="card">
        <h3>⚠️ Warnings</h3>
        ${result.warnings.map(warning => `<div class="warning">• ${warning}</div>`).join('')}
    </div>
    ` : ''}

    ${result.errors.length > 0 ? `
    <div class="card">
        <h3>❌ Errors</h3>
        ${result.errors.map(error => `<div class="error">• ${error}</div>`).join('')}
    </div>
    ` : ''}

    <div class="card">
        <h3>🗂️ Project Structure</h3>
        <div class="file-tree">${structure.structure}</div>
    </div>

    <div class="timestamp">
        Generated on ${new Date().toLocaleString('ja-JP')} by MATURA Autonomous Code Generation Engine
    </div>
</body>
</html>`

    const htmlPath = join(this.projectRoot, 'GENERATION_REPORT.html')
    writeFileSync(htmlPath, html)
  }

  /**
   * Markdownレポート生成
   */
  private async generateMarkdownReport(
    result: CodeGenerationResult,
    structure: ProjectStructure,
    performance: any,
    quality: any
  ): Promise<void> {
    const markdown = `# 🚀 MATURA Code Generation Report

${result.success ? '✅ **Generation Completed Successfully**' : '❌ **Generation Failed**'}

Generated on: ${new Date().toLocaleString('ja-JP')}

## 📊 Summary

| Metric | Value |
|--------|--------|
| Status | ${result.success ? '✅ Success' : '❌ Failed'} |
| Files Generated | ${result.metrics.totalFiles} |
| Lines of Code | ${result.metrics.totalLines.toLocaleString()} |
| Components | ${result.metrics.componentsGenerated} |
| Duration | ${Math.round(result.metrics.duration / 1000)}s |
| Generation Speed | ${performance.filesPerSecond} files/sec |
| Code Generation Rate | ${performance.linesPerSecond} lines/sec |

## ⚡ Performance Metrics

- **Efficiency Score**: ${performance.efficiency}/100
- **Average File Size**: ${performance.averageFileSize} lines
- **Files per Second**: ${performance.filesPerSecond}
- **Lines per Second**: ${performance.linesPerSecond}

## ✨ Quality Metrics

- **TypeScript Coverage**: ${quality.typescriptCoverage}%
- **Test Coverage**: ${quality.testCoverage}%
- **Quality Score**: ${quality.qualityScore}/100
- **API Endpoints**: ${quality.apiEndpoints}

## 📁 File Distribution

### By Type
${Object.entries(structure.filesByType).map(([type, count]) => `- **${type}**: ${count} files`).join('\n')}

### By Language
${Object.entries(structure.filesByLanguage).map(([lang, count]) => `- **${lang}**: ${count} files`).join('\n')}

${result.warnings.length > 0 ? `
## ⚠️ Warnings

${result.warnings.map(warning => `- ${warning}`).join('\n')}
` : ''}

${result.errors.length > 0 ? `
## ❌ Errors

${result.errors.map(error => `- ${error}`).join('\n')}
` : ''}

## 🗂️ Project Structure

\`\`\`
${structure.structure}
\`\`\`

---

🤖 Generated by MATURA Autonomous Code Generation Engine v1.0`

    const markdownPath = join(this.projectRoot, 'GENERATION_REPORT.md')
    writeFileSync(markdownPath, markdown)
  }

  /**
   * JSON詳細レポート生成
   */
  private async generateJSONReport(
    result: CodeGenerationResult,
    structure: ProjectStructure,
    performance: any,
    quality: any
  ): Promise<void> {
    const report = {
      meta: {
        version: '1.0.0',
        generatedAt: new Date().toISOString(),
        engine: 'MATURA Autonomous Code Generation Engine'
      },
      result,
      structure,
      performance,
      quality,
      summary: {
        success: result.success,
        totalFiles: result.metrics.totalFiles,
        totalLines: result.metrics.totalLines,
        duration: result.metrics.duration,
        efficiencyScore: performance.efficiency,
        qualityScore: quality.qualityScore
      }
    }

    const jsonPath = join(this.projectRoot, 'generation-report.json')
    writeFileSync(jsonPath, JSON.stringify(report, null, 2))
  }
}

export default ReportGenerator