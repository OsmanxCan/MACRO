export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      about: {
        Row: {
          content: string
          id: number
          title: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          content: string
          id?: number
          title: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          content?: string
          id?: number
          title?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "about_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      announcements: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          id: string
          image_file: string | null
          image_url: string | null
          link: string | null
          title: string
          updated_at: string | null
          video_file: string | null
          video_url: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          image_file?: string | null
          image_url?: string | null
          link?: string | null
          title: string
          updated_at?: string | null
          video_file?: string | null
          video_url?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          id?: string
          image_file?: string | null
          image_url?: string | null
          link?: string | null
          title?: string
          updated_at?: string | null
          video_file?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      application_history: {
        Row: {
          action: string
          application_id: string | null
          created_at: string | null
          id: string
          new_status: string | null
          notes: string | null
          old_status: string | null
          performed_by: string | null
        }
        Insert: {
          action: string
          application_id?: string | null
          created_at?: string | null
          id?: string
          new_status?: string | null
          notes?: string | null
          old_status?: string | null
          performed_by?: string | null
        }
        Update: {
          action?: string
          application_id?: string | null
          created_at?: string | null
          id?: string
          new_status?: string | null
          notes?: string | null
          old_status?: string | null
          performed_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "application_history_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "approved_applications_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_history_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "membership_applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_history_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "pending_applications_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "application_history_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      email_logs: {
        Row: {
          email_body: string | null
          email_type: string
          error_message: string | null
          id: string
          recipient_email: string
          reference_id: string | null
          reference_type: string | null
          sent_at: string | null
          status: string | null
          subject: string
          user_id: string | null
        }
        Insert: {
          email_body?: string | null
          email_type: string
          error_message?: string | null
          id?: string
          recipient_email: string
          reference_id?: string | null
          reference_type?: string | null
          sent_at?: string | null
          status?: string | null
          subject: string
          user_id?: string | null
        }
        Update: {
          email_body?: string | null
          email_type?: string
          error_message?: string | null
          id?: string
          recipient_email?: string
          reference_id?: string | null
          reference_type?: string | null
          sent_at?: string | null
          status?: string | null
          subject?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "email_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_by: string | null
          date: string | null
          description: string | null
          id: string
          image_file: string | null
          image_url: string | null
          link: string | null
          title: string
          video_file: string | null
          video_url: string | null
        }
        Insert: {
          created_by?: string | null
          date?: string | null
          description?: string | null
          id?: string
          image_file?: string | null
          image_url?: string | null
          link?: string | null
          title: string
          video_file?: string | null
          video_url?: string | null
        }
        Update: {
          created_by?: string | null
          date?: string | null
          description?: string | null
          id?: string
          image_file?: string | null
          image_url?: string | null
          link?: string | null
          title?: string
          video_file?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      membership_applications: {
        Row: {
          admin_notes: string | null
          availability: string | null
          communication_skills: number | null
          created_at: string | null
          department: string | null
          email: string
          experience: string | null
          full_name: string
          grade: string | null
          id: string
          interests: string | null
          phone: string
          portfolio_url: string | null
          project_preference: string | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          self_introduction: string | null
          skills: string | null
          social_media: Json | null
          status: string | null
          student_id: string | null
          student_number: string | null
          submitted_at: string | null
          teamwork_skills: number | null
          updated_at: string | null
          user_id: string | null
          why_join: string
          year_of_study: number | null
        }
        Insert: {
          admin_notes?: string | null
          availability?: string | null
          communication_skills?: number | null
          created_at?: string | null
          department?: string | null
          email: string
          experience?: string | null
          full_name: string
          grade?: string | null
          id?: string
          interests?: string | null
          phone: string
          portfolio_url?: string | null
          project_preference?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          self_introduction?: string | null
          skills?: string | null
          social_media?: Json | null
          status?: string | null
          student_id?: string | null
          student_number?: string | null
          submitted_at?: string | null
          teamwork_skills?: number | null
          updated_at?: string | null
          user_id?: string | null
          why_join: string
          year_of_study?: number | null
        }
        Update: {
          admin_notes?: string | null
          availability?: string | null
          communication_skills?: number | null
          created_at?: string | null
          department?: string | null
          email?: string
          experience?: string | null
          full_name?: string
          grade?: string | null
          id?: string
          interests?: string | null
          phone?: string
          portfolio_url?: string | null
          project_preference?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          self_introduction?: string | null
          skills?: string | null
          social_media?: Json | null
          status?: string | null
          student_id?: string | null
          student_number?: string | null
          submitted_at?: string | null
          teamwork_skills?: number | null
          updated_at?: string | null
          user_id?: string | null
          why_join?: string
          year_of_study?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "membership_applications_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          department: string | null
          email: string | null
          full_name: string | null
          grade: string | null
          id: string
          is_active: boolean | null
          phone: string | null
          role: string
          student_number: string | null
          updated_at: string | null
          username: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          email?: string | null
          full_name?: string | null
          grade?: string | null
          id: string
          is_active?: boolean | null
          phone?: string | null
          role?: string
          student_number?: string | null
          updated_at?: string | null
          username: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          department?: string | null
          email?: string | null
          full_name?: string | null
          grade?: string | null
          id?: string
          is_active?: boolean | null
          phone?: string | null
          role?: string
          student_number?: string | null
          updated_at?: string | null
          username?: string
        }
        Relationships: []
      }
    }
    Views: {
      approved_applications_view: {
        Row: {
          admin_notes: string | null
          applicant_name: string | null
          availability: string | null
          avatar_url: string | null
          created_at: string | null
          department: string | null
          email: string | null
          experience: string | null
          full_name: string | null
          grade: string | null
          id: string | null
          interests: string | null
          phone: string | null
          portfolio_url: string | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          reviewer_name: string | null
          reviewer_username: string | null
          skills: string | null
          social_media: Json | null
          status: string | null
          student_id: string | null
          student_number: string | null
          submitted_at: string | null
          updated_at: string | null
          user_id: string | null
          username: string | null
          why_join: string | null
          year_of_study: number | null
        }
        Relationships: [
          {
            foreignKeyName: "membership_applications_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dashboard_stats: {
        Row: {
          approved_this_month: number | null
          pending_applications: number | null
          rejected_this_month: number | null
          total_admins: number | null
          total_members: number | null
          total_moderators: number | null
        }
        Relationships: []
      }
      pending_applications_view: {
        Row: {
          admin_notes: string | null
          applicant_name: string | null
          availability: string | null
          avatar_url: string | null
          created_at: string | null
          days_waiting: number | null
          department: string | null
          email: string | null
          experience: string | null
          full_name: string | null
          grade: string | null
          hours_waiting: number | null
          id: string | null
          interests: string | null
          phone: string | null
          portfolio_url: string | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          skills: string | null
          social_media: Json | null
          status: string | null
          student_id: string | null
          student_number: string | null
          submitted_at: string | null
          updated_at: string | null
          user_id: string | null
          username: string | null
          why_join: string | null
          year_of_study: number | null
        }
        Relationships: [
          {
            foreignKeyName: "membership_applications_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_user_role: { Args: { user_id: string }; Returns: string }
      is_admin_or_above: { Args: { user_id: string }; Returns: boolean }
      is_moderator_or_above: { Args: { user_id: string }; Returns: boolean }
      is_super_admin: { Args: { user_id: string }; Returns: boolean }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
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

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
