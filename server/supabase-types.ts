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
      organizations: {
        Row: {
          created_at: string | null
          description: string | null
          domain: string
          id: string
          logo: string | null
          name: string
          social_links: Json | null
          updated_at: string | null
          website: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          domain: string
          id?: string
          logo?: string | null
          name: string
          social_links?: Json | null
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          domain?: string
          id?: string
          logo?: string | null
          name?: string
          social_links?: Json | null
          updated_at?: string | null
          website?: string | null
        }
        Relationships: []
      }
      otp_codes: {
        Row: {
          code: string
          created_at: string
          email: string
          expires_at: string
          id: string
          is_used: boolean
          purpose: Database["public"]["Enums"]["otp-purpose"]
          used_at: string | null
        }
        Insert: {
          code: string
          created_at?: string
          email: string
          expires_at: string
          id?: string
          is_used?: boolean
          purpose: Database["public"]["Enums"]["otp-purpose"]
          used_at?: string | null
        }
        Update: {
          code?: string
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          is_used?: boolean
          purpose?: Database["public"]["Enums"]["otp-purpose"]
          used_at?: string | null
        }
        Relationships: []
      }
      pack_documents: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          order: number
          pack_id: string
          page_count: number | null
          thumbnail: string | null
          title: string
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          order: number
          pack_id: string
          page_count?: number | null
          thumbnail?: string | null
          title: string
          updated_at?: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          order?: number
          pack_id?: string
          page_count?: number | null
          thumbnail?: string | null
          title?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "pack_documents_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "packs"
            referencedColumns: ["id"]
          },
        ]
      }
      pack_tags: {
        Row: {
          created_at: string | null
          name: string
          slug: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          name: string
          slug: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          name?: string
          slug?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      pack_videos: {
        Row: {
          created_at: string
          description: string | null
          duration: number
          id: string
          order: number
          pack_id: string
          thumbnail: string | null
          title: string
          update_at: string | null
          url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration: number
          id?: string
          order: number
          pack_id: string
          thumbnail?: string | null
          title: string
          update_at?: string | null
          url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration?: number
          id?: string
          order?: number
          pack_id?: string
          thumbnail?: string | null
          title?: string
          update_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "pack_videos_pack_id_fkey"
            columns: ["pack_id"]
            isOneToOne: false
            referencedRelation: "packs"
            referencedColumns: ["id"]
          },
        ]
      }
      packs: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          image: string | null
          is_free: boolean
          long_description: string | null
          org_id: string | null
          price: number
          tags: string[]
          title: string
          total_duration: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          is_free?: boolean
          long_description?: string | null
          org_id?: string | null
          price: number
          tags: string[]
          title: string
          total_duration?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          image?: string | null
          is_free?: boolean
          long_description?: string | null
          org_id?: string | null
          price?: number
          tags?: string[]
          title?: string
          total_duration?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "packs_orgId_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      tokens: {
        Row: {
          created_at: string | null
          email: string
          expires_at: string
          hash: string
          id: string
          is_revoked: boolean
        }
        Insert: {
          created_at?: string | null
          email: string
          expires_at: string
          hash: string
          id?: string
          is_revoked?: boolean
        }
        Update: {
          created_at?: string | null
          email?: string
          expires_at?: string
          hash?: string
          id?: string
          is_revoked?: boolean
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          email: string
          id: string
          isAdmin: boolean
          isPremium: boolean
          last_login: string | null
          last_logout: string | null
          name: string
          orgs: string[]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          isAdmin?: boolean
          isPremium?: boolean
          last_login?: string | null
          last_logout?: string | null
          name: string
          orgs: string[]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          isAdmin?: boolean
          isPremium?: boolean
          last_login?: string | null
          last_logout?: string | null
          name?: string
          orgs?: string[]
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_org: {
        Args: { p_user_id: string; p_org: string }
        Returns: undefined
      }
    }
    Enums: {
      "otp-purpose": "VERIFY" | "VERIFY_ORG"
      "user-status": "PENDING_VERIFICATION" | "VERIFIED"
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
      "otp-purpose": ["VERIFY", "VERIFY_ORG"],
      "user-status": ["PENDING_VERIFICATION", "VERIFIED"],
    },
  },
} as const
