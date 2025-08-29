-- 過去問テーブルの更新ポリシーを確認・作成

-- 既存のポリシーを確認
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'past_exams';

-- 過去問の更新ポリシーを作成（投稿者本人のみ更新可能）
DROP POLICY IF EXISTS "Users can update their own past exams" ON past_exams;

CREATE POLICY "Users can update their own past exams"
ON past_exams
FOR UPDATE
USING (auth.uid() = uploaded_by::uuid);

-- 過去問の選択ポリシーも確認（読み取りが必要）
DROP POLICY IF EXISTS "Anyone can view past exams" ON past_exams;

CREATE POLICY "Anyone can view past exams"
ON past_exams
FOR SELECT
USING (true);

-- 過去問の挿入ポリシーも確認
DROP POLICY IF EXISTS "Authenticated users can insert past exams" ON past_exams;

CREATE POLICY "Authenticated users can insert past exams"
ON past_exams
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL AND auth.uid() = uploaded_by::uuid);

-- RLSが有効か確認
ALTER TABLE past_exams ENABLE ROW LEVEL SECURITY;

-- ポリシーを再確認
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'past_exams';