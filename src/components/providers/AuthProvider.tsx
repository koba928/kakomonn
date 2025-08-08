'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useAuth, AuthUser } from '@/hooks/useAuth'

interface AuthContextType {
  user: AuthUser | null
  session: any
  loading: boolean
  signUp: (email: string, password: string, userData: Omit<AuthUser, 'id'>) => Promise<{ data: any; error: any }>
  signIn: (email: string, password: string) => Promise<{ data: any; error: any }>
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<AuthUser>) => Promise<{ error: any }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuthContext = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}
