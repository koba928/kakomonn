'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { UserProfile } from '@/types/user'

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

  useEffect(() => {
    // ローカルストレージからユーザー情報を読み込み
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('userProfile')
        if (storedUser) {
          setUser(JSON.parse(storedUser))
        }
      } catch (error) {
        console.error('Failed to load user profile:', error)
      }
    }
    setIsLoaded(true)
  }, [])

  const updateUser = (newUser: UserProfile | null) => {
    setUser(newUser)
    if (typeof window !== 'undefined') {
      if (newUser) {
        localStorage.setItem('userProfile', JSON.stringify(newUser))
      } else {
        localStorage.removeItem('userProfile')
      }
    }
  }

  const logout = () => {
    updateUser(null)
  }

  const value = {
    user,
    setUser: updateUser,
    isLoggedIn: !!user,
    logout
  }

  // ローディング中は何も表示しない（フラッシュを防ぐ）
  if (!isLoaded) {
    return null
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}