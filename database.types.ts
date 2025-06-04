export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
          applications: Json[]
          code: string
          created_at: string | null
          id: number
          name: string
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          applications?: Json[]
          code: string
          created_at?: string | null
          id?: number
          name: string
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          applications?: Json[]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
