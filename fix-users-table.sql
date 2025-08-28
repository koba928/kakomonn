-- Supabase usersテーブル修正スクリプト
-- 不足しているカラムを追加

-- 既存のusersテーブルにdepartmentカラムが存在するかチェック
DO $$
BEGIN
    -- departmentカラムが存在しない場合は追加
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'department'
    ) THEN
        ALTER TABLE users ADD COLUMN department VARCHAR(100);
        RAISE NOTICE 'Added department column to users table';
    END IF;

    -- pen_nameカラムが存在しない場合は追加
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'pen_name'
    ) THEN
        ALTER TABLE users ADD COLUMN pen_name VARCHAR(100);
        RAISE NOTICE 'Added pen_name column to users table';
    END IF;

    -- yearカラムが存在しない場合は追加
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'year'
    ) THEN
        ALTER TABLE users ADD COLUMN year INTEGER;
        RAISE NOTICE 'Added year column to users table';
    END IF;

    -- universityカラムが存在しない場合は追加
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'university'
    ) THEN
        ALTER TABLE users ADD COLUMN university VARCHAR(100);
        RAISE NOTICE 'Added university column to users table';
    END IF;

    -- facultyカラムが存在しない場合は追加
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'faculty'
    ) THEN
        ALTER TABLE users ADD COLUMN faculty VARCHAR(100);
        RAISE NOTICE 'Added faculty column to users table';
    END IF;

    -- nameカラムが存在しない場合は追加
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'name'
    ) THEN
        ALTER TABLE users ADD COLUMN name VARCHAR(100);
        RAISE NOTICE 'Added name column to users table';
    END IF;

    -- created_atカラムが存在しない場合は追加
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'created_at'
    ) THEN
        ALTER TABLE users ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Added created_at column to users table';
    END IF;

    -- updated_atカラムが存在しない場合は追加
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'updated_at'
    ) THEN
        ALTER TABLE users ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
        RAISE NOTICE 'Added updated_at column to users table';
    END IF;
END $$;

-- デフォルト値を設定（既存レコードがある場合）
UPDATE users 
SET 
    department = COALESCE(department, '未設定'),
    pen_name = COALESCE(pen_name, name, 'ユーザー'),
    year = COALESCE(year, 1),
    university = COALESCE(university, '未設定'),
    faculty = COALESCE(faculty, '未設定'),
    name = COALESCE(name, 'ユーザー'),
    created_at = COALESCE(created_at, NOW()),
    updated_at = COALESCE(updated_at, NOW())
WHERE 
    department IS NULL 
    OR pen_name IS NULL 
    OR year IS NULL 
    OR university IS NULL 
    OR faculty IS NULL 
    OR name IS NULL 
    OR created_at IS NULL 
    OR updated_at IS NULL;

-- NOT NULL制約を追加（デフォルト値設定後）
DO $$
BEGIN
    -- departmentのNOT NULL制約を追加
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'department' AND is_nullable = 'YES'
    ) THEN
        ALTER TABLE users ALTER COLUMN department SET NOT NULL;
        RAISE NOTICE 'Set department column to NOT NULL';
    END IF;

    -- その他のカラムも同様にNOT NULL制約を追加
    ALTER TABLE users ALTER COLUMN pen_name SET NOT NULL;
    ALTER TABLE users ALTER COLUMN year SET NOT NULL;
    ALTER TABLE users ALTER COLUMN university SET NOT NULL;
    ALTER TABLE users ALTER COLUMN faculty SET NOT NULL;
    ALTER TABLE users ALTER COLUMN name SET NOT NULL;
    ALTER TABLE users ALTER COLUMN created_at SET NOT NULL;
    ALTER TABLE users ALTER COLUMN updated_at SET NOT NULL;
    
    RAISE NOTICE 'Set all required columns to NOT NULL';
END $$;

-- 確認用クエリ
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;