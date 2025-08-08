-- 過去問hub テストデータ挿入スクリプト（一回のコピペで実行可能）
-- Supabase SQL Editorで実行してください

-- テストユーザーの挿入（UUID形式のIDを使用）
INSERT INTO users (id, email, name, university, faculty, department, year, pen_name, created_at, updated_at)
VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'test1@example.com', 'テストユーザー1', '東京大学', '経済学部', '経済学科', 2, '経済マスター', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440002', 'test2@example.com', 'テストユーザー2', '早稲田大学', '商学部', '商学科', 3, '商学エキスパート', NOW(), NOW()),
  ('550e8400-e29b-41d4-a716-446655440003', 'test3@example.com', 'テストユーザー3', '慶應義塾大学', '理工学部', '情報工学科', 2, 'プログラマー', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- テスト過去問データの挿入
INSERT INTO past_exams (
  id, title, course_name, professor, university, faculty, department, 
  year, semester, exam_type, file_url, file_name, uploaded_by, 
  download_count, difficulty, helpful_count, tags, created_at, updated_at
)
VALUES 
  (
    '550e8400-e29b-41d4-a716-446655440101', 'マクロ経済学I 中間試験', 'マクロ経済学I', '田中経済', '東京大学', '経済学部', '経済学科',
    2024, 'spring', 'midterm', 'https://example.com/files/macro-midterm-2024.pdf', 'macro-midterm-2024.pdf', '550e8400-e29b-41d4-a716-446655440001',
    15, 4, 8, ARRAY['経済学', 'マクロ', '中間試験'], NOW(), NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655440102', 'ミクロ経済学 期末試験', 'ミクロ経済学', '佐藤統計', '東京大学', '経済学部', '経済学科',
    2023, 'fall', 'final', 'https://example.com/files/micro-final-2023.pdf', 'micro-final-2023.pdf', '550e8400-e29b-41d4-a716-446655440001',
    23, 3, 12, ARRAY['経済学', 'ミクロ', '期末試験'], NOW(), NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655440103', '商学概論 小テスト', '商学概論', '中村商学', '早稲田大学', '商学部', '商学科',
    2024, 'spring', 'quiz', 'https://example.com/files/business-quiz-2024.pdf', 'business-quiz-2024.pdf', '550e8400-e29b-41d4-a716-446655440002',
    8, 2, 5, ARRAY['商学', '小テスト'], NOW(), NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655440104', '経営学原理 レポート課題', '経営学原理', '小林マーケ', '早稲田大学', '商学部', '商学科',
    2023, 'fall', 'assignment', 'https://example.com/files/management-assignment-2023.pdf', 'management-assignment-2023.pdf', '550e8400-e29b-41d4-a716-446655440002',
    12, 3, 7, ARRAY['経営学', 'レポート'], NOW(), NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655440105', '線形代数学 中間試験', '線形代数学', '鈴木工学', '慶應義塾大学', '理工学部', '情報工学科',
    2024, 'spring', 'midterm', 'https://example.com/files/linear-algebra-midterm-2024.pdf', 'linear-algebra-midterm-2024.pdf', '550e8400-e29b-41d4-a716-446655440003',
    18, 4, 10, ARRAY['数学', '線形代数', '中間試験'], NOW(), NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655440106', 'データ構造とアルゴリズム 期末試験', 'データ構造とアルゴリズム', '高橋情報', '慶應義塾大学', '理工学部', '情報工学科',
    2023, 'fall', 'final', 'https://example.com/files/algorithm-final-2023.pdf', 'algorithm-final-2023.pdf', '550e8400-e29b-41d4-a716-446655440003',
    31, 5, 15, ARRAY['プログラミング', 'アルゴリズム', '期末試験'], NOW(), NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655440107', '計量経済学 中間試験', '計量経済学', '佐藤統計', '東京大学', '経済学部', '経済学科',
    2024, 'spring', 'midterm', 'https://example.com/files/econometrics-midterm-2024.pdf', 'econometrics-midterm-2024.pdf', '550e8400-e29b-41d4-a716-446655440001',
    20, 4, 11, ARRAY['経済学', '計量経済学', '統計'], NOW(), NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655440108', 'マーケティング論 期末試験', 'マーケティング論', '小林マーケ', '早稲田大学', '商学部', '商学科',
    2023, 'fall', 'final', 'https://example.com/files/marketing-final-2023.pdf', 'marketing-final-2023.pdf', '550e8400-e29b-41d4-a716-446655440002',
    16, 3, 9, ARRAY['マーケティング', '期末試験'], NOW(), NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655440109', '解析学I 中間試験', '解析学I', '鈴木工学', '慶應義塾大学', '理工学部', '情報工学科',
    2024, 'spring', 'midterm', 'https://example.com/files/calculus-midterm-2024.pdf', 'calculus-midterm-2024.pdf', '550e8400-e29b-41d4-a716-446655440003',
    14, 4, 8, ARRAY['数学', '解析学', '中間試験'], NOW(), NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655440110', '金融論 期末試験', '金融論', '山田金融', '東京大学', '経済学部', '経済学科',
    2023, 'fall', 'final', 'https://example.com/files/finance-final-2023.pdf', 'finance-final-2023.pdf', '550e8400-e29b-41d4-a716-446655440001',
    19, 4, 10, ARRAY['金融', '期末試験'], NOW(), NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- テストスレッドデータの挿入（courseカラムを追加）
INSERT INTO threads (
  id, title, content, author_id, course, university, faculty, department, 
  created_at, updated_at
)
VALUES 
  (
    '550e8400-e29b-41d4-a716-446655440201', 'マクロ経済学Iの勉強法について', 'マクロ経済学Iの勉強で困っていることがあります。特にIS-LM分析の部分が理解できません。どのように勉強すれば良いでしょうか？',
    '550e8400-e29b-41d4-a716-446655440001', 'マクロ経済学I', '東京大学', '経済学部', '経済学科',
    NOW(), NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655440202', '線形代数の過去問について', '線形代数の中間試験の過去問を探しています。特に固有値・固有ベクトルの問題が知りたいです。',
    '550e8400-e29b-41d4-a716-446655440003', '線形代数学', '慶應義塾大学', '理工学部', '情報工学科',
    NOW(), NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655440203', '商学概論のレポート課題', '商学概論のレポート課題について相談したいです。テーマ選びで迷っています。',
    '550e8400-e29b-41d4-a716-446655440002', '商学概論', '早稲田大学', '商学部', '商学科',
    NOW(), NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- テストコメントデータの挿入
INSERT INTO comments (
  id, thread_id, content, author_id, created_at, updated_at
)
VALUES 
  (
    '550e8400-e29b-41d4-a716-446655440301', '550e8400-e29b-41d4-a716-446655440201', 'IS-LM分析は図を描きながら理解するのがおすすめです。教科書の図を何度も描いてみてください。',
    '550e8400-e29b-41d4-a716-446655440002', NOW(), NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655440302', '550e8400-e29b-41d4-a716-446655440201', 'YouTubeでIS-LM分析の解説動画を見るのも良いと思います。視覚的に理解できます。',
    '550e8400-e29b-41d4-a716-446655440003', NOW(), NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655440303', '550e8400-e29b-41d4-a716-446655440202', '固有値・固有ベクトルの問題は計算が複雑なので、手計算をたくさん練習するのが大切です。',
    '550e8400-e29b-41d4-a716-446655440001', NOW(), NOW()
  ),
  (
    '550e8400-e29b-41d4-a716-446655440304', '550e8400-e29b-41d4-a716-446655440203', '商学概論のレポートは、身近な企業の事例を取り上げると書きやすいですよ。',
    '550e8400-e29b-41d4-a716-446655440001', NOW(), NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- 確認用クエリ
SELECT 'Users count:' as info, COUNT(*) as count FROM users
UNION ALL
SELECT 'Past exams count:', COUNT(*) FROM past_exams
UNION ALL
SELECT 'Threads count:', COUNT(*) FROM threads
UNION ALL
SELECT 'Comments count:', COUNT(*) FROM comments;
