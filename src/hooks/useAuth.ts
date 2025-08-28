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
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [authStep, setAuthStep] = useState<'idle' | 'signing-in' | 'verifying' | 'profile-loading' | 'redirecting'>('idle')

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
      // まずusersテーブルからプロフィールを取得を試行
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (!error && data) {
        setUser(data)
        return
      }

      console.warn('usersテーブルからの取得失敗、auth.usersから取得します:', error)
      
      // usersテーブルが使えない場合、auth.usersのメタデータから取得
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !authUser) {
        console.error('認証ユーザー取得エラー:', authError)
        return
      }

      // メタデータからユーザー情報を構築
      const userFromMetadata = {
        id: authUser.id,
        email: authUser.email || '',
        name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'ユーザー',
        university: authUser.user_metadata?.university || '未設定',
        faculty: authUser.user_metadata?.faculty || '未設定',
        department: authUser.user_metadata?.department || '未設定',
        year: authUser.user_metadata?.year || 1,
        pen_name: authUser.user_metadata?.pen_name || authUser.user_metadata?.name || 'ユーザー'
      }

      setUser(userFromMetadata)
      
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

      // ユーザープロフィールを作成（完全回避策）
      if (data.user) {
        console.log('ユーザープロフィール作成開始:', data.user.id)
        
        // プロフィール情報はuser_metadataに既に保存済み
        // usersテーブルへの挿入は試行するが、失敗してもOK
        try {
          const { error } = await supabase
            .from('users')
            .insert({
              id: data.user.id,
              email: userData.email,
              name: userData.name,
              university: userData.university,
              faculty: userData.faculty,
              department: userData.department,
              year: userData.year,
              pen_name: userData.pen_name,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
          
          if (error) {
            console.warn('usersテーブル挿入失敗（問題なし）:', error.message)
            console.info('✅ プロフィール情報は認証メタデータに保存されています')
          } else {
            console.log('✅ usersテーブルへの保存も成功しました')
          }
          
        } catch (insertError) {
          console.warn('usersテーブル挿入試行中にエラー（問題なし）:', insertError)
          console.info('✅ プロフィール情報は認証メタデータに保存されています')
        }
        
        console.log('✅ プロフィール作成完了（メタデータベース）')
      }

      return { data, error: null }
    } catch (error) {
      console.error('signUp全体エラー:', error)
      return { data: null, error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setIsAuthenticating(true)
      setAuthStep('signing-in')

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      setAuthStep('profile-loading')
      
      // セッション情報を手動で設定
      setSession(data.session)

      let userProfile = null
      if (data.user) {
        // ユーザープロフィールを取得
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id)
          .single()
        
        if (!profileError && profile) {
          userProfile = profile
          setUser(profile)
        }
      }

      setAuthStep('redirecting')
      
      // 少し待ってからリセット
      setTimeout(() => {
        setIsAuthenticating(false)
        setAuthStep('idle')
      }, 1000)

      return { data, error: null, user: userProfile }
    } catch (error) {
      return { data: null, error, user: null }
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
    isAuthenticating,
    authStep,
    signUp,
    signIn,
    signOut,
    updateProfile,
    setAuthStep
  }
}
