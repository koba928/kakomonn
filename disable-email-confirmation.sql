-- Supabaseでメール確認を無効化する設定

-- 1. 認証設定でメール確認を無効化
-- Supabase管理画面で以下の設定を行う：
-- Authentication > Settings > Auth settings
-- "Enable email confirmations" をOFFにする

-- または、開発環境用に自動確認を有効化
-- Authentication > Email Templates > Confirm signup
-- テンプレートを編集して自動確認リンクを設定

-- 2. 既存ユーザーのメール確認状態を更新（オプション）
UPDATE auth.users 
SET email_confirmed_at = now() 
WHERE email_confirmed_at IS NULL;

-- 注意: これは開発環境でのみ使用してください
-- 本番環境ではセキュリティのためメール確認を有効にすることを推奨