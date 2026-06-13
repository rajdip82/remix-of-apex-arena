export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          free_fire_uid: string | null
          bgmi_uid: string | null
          favorite_game: 'Free Fire MAX' | 'BGMI' | null
          state: string | null
          country: string | null
          role: 'user' | 'admin' | 'moderator'
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          free_fire_uid?: string | null
          bgmi_uid?: string | null
          favorite_game?: 'Free Fire MAX' | 'BGMI' | null
          state?: string | null
          country?: string | null
          role?: 'user' | 'admin' | 'moderator'
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          free_fire_uid?: string | null
          bgmi_uid?: string | null
          favorite_game?: 'Free Fire MAX' | 'BGMI' | null
          state?: string | null
          country?: string | null
          role?: 'user' | 'admin' | 'moderator'
          verified?: boolean
          updated_at?: string
        }
      }
      teams: {
        Row: {
          id: string
          name: string
          logo_url: string | null
          captain_id: string | null
          game: 'Free Fire MAX' | 'BGMI'
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          logo_url?: string | null
          captain_id?: string | null
          game: 'Free Fire MAX' | 'BGMI'
          created_at?: string
        }
        Update: {
          name?: string
          logo_url?: string | null
          captain_id?: string | null
          game?: 'Free Fire MAX' | 'BGMI'
        }
      }
      team_members: {
        Row: {
          id: string
          team_id: string
          user_id: string
          role: 'captain' | 'member'
          joined_at: string
        }
        Insert: {
          id?: string
          team_id: string
          user_id: string
          role?: 'captain' | 'member'
          joined_at?: string
        }
        Update: {
          role?: 'captain' | 'member'
        }
      }
      tournaments: {
        Row: {
          id: string
          title: string
          game: 'Free Fire MAX' | 'BGMI'
          mode: 'Solo' | 'Duo' | 'Squad'
          map: string
          prize_pool: number
          entry_fee: number
          total_slots: number
          filled_slots: number
          start_time: string
          status: 'Upcoming' | 'Live' | 'Completed' | 'Cancelled'
          banner_url: string | null
          banner_gradient: string | null
          rules: string | null
          room_id: string | null
          room_password: string | null
          created_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          game: 'Free Fire MAX' | 'BGMI'
          mode: 'Solo' | 'Duo' | 'Squad'
          map: string
          prize_pool?: number
          entry_fee?: number
          total_slots?: number
          filled_slots?: number
          start_time: string
          status?: 'Upcoming' | 'Live' | 'Completed' | 'Cancelled'
          banner_url?: string | null
          banner_gradient?: string | null
          rules?: string | null
          room_id?: string | null
          room_password?: string | null
          created_by?: string | null
          created_at?: string
        }
        Update: {
          title?: string
          game?: 'Free Fire MAX' | 'BGMI'
          mode?: 'Solo' | 'Duo' | 'Squad'
          map?: string
          prize_pool?: number
          entry_fee?: number
          total_slots?: number
          filled_slots?: number
          start_time?: string
          status?: 'Upcoming' | 'Live' | 'Completed' | 'Cancelled'
          banner_url?: string | null
          banner_gradient?: string | null
          rules?: string | null
          room_id?: string | null
          room_password?: string | null
        }
      }
      registrations: {
        Row: {
          id: string
          tournament_id: string
          team_id: string | null
          user_id: string
          payment_status: 'pending' | 'approved' | 'rejected'
          registration_status: 'pending' | 'approved' | 'rejected' | 'cancelled'
          created_at: string
        }
        Insert: {
          id?: string
          tournament_id: string
          team_id?: string | null
          user_id: string
          payment_status?: 'pending' | 'approved' | 'rejected'
          registration_status?: 'pending' | 'approved' | 'rejected' | 'cancelled'
          created_at?: string
        }
        Update: {
          team_id?: string | null
          payment_status?: 'pending' | 'approved' | 'rejected'
          registration_status?: 'pending' | 'approved' | 'rejected' | 'cancelled'
        }
      }
      payment_submissions: {
        Row: {
          id: string
          tournament_id: string
          registration_id: string | null
          user_id: string
          utr_number: string
          screenshot_url: string | null
          payment_status: 'pending' | 'approved' | 'rejected'
          verified_by: string | null
          amount: number
          created_at: string
        }
        Insert: {
          id?: string
          tournament_id: string
          registration_id?: string | null
          user_id: string
          utr_number: string
          screenshot_url?: string | null
          payment_status?: 'pending' | 'approved' | 'rejected'
          verified_by?: string | null
          amount?: number
          created_at?: string
        }
        Update: {
          screenshot_url?: string | null
          payment_status?: 'pending' | 'approved' | 'rejected'
          verified_by?: string | null
        }
      }
      redeem_codes: {
        Row: {
          id: string
          code: string
          discount_percentage: number
          free_entry: boolean
          expiry_date: string | null
          max_usage: number
          current_usage: number
          status: boolean
          created_at: string
        }
        Insert: {
          id?: string
          code: string
          discount_percentage?: number
          free_entry?: boolean
          expiry_date?: string | null
          max_usage?: number
          current_usage?: number
          status?: boolean
          created_at?: string
        }
        Update: {
          code?: string
          discount_percentage?: number
          free_entry?: boolean
          expiry_date?: string | null
          max_usage?: number
          current_usage?: number
          status?: boolean
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'tournament' | 'registration' | 'room' | 'result' | 'system' | 'payment'
          read: boolean
          link: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type?: 'tournament' | 'registration' | 'room' | 'result' | 'system' | 'payment'
          read?: boolean
          link?: string | null
          created_at?: string
        }
        Update: {
          read?: boolean
        }
      }
      admin_logs: {
        Row: {
          id: string
          admin_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          details: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          admin_id?: string | null
          action: string
          entity_type: string
          entity_id?: string | null
          details?: Json | null
          created_at?: string
        }
        Update: never
      }
    }
    Views: { [_ in never]: never }
    Functions: { [_ in never]: never }
    Enums: {
      game_type: 'Free Fire MAX' | 'BGMI'
      game_mode: 'Solo' | 'Duo' | 'Squad'
      tournament_status: 'Upcoming' | 'Live' | 'Completed' | 'Cancelled'
      user_role: 'user' | 'admin' | 'moderator'
      payment_status: 'pending' | 'approved' | 'rejected'
      registration_status: 'pending' | 'approved' | 'rejected' | 'cancelled'
      notification_type: 'tournament' | 'registration' | 'room' | 'result' | 'system' | 'payment'
      team_member_role: 'captain' | 'member'
    }
    CompositeTypes: { [_ in never]: never }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">
type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never
