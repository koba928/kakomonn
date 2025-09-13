import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const { email, confirmationUrl, otp } = await request.json()
    
    console.log('📧 Resend経由でメール送信:', { email, hasUrl: !!confirmationUrl, otp })

    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY環境変数が設定されていません')
      return NextResponse.json(
        { error: 'メール送信設定エラー' },
        { status: 500 }
      )
    }

    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4F46E5;">過去問hubへようこそ！</h2>
        
        <p>名古屋大学過去問共有プラットフォーム「過去問hub」にご登録いただき、ありがとうございます。</p>
        
        <div style="background-color: #F3F4F6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">メール認証を完了してください</h3>
          
          ${confirmationUrl ? `
            <p><strong>方法1: リンクをクリック</strong></p>
            <a href="${confirmationUrl}" style="display: inline-block; background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
              メール認証を完了
            </a>
            <p style="margin-top: 15px;"><small>リンクが機能しない場合は、以下をブラウザのアドレスバーにコピーしてください：<br>${confirmationUrl}</small></p>
          ` : ''}
          
          ${otp ? `
            <p><strong>方法2: 認証コードを入力</strong></p>
            <p>以下の6桁のコードを認証画面に入力してください：</p>
            <div style="font-size: 24px; font-weight: bold; color: #4F46E5; background-color: white; padding: 15px; border-radius: 4px; text-align: center; letter-spacing: 2px; border: 2px solid #E5E7EB;">
              ${otp}
            </div>
            <p><small>認証コードは24時間有効です。</small></p>
          ` : ''}
        </div>
        
        <div style="border-top: 1px solid #E5E7EB; padding-top: 20px; margin-top: 30px; color: #6B7280; font-size: 14px;">
          <p><strong>過去問hubについて</strong></p>
          <p>名古屋大学生専用の過去問共有プラットフォームです。安全で信頼できる学習環境を提供するため、大学メールアドレスでの認証を必須としています。</p>
          
          <p style="margin-top: 20px;">
            このメールに心当たりがない場合は、このメールを無視してください。<br>
            お困りの際は、プラットフォーム内のお問い合わせからご連絡ください。
          </p>
          
          <p style="margin-top: 20px;">
            過去問hub運営チーム<br>
            <a href="https://kakomonn.vercel.app" style="color: #4F46E5;">https://kakomonn.vercel.app</a>
          </p>
        </div>
      </div>
    `

    const { data, error } = await resend.emails.send({
      from: '過去問hub <noreply@resend.dev>', // Resendの無料ドメインを使用
      to: [email],
      subject: '【過去問hub】メール認証のお願い',
      html: emailContent
    })

    if (error) {
      console.error('❌ Resendメール送信エラー:', error)
      return NextResponse.json(
        { error: 'メール送信に失敗しました: ' + error.message },
        { status: 500 }
      )
    }

    console.log('✅ Resendメール送信成功:', { messageId: data?.id })

    return NextResponse.json({
      success: true,
      messageId: data?.id,
      message: 'メールを送信しました。受信トレイとスパムフォルダをご確認ください。'
    })

  } catch (error) {
    console.error('❌ メール送信API全体エラー:', error)
    return NextResponse.json(
      { error: 'サーバーエラーが発生しました' },
      { status: 500 }
    )
  }
}