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

    async getByUserId(userId: string): Promise<PastExam[]> {
      const { data, error } = await supabase
        .from('past_exams')
        .select('*')
        .eq('uploaded_by', userId)
        .order('created_at', { ascending: false })
      
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
      // 現在のユーザー情報を確認
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('認証されていません')
      }

      // 既存データと権限をチェック
      const { data: existingData, error: checkError } = await supabase
        .from('past_exams')
        .select('*')
        .eq('id', id)
        .single()
      
      if (checkError) {
        throw checkError
      }
      
      if (!existingData) {
        throw new Error('更新対象の過去問が見つかりません')
      }
      
      // 権限チェック
      if (existingData.uploaded_by !== user.id) {
        throw new Error('この過去問を編集する権限がありません')
      }
      
      // 更新実行
      const { error } = await supabase
        .from('past_exams')
        .update(updates)
        .eq('id', id)
      
      if (error) throw error
      
      // 更新後にデータを再取得
      const { data: updatedData, error: fetchError } = await supabase
        .from('past_exams')
        .select('*')
        .eq('id', id)
        .single()
      
      if (fetchError) throw fetchError
      if (!updatedData) throw new Error('更新されたデータの取得に失敗しました')
      
      return updatedData
    },

    async delete(id: string): Promise<void> {
      const { error } = await supabase
        .from('past_exams')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },

    async incrementDownloadCount(id: string): Promise<void> {
      const { error } = await supabase.rpc('increment_download_count', { exam_id: id })
      if (error) throw error
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

  // 過去問コメント機能
  pastExamComments: {
    async getByPastExamId(pastExamId: string): Promise<any[]> {
      const { data, error } = await supabase
        .from('past_exam_comments')
        .select(`
          *,
          users!past_exam_comments_author_id_fkey(name, pen_name)
        `)
        .eq('past_exam_id', pastExamId)
        .is('parent_comment_id', null) // 親コメントのみ
        .order('created_at', { ascending: true })

      if (error) throw error
      return data || []
    },

    async getReplies(parentCommentId: string): Promise<any[]> {
      const { data, error } = await supabase
        .from('past_exam_comments')
        .select(`
          *,
          users!past_exam_comments_author_id_fkey(name, pen_name)
        `)
        .eq('parent_comment_id', parentCommentId)
        .order('created_at', { ascending: true })

      if (error) throw error
      return data || []
    },

    async create(comment: {
      past_exam_id: string
      content: string
      author_id: string
      parent_comment_id?: string
    }): Promise<any> {
      const { data, error } = await supabase
        .from('past_exam_comments')
        .insert(comment)
        .select(`
          *,
          users!past_exam_comments_author_id_fkey(name, pen_name)
        `)
        .single()

      if (error) throw error

      // コメント数をインクリメント
      await supabase.rpc('increment_comment_count', { exam_id: comment.past_exam_id })

      return data
    },

    async delete(id: string, pastExamId: string): Promise<void> {
      const { error } = await supabase
        .from('past_exam_comments')
        .delete()
        .eq('id', id)

      if (error) throw error

      // コメント数をデクリメント
      await supabase.rpc('decrement_comment_count', { exam_id: pastExamId })
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
