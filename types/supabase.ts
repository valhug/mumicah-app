// types/supabase.ts
import { createClient } from '@supabase/supabase-js'
import { Database } from './database'

export type SupabaseClient = ReturnType<typeof createClient<Database>>

// Helper types for table operations
export type ProfileRow = Database['public']['Tables']['profiles']['Row']
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

export type ProgressRow = Database['public']['Tables']['progress']['Row']
export type ProgressInsert = Database['public']['Tables']['progress']['Insert']
export type ProgressUpdate = Database['public']['Tables']['progress']['Update']

export type LearningPathRow = Database['public']['Tables']['learning_paths']['Row']
export type LearningPathInsert = Database['public']['Tables']['learning_paths']['Insert']
export type LearningPathUpdate = Database['public']['Tables']['learning_paths']['Update']

export type SubscriptionRow = Database['public']['Tables']['subscriptions']['Row']
export type SubscriptionInsert = Database['public']['Tables']['subscriptions']['Insert']
export type SubscriptionUpdate = Database['public']['Tables']['subscriptions']['Update']

// Query result types
import { QueryData, QueryError } from '@supabase/supabase-js'

// Example usage for complex queries
export const getUserProfileWithProgressQuery = (supabase: SupabaseClient, userId: string) =>
  supabase
    .from('profiles')
    .select(`
      *,
      progress (
        id,
        lesson_id,
        status,
        score,
        completed_at,
        lessons:lesson_id (
          title,
          learning_path_id,
          learning_paths:learning_path_id (
            title,
            language
          )
        )
      ),
      subscriptions (
        status,
        plan_name,
        current_period_end
      )
    `)
    .eq('id', userId)
    .single()

export type UserProfileWithProgress = QueryData<
  ReturnType<typeof getUserProfileWithProgressQuery>
>
