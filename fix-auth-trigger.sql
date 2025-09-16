-- Supabase認証エラー修正スクリプト
-- "Database error saving new user"エラーの解決

-- 1. 既存のトリガーを一時的に無効化
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. プロファイル作成関数を修正（エラーハンドリング追加）
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- エラーハンドリングを追加
  BEGIN
    INSERT INTO public.profiles (id, university, faculty, year)
    VALUES (NEW.id, '名古屋大学', null, null)
    ON CONFLICT (id) DO NOTHING;  -- 既に存在する場合は何もしない
  EXCEPTION
    WHEN OTHERS THEN
      -- エラーが発生してもユーザー作成は続行
      RAISE WARNING 'Profile creation failed for user %: %', NEW.id, SQLERRM;
  END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. トリガーを再作成
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 4. RLSポリシーの確認と修正
-- サービスロールでの挿入を許可
DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;
CREATE POLICY "Service role can insert profiles" ON profiles
  FOR INSERT TO service_role
  WITH CHECK (true);

-- 5. profiles テーブルの権限設定
GRANT ALL ON public.profiles TO postgres;
GRANT ALL ON public.profiles TO service_role;

-- 6. auth.users に関連する問題のデバッグ用クエリ
-- 以下のクエリを実行して、エラーの詳細を確認できます
/*
-- 最近作成されたユーザーを確認
SELECT id, email, created_at, email_confirmed_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 10;

-- profilesテーブルの内容を確認
SELECT * FROM profiles ORDER BY created_at DESC LIMIT 10;

-- トリガーの状態を確認
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'auth';
*/