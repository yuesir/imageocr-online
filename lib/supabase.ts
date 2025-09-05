import { createBrowserClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import type { SupabaseClient } from '@supabase/supabase-js'

// Get environment variables with fallback values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lbbjfeoggdsmbjeexpso.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiYmpmZW9nZ2RzbWJqZWV4cHNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYxOTg4MzIsImV4cCI6MjA3MTc3NDgzMn0.DE-ruEPZMT_6VL0zYsLwkvbV-GIoLJXy8AHtP2f6DYg'

// Validate URL format
function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Check if we have valid Supabase configuration
const hasValidConfig = isValidUrl(supabaseUrl) && supabaseAnonKey && supabaseAnonKey !== 'your_supabase_anon_key'

// Singleton pattern for browser client to prevent multiple GoTrueClient instances
let supabaseInstance: SupabaseClient | null = null

function getSupabaseClient() {
  if (!hasValidConfig) {
    console.warn('Supabase configuration is invalid. Please check your environment variables.')
    // Return a mock client that won't cause errors
    return {
      auth: {
        getSession: () => Promise.resolve({ data: { session: null }, error: null }),
        getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: null } }),
        signUp: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        signOut: () => Promise.resolve({ error: null }),
        resetPasswordForEmail: () => Promise.resolve({ error: new Error('Supabase not configured') }),
        updateUser: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
      },
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        update: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        delete: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
      }),
      storage: {
        from: () => ({
          upload: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
          getPublicUrl: () => ({ data: { publicUrl: '' } }),
          remove: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
        })
      }
    } as unknown as SupabaseClient
  }

  if (typeof window === 'undefined') {
    // Server-side: create a new client each time
    return createBrowserClient(supabaseUrl, supabaseAnonKey)
  }
  
  // Client-side: use singleton pattern
  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient(supabaseUrl, supabaseAnonKey)
  }
  
  return supabaseInstance
}

export const supabase = getSupabaseClient()

// Server-side client with service role key (only used on server)
let supabaseAdminInstance: SupabaseClient | null = null

function getSupabaseAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiYmpmZW9nZ2RzbWJqZWV4cHNvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjE5ODgzMiwiZXhwIjoyMDcxNzc0ODMyfQ.yQD3lXAV0VYIq6XAanxjzceBIpy28Kfxf6qjri_5v8Q'
  
  if (!hasValidConfig || serviceRoleKey === 'your_supabase_service_role_key') {
    console.warn('Supabase admin configuration is invalid. Please check your environment variables.')
    // Return a mock admin client
    return {
      auth: {
        getUser: () => Promise.resolve({ data: { user: null }, error: new Error('Supabase not configured') })
      },
      from: () => ({
        select: () => Promise.resolve({ data: [], error: null }),
        insert: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        update: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
        delete: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
      }),
      storage: {
        from: () => ({
          upload: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') }),
          getPublicUrl: () => ({ data: { publicUrl: '' } }),
          remove: () => Promise.resolve({ data: null, error: new Error('Supabase not configured') })
        })
      }
    } as unknown as SupabaseClient
  }

  if (!supabaseAdminInstance) {
    supabaseAdminInstance = createClient(
      supabaseUrl,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )
  }
  
  return supabaseAdminInstance
}

export const supabaseAdmin = getSupabaseAdminClient()

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      user_preferences: {
        Row: {
          id: string
          user_id: string
          theme: 'light' | 'dark' | 'system'
          language: string
          ocr_language: string
          auto_detect_language: boolean
          save_history: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          theme?: 'light' | 'dark' | 'system'
          language?: string
          ocr_language?: string
          auto_detect_language?: boolean
          save_history?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          theme?: 'light' | 'dark' | 'system'
          language?: string
          ocr_language?: string
          auto_detect_language?: boolean
          save_history?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      ocr_results: {
        Row: {
          id: string
          user_id: string | null
          file_id: string
          extracted_text: string
          confidence_score: number | null
          language_detected: string | null
          processing_time: number | null
          status: 'processing' | 'completed' | 'failed'
          error_message: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          file_id: string
          extracted_text: string
          confidence_score?: number | null
          language_detected?: string | null
          processing_time?: number | null
          status?: 'processing' | 'completed' | 'failed'
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          file_id?: string
          extracted_text?: string
          confidence_score?: number | null
          language_detected?: string | null
          processing_time?: number | null
          status?: 'processing' | 'completed' | 'failed'
          error_message?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      files: {
        Row: {
          id: string
          user_id: string | null
          original_name: string
          file_path: string
          file_size: number
          mime_type: string
          upload_status: 'uploading' | 'completed' | 'failed'
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          original_name: string
          file_path: string
          file_size: number
          mime_type: string
          upload_status?: 'uploading' | 'completed' | 'failed'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          original_name?: string
          file_path?: string
          file_size?: number
          mime_type?: string
          upload_status?: 'uploading' | 'completed' | 'failed'
          created_at?: string
        }
      }
      result_exports: {
        Row: {
          id: string
          user_id: string
          ocr_result_id: string
          export_format: 'txt' | 'pdf' | 'docx' | 'json'
          file_path: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          ocr_result_id: string
          export_format: 'txt' | 'pdf' | 'docx' | 'json'
          file_path: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          ocr_result_id?: string
          export_format?: 'txt' | 'pdf' | 'docx' | 'json'
          file_path?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}