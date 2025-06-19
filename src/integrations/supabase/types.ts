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
      changelog_entries: {
        Row: {
          content: string | null
          content_type: Database["public"]["Enums"]["changelog_content_type"]
          created_at: string
          description: string
          features: string[]
          id: string
          image_url: string | null
          product: string
          release_date: string
          title: string
          type: Database["public"]["Enums"]["changelog_type"]
          updated_at: string
          version: string
          video_url: string | null
        }
        Insert: {
          content?: string | null
          content_type?: Database["public"]["Enums"]["changelog_content_type"]
          created_at?: string
          description: string
          features?: string[]
          id?: string
          image_url?: string | null
          product: string
          release_date: string
          title: string
          type?: Database["public"]["Enums"]["changelog_type"]
          updated_at?: string
          version: string
          video_url?: string | null
        }
        Update: {
          content?: string | null
          content_type?: Database["public"]["Enums"]["changelog_content_type"]
          created_at?: string
          description?: string
          features?: string[]
          id?: string
          image_url?: string | null
          product?: string
          release_date?: string
          title?: string
          type?: Database["public"]["Enums"]["changelog_type"]
          updated_at?: string
          version?: string
          video_url?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          name: string | null
          permission: Database["public"]["Enums"]["user_permission"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          permission?: Database["public"]["Enums"]["user_permission"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          name?: string | null
          permission?: Database["public"]["Enums"]["user_permission"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      roadmap_items: {
        Row: {
          created_at: string
          description: string
          end_date: string | null
          estimated_date: string | null
          id: string
          priority: Database["public"]["Enums"]["priority_level"]
          product: string
          start_date: string | null
          status: Database["public"]["Enums"]["roadmap_status"]
          title: string
          updated_at: string
          votes: number
        }
        Insert: {
          created_at?: string
          description: string
          end_date?: string | null
          estimated_date?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["priority_level"]
          product: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["roadmap_status"]
          title: string
          updated_at?: string
          votes?: number
        }
        Update: {
          created_at?: string
          description?: string
          end_date?: string | null
          estimated_date?: string | null
          id?: string
          priority?: Database["public"]["Enums"]["priority_level"]
          product?: string
          start_date?: string | null
          status?: Database["public"]["Enums"]["roadmap_status"]
          title?: string
          updated_at?: string
          votes?: number
        }
        Relationships: []
      }
      roadmap_reactions: {
        Row: {
          created_at: string
          id: string
          reaction_type: string
          roadmap_item_id: string | null
          user_email: string
        }
        Insert: {
          created_at?: string
          id?: string
          reaction_type: string
          roadmap_item_id?: string | null
          user_email: string
        }
        Update: {
          created_at?: string
          id?: string
          reaction_type?: string
          roadmap_item_id?: string | null
          user_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "roadmap_reactions_roadmap_item_id_fkey"
            columns: ["roadmap_item_id"]
            isOneToOne: false
            referencedRelation: "roadmap_items"
            referencedColumns: ["id"]
          },
        ]
      }
      suggestion_votes: {
        Row: {
          created_at: string
          id: string
          suggestion_id: string | null
          user_email: string
        }
        Insert: {
          created_at?: string
          id?: string
          suggestion_id?: string | null
          user_email: string
        }
        Update: {
          created_at?: string
          id?: string
          suggestion_id?: string | null
          user_email?: string
        }
        Relationships: [
          {
            foreignKeyName: "suggestion_votes_suggestion_id_fkey"
            columns: ["suggestion_id"]
            isOneToOne: false
            referencedRelation: "suggestions"
            referencedColumns: ["id"]
          },
        ]
      }
      suggestions: {
        Row: {
          admin_response: string | null
          comments_count: number
          created_at: string
          description: string
          email: string
          id: string
          is_pinned: boolean
          is_public: boolean
          module: string
          priority: Database["public"]["Enums"]["priority_level"]
          status: Database["public"]["Enums"]["suggestion_status"]
          title: string
          updated_at: string
          votes: number
          youtube_url: string | null
        }
        Insert: {
          admin_response?: string | null
          comments_count?: number
          created_at?: string
          description: string
          email: string
          id?: string
          is_pinned?: boolean
          is_public?: boolean
          module: string
          priority?: Database["public"]["Enums"]["priority_level"]
          status?: Database["public"]["Enums"]["suggestion_status"]
          title: string
          updated_at?: string
          votes?: number
          youtube_url?: string | null
        }
        Update: {
          admin_response?: string | null
          comments_count?: number
          created_at?: string
          description?: string
          email?: string
          id?: string
          is_pinned?: boolean
          is_public?: boolean
          module?: string
          priority?: Database["public"]["Enums"]["priority_level"]
          status?: Database["public"]["Enums"]["suggestion_status"]
          title?: string
          updated_at?: string
          votes?: number
          youtube_url?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      changelog_content_type: "text" | "image" | "video" | "gif"
      changelog_type: "feature" | "improvement" | "bugfix" | "breaking"
      priority_level: "baixa" | "media" | "alta"
      roadmap_status: "planejado" | "em-desenvolvimento" | "concluido"
      suggestion_status:
        | "recebido"
        | "em-analise"
        | "aprovada"
        | "rejeitada"
        | "implementada"
      user_permission: "admin" | "moderator" | "user"
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
    Enums: {
      changelog_content_type: ["text", "image", "video", "gif"],
      changelog_type: ["feature", "improvement", "bugfix", "breaking"],
      priority_level: ["baixa", "media", "alta"],
      roadmap_status: ["planejado", "em-desenvolvimento", "concluido"],
      suggestion_status: [
        "recebido",
        "em-analise",
        "aprovada",
        "rejeitada",
        "implementada",
      ],
      user_permission: ["admin", "moderator", "user"],
    },
  },
} as const
