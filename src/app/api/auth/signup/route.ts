import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, isValidNagoyaEmail, extractDomain } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Validate email format
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json(
        { error: 'メールアドレスを正しく入力してください' },
        { status: 400 }
      )
    }

    // Check if email domain is allowed
    if (!isValidNagoyaEmail(email)) {
      const domain = extractDomain(email)
      return NextResponse.json(
        { 
          error: '名古屋大学のメールアドレス（@nagoya-u.ac.jp または @i.nagoya-u.ac.jp）のみ登録可能です',
          domain: domain 
        },
        { status: 400 }
      )
    }

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers()
    const userExists = existingUser.users.some(user => user.email === email)

    if (userExists) {
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