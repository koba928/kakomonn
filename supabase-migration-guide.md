# Supabase プロジェクト移行ガイド

## 🚀 新しいSupabaseプロジェクトへの移行手順

### 1. 新しいSupabaseプロジェクトを作成

1. **https://app.supabase.com** にログイン
2. **「New project」** をクリック
3. プロジェクト名: `kakomonn` または `kakomonn-hub`
4. データベースパスワードを設定（強力なパスワードを推奨）
5. リージョンを選択（日本の場合は Asia Pacific (Tokyo) 推奨）
6. **「Create new project」** をクリック

### 2. 新しいプロジェクトの環境変数を取得

プロジェクト作成完了後：

1. **Settings** → **API** に移動
2. 以下の値をコピー：
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **Project API Key** の **anon/public** (NEXT_PUBLIC_SUPABASE_ANON_KEY)
   - **Project API Key** の **service_role** (SUPABASE_SERVICE_ROLE_KEY)

### 3. 環境変数を更新

`.env` ファイルを以下のように更新：

```env
NEXT_PUBLIC_SUPABASE_URL="新しいプロジェクトのURL"
NEXT_PUBLIC_SUPABASE_ANON_KEY="新しいanonキー"
SUPABASE_SERVICE_ROLE_KEY="新しいservice_roleキー"
```

### 4. データベーススキーマを適用

1. 新しいプロジェクトの **SQL Editor** を開く
2. **「New query」** をクリック
3. `supabase-schema.sql` の内容をコピー&ペースト
4. **「Run」** をクリック

### 5. ストレージバケットを作成

1. 同じくSQL Editorで **「New query」** をクリック
2. `setup-storage.sql` の内容をコピー&ペースト
3. **「Run」** をクリック

### 6. 接続テスト

```bash
node test-supabase-connection.js
```

### 7. 認証設定（オプション）

もし既存の認証設定がある場合：

1. **Authentication** → **Settings** で設定を確認
2. **Site URL** を設定（本番: https://kakomonn.vercel.app, 開発: http://localhost:3000）
3. **Email Templates** をカスタマイズ（必要に応じて）

## 🔄 移行後の確認事項

- ✅ データベース接続成功
- ✅ past_examsテーブル存在
- ✅ usersテーブル存在
- ✅ past-examsストレージバケット存在
- ✅ 認証機能の動作
- ✅ ファイルアップロード機能の動作

## 📝 移行のメリット

- 自分のアカウントで完全な管理権限
- プロジェクト設定の自由度向上
- 課金管理の透明性
- バックアップ・復元の容易さ

---

**注意**: 友人のプロジェクトに既存データがある場合、移行前にエクスポートを検討してください。