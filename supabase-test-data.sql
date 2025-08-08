-- 過去問hub テストデータ挿入スクリプト
-- Supabase SQL Editorで実行してください

-- テストユーザーの挿入
INSERT INTO users (id, email, name, university, faculty, department, year, pen_name, created_at, updated_at)
VALUES 
  ('test-user-1', 'test1@example.com', 'テストユーザー1', '東京大学', '経済学部', '経済学科', 2, '経済マスター', NOW(), NOW()),
  ('test-user-2', 'test2@example.com', 'テストユーザー2', '早稲田大学', '商学部', '商学科', 3, '商学エキスパート', NOW(), NOW()),
  ('test-user-3', 'test3@example.com', 'テストユーザー3', '慶應義塾大学', '理工学部', '情報工学科', 2, 'プログラマー', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- テスト過去問データの挿入
INSERT INTO past_exams (
  id, title, course_name, professor, university, faculty, department, 
  year, semester, exam_type, file_url, file_name, uploaded_by, 
  download_count, difficulty, helpful_count, tags, created_at, updated_at
)
VALUES 
  (
    'exam-1', 'マクロ経済学I 中間試験', 'マクロ経済学I', '田中経済', '東京大学', '経済学部', '経済学科',
    2024, 'spring', 'midterm', 'https://example.com/files/macro-midterm-2024.pdf', 'macro-midterm-2024.pdf', 'test-user-1',
    15, 4, 8, ARRAY['経済学', 'マクロ', '中間試験'], NOW(), NOW()
  ),
  (
    'exam-2', 'ミクロ経済学 期末試験', 'ミクロ経済学', '佐藤統計', '東京大学', '経済学部', '経済学科',
    2023, 'fall', 'final', 'https://example.com/files/micro-final-2023.pdf', 'micro-final-2023.pdf', 'test-user-1',
    23, 3, 12, ARRAY['経済学', 'ミクロ', '期末試験'], NOW(), NOW()
  ),
  (
    'exam-3', '商学概論 小テスト', '商学概論', '中村商学', '早稲田大学', '商学部', '商学科',
    2024, 'spring', 'quiz', 'https://example.com/files/business-quiz-2024.pdf', 'business-quiz-2024.pdf', 'test-user-2',
    8, 2, 5, ARRAY['商学', '小テスト'], NOW(), NOW()
  ),
  (
    'exam-4', '経営学原理 レポート課題', '経営学原理', '小林マーケ', '早稲田大学', '商学部', '商学科',
    2023, 'fall', 'assignment', 'https://example.com/files/management-assignment-2023.pdf', 'management-assignment-2023.pdf', 'test-user-2',
    12, 3, 7, ARRAY['経営学', 'レポート'], NOW(), NOW()
  ),
  (
    'exam-5', '線形代数学 中間試験', '線形代数学', '鈴木工学', '慶應義塾大学', '理工学部', '情報工学科',
    2024, 'spring', 'midterm', 'https://example.com/files/linear-algebra-midterm-2024.pdf', 'linear-algebra-midterm-2024.pdf', 'test-user-3',
    18, 4, 10, ARRAY['数学', '線形代数', '中間試験'], NOW(), NOW()
  ),
  (
    'exam-6', 'データ構造とアルゴリズム 期末試験', 'データ構造とアルゴリズム', '高橋情報', '慶應義塾大学', '理工学部', '情報工学科',
    2023, 'fall', 'final', 'https://example.com/files/algorithm-final-2023.pdf', 'algorithm-final-2023.pdf', 'test-user-3',
    31, 5, 15, ARRAY['プログラミング', 'アルゴリズム', '期末試験'], NOW(), NOW()
  ),
  (
    'exam-7', '計量経済学 中間試験', '計量経済学', '佐藤統計', '東京大学', '経済学部', '経済学科',
    2024, 'spring', 'midterm', 'https://example.com/files/econometrics-midterm-2024.pdf', 'econometrics-midterm-2024.pdf', 'test-user-1',
    20, 4, 11, ARRAY['経済学', '計量経済学', '統計'], NOW(), NOW()
  ),
  (
    'exam-8', 'マーケティング論 期末試験', 'マーケティング論', '小林マーケ', '早稲田大学', '商学部', '商学科',
    2023, 'fall', 'final', 'https://example.com/files/marketing-final-2023.pdf', 'marketing-final-2023.pdf', 'test-user-2',
    16, 3, 9, ARRAY['マーケティング', '期末試験'], NOW(), NOW()
  ),
  (
    'exam-9', '解析学I 中間試験', '解析学I', '鈴木工学', '慶應義塾大学', '理工学部', '情報工学科',
    2024, 'spring', 'midterm', 'https://example.com/files/calculus-midterm-2024.pdf', 'calculus-midterm-2024.pdf', 'test-user-3',
    14, 4, 8, ARRAY['数学', '解析学', '中間試験'], NOW(), NOW()
  ),
  (
    'exam-10', '金融論 期末試験', '金融論', '山田金融', '東京大学', '経済学部', '経済学科',
    2023, 'fall', 'final', 'https://example.com/files/finance-final-2023.pdf', 'finance-final-2023.pdf', 'test-user-1',
    19, 4, 10, ARRAY['金融', '期末試験'], NOW(), NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- テストスレッドデータの挿入
INSERT INTO threads (
  id, title, content, author_id, university, faculty, department, 
  course_name, exam_year, tags, created_at, updated_at
)
VALUES 
  (
    'thread-1', 'マクロ経済学Iの勉強法について', 'マクロ経済学Iの勉強で困っていることがあります。特にIS-LM分析の部分が理解できません。どのように勉強すれば良いでしょうか？',
    'test-user-1', '東京大学', '経済学部', '経済学科', 'マクロ経済学I', 2024,
    ARRAY['経済学', '勉強法', 'IS-LM分析'], NOW(), NOW()
  ),
  (
    'thread-2', '線形代数の過去問について', '線形代数の中間試験の過去問を探しています。特に固有値・固有ベクトルの問題が知りたいです。',
    'test-user-3', '慶應義塾大学', '理工学部', '情報工学科', '線形代数学', 2024,
    ARRAY['数学', '線形代数', '固有値'], NOW(), NOW()
  ),
  (
    'thread-3', '商学概論のレポート課題', '商学概論のレポート課題について相談したいです。テーマ選びで迷っています。',
    'test-user-2', '早稲田大学', '商学部', '商学科', '商学概論', 2024,
    ARRAY['商学', 'レポート', 'テーマ選び'], NOW(), NOW()
  )
ON CONFLICT (id) DO NOTHING;

-- テストコメントデータの挿入
INSERT INTO comments (
  id, thread_id, content, author_id, created_at, updated_at
)
VALUES 
  (
    'comment-1', 'thread-1', 'IS-LM分析は図を描きながら理解するのがおすすめです。教科書の図を何度も描いてみてください。',
    'test-user-2', NOW(), NOW()
  ),
  (
    'comment-2', 'thread-1', 'YouTubeでIS-LM分析の解説動画を見るのも良いと思います。視覚的に理解できます。',
    'test-user-3', NOW(), NOW()
  ),
  (
    'comment-3', 'thread-2', '固有値・固有ベクトルの問題は計算が複雑なので、手計算をたくさん練習するのが大切です。',
    'test-user-1', NOW(), NOW()
  ),
  (
    'comment-4', 'thread-3', '商学概論のレポートは、身近な企業の事例を取り上げると書きやすいですよ。',
    'test-user-1', NOW(), NOW()
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
