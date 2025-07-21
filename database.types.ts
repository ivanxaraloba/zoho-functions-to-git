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
      commits: {
        Row: {
          created_at: string
          function: Json | null
          functionId: string | null
          functionName: string | null
          id: number
          message: string | null
          path: string | null
          projectId: number | null
          status: string | null
          userId: string | null
        }
        Insert: {
          created_at?: string
          function?: Json | null
          functionId?: string | null
          functionName?: string | null
          id?: number
          message?: string | null
          path?: string | null
          projectId?: number | null
          status?: string | null
          userId?: string | null
        }
        Update: {
          created_at?: string
          function?: Json | null
          functionId?: string | null
          functionName?: string | null
          id?: number
          message?: string | null
          path?: string | null
          projectId?: number | null
          status?: string | null
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "commits_projectId_fkey"
            columns: ["projectId"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "commits_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      creator: {
        Row: {
          apps: Json | null
          config: Json | null
          created_at: string
          id: number
          owner: string
          projectId: number
        }
        Insert: {
          apps?: Json | null
          config?: Json | null
          created_at?: string
          id?: number
          owner: string
          projectId: number
        }
        Update: {
          apps?: Json | null
          config?: Json | null
          created_at?: string
          id?: number
          owner?: string
          projectId?: number
        }
        Relationships: [
          {
            foreignKeyName: "creator_projectId_fkey"
            columns: ["projectId"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      creatorApps: {
        Row: {
          accordian: Json | null
          created_at: string
          creatorId: number
          id: number
          lastCommit: string | null
          lastSync: string | null
          name: string | null
        }
        Insert: {
          accordian?: Json | null
          created_at?: string
          creatorId: number
          id?: number
          lastCommit?: string | null
          lastSync?: string | null
          name?: string | null
        }
        Update: {
          accordian?: Json | null
          created_at?: string
          creatorId?: number
          id?: number
          lastCommit?: string | null
          lastSync?: string | null
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "creatorApps_creatorId_fkey"
            columns: ["creatorId"]
            isOneToOne: false
            referencedRelation: "creator"
            referencedColumns: ["id"]
          },
        ]
      }
      crm: {
        Row: {
          client_scripts: Json | null
          config: Json | null
          connections: Json[] | null
          created_at: string
          functions: Json | null
          id: number
          lastCommit: string | null
          lastSync: string | null
          projectId: number
        }
        Insert: {
          client_scripts?: Json | null
          config?: Json | null
          connections?: Json[] | null
          created_at?: string
          functions?: Json | null
          id?: number
          lastCommit?: string | null
          lastSync?: string | null
          projectId: number
        }
        Update: {
          client_scripts?: Json | null
          config?: Json | null
          connections?: Json[] | null
          created_at?: string
          functions?: Json | null
          id?: number
          lastCommit?: string | null
          lastSync?: string | null
          projectId?: number
        }
        Relationships: [
          {
            foreignKeyName: "crm_projectId_fkey"
            columns: ["projectId"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      crmFunctions: {
        Row: {
          api_name: string | null
          associated_place: Json | null
          category: string | null
          config: boolean | null
          connections: Json | null
          crmProjectId: number | null
          description: string | null
          display_name: string | null
          id: string
          language: string | null
          modified_by: string | null
          modified_on: string | null
          name: string | null
          nameSpace: string | null
          params: Json | null
          rest_api: Json | null
          return_type: string | null
          script: string | null
          source: string | null
          tasks: Json | null
          updatedTime: string | null
          workflow: string | null
        }
        Insert: {
          api_name?: string | null
          associated_place?: Json | null
          category?: string | null
          config?: boolean | null
          connections?: Json | null
          crmProjectId?: number | null
          description?: string | null
          display_name?: string | null
          id: string
          language?: string | null
          modified_by?: string | null
          modified_on?: string | null
          name?: string | null
          nameSpace?: string | null
          params?: Json | null
          rest_api?: Json | null
          return_type?: string | null
          script?: string | null
          source?: string | null
          tasks?: Json | null
          updatedTime?: string | null
          workflow?: string | null
        }
        Update: {
          api_name?: string | null
          associated_place?: Json | null
          category?: string | null
          config?: boolean | null
          connections?: Json | null
          crmProjectId?: number | null
          description?: string | null
          display_name?: string | null
          id?: string
          language?: string | null
          modified_by?: string | null
          modified_on?: string | null
          name?: string | null
          nameSpace?: string | null
          params?: Json | null
          rest_api?: Json | null
          return_type?: string | null
          script?: string | null
          source?: string | null
          tasks?: Json | null
          updatedTime?: string | null
          workflow?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crmFunctions_crmProjectId_fkey"
            columns: ["crmProjectId"]
            isOneToOne: false
            referencedRelation: "crm"
            referencedColumns: ["projectId"]
          },
        ]
      }
      departments: {
        Row: {
          created_at: string
          id: number
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      functions: {
        Row: {
          applications: string[]
          code: string
          created_at: string | null
          id: number
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          applications: string[]
          code: string
          created_at?: string | null
          id?: number
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          applications?: string[]
          code?: string
          created_at?: string | null
          id?: number
          name?: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "functions_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      logs: {
        Row: {
          created_at: string
          function: string | null
          id: number
          notes: string | null
          projectUsername: string | null
          type: string
        }
        Insert: {
          created_at?: string
          function?: string | null
          id?: number
          notes?: string | null
          projectUsername?: string | null
          type?: string
        }
        Update: {
          created_at?: string
          function?: string | null
          id?: number
          notes?: string | null
          projectUsername?: string | null
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "logs_projectUsername_fkey"
            columns: ["projectUsername"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["username"]
          },
        ]
      }
      newcommits: {
        Row: {
          created_at: string
          id: number
          projectId: number | null
          userId: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          projectId?: number | null
          userId?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          projectId?: number | null
          userId?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "newcommits_projectId_fkey"
            columns: ["projectId"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "newcommits_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          created_at: string
          departmentId: number | null
          domain: string | null
          id: number
          name: string
          username: string | null
        }
        Insert: {
          created_at?: string
          departmentId?: number | null
          domain?: string | null
          id?: number
          name: string
          username?: string | null
        }
        Update: {
          created_at?: string
          departmentId?: number | null
          domain?: string | null
          id?: number
          name?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "projects_departmentId_fkey"
            columns: ["departmentId"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      recruit: {
        Row: {
          config: Json | null
          created_at: string
          functions: Json | null
          id: number
          lastCommit: string | null
          lastSync: string | null
          projectId: number
        }
        Insert: {
          config?: Json | null
          created_at?: string
          functions?: Json | null
          id?: number
          lastCommit?: string | null
          lastSync?: string | null
          projectId: number
        }
        Update: {
          config?: Json | null
          created_at?: string
          functions?: Json | null
          id?: number
          lastCommit?: string | null
          lastSync?: string | null
          projectId?: number
        }
        Relationships: [
          {
            foreignKeyName: "recruit_projectId_fkey"
            columns: ["projectId"]
            isOneToOne: true
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          bbPassword: string | null
          bbUsername: string | null
          created_at: string
          id: string
        }
        Insert: {
          bbPassword?: string | null
          bbUsername?: string | null
          created_at?: string
          id?: string
        }
        Update: {
          bbPassword?: string | null
          bbUsername?: string | null
          created_at?: string
          id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_projects_with_relations: {
        Args: Record<PropertyKey, never>
        Returns: Json[]
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
