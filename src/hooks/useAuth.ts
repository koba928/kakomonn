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
      console.log('=== fetchUserProfile開始 ===', { userId: userId.substring(0, 8) + '...' })
      
      // 1. まず認証ユーザー情報を取得（最新の状態を保証）
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()
      
      if (authError || !authUser) {
        console.error('認証ユーザー取得エラー:', authError)
        return
      }

      console.log('🔍 認証ユーザーメタデータ:', {
        name: authUser.user_metadata?.name,
        university: authUser.user_metadata?.university,
        faculty: authUser.user_metadata?.faculty,
        department: authUser.user_metadata?.department,
        year: authUser.user_metadata?.year
      })

      // 2. 認証メタデータを主要情報源として使用
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

      console.log('📝 認証メタデータから構築したユーザー情報:', {
        email: userFromMetadata.email,
        name: userFromMetadata.name,
        university: userFromMetadata.university,
        faculty: userFromMetadata.faculty,
        department: userFromMetadata.department,
        year: userFromMetadata.year
      })
      
      // 3. ユーザー情報を設定（メタデータベース）
      setUser(userFromMetadata)
      
      // 4. オプション: usersテーブルからの情報で補完を試行（失敗してもOK）
      try {
        const { data: tableUser, error: tableError } = await supabase
          .from('users')
          .select('university, faculty, department, year, name, pen_name')
          .eq('id', userId)
          .single()

        if (!tableError && tableUser) {
          console.log('📊 usersテーブルから補完情報取得:', tableUser)
          
          // テーブルに有効な情報がある場合のみ補完
          const enhancedUser = {
            ...userFromMetadata,
            university: (tableUser.university && tableUser.university !== '未設定') ? tableUser.university : userFromMetadata.university,
            faculty: (tableUser.faculty && tableUser.faculty !== '未設定') ? tableUser.faculty : userFromMetadata.faculty,
            department: (tableUser.department && tableUser.department !== '未設定') ? tableUser.department : userFromMetadata.department,
            year: tableUser.year || userFromMetadata.year,
            name: tableUser.name || userFromMetadata.name,
            pen_name: tableUser.pen_name || userFromMetadata.pen_name
          }
          
          console.log('✨ テーブル情報で補完したユーザー情報:', {
            university: enhancedUser.university,
            faculty: enhancedUser.faculty,
            department: enhancedUser.department
          })
          
          setUser(enhancedUser)
        }
      } catch (tableError) {
        console.log('ℹ️ usersテーブル補完失敗（問題ありません）:', tableError)
      }
      
      console.log('=== fetchUserProfile完了 ===')
      
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
          user: data.user ? { 
            id: data.user.id, 
            email: data.user.email,
            user_metadata: data.user.user_metadata 
          } : null,
          session: data.session ? 'session-exists' : null
        } : null, 
        error: error ? { message: error.message, status: error.status } : null 
      })
      
      // 保存されたメタデータを詳細に確認
      if (data.user) {
        console.log('📋 保存されたuser_metadata詳細:', {
          name: data.user.user_metadata?.name,
          university: data.user.user_metadata?.university,
          faculty: data.user.user_metadata?.faculty,
          department: data.user.user_metadata?.department,
          year: data.user.user_metadata?.year,
          pen_name: data.user.user_metadata?.pen_name
        })
      }

      if (error) {
        console.error('Supabase認証エラー詳細:', {
          message: error.message,
          status: error.status,
          name: error.name
        })
        throw error
      }

      // ユーザープロフィールを作成（メタデータベース）
      if (data.user) {
        console.log('🎉 ユーザー登録成功:', {
          userId: data.user.id.substring(0, 8) + '...',
          email: userData.email,
          name: userData.name,
          university: userData.university,
          faculty: userData.faculty,
          department: userData.department
        })
        
        // プロフィール情報は user_metadata に保存されているので登録完了
        console.log('✅ プロフィール情報は認証メタデータに保存されました')
        
        // オプション: usersテーブルに同期を試行（失敗してもシステムは動作）
        try {
          const { error: tableError } = await supabase
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
          
          if (!tableError) {
            console.log('🗃️ usersテーブル同期も成功しました')
          } else {
            console.log('ℹ️ usersテーブル同期失敗（システムは正常動作します）:', tableError.message)
          }
          
        } catch (insertError) {
          console.log('ℹ️ usersテーブル同期試行エラー（システムは正常動作します）:', insertError)
        }
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
      console.log('🔄 プロフィール更新開始:', updates)

      // 1. 認証メタデータを更新（最重要）
      const { error: metadataError } = await supabase.auth.updateUser({
        data: {
          name: updates.name || user.name,
          university: updates.university || user.university,
          faculty: updates.faculty || user.faculty,
          department: updates.department || user.department,
          year: updates.year || user.year,
          pen_name: updates.pen_name || user.pen_name
        }
      })

      if (metadataError) {
        console.error('❌ メタデータ更新エラー:', metadataError)
        throw metadataError
      }

      console.log('✅ 認証メタデータ更新成功')

      // 2. usersテーブルも更新（補完的）
      try {
        const { error: tableError } = await supabase
          .from('users')
          .upsert({
            id: user.id,
            email: user.email,
            name: updates.name || user.name,
            university: updates.university || user.university,
            faculty: updates.faculty || user.faculty,
            department: updates.department || user.department,
            year: updates.year || user.year,
            pen_name: updates.pen_name || user.pen_name,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'id'
          })

        if (!tableError) {
          console.log('✅ usersテーブル更新成功')
        } else {
          console.warn('⚠️ usersテーブル更新失敗（問題なし）:', tableError)
        }
      } catch (tableError) {
        console.warn('⚠️ usersテーブル更新エラー（問題なし）:', tableError)
      }

      // 3. ローカル状態を更新
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      console.log('✅ ローカル状態更新完了:', updatedUser)

      return { error: null }
    } catch (error) {
      console.error('❌ プロフィール更新全体エラー:', error)
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
