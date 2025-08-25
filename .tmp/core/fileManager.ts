/**
 * MATURA File Manager
 * ファイル操作を管理
 */

import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'

export interface SaveResult {
  success: boolean
  filePath: string
  error?: string
}

export class FileManager {
  private projectRoot: string

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot
  }

  saveToApp(relativePath: string, content: string): SaveResult {
    try {
      const fullPath = join(this.projectRoot, 'app', relativePath)
      const dir = dirname(fullPath)

      // Create directory if it doesn't exist
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true })
        console.log(`📁 [FileManager] Created directory: ${dir}`)
      }

      // Save file
      writeFileSync(fullPath, content, 'utf8')
      console.log(`💾 [FileManager] Saved: ${fullPath}`)

      return {
        success: true,
        filePath: fullPath
      }

    } catch (error) {
      console.error(`💥 [FileManager] Failed to save ${relativePath}:`, error)
      return {
        success: false,
        filePath: '',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  saveToLib(relativePath: string, content: string): SaveResult {
    try {
      const fullPath = join(this.projectRoot, 'lib', relativePath)
      const dir = dirname(fullPath)

      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true })
        console.log(`📁 [FileManager] Created directory: ${dir}`)
      }

      writeFileSync(fullPath, content, 'utf8')
      console.log(`💾 [FileManager] Saved: ${fullPath}`)

      return {
        success: true,
        filePath: fullPath
      }

    } catch (error) {
      console.error(`💥 [FileManager] Failed to save ${relativePath}:`, error)
      return {
        success: false,
        filePath: '',
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  fileExists(relativePath: string): boolean {
    const fullPath = join(this.projectRoot, relativePath)
    return existsSync(fullPath)
  }

  readFile(relativePath: string): string | null {
    try {
      const fullPath = join(this.projectRoot, relativePath)
      if (!existsSync(fullPath)) {
        return null
      }
      return readFileSync(fullPath, 'utf8')
    } catch (error) {
      console.error(`💥 [FileManager] Failed to read ${relativePath}:`, error)
      return null
    }
  }

  ensureAppStructure(): void {
    const directories = [
      'app',
      'app/components',
      'app/api',
      'lib',
      'lib/store',
      'lib/handlers',
      'lib/api'
    ]

    directories.forEach(dir => {
      const fullPath = join(this.projectRoot, dir)
      if (!existsSync(fullPath)) {
        mkdirSync(fullPath, { recursive: true })
        console.log(`📁 [FileManager] Created: ${dir}`)
      }
    })
  }
}

export default FileManager