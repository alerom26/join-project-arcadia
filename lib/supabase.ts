import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      access_requests: {
        Row: {
          id: string
          name: string
          location_lat: number
          location_lng: number
          status: "pending" | "approved" | "rejected"
          created_at: string
          approved_at: string | null
          device_id: string
          photo_url: string | null
          photo_expires_at: string | null
        }
        Insert: {
          id?: string
          name: string
          location_lat: number
          location_lng: number
          status?: "pending" | "approved" | "rejected"
          created_at?: string
          approved_at?: string | null
          device_id: string
          photo_url?: string | null
          photo_expires_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          location_lat?: number
          location_lng?: number
          status?: "pending" | "approved" | "rejected"
          created_at?: string
          approved_at?: string | null
          device_id?: string
          photo_url?: string | null
          photo_expires_at?: string | null
        }
      }
      admin_users: {
        Row: {
          id: string
          email: string
          created_at: string
          face_encoding: string | null
          face_photo_url: string | null
        }
        Insert: {
          id?: string
          email: string
          created_at?: string
          face_encoding?: string | null
          face_photo_url?: string | null
        }
        Update: {
          id?: string
          email?: string
          created_at?: string
          face_encoding?: string | null
          face_photo_url?: string | null
        }
      }
      applications: {
        // New table definition
        Row: {
          id: string // Corresponds to user_id
          user_id: string // Foreign key to auth.users.id
          name: string
          email: string
          stage: "application" | "test" | "interview" | "completed"
          test_unlocked: boolean
          assigned_interviewer: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          email: string
          stage?: "application" | "test" | "interview" | "completed"
          test_unlocked?: boolean
          assigned_interviewer?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          email?: string
          stage?: "application" | "test" | "interview" | "completed"
          test_unlocked?: boolean
          assigned_interviewer?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
