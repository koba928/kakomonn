import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, isValidNagoyaEmail, extractDomain } from '@/lib/supabase-admin'

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
    if (!isValidNagoyaEmail(email) && !devMode) {
      const domain = extractDomain(email)
      console.log('❌ ドメインエラー:', { email, domain, allowedDomains: process.env.ALLOWED_EMAIL_DOMAINS })
      return NextResponse.json(
        { 
          error: '名古屋大学のメールアドレス（@s.thers.ac.jp）のみ登録可能です',
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

    // Create user with email confirmation required
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      email_confirm: false,
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

    // Generate magic link
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding`
      }
    })

    if (linkError) {
      console.error('Magic link generation error:', linkError)
      // User was created but link generation failed
      // In production, you might want to handle this differently
      return NextResponse.json(
        { 
          message: 'アカウントは作成されましたが、確認メールの送信に失敗しました。サポートにお問い合わせください。',
          userId: data.user.id 
        },
        { status: 201 }
      )
    }

    // In production, send email using your email service
    // For now, we'll return the link (remove in production!)
    console.log('Magic link for', email, ':', linkData.properties?.action_link)

    // Send confirmation email
    // TODO: Implement email sending via SendGrid, Resend, etc.
    // await sendConfirmationEmail(email, linkData.properties?.action_link)

    return NextResponse.json({
      message: '確認メールを送信しました。名古屋大学のメールアドレスをご確認ください。',
      // Remove this in production:
      debugLink: process.env.NODE_ENV === 'development' ? linkData.properties?.action_link : undefined
    })

  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}