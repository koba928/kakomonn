import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/supabase'

// Create Supabase admin client with service role key
// This bypasses RLS and should only be used on the server
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Domain validation utilities
export const ALLOWED_EMAIL_DOMAINS = process.env.ALLOWED_EMAIL_DOMAINS?.split(',') || [
  's.thers.ac.jp',
  'nagoya-u.ac.jp',
  'i.nagoya-u.ac.jp',
  'icloud.com'
]

export function isValidNagoyaEmail(email: string): boolean {
  // 開発モードまたはテストモードでは全てのメールを許可
  const isDev = process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_TEST_MODE === 'true'
  console.log('🔍 isValidNagoyaEmail チェック:', {
    email,
    isDev,
    NODE_ENV: process.env.NODE_ENV,
    TEST_MODE: process.env.NEXT_PUBLIC_TEST_MODE
  })
  
  if (isDev) {
    console.log('🔧 supabase-admin: 開発/テストモードでドメイン制限をスキップ')
    return true
  }
  
  const domain = email.toLowerCase().split('@')[1]
  const isValid = ALLOWED_EMAIL_DOMAINS.some(allowed => domain === allowed.toLowerCase())
  console.log('📧 ドメインチェック結果:', { domain, isValid, ALLOWED_EMAIL_DOMAINS })
  return isValid
}

export function extractDomain(email: string): string | null {
  const parts = email.split('@')
  return parts.length === 2 ? (parts[1] || null) : null
}