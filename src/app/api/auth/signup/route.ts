import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, isValidNagoyaEmail, extractDomain } from '@/lib/supabase-admin'
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

// 通常のSupabaseクライアント（メール認証用）
const supabasePublic = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { email, devMode } = await request.json()
    
    console.log('📧 新規登録リクエスト:', { email, devMode })

    // Validate email format
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      console.log('❌ メールフォーマットエラー')
      return NextResponse.json(
        { error: 'メールアドレスを正しく入力してください' },
        { status: 400 }
      )
    }

    // Check if email domain is allowed (skip in dev mode)
    const isDevelopment = process.env.NODE_ENV === 'development'
    if (!isValidNagoyaEmail(email) && !devMode && !isDevelopment) {
      const domain = extractDomain(email)
      console.log('❌ ドメインエラー:', { email, domain, allowedDomains: process.env.ALLOWED_EMAIL_DOMAINS })
      return NextResponse.json(
        { 
          error: '名古屋大学のメールアドレス（@s.thers.ac.jp、@nagoya-u.ac.jp、@i.nagoya-u.ac.jp）のみ登録可能です',
          domain: domain 
        },
        { status: 400 }
      )
    }
    
    if (devMode || isDevelopment) {
      console.log('🔧 開発モード: ドメイン制限をスキップ')
    }

    // Check if user already exists
    console.log('🔍 既存ユーザーチェック中:', email)
    const { data: existingUser, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (listError) {
      console.error('❌ ユーザー一覧取得エラー:', listError)
      return NextResponse.json(
        { error: 'ユーザー確認中にエラーが発生しました' },
        { status: 500 }
      )
    }
    
    const existingUserData = existingUser.users.find(user => user.email === email)
    console.log('📊 ユーザー存在チェック:', { 
      email, 
      userExists: !!existingUserData, 
      totalUsers: existingUser.users.length,
      matchingUsers: existingUser.users.filter(u => u.email === email).length
    })

    if (existingUserData) {
      console.log('🔍 既存ユーザー詳細:', {
        id: existingUserData.id,
        email: existingUserData.email,
        email_confirmed_at: existingUserData.email_confirmed_at,
        created_at: existingUserData.created_at
      })

      // メール認証済みのユーザーの場合は登録を拒否
      if (existingUserData.email_confirmed_at) {
        console.log('❌ 既に認証済みのユーザー')
        return NextResponse.json(
          { error: 'このメールアドレスは既に登録済みで認証も完了しています' },
          { status: 400 }
        )
      }

      // メール未認証のユーザーの場合は削除して再作成を許可
      console.log('🔄 メール未認証ユーザーを削除して再作成')
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(existingUserData.id)
      
      if (deleteError) {
        console.error('❌ ユーザー削除エラー:', deleteError)
        return NextResponse.json(
          { error: 'アカウントの再作成中にエラーが発生しました' },
          { status: 500 }
        )
      }
      
      console.log('✅ 未認証ユーザーを削除完了 - 新しい認証メールを送信します')
    }

    // Generate secure temporary password for email-only signup
    const userPassword = crypto.randomUUID()

    console.log('📧 ユーザー作成開始:', { email, hasPassword: !!userPassword })

    // Use public client for proper email confirmation flow
    console.log('📧 通常のsignUpでメール認証フロー開始')
    const { data, error } = await supabasePublic.auth.signUp({
      email,
      password: userPassword,
      options: {
        data: {
          university: '名古屋大学'
        },
        emailRedirectTo: `https://kakomonn.vercel.app/auth/email-verify?email=${encodeURIComponent(email)}`
      }
    })
    
    console.log('📧 signUp結果:', {
      success: !error,
      userId: data?.user?.id,
      email: data?.user?.email,
      emailConfirmedAt: data?.user?.email_confirmed_at,
      needsConfirmation: !data?.user?.email_confirmed_at,
      sessionExists: !!data?.session
    })

    if (error) {
      console.error('User creation error:', error)
      return NextResponse.json(
        { error: 'ユーザー登録中にエラーが発生しました' },
        { status: 500 }
      )
    }

    // Supabaseの標準signUpを使用した場合、自動的にメールが送信される
    let linkData = null
    
    console.log('📧 Supabaseの自動メール送信を使用（手動リンク生成をスキップ）')
    
    // 開発モード用にOTPを生成（デバッグ目的のみ）
    if (devMode && data?.user && !data?.user?.email_confirmed_at) {
      console.log('🔧 開発モード: OTP生成中...')
      try {
        const { data: generatedLinkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
          type: 'signup',
          email,
          password: userPassword,
          options: {
            redirectTo: `https://kakomonn.vercel.app/auth/email-verify?email=${encodeURIComponent(email)}`
          }
        })

        if (!linkError && generatedLinkData) {
          linkData = generatedLinkData
          console.log('✅ 開発用OTPコード:', linkData?.properties?.email_otp)
        }
      } catch (devError) {
        console.log('⚠️ 開発用OTP生成失敗:', devError)
      }
    }

    // Resend経由でのバックアップメール送信（オプション）
    if (linkData?.properties?.action_link || linkData?.properties?.email_otp) {
      console.log('📧 Resend経由でバックアップメール送信中...')
      try {
        const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://kakomonn.vercel.app'}/api/auth/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            confirmationUrl: linkData?.properties?.action_link?.replace('https://fuyou-sigma.vercel.app', 'https://kakomonn.vercel.app'),
            otp: linkData?.properties?.email_otp
          })
        })

        if (emailResponse.ok) {
          console.log('✅ Resend経由バックアップメール送信成功')
        } else {
          console.log('⚠️ Resend経由バックアップメール送信失敗')
        }
      } catch (emailError) {
        console.log('⚠️ Resend経由メール送信エラー:', emailError instanceof Error ? emailError.message : emailError)
      }
    } else {
      console.log('📧 Supabase標準メールを使用、Resendバックアップをスキップ')
    }

    console.log('✅ ユーザー作成・メール送信成功:', data?.user?.id)

    const isResend = !!existingUserData
    
    return NextResponse.json({
      message: isResend 
        ? '新しい認証メールを送信しました。前回のメールが届かなかった場合は、受信トレイとスパムフォルダをご確認ください。'
        : 'アカウントを作成しました。メール認証を完了してください。受信トレイとスパムフォルダの両方をご確認ください。',
      success: true,
      userId: data?.user?.id,
      email: email,
      isResend: isResend,
      // Development mode: OTPを返す（本番では削除）
      ...(devMode && { 
        otp: linkData?.properties?.email_otp,
        debugInfo: 'OTPコードが生成されました。メールが届かない場合はこのコードを使用してください。'
      })
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}