# 名古屋大学専用認証システム セットアップガイド

## 概要

このシステムは名古屋大学の学生・教職員のみが利用できる過去問共有プラットフォームです。
名大メール（@nagoya-u.ac.jp または @i.nagoya-u.ac.jp）での認証を必須とし、大学名は「名古屋大学」に固定されます。

## セットアップ手順

### 1. Supabase設定

#### 1.1 認証設定
1. Supabase ダッシュボードにログイン
2. `Authentication` > `Providers` に移動
3. `Email` プロバイダーで以下を設定：
   - `Enable Email Signups` を **OFF** にする（公開サインアップを無効化）
   - `Enable Email Confirmations` を **ON** にする
   - `Secure Email Change` を **ON** にする

#### 1.2 メールテンプレート
1. `Authentication` > `Email Templates` に移動
2. `Confirm signup` テンプレートを以下のように編集：

```html
<h2>名古屋大学 過去問hub - メールアドレス確認</h2>
<p>こんにちは、</p>
<p>過去問hubへの登録ありがとうございます。以下のリンクをクリックして、メールアドレスを確認してください：</p>
<p><a href="{{ .ConfirmationURL }}">メールアドレスを確認する</a></p>
<p>このリンクは24時間有効です。</p>
<p>心当たりのない場合は、このメールを無視してください。</p>
```

### 2. データベース設定

#### 2.1 マイグレーション実行
```bash
# Supabase CLIがインストールされている場合
supabase db push

# または、Supabase ダッシュボードのSQL エディタで以下を実行：
# /supabase/migrations/20240104_nagoya_auth_schema.sql の内容をコピー&ペースト
```

### 3. 環境変数設定

#### 3.1 `.env.local` ファイルを作成
```bash
cp .env.example.nagoya .env.local
```

#### 3.2 必要な値を設定
```env
# Supabaseダッシュボードから取得
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...  # Settings > API > service_role secret

# アプリケーションURL
NEXT_PUBLIC_APP_URL=https://your-domain.com  # 本番環境のURL

# 許可メールドメイン（カンマ区切り）
ALLOWED_EMAIL_DOMAINS=nagoya-u.ac.jp,i.nagoya-u.ac.jp
```

### 4. Vercelデプロイ設定（本番環境）

1. Vercel ダッシュボードにログイン
2. プロジェクトの Settings > Environment Variables
3. 上記の環境変数をすべて追加
4. デプロイを実行

## 認証フロー

1. **新規登録** (`/signup`)
   - 名大メール入力 → API検証 → 確認メール送信
   - 許可ドメイン以外は400エラー

2. **メール確認**
   - マジックリンククリック → Supabase認証

3. **プロフィール登録** (`/onboarding`)
   - 学部選択（必須）
   - 大学名は自動的に「名古屋大学」

4. **完了**
   - `/search` へリダイレクト

## セキュリティ設計

### サーバー側の保護
- `university` フィールドは常にサーバー側で「名古屋大学」に設定
- クライアントからの university 入力は無視

### データベースレベルの保護
```sql
-- CHECK制約で名古屋大学以外を拒否
CHECK (university = '名古屋大学')

-- トリガーでUPDATE時の変更を防止
CREATE TRIGGER prevent_profiles_university_update
```

### RLSポリシー
- INSERT: `university = '名古屋大学'` の場合のみ許可
- UPDATE: 自分のプロフィールのみ（universityは変更不可）

## トラブルシューティング

### Q: メールが届かない
A: 
1. Supabaseの Email Logs を確認
2. スパムフォルダを確認
3. 本番環境ではSendGridなどの外部メールサービス設定を推奨

### Q: "University cannot be changed" エラー
A: これは正常な動作です。university フィールドは変更不可能です。

### Q: プロフィール作成でエラー
A: 
1. ユーザーが認証済みか確認
2. すでにプロフィールが存在していないか確認
3. Supabase ログで詳細を確認

## 開発環境での動作確認

1. ローカルでNext.jsを起動
```bash
npm run dev
```

2. `/signup` にアクセス
3. 開発環境では確認メールのリンクがレスポンスに含まれます（debugLink）
4. リンクをブラウザで開いて認証完了
5. `/onboarding` で学部を選択

## 本番環境移行チェックリスト

- [ ] Supabase Auth設定の確認
- [ ] 環境変数の設定
- [ ] データベースマイグレーション実行
- [ ] メールサービスの設定（SendGrid等）
- [ ] `debugLink` の削除確認（/api/auth/signup）
- [ ] RLSポリシーの動作確認
- [ ] エラーメッセージの確認