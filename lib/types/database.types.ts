export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      failures: {
        Row: {
          id: string
          user_id: string
          count: number // Included just in case, though we primarily count rows
          note: string | null
          occurred_at: string
        }
        Insert: {
          id?: string
          user_id: string
          count?: number
          note?: string | null
          occurred_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          count?: number
          note?: string | null
          occurred_at?: string
        }
      }
      user_settings: {
        Row: {
          user_id: string
          theme: 'dark' | 'light' | 'system'
          sound_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          theme?: 'dark' | 'light' | 'system'
          sound_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          theme?: 'dark' | 'light' | 'system'
          sound_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      favorite_quotes: {
        Row: {
          id: string
          user_id: string
          quote_api_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          quote_api_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          quote_api_id?: string
          created_at?: string
        }
      }
    }
  }
}
