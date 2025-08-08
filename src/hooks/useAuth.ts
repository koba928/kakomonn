import { useState, useEffect } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export interface AuthUser {
  id: string
  email: string
  name: string
  university: string
  faculty: string
  department: string
  year: number
  pen_name: string
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 現在のセッションを取得
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      
      if (session?.user) {
        await fetchUserProfile(session.user.id)
      }
      setLoading(false)
    }

    getSession()

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session)
        
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('ユーザープロフィール取得エラー:', error)
        return
      }

      setUser(data)
    } catch (error) {
      console.error('ユーザープロフィール取得エラー:', error)
    }
  }

  const signUp = async (email: string, password: string, userData: Omit<AuthUser, 'id'>) => {
    try {
      console.log('signUp開始:', { email, userData })
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            university: userData.university,
            faculty: userData.faculty,
            department: userData.department,
            year: userData.year,
            pen_name: userData.pen_name
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      console.log('Supabase認証結果:', { 
        data: data ? { 
          user: data.user ? { id: data.user.id, email: data.user.email } : null,
          session: data.session ? 'session-exists' : null
        } : null, 
        error: error ? { message: error.message, status: error.status } : null 
      })

      if (error) {
        console.error('Supabase認証エラー詳細:', {
          message: error.message,
          status: error.status,
          name: error.name
        })
        throw error
      }

      // ユーザープロフィールを作成
      if (data.user) {
        console.log('ユーザープロフィール作成開始:', data.user.id)
        
        const { error: profileError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            email: userData.email,
            name: userData.name,
            university: userData.university,
            faculty: userData.faculty,
            department: userData.department,
            year: userData.year,
            pen_name: userData.pen_name
          })

        if (profileError) {
          console.error('プロフィール作成エラー:', profileError)
          throw profileError
        }
        
        console.log('プロフィール作成成功')
      }

      return { data, error: null }
    } catch (error) {
      console.error('signUp全体エラー:', error)
      return { data: null, error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      if (data.user) {
        await fetchUserProfile(data.user.id)
      }

      return { data, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setUser(null)
      setSession(null)
    } catch (error) {
      console.error('ログアウトエラー:', error)
    }
  }

  const updateProfile = async (updates: Partial<AuthUser>) => {
    if (!user) return { error: new Error('ユーザーがログインしていません') }

    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)

      if (error) throw error

      // ローカル状態を更新
      setUser(prev => prev ? { ...prev, ...updates } : null)

      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  return {
    user,
    session,
    loading,
    isLoggedIn: !!session,
    signUp,
    signIn,
    signOut,
    updateProfile
  }
}
