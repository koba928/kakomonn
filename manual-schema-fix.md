# Supabase usersテーブル手動修正手順

## 問題
`department`カラムなどが不足しているため、アカウント作成時にエラーが発生しています。

## 解決方法：Supabase Dashboardで手動修正

### 1. Supabase Dashboardにアクセス
1. https://supabase.com/dashboard にアクセス
2. プロジェクト「kakomonn」を選択

### 2. usersテーブルを編集
1. 左サイドバーから「Table Editor」をクリック
2. 「users」テーブルを選択
3. 右上の「+ Add Column」ボタンをクリック

### 3. 不足しているカラムを追加

以下のカラムを順番に追加してください：

#### a) department カラム
- **Name**: `department`
- **Type**: `text`
- **Default Value**: 空欄
- **Is Nullable**: チェックを外す (NOT NULL)

#### b) pen_name カラム
- **Name**: `pen_name`
- **Type**: `text`
- **Default Value**: 空欄
- **Is Nullable**: チェックを外す (NOT NULL)

#### c) year カラム
- **Name**: `year`
- **Type**: `int4`
- **Default Value**: 空欄
- **Is Nullable**: チェックを外す (NOT NULL)

#### d) university カラム
- **Name**: `university`
- **Type**: `text`
- **Default Value**: 空欄
- **Is Nullable**: チェックを外す (NOT NULL)

#### e) faculty カラム
- **Name**: `faculty`
- **Type**: `text`
- **Default Value**: 空欄
- **Is Nullable**: チェックを外す (NOT NULL)

#### f) name カラム
- **Name**: `name`
- **Type**: `text`
- **Default Value**: 空欄
- **Is Nullable**: チェックを外す (NOT NULL)

#### g) created_at カラム（存在しない場合）
- **Name**: `created_at`
- **Type**: `timestamptz`
- **Default Value**: `now()`
- **Is Nullable**: チェックを外す (NOT NULL)

#### h) updated_at カラム（存在しない場合）
- **Name**: `updated_at`
- **Type**: `timestamptz`
- **Default Value**: `now()`
- **Is Nullable**: チェックを外す (NOT NULL)

### 4. 変更を保存
各カラム追加後、「Save」ボタンをクリックして保存してください。

### 5. 確認
修正後、新規アカウント作成が正常に動作することを確認してください。

## 代替方法：SQL Editorを使用

SQL Editorで以下を実行することも可能です：

```sql
-- カラム追加
ALTER TABLE users ADD COLUMN IF NOT EXISTS department text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS pen_name text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS year int4;
ALTER TABLE users ADD COLUMN IF NOT EXISTS university text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS faculty text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS name text;
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- 既存データのデフォルト値設定
UPDATE users SET 
  department = '未設定' WHERE department IS NULL,
  pen_name = '未設定' WHERE pen_name IS NULL,
  year = 1 WHERE year IS NULL,
  university = '未設定' WHERE university IS NULL,
  faculty = '未設定' WHERE faculty IS NULL,
  name = '未設定' WHERE name IS NULL,
  created_at = now() WHERE created_at IS NULL,
  updated_at = now() WHERE updated_at IS NULL;

-- NOT NULL制約追加
ALTER TABLE users ALTER COLUMN department SET NOT NULL;
ALTER TABLE users ALTER COLUMN pen_name SET NOT NULL;
ALTER TABLE users ALTER COLUMN year SET NOT NULL;
ALTER TABLE users ALTER COLUMN university SET NOT NULL;
ALTER TABLE users ALTER COLUMN faculty SET NOT NULL;
ALTER TABLE users ALTER COLUMN name SET NOT NULL;
ALTER TABLE users ALTER COLUMN created_at SET NOT NULL;
ALTER TABLE users ALTER COLUMN updated_at SET NOT NULL;
```