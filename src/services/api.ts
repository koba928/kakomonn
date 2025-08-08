import { supabase } from '@/lib/supabase'
import type { Database } from '@/lib/supabase'

type User = Database['public']['Tables']['users']['Row']
type PastExam = Database['public']['Tables']['past_exams']['Row']
type Thread = Database['public']['Tables']['threads']['Row']
type Comment = Database['public']['Tables']['comments']['Row']

export const api = {
  // ユーザー関連
  users: {
    async getById(id: string): Promise<User | null> {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) {
        if (error.code === 'PGRST116') { // No rows found
          return null
        }
        throw error
      }
      return data
    },

    async create(user: {
      id: string
      email: string
      name: string
      university: string
      faculty: string
      department: string
      year: number
      pen_name: string
    }): Promise<User> {
      const { data, error } = await supabase
        .from('users')
        .insert(user)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async update(id: string, updates: Partial<User>): Promise<User> {
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async upsert(user: {
      id: string
      email: string
      name: string
      university: string
      faculty: string
      department: string
      year: number
      pen_name: string
    }): Promise<User> {
      const { data, error } = await supabase
        .from('users')
        .upsert(user)
        .select()
        .single()
      
      if (error) throw error
      return data
    }
  },

  // 過去問関連
  pastExams: {
    async getAll(filters?: {
      university?: string
      faculty?: string
      department?: string
      course?: string
      professor?: string
      year?: number
    }): Promise<PastExam[]> {
      let query = supabase
        .from('past_exams')
        .select('*')
        .order('created_at', { ascending: false })

      if (filters?.university) {
        query = query.eq('university', filters.university)
      }
      if (filters?.faculty) {
        query = query.eq('faculty', filters.faculty)
      }
      if (filters?.department) {
        query = query.eq('department', filters.department)
      }
      if (filters?.course) {
        query = query.ilike('course_name', `%${filters.course}%`)
      }
      if (filters?.professor) {
        query = query.ilike('professor', `%${filters.professor}%`)
      }
      if (filters?.year) {
        query = query.eq('year', filters.year)
      }

      const { data, error } = await query
      if (error) throw error
      return data
    },

    async getById(id: string): Promise<PastExam | null> {
      const { data, error } = await supabase
        .from('past_exams')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    },

    async create(exam: Omit<PastExam, 'id' | 'created_at' | 'updated_at'>): Promise<PastExam> {
      const { data, error } = await supabase
        .from('past_exams')
        .insert(exam)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async update(id: string, updates: Partial<PastExam>): Promise<PastExam> {
      const { data, error } = await supabase
        .from('past_exams')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from('past_exams')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },

    async incrementDownloadCount(id: string): Promise<void> {
      // 現在の値を取得してから更新
      const { data: current } = await supabase
        .from('past_exams')
        .select('download_count')
        .eq('id', id)
        .single()
      
      if (current) {
        const { error } = await supabase
          .from('past_exams')
          .update({ download_count: (current.download_count || 0) + 1 })
          .eq('id', id)
        
        if (error) throw error
      }
    }
  },

  // スレッド関連
  threads: {
    async getAll(filters?: {
      university?: string
      faculty?: string
      department?: string
      course?: string
    }): Promise<Thread[]> {
      let query = supabase
        .from('threads')
        .select(`
          *,
          users!threads_author_id_fkey(name, pen_name)
        `)
        .order('created_at', { ascending: false })

      if (filters?.university) {
        query = query.eq('university', filters.university)
      }
      if (filters?.faculty) {
        query = query.eq('faculty', filters.faculty)
      }
      if (filters?.department) {
        query = query.eq('department', filters.department)
      }
      if (filters?.course) {
        query = query.ilike('course', `%${filters.course}%`)
      }

      const { data, error } = await query
      if (error) throw error
      return data
    },

    async getById(id: string): Promise<Thread | null> {
      const { data, error } = await supabase
        .from('threads')
        .select(`
          *,
          users!threads_author_id_fkey(name, pen_name)
        `)
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data
    },

    async create(thread: Omit<Thread, 'id' | 'created_at' | 'updated_at'>): Promise<Thread> {
      const { data, error } = await supabase
        .from('threads')
        .insert(thread)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async update(id: string, updates: Partial<Thread>): Promise<Thread> {
      const { data, error } = await supabase
        .from('threads')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from('threads')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    }
  },

  // コメント関連
  comments: {
    async getByThreadId(threadId: string): Promise<Comment[]> {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          users!comments_author_id_fkey(name, pen_name)
        `)
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true })
      
      if (error) throw error
      return data
    },

    async create(comment: Omit<Comment, 'id' | 'created_at' | 'updated_at'>): Promise<Comment> {
      const { data, error } = await supabase
        .from('comments')
        .insert(comment)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    }
  },

  // ファイルアップロード
  storage: {
    async uploadFile(file: File, path: string): Promise<string> {
      const { error } = await supabase.storage
        .from('past-exams')
        .upload(path, file)
      
      if (error) throw error
      
      const { data: { publicUrl } } = supabase.storage
        .from('past-exams')
        .getPublicUrl(path)
      
      return publicUrl
    },

    async deleteFile(path: string): Promise<void> {
      const { error } = await supabase.storage
        .from('past-exams')
        .remove([path])
      
      if (error) throw error
    }
  }
}
