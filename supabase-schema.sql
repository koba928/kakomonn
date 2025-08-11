-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  university VARCHAR(100) NOT NULL,
  faculty VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  pen_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Past exams table
CREATE TABLE IF NOT EXISTS past_exams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  course_name VARCHAR(100) NOT NULL,
  professor VARCHAR(100) NOT NULL,
  university VARCHAR(100) NOT NULL,
  faculty VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  year INTEGER NOT NULL,
  semester VARCHAR(20) NOT NULL,
  exam_type VARCHAR(20) NOT NULL,
  file_url TEXT NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  uploaded_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  download_count INTEGER DEFAULT 0,
  difficulty INTEGER DEFAULT 3,
  helpful_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Threads table
CREATE TABLE IF NOT EXISTS threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  course VARCHAR(100) NOT NULL,
  university VARCHAR(100) NOT NULL,
  faculty VARCHAR(100) NOT NULL,
  department VARCHAR(100) NOT NULL,
  exam_year INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_past_exams_university ON past_exams(university);
CREATE INDEX IF NOT EXISTS idx_past_exams_faculty ON past_exams(faculty);
CREATE INDEX IF NOT EXISTS idx_past_exams_course ON past_exams(course_name);
CREATE INDEX IF NOT EXISTS idx_threads_university ON threads(university);
CREATE INDEX IF NOT EXISTS idx_threads_faculty ON threads(faculty);
CREATE INDEX IF NOT EXISTS idx_comments_thread_id ON comments(thread_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE past_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users
CREATE POLICY "Users can view all users" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- RLS Policies for past_exams
CREATE POLICY "Anyone can view past exams" ON past_exams
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create past exams" ON past_exams
  FOR INSERT WITH CHECK (auth.uid() = uploaded_by);

CREATE POLICY "Users can update their own past exams" ON past_exams
  FOR UPDATE USING (auth.uid() = uploaded_by);

CREATE POLICY "Users can delete their own past exams" ON past_exams
  FOR DELETE USING (auth.uid() = uploaded_by);

-- RLS Policies for threads
CREATE POLICY "Anyone can view threads" ON threads
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create threads" ON threads
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own threads" ON threads
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own threads" ON threads
  FOR DELETE USING (auth.uid() = author_id);

-- RLS Policies for comments
CREATE POLICY "Anyone can view comments" ON comments
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments" ON comments
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own comments" ON comments
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own comments" ON comments
  FOR DELETE USING (auth.uid() = author_id);

-- Create storage bucket for past exam files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('past-exams', 'past-exams', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies（厳格化: ユーザー自身のUID配下のみ操作可）
DO $$ BEGIN
  PERFORM 1 FROM pg_policies WHERE polname = 'Anyone can view past exam files' AND schemaname = 'public';
EXCEPTION WHEN undefined_table THEN NULL; END $$;

DROP POLICY IF EXISTS "Anyone can view past exam files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload past exam files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own past exam files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own past exam files" ON storage.objects;

CREATE POLICY "Anyone can view past exam files" ON storage.objects
  FOR SELECT USING (bucket_id = 'past-exams');

-- 自分のUID（パスの先頭）に限定して操作を許可
CREATE POLICY "Insert own past exam files" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'past-exams'
    AND split_part(name, '/', 1) = auth.uid()::text
  );

CREATE POLICY "Update own past exam files" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'past-exams'
    AND split_part(name, '/', 1) = auth.uid()::text
  );

CREATE POLICY "Delete own past exam files" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'past-exams'
    AND split_part(name, '/', 1) = auth.uid()::text
  );

-- ダウンロード数インクリメントの原子的更新RPC
CREATE OR REPLACE FUNCTION increment_download_count(exam_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE past_exams
  SET download_count = COALESCE(download_count, 0) + 1
  WHERE id = exam_id;
$$;

REVOKE ALL ON FUNCTION increment_download_count(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION increment_download_count(uuid) TO anon, authenticated;

-- テストデータの挿入
-- テストユーザーの挿入
INSERT INTO users (id, email, name, university, faculty, department, year, pen_name) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'test1@example.com', '田中太郎', '東京大学', '経済学部', '経済学科', 3, '経済3年'),
('550e8400-e29b-41d4-a716-446655440002', 'test2@example.com', '佐藤花子', '早稲田大学', '商学部', '商学科', 2, '商学2年'),
('550e8400-e29b-41d4-a716-446655440003', 'test3@example.com', '鈴木一郎', '京都大学', '理学部', '物理学科', 4, '物理4年')
ON CONFLICT (id) DO NOTHING;

-- テストスレッドの挿入
INSERT INTO threads (id, title, content, author_id, course, university, faculty, department, exam_year) VALUES
('660e8400-e29b-41d4-a716-446655440001', 'マクロ経済学 2024年期末試験について', '来週のマクロ経済学の期末試験、過去問と傾向が似てるかな？IS-LMモデルは確実に出そうだけど...', '550e8400-e29b-41d4-a716-446655440001', 'マクロ経済学', '東京大学', '経済学部', '経済学科', 2024),
('660e8400-e29b-41d4-a716-446655440002', '微積分学I 田中教授の過去問共有', '田中教授の微積分、毎年似たような問題が出てます。2023年の過去問をアップしたので参考にどうぞ！', '550e8400-e29b-41d4-a716-446655440003', '微積分学I', '京都大学', '理学部', '物理学科', 2023),
('660e8400-e29b-41d4-a716-446655440003', '憲法 レポート課題のヒント教えて', '憲法のレポート課題「基本的人権について」で悩んでます。どの判例を中心に書けばいいでしょうか？', '550e8400-e29b-41d4-a716-446655440002', '憲法', '早稲田大学', '商学部', '商学科', NULL)
ON CONFLICT (id) DO NOTHING;

-- テストコメントの挿入
INSERT INTO comments (id, thread_id, content, author_id) VALUES
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'ありがとうございます！IS-LMモデル、グラフの移動パターンをもう一度整理しておきます。', '550e8400-e29b-41d4-a716-446655440002'),
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', '田中教授の試験、計算問題も出ますよね？数値を使ったIS-LM分析とかも準備した方がいいかも。', '550e8400-e29b-41d4-a716-446655440003'),
('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', 'ファイルありがとうございます。参考にさせていただきます。', '550e8400-e29b-41d4-a716-446655440001')
ON CONFLICT (id) DO NOTHING;
