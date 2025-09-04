import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing required Supabase environment variables')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// データベースの型定義
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          university: string
          faculty: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          university?: string
          faculty?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          university?: string
          faculty?: string | null
          created_at?: string
          updated_at?: string
        }
      }
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
