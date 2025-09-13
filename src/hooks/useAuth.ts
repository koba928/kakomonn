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
  year: string
  pen_name: string
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [authStep, setAuthStep] = useState<'idle' | 'signing-in' | 'verifying' | 'profile-loading' | 'redirecting'>('idle')

  useEffect(() => {
    let isMounted = true

    // 現在のセッションを取得
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!isMounted) return
        
        if (error) {
          console.error('セッション取得エラー:', error)
          setLoading(false)
          return
        }

        console.log('🔐 セッション確認:', { 
          hasSession: !!session, 
          userId: session?.user?.id?.substring(0, 8) + '...' 
        })

        setSession(session)
        
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        }
        
        setLoading(false)
      } catch (error) {
        console.error('セッション初期化エラー:', error)
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    getSession()

    // 認証状態の変更を監視
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return

        console.log('🔐 認証状態変更:', { event, hasSession: !!session })
        
        setSession(session)
        
        if (session?.user) {
          await fetchUserProfile(session.user.id)
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      console.log('=== fetchUserProfile開始 ===', { userId: userId.substring(0, 8) + '...' })
      
      // 1. まず認証ユーザー情報を取得（最新の状態を保証）
      console.log('🔄 getUser()を呼び出し中...')
      
      // タイムアウトを設定
      const getUserPromise = supabase.auth.getUser()
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('getUser timeout')), 5000)
      )
      
      try {
        const result = await Promise.race([getUserPromise, timeoutPromise]) as { data: { user: any }, error: any }
        const { data: { user: authUser }, error: authError } = result
        
        console.log('✅ getUser()完了:', { 
          hasUser: !!authUser, 
          hasError: !!authError,
          error: authError 
        })
        
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
        year: authUser.user_metadata?.year || '未設定',
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
      
      // 4. profilesテーブルからの情報で補完を試行（プライマリソース）
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('university, faculty, year')
          .eq('id', userId)
          .single()

        if (!profileError && profileData) {
          console.log('📊 profilesテーブルから情報取得:', profileData)
          
          // プロフィール情報で補完
          const enhancedUser = {
            ...userFromMetadata,
            university: profileData.university || '名古屋大学',
            faculty: profileData.faculty || '未設定',
            department: '未設定', // profilesテーブルにはdepartmentはない
            year: profileData.year || '未設定',
            pen_name: userFromMetadata.name
          }
          
          console.log('✨ プロフィール情報で補完したユーザー情報:', {
            university: enhancedUser.university,
            faculty: enhancedUser.faculty,
            year: enhancedUser.year
          })
          
          setUser(enhancedUser)
        }
      } catch (profileError) {
        console.log('ℹ️ profilesテーブル取得失敗（問題ありません）:', profileError)
      }
      
        console.log('=== fetchUserProfile完了 ===')
        
      } catch (timeoutError) {
        console.error('⏱️ getUser()タイムアウト:', timeoutError)
        // タイムアウトの場合は基本情報だけ設定
        setUser({
          id: userId,
          email: '',
          name: 'ユーザー',
          university: '未設定',
          faculty: '未設定', 
          department: '未設定',
          year: '未設定',
          pen_name: 'ユーザー'
        })
      }
      
    } catch (error) {
      console.error('ユーザープロフィール取得エラー:', error)
    }
  }

  const signUp = async (email: string, devMode = false) => {
    try {
      console.log('signUp開始（メール認証フロー）:', { email, devMode })
      
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, devMode }),
      })

      const result = await response.json()

      if (!response.ok) {
        console.error('API signup エラー:', result.error)
        return { data: null, error: new Error(result.error) }
      }

      console.log('✅ signup API 成功:', result.message)
      return { data: result, error: null }
      
    } catch (error) {
      console.error('signUp全体エラー:', error)
      return { data: null, error }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      console.log('🔐 signIn開始:', { email })
      setIsAuthenticating(true)
      setAuthStep('signing-in')

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      console.log('🔐 認証結果:', { 
        success: !error,
        error: error?.message,
        userId: data.user?.id?.substring(0, 8) + '...' 
      })

      if (error) {
        console.error('❌ 認証エラー:', error)
        // エラー時は即座に認証状態をリセット
        setIsAuthenticating(false)
        setAuthStep('idle')
        throw error
      }

      console.log('👤 プロフィール取得開始')
      setAuthStep('profile-loading')
      
      // セッション情報を手動で設定
      setSession(data.session)

      if (data.user) {
        // fetchUserProfile を使用（既存のロジックを活用）
        await fetchUserProfile(data.user.id)
        console.log('✅ プロフィール取得完了')
      }

      console.log('🔄 認証状態リセット開始')
      setAuthStep('redirecting')
      
      // 認証状態を確実にリセット
      setIsAuthenticating(false)
      setAuthStep('idle')
      
      console.log('✅ signIn完了')
      return { data, error: null, user: data.user }
      
    } catch (error) {
      console.error('❌ signIn全体エラー:', error)
      // エラー時も確実に認証状態をリセット
      setIsAuthenticating(false)
      setAuthStep('idle')
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
