# Supabase Storage RLS 手動修正手順

## 問題
ファイルアップロード時に「new row violates row-level security policy」エラーが発生

## 解決方法

### 1. Supabase管理画面にアクセス
1. https://supabase.com/dashboard にログイン
2. プロジェクト「lomqnabnvzufgdzlwblg」を選択

### 2. Storage設定を確認
1. 左メニュー「Storage」をクリック
2. 「past-exams」バケットを確認

### 3. RLSを一時的に無効化（緊急対応）
1. 左メニュー「SQL Editor」をクリック
2. 以下のSQLを実行：

```sql
-- Storage objects テーブルのRLSを無効化
ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;
```

### 4. または、適切なポリシーを作成
1. 左メニュー「Storage」 → 「Policies」
2. 「New Policy」をクリック
3. 以下のポリシーを作成：

**Policy 1: Allow authenticated uploads**
- Policy name: `Allow authenticated uploads`
- Allowed operation: `INSERT`
- Target roles: `authenticated`
- USING expression: `bucket_id = 'past-exams'`

**Policy 2: Allow public read**
- Policy name: `Allow public read`
- Allowed operation: `SELECT`
- Target roles: `anon, authenticated`
- USING expression: `bucket_id = 'past-exams'`

### 5. 確認方法
アプリでPDFファイルのアップロードをテストする

## 注意事項
- RLSを完全に無効化するのはセキュリティ上推奨されません
- 本番環境では適切なポリシーを設定してください