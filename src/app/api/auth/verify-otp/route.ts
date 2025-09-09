import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function POST(request: NextRequest) {
  try {
    const { email, otp } = await request.json()
    
    console.log('🔐 OTP認証リクエスト:', { email, otp })

    // Validate input
    if (!email || !otp) {
      return NextResponse.json(
        { error: 'メールアドレスとOTPを入力してください' },
        { status: 400 }
      )
    }

    // Verify OTP using admin client
    const { data, error } = await supabaseAdmin.auth.verifyOtp({
      email,
      token: otp,
      type: 'email'
    })

    if (error) {
      console.error('❌ OTP認証エラー:', error)
      return NextResponse.json(
        { error: 'OTPが無効または期限切れです' },
        { status: 400 }
      )
    }

    console.log('✅ OTP認証成功:', data.user?.id)

    // Update user's email_confirmed_at
    if (data.user) {
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        data.user.id,
        { email_confirm: true }
      )
      
      if (updateError) {
        console.error('⚠️ メール確認状態更新エラー:', updateError)
      }
    }

    return NextResponse.json({
      message: 'メール認証が完了しました',
      user: data.user
    })

  } catch (error) {
    console.error('OTP verification error:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}