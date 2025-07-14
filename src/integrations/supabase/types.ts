export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      checklist_tasks: {
        Row: {
          actual_minutes: number | null
          assigned_to: string | null
          checklist_id: string
          completed_at: string | null
          completed_by: string | null
          created_at: string
          description: string | null
          estimated_minutes: number | null
          id: string
          is_critical: boolean
          order_index: number
          performance_rating: string | null
          started_at: string | null
          status: string
          template_task_id: string | null
          title: string
          updated_at: string
        }
        Insert: {
          actual_minutes?: number | null
          assigned_to?: string | null
          checklist_id: string
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          description?: string | null
          estimated_minutes?: number | null
          id?: string
          is_critical?: boolean
          order_index?: number
          performance_rating?: string | null
          started_at?: string | null
          status?: string
          template_task_id?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          actual_minutes?: number | null
          assigned_to?: string | null
          checklist_id?: string
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          description?: string | null
          estimated_minutes?: number | null
          id?: string
          is_critical?: boolean
          order_index?: number
          performance_rating?: string | null
          started_at?: string | null
          status?: string
          template_task_id?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklist_tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checklist_tasks_checklist_id_fkey"
            columns: ["checklist_id"]
            isOneToOne: false
            referencedRelation: "checklists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checklist_tasks_template_task_id_fkey"
            columns: ["template_task_id"]
            isOneToOne: false
            referencedRelation: "checklist_template_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_template_tasks: {
        Row: {
          created_at: string
          description: string | null
          estimated_minutes: number | null
          id: string
          is_critical: boolean
          order_index: number
          required_role: string | null
          template_id: string
          title: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          estimated_minutes?: number | null
          id?: string
          is_critical?: boolean
          order_index?: number
          required_role?: string | null
          template_id: string
          title: string
        }
        Update: {
          created_at?: string
          description?: string | null
          estimated_minutes?: number | null
          id?: string
          is_critical?: boolean
          order_index?: number
          required_role?: string | null
          template_id?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklist_template_tasks_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "checklist_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      checklist_templates: {
        Row: {
          checklist_type: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_active: boolean
          name: string
          store_id: string
          updated_at: string
        }
        Insert: {
          checklist_type: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          store_id: string
          updated_at?: string
        }
        Update: {
          checklist_type?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklist_templates_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      checklists: {
        Row: {
          completed_at: string | null
          created_at: string
          created_by: string | null
          date: string
          id: string
          shift_id: string | null
          started_at: string | null
          status: string
          store_id: string
          template_id: string
          updated_at: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          date: string
          id?: string
          shift_id?: string | null
          started_at?: string | null
          status?: string
          store_id: string
          template_id: string
          updated_at?: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          created_by?: string | null
          date?: string
          id?: string
          shift_id?: string | null
          started_at?: string | null
          status?: string
          store_id?: string
          template_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "checklists_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checklists_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "checklists_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "checklist_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          employee_id: string | null
          first_name: string | null
          id: string
          is_active: boolean
          last_name: string | null
          permissions: string[] | null
          phone: string | null
          pin: string | null
          role: string
          store_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          employee_id?: string | null
          first_name?: string | null
          id?: string
          is_active?: boolean
          last_name?: string | null
          permissions?: string[] | null
          phone?: string | null
          pin?: string | null
          role?: string
          store_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          employee_id?: string | null
          first_name?: string | null
          id?: string
          is_active?: boolean
          last_name?: string | null
          permissions?: string[] | null
          phone?: string | null
          pin?: string | null
          role?: string
          store_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      qcash_transactions: {
        Row: {
          amount: number
          created_at: string
          created_by: string | null
          description: string
          id: string
          profile_id: string
          shift_id: string | null
          source_profile_id: string | null
          transaction_type: string
        }
        Insert: {
          amount: number
          created_at?: string
          created_by?: string | null
          description: string
          id?: string
          profile_id: string
          shift_id?: string | null
          source_profile_id?: string | null
          transaction_type: string
        }
        Update: {
          amount?: number
          created_at?: string
          created_by?: string | null
          description?: string
          id?: string
          profile_id?: string
          shift_id?: string | null
          source_profile_id?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "qcash_transactions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qcash_transactions_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "qcash_transactions_source_profile_id_fkey"
            columns: ["source_profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      shift_assignments: {
        Row: {
          bbq_buddy_id: string | null
          created_at: string
          id: string
          is_scheduled: boolean
          primary_role: string
          profile_id: string
          secondary_roles: string[] | null
          shift_id: string
          updated_at: string
        }
        Insert: {
          bbq_buddy_id?: string | null
          created_at?: string
          id?: string
          is_scheduled?: boolean
          primary_role: string
          profile_id: string
          secondary_roles?: string[] | null
          shift_id: string
          updated_at?: string
        }
        Update: {
          bbq_buddy_id?: string | null
          created_at?: string
          id?: string
          is_scheduled?: boolean
          primary_role?: string
          profile_id?: string
          secondary_roles?: string[] | null
          shift_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shift_assignments_bbq_buddy_id_fkey"
            columns: ["bbq_buddy_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shift_assignments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shift_assignments_shift_id_fkey"
            columns: ["shift_id"]
            isOneToOne: false
            referencedRelation: "shifts"
            referencedColumns: ["id"]
          },
        ]
      }
      shifts: {
        Row: {
          catering_notes: string | null
          created_at: string
          created_by: string | null
          daily_specials: string | null
          date: string
          end_time: string | null
          id: string
          notes: string | null
          shift_type: string
          start_time: string | null
          store_id: string
          updated_at: string
        }
        Insert: {
          catering_notes?: string | null
          created_at?: string
          created_by?: string | null
          daily_specials?: string | null
          date: string
          end_time?: string | null
          id?: string
          notes?: string | null
          shift_type: string
          start_time?: string | null
          store_id: string
          updated_at?: string
        }
        Update: {
          catering_notes?: string | null
          created_at?: string
          created_by?: string | null
          daily_specials?: string | null
          date?: string
          end_time?: string | null
          id?: string
          notes?: string | null
          shift_type?: string
          start_time?: string | null
          store_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "shifts_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "stores"
            referencedColumns: ["id"]
          },
        ]
      }
      stores: {
        Row: {
          address: string | null
          created_at: string
          id: string
          is_active: boolean
          location: string
          name: string
          phone: string | null
          toast_pos_id: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          location: string
          name: string
          phone?: string | null
          toast_pos_id?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          is_active?: boolean
          location?: string
          name?: string
          phone?: string | null
          toast_pos_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      task_comments: {
        Row: {
          comment: string
          comment_type: string
          created_at: string
          id: string
          profile_id: string
          task_id: string
        }
        Insert: {
          comment: string
          comment_type?: string
          created_at?: string
          id?: string
          profile_id: string
          task_id: string
        }
        Update: {
          comment?: string
          comment_type?: string
          created_at?: string
          id?: string
          profile_id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_comments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "task_comments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "checklist_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      belongs_to_store: {
        Args: { target_store_id: string }
        Returns: boolean
      }
      can_manage_profiles_in_store: {
        Args: { target_store_id: string }
        Returns: boolean
      }
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
