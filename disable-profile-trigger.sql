-- profilesテーブルのトリガーを一時的に無効化
-- "Database error saving new user"エラーの暫定対処

-- トリガーを削除（一時的）
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 確認用クエリ
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'auth' OR event_object_schema = 'auth';