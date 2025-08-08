import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lgafjtxtsosrsabsrygh.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnYWZqdHh0c29zcnNhYnNyeWdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2Njk1MTMsImV4cCI6MjA3MDI0NTUxM30.uBUhUlcmuPKUm1XhRk3YTl6XsVC9HyYzD1C7KNoj1Uo'

// デバッグログ
console.log('Supabase設定:', {
  supabaseUrl,
  hasAnonKey: !!supabaseAnonKey,
  envUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  envKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
})

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// データベースの型定義
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          university: string
          faculty: string
          department: string
          year: number
          pen_name: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name: string
          university: string
          faculty: string
          department: string
          year: number
          pen_name: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          university?: string
          faculty?: string
          department?: string
          year?: number
          pen_name?: string
          created_at?: string
          updated_at?: string
        }
      }
      past_exams: {
        Row: {
          id: string
          title: string
          course_name: string
          professor: string
          university: string
          faculty: string
          department: string
          year: number
          semester: string
          exam_type: string
          file_url: string
          file_name: string
          uploaded_by: string
          download_count: number
          difficulty: number
          helpful_count: number
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          course_name: string
          professor: string
          university: string
          faculty: string
          department: string
          year: number
          semester: string
          exam_type: string
          file_url: string
          file_name: string
          uploaded_by: string
          download_count?: number
          difficulty?: number
          helpful_count?: number
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          course_name?: string
          professor?: string
          university?: string
          faculty?: string
          department?: string
          year?: number
          semester?: string
          exam_type?: string
          file_url?: string
          file_name?: string
          uploaded_by?: string
          download_count?: number
          difficulty?: number
          helpful_count?: number
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      threads: {
        Row: {
          id: string
          title: string
          content: string
          author_id: string
          course: string
          university: string
          faculty: string
          department: string
          exam_year: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          author_id: string
          course: string
          university: string
          faculty: string
          department: string
          exam_year?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          author_id?: string
          course?: string
          university?: string
          faculty?: string
          department?: string
          exam_year?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          thread_id: string
          content: string
          author_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          thread_id: string
          content: string
          author_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          thread_id?: string
          content?: string
          author_id?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
