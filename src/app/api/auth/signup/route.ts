import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, isValidNagoyaEmail, extractDomain } from '@/lib/supabase-admin'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email, password, devMode } = await request.json()
    
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
    if (!isValidNagoyaEmail(email) && !devMode) {
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
    
    if (devMode) {
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
    
    const userExists = existingUser.users.some(user => user.email === email)
    console.log('📊 ユーザー存在チェック:', { 
      email, 
      userExists, 
      totalUsers: existingUser.users.length,
      matchingUsers: existingUser.users.filter(u => u.email === email).length
    })

    if (userExists) {
      const existingUserData = existingUser.users.find(user => user.email === email)
      console.log('❌ 既存ユーザー詳細:', {
        id: existingUserData?.id,
        email: existingUserData?.email,
        created_at: existingUserData?.created_at
      })
      return NextResponse.json(
        { error: 'このメールアドレスは既に登録されています' },
        { status: 400 }
      )
    }

    // Use provided password or generate temporary one
    const userPassword = password || crypto.randomUUID()

    // Create user and send confirmation email
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password: userPassword,
      email_confirm: false, // メール認証を必要とする
      user_metadata: {
        university: '名古屋大学'
      }
    })

    if (error) {
      console.error('User creation error:', error)
      return NextResponse.json(
        { error: 'ユーザー登録中にエラーが発生しました' },
        { status: 500 }
      )
    }

    // Generate email confirmation link
    console.log('📧 メールリンク生成中... redirectTo:', 'https://kakomonn.vercel.app/auth/callback')
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email,
      password: userPassword,
      options: {
        redirectTo: 'https://kakomonn.vercel.app/auth/callback'
      }
    })

    if (linkError) {
      console.error('❌ Link generation error:', linkError)
      // Clean up created user if link generation fails
      await supabaseAdmin.auth.admin.deleteUser(data.user.id)
      return NextResponse.json(
        { error: 'メール送信に失敗しました' },
        { status: 500 }
      )
    }

    console.log('✅ メールリンク生成成功:', linkData?.properties?.action_link)
    console.log('✅ OTPコード:', linkData?.properties?.email_otp)

    // Resend経由でもメール送信を試行
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
        console.log('✅ Resend経由メール送信成功')
      } else {
        console.log('⚠️ Resend経由メール送信失敗（Supabaseメールにフォールバック）')
      }
    } catch (emailError) {
      console.log('⚠️ Resend経由メール送信エラー:', emailError.message)
    }

    console.log('✅ ユーザー作成・メール送信成功:', data.user.id)

    return NextResponse.json({
      message: 'アカウントを作成しました。メール認証を完了してください。受信トレイとスパムフォルダの両方をご確認ください。',
      success: true,
      userId: data.user.id,
      email: email,
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