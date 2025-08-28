-- Minimal schema for kakomonn - コピー&ペーストして実行してください

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
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
CREATE TABLE past_exams (
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
  uploaded_by UUID NOT NULL REFERENCES users(id),
  download_count INTEGER DEFAULT 0,
  difficulty INTEGER DEFAULT 3,
  helpful_count INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE past_exams ENABLE ROW LEVEL SECURITY;

-- Basic policies
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);
CREATE POLICY "Anyone can view past exams" ON past_exams FOR SELECT USING (true);
CREATE POLICY "Authenticated users can create past exams" ON past_exams FOR INSERT WITH CHECK (auth.uid() = uploaded_by);