-- 過去問更新のためのRLSポリシー修正

-- 現在のポリシーを確認
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'past_exams' AND cmd = 'UPDATE';

-- 更新ポリシーを削除して再作成
DROP POLICY IF EXISTS "Users can update their own past exams" ON past_exams;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON past_exams;
DROP POLICY IF EXISTS "Users can update own exams" ON past_exams;

-- 新しい更新ポリシーを作成
CREATE POLICY "Allow users to update their own past exams"
ON past_exams
FOR UPDATE
USING (auth.uid()::text = uploaded_by)
WITH CHECK (auth.uid()::text = uploaded_by);

-- ポリシーが正しく作成されたか確認
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'past_exams' AND cmd = 'UPDATE';

-- テスト用のクエリ（実際のIDに置き換えてください）
-- SELECT * FROM past_exams WHERE id = '2f8c9257-34f2-4a73-a0ac-3bab6d316241' AND auth.uid()::text = uploaded_by;