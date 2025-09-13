# Supabaseメール認証設定ガイド

## 1. Supabaseダッシュボードでの設定（必須）

### Authentication → URL Configuration
1. **Site URL**: `https://kakomonn.vercel.app` に設定
2. **Redirect URLs**: 以下を追加
   - `https://kakomonn.vercel.app/**`
   - `http://localhost:3000/**` （開発用）

### Authentication → Providers → Email
1. **Enable Email Confirmations**: ON
2. **Enable Email Change Confirmations**: ON
3. **Secure Email Change**: ON

## 2. 無料プランの制限回避方法

### 現在の制限
- **1時間あたり2通**のメール送信制限
- 本番環境での使用は非推奨

### 暫定的な解決策
1. **開発段階**: OTP表示モードを使用
2. **テスト段階**: レート制限に注意して少人数でテスト
3. **本番環境**: カスタムSMTP設定（必須）

## 3. カスタムSMTP設定（推奨）

### SendGrid（無料プランあり）
1. SendGridアカウント作成
2. APIキー生成
3. Supabaseダッシュボードで設定：
   - SMTP Host: `smtp.sendgrid.net`
   - Port: `587`
   - Username: `apikey`
   - Password: `[SendGrid APIキー]`

### Resend（推奨・簡単）
1. Resendアカウント作成
2. APIキー生成
3. ドメイン認証
4. Supabaseダッシュボードで設定

## 4. テスト手順

### メール送信テスト
1. 1時間に2通の制限に注意
2. 異なるメールアドレスでテスト
3. スパムフォルダも確認

### デバッグ手順
1. Supabase Dashboard → Logs → Auth でエラーログ確認
2. ブラウザの開発者ツールでネットワークタブ確認
3. サーバーログで詳細エラー確認

## 5. 本番環境チェックリスト

- [ ] Supabase Site URL設定完了
- [ ] Redirect URLs設定完了
- [ ] カスタムSMTP設定完了
- [ ] ドメイン認証完了（該当する場合）
- [ ] メール送信テスト完了
- [ ] エラーハンドリング実装完了