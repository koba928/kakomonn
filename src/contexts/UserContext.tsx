'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { UserProfile } from '@/types/user'
import { storage, setItemDebounced } from '@/utils/storage'
import { STORAGE_KEYS } from '@/constants/app'

interface UserContextType {
  user: UserProfile | null
  setUser: (user: UserProfile | null) => void
  isLoggedIn: boolean
  logout: () => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

interface UserProviderProps {
  children: ReactNode
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // ローカルストレージからユーザー情報を読み込み
    if (typeof window !== 'undefined') {
      try {
        const storedUser = storage.getObject<UserProfile>(STORAGE_KEYS.userProfile)
        if (storedUser) {
          // Validate user data structure
          if (typeof storedUser === 'object' && storedUser.id && storedUser.name) {
            setUser(storedUser)
          } else {
            console.warn('ユーザー情報のデータ形式が正しくありません:', storedUser)
            // Clear invalid data
            storage.remove(STORAGE_KEYS.userProfile)
          }
        }
      } catch (error) {
        console.error('ユーザー情報の読み込みに失敗しました:', error)
      }
    }
    setIsLoaded(true)
  }, [])

  const updateUser = (newUser: UserProfile | null) => {
    try {
      setUser(newUser)
      if (typeof window !== 'undefined') {
        if (newUser) {
          // Validate user data before saving
          if (!newUser.id || !newUser.name) {
            throw new Error('ユーザー情報に必須項目が不足しています')
          }
          setItemDebounced(STORAGE_KEYS.userProfile, JSON.stringify(newUser), 1000)
        } else {
          storage.remove(STORAGE_KEYS.userProfile)
        }
      }
    } catch (error) {
      console.error('ユーザー情報の保存に失敗しました:', error)
    }
  }

  const logout = () => {
    try {
      updateUser(null)
    } catch (error) {
      console.error('ログアウト中にエラーが発生しました:', error)
    }
  }

  const value = {
    user,
    setUser: updateUser,
    isLoggedIn: !!user,
    logout
  }

  // ローディング中やマウント前は何も表示しない（フラッシュを防ぐ）
  if (!mounted || !isLoaded) {
    return (
      <UserContext.Provider value={{
        user: null,
        setUser: () => {},
        isLoggedIn: false,
        logout: () => {}
      }}>
        {children}
      </UserContext.Provider>
    )
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}