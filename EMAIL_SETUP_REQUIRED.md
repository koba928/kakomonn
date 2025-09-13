# 🚨 メール認証設定が必要です

## 緊急対応完了内容
✅ OTP認証システム実装（メール認証の代替手段）
✅ Resend API統合（バックアップメール送信）
✅ デバッグモード実装（開発・テスト用）

## 本番環境で必要な設定

### 1️⃣ Supabaseダッシュボード設定（最重要）
**URL: https://supabase.com/dashboard/project/rgcbixnrlrohwcbxylyg**

#### Authentication → URL Configuration
- **Site URL**: `https://kakomonn.vercel.app`
- **Redirect URLs**: `https://kakomonn.vercel.app/**`

現在の問題: Site URLが `https://fuyou-sigma.vercel.app` のため、メールリンクが機能しません

### 2️⃣ Resend API設定（推奨）
1. https://resend.com でアカウント作成
2. API Key生成: `re_xxxxx` 形式
3. Vercelで環境変数更新:
```bash
vercel env rm RESEND_API_KEY production
vercel env add RESEND_API_KEY production
# 実際のAPIキーを入力
```

### 3️⃣ Supabase SMTP設定（オプション）
Authentication → Settings → SMTP Settings:
- **Enable custom SMTP**: ON  
- **Host**: smtp.resend.com
- **Port**: 587
- **Username**: resend
- **Password**: [Resend APIキー]

## 現在の動作

### ✅ 動作中の機能
- OTP認証（6桁コード入力）
- 開発モードでOTP表示
- Supabaseデフォルトメール送信（制限あり）
- Resend APIバックアップ送信

### ⚠️ 制限事項
- Supabase無料プラン: 1時間2通まで
- Site URL設定により正しいリンクが生成されない
- スパムフィルターによるメール不達の可能性

## テスト手順

### 管理者テスト
1. https://kakomonn.vercel.app/signup
2. 開発モードON
3. OTPコード確認
4. /auth/verify-otp でOTP入力

### 実ユーザーテスト
1. 正しいメール設定完了後
2. 名大メールアドレス（@s.thers.ac.jp）で登録
3. メール認証リンクまたはOTPで認証

## 設定優先度
1. **最優先**: Supabase Site URL修正
2. **推奨**: Resend API設定
3. **任意**: Supabase SMTP設定

設定完了までOTP認証で運用可能です。