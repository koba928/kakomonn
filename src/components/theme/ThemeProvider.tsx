'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { storage } from '@/utils/storage'
import { THEME_CONFIG } from '@/constants/app'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  currentTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

interface ThemeProviderProps {
  children: React.ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mounted, setMounted] = useState(false)
  const [theme, setTheme] = useState<Theme>(THEME_CONFIG.defaultTheme)
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light')

  // マウント後にのみテーマを読み込み
  useEffect(() => {
    setMounted(true)
    
    // ローカルストレージからテーマを読み込み
    const savedTheme = storage.get(THEME_CONFIG.storageKey) as Theme
    if (savedTheme && THEME_CONFIG.themes.includes(savedTheme)) {
      setTheme(savedTheme)
    }
  }, [])

  // テーマが変更されたときの処理
  useEffect(() => {
    if (!mounted) return

    let resolvedTheme: 'light' | 'dark' = 'light'
    
    if (theme === 'system') {
      if (typeof window !== 'undefined') {
        resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      }
    } else {
      resolvedTheme = theme
    }
    
    setCurrentTheme(resolvedTheme)
    
    // DOM操作
    if (typeof document !== 'undefined') {
      if (resolvedTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
    
    // ローカルストレージに保存
    storage.set(THEME_CONFIG.storageKey, theme)
  }, [theme, mounted])

  // システムテーマ変更の監視
  useEffect(() => {
    if (!mounted || theme !== 'system' || typeof window === 'undefined') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (e: MediaQueryListEvent) => {
      setCurrentTheme(e.matches ? 'dark' : 'light')
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [theme, mounted])

  const handleSetTheme = (newTheme: Theme) => {
    setTheme(newTheme)
  }

  const value: ThemeContextType = {
    theme,
    setTheme: handleSetTheme,
    currentTheme
  }

  // SSR中またはマウント前はデフォルト値でレンダリング
  if (!mounted) {
    return (
      <ThemeContext.Provider value={{
        theme: THEME_CONFIG.defaultTheme,
        setTheme: () => {},
        currentTheme: 'light'
      }}>
        {children}
      </ThemeContext.Provider>
    )
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

interface ThemeToggleProps {
  className?: string
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '' }) => {
  const { theme, setTheme, currentTheme } = useTheme()

  const cycleTheme = () => {
    const themes: Theme[] = ['light', 'dark', 'system']
    const currentIndex = themes.indexOf(theme)
    const nextIndex = (currentIndex + 1) % themes.length
    const nextTheme = themes[nextIndex]
    if (nextTheme) {
      setTheme(nextTheme)
    }
  }

  const getThemeIcon = () => {
    if (theme === 'system') {
      return '🌓'
    }
    return currentTheme === 'dark' ? '🌙' : '☀️'
  }

  const getThemeLabel = () => {
    if (theme === 'system') {
      return THEME_CONFIG.labels.system
    }
    return currentTheme === 'dark' ? THEME_CONFIG.labels.dark : THEME_CONFIG.labels.light
  }

  return (
    <button
      onClick={cycleTheme}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-lg
        bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700
        text-gray-900 dark:text-gray-100
        transition-all duration-200 transform hover:scale-105
        ${className}
      `}
      title={`現在のテーマ: ${getThemeLabel()}`}
    >
      <span className="text-lg">{getThemeIcon()}</span>
      <span className="text-sm font-medium hidden sm:block">{getThemeLabel()}</span>
    </button>
  )
}