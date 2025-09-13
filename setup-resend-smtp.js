#!/usr/bin/env node

// Resend SMTP設定のヘルパースクリプト
const crypto = require('crypto')

console.log('📧 Resend SMTP設定ガイド')
console.log('=' .repeat(50))

console.log('\n1️⃣ Resendアカウント作成:')
console.log('   https://resend.com でアカウント作成')

console.log('\n2️⃣ APIキー生成:')
console.log('   Dashboard → API Keys → Create API Key')
console.log('   名前: kakomonn-email')
console.log('   権限: Sending access')

console.log('\n3️⃣ Supabaseダッシュボード設定:')
console.log('   Authentication → Settings → SMTP Settings')
console.log('   Enable custom SMTP: ON')
console.log('   Sender name: 過去問hub')
console.log('   Sender email: noreply@kakomonn.vercel.app')
console.log('   Host: smtp.resend.com')
console.log('   Port: 587')
console.log('   Username: resend')
console.log('   Password: [ResendのAPIキー]')

console.log('\n4️⃣ Vercel環境変数追加:')
console.log('   RESEND_API_KEY=[ResendのAPIキー]')

console.log('\n5️⃣ ドメイン認証（オプション・推奨）:')
console.log('   Resend Dashboard → Domains → Add Domain')
console.log('   ドメイン: kakomonn.vercel.app')
console.log('   DNS設定が必要')

console.log('\n6️⃣ 緊急回避策（Resend API直接使用）:')
console.log('   /api/auth/send-email エンドポイントを作成')
console.log('   Resend APIで直接メール送信')

const resendCode = `
// /src/app/api/auth/send-email/route.ts
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  const { email, confirmationUrl } = await request.json()
  
  try {
    const { data, error } = await resend.emails.send({
      from: '過去問hub <noreply@kakomonn.vercel.app>',
      to: [email],
      subject: 'メール認証のお願い',
      html: \`
        <h2>過去問hubへようこそ</h2>
        <p>以下のリンクをクリックしてメール認証を完了してください：</p>
        <a href="\${confirmationUrl}">メール認証を完了</a>
        <p>このリンクは24時間有効です。</p>
      \`
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, messageId: data.id })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
`

console.log('\n7️⃣ コード例:')
console.log(resendCode)

console.log('\n⚠️ 重要: Supabaseダッシュボードでまず以下を設定:')
console.log('   Authentication → URL Configuration')
console.log('   Site URL: https://kakomonn.vercel.app')
console.log('   Redirect URLs: https://kakomonn.vercel.app/**')