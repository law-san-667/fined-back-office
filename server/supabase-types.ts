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
      budget_categories: {
        Row: {
          amount: number
          budget_summary_id: string | null
          color: string | null
          created_at: string | null
          id: string
          name: string
        }
        Insert: {
          amount: number
          budget_summary_id?: string | null
          color?: string | null
          created_at?: string | null
          id?: string
          name: string
        }
        Update: {
          amount?: number
          budget_summary_id?: string | null
          color?: string | null
          created_at?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "budget_categories_budget_summary_id_fkey"
            columns: ["budget_summary_id"]
            isOneToOne: false
            referencedRelation: "budget_summaries"
            referencedColumns: ["id"]
          },
        ]
      }
      budget_summaries: {
        Row: {
          created_at: string | null
          id: string
          month_year: string
          monthly_budget: number | null
          total_spent: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          month_year: string
          monthly_budget?: number | null
          total_spent?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          month_year?: string
          monthly_budget?: number | null
          total_spent?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "budget_summaries_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      channel_messages: {
        Row: {
          channel_id: string | null
          created_at: string | null
          id: string
          is_deleted: boolean | null
          reply_to_id: string | null
          text: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          channel_id?: string | null
          created_at?: string | null
          id?: string
          is_deleted?: boolean | null
          reply_to_id?: string | null
          text: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          channel_id?: string | null
          created_at?: string | null
          id?: string
          is_deleted?: boolean | null
          reply_to_id?: string | null
          text?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "channel_messages_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "forum_channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "channel_messages_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "channel_messages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "channel_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          conversation_id: string | null
          created_at: string | null
          id: string
          sender: string | null
          text: string
          user_id: string | null
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          sender?: string | null
          text: string
          user_id?: string | null
        }
        Update: {
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          sender?: string | null
          text?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      expense_categories: {
        Row: {
          bg_color: string | null
          created_at: string | null
          id: string
          name: string
          text_color: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          bg_color?: string | null
          created_at?: string | null
          id?: string
          name: string
          text_color?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          bg_color?: string | null
          created_at?: string | null
          id?: string
          name?: string
          text_color?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expense_categories_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          category_id: string | null
          created_at: string | null
          date: string
          id: string
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          category_id?: string | null
          created_at?: string | null
          date: string
          id?: string
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          category_id?: string | null
          created_at?: string | null
          date?: string
          id?: string
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "expenses_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "expense_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_channels: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          id: string
          member_count: number | null
          message_count: number | null
          name: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          member_count?: number | null
          message_count?: number | null
          name: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          member_count?: number | null
          message_count?: number | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      forum_posts: {
        Row: {
          answer_count: number | null
          created_at: string | null
          description: string
          id: string
          tags: string[] | null
          title: string
          updated_at: string | null
          upvotes: number | null
          user_id: string | null
        }
        Insert: {
          answer_count?: number | null
          created_at?: string | null
          description: string
          id?: string
          tags?: string[] | null
          title: string
          updated_at?: string | null
          upvotes?: number | null
          user_id?: string | null
        }
        Update: {
          answer_count?: number | null
          created_at?: string | null
          description?: string
          id?: string
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          upvotes?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forum_questions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          category: string
          content: string | null
          created_at: string | null
          id: string
          image: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          content?: string | null
          created_at?: string | null
          id?: string
          image: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          content?: string | null
          created_at?: string | null
          id?: string
          image?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "news_category_fkey"
            columns: ["category"]
            isOneToOne: false
            referencedRelation: "news_tags"
            referencedColumns: ["slug"]
          },
        ]
      }
      news_tags: {
        Row: {
          created_at: string | null
          name: string
          slug: string
          updated_At: string | null
        }
        Insert: {
          created_at?: string | null
          name: string
          slug: string
          updated_At?: string | null
        }
        Update: {
          created_at?: string | null
          name?: string
          slug?: string
          updated_At?: string | null
        }
        Relationships: []
      }
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
          type: string | null
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
          type?: string | null
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
          type?: string | null
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
      portfolio_positions: {
        Row: {
          avg_price: number
          created_at: string | null
          current_price: number
          id: string
          pnl: number | null
          pnl_percent: number | null
          portfolio_id: string | null
          shares: number
          stock_name: string
          stock_symbol: string
          updated_at: string | null
        }
        Insert: {
          avg_price: number
          created_at?: string | null
          current_price: number
          id?: string
          pnl?: number | null
          pnl_percent?: number | null
          portfolio_id?: string | null
          shares: number
          stock_name: string
          stock_symbol: string
          updated_at?: string | null
        }
        Update: {
          avg_price?: number
          created_at?: string | null
          current_price?: number
          id?: string
          pnl?: number | null
          pnl_percent?: number | null
          portfolio_id?: string | null
          shares?: number
          stock_name?: string
          stock_symbol?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_positions_portfolio_id_fkey"
            columns: ["portfolio_id"]
            isOneToOne: false
            referencedRelation: "user_portfolios"
            referencedColumns: ["id"]
          },
        ]
      }
      post_answers: {
        Row: {
          created_at: string | null
          id: string
          question_id: string | null
          reply_to_id: string | null
          text: string
          updated_at: string | null
          upvotes: number | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          question_id?: string | null
          reply_to_id?: string | null
          text: string
          updated_at?: string | null
          upvotes?: number | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          question_id?: string | null
          reply_to_id?: string | null
          text?: string
          updated_at?: string | null
          upvotes?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "question_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "forum_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_answers_reply_to_id_fkey"
            columns: ["reply_to_id"]
            isOneToOne: false
            referencedRelation: "post_answers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_answers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      post_tags: {
        Row: {
          created_at: string | null
          name: string
          slug: string
          updated_At: string | null
        }
        Insert: {
          created_at?: string | null
          name: string
          slug: string
          updated_At?: string | null
        }
        Update: {
          created_at?: string | null
          name?: string
          slug?: string
          updated_At?: string | null
        }
        Relationships: []
      }
      stocks: {
        Row: {
          change: number
          change_percent: number
          chart_data: number[] | null
          created_at: string | null
          id: string
          market_cap: string | null
          name: string
          pe_ratio: number | null
          price: number
          symbol: string
          updated_at: string | null
          volume: string | null
        }
        Insert: {
          change: number
          change_percent: number
          chart_data?: number[] | null
          created_at?: string | null
          id?: string
          market_cap?: string | null
          name: string
          pe_ratio?: number | null
          price: number
          symbol: string
          updated_at?: string | null
          volume?: string | null
        }
        Update: {
          change?: number
          change_percent?: number
          chart_data?: number[] | null
          created_at?: string | null
          id?: string
          market_cap?: string | null
          name?: string
          pe_ratio?: number | null
          price?: number
          symbol?: string
          updated_at?: string | null
          volume?: string | null
        }
        Relationships: []
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
      trade_history: {
        Row: {
          created_at: string | null
          entry_price: number
          exit_price: number
          id: string
          pnl: number
          pnl_percent: number
          shares: number
          stock_name: string
          stock_symbol: string
          trade_date: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          entry_price: number
          exit_price: number
          id?: string
          pnl: number
          pnl_percent: number
          shares: number
          stock_name: string
          stock_symbol: string
          trade_date: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          entry_price?: number
          exit_price?: number
          id?: string
          pnl?: number
          pnl_percent?: number
          shares?: number
          stock_name?: string
          stock_symbol?: string
          trade_date?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trade_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_portfolios: {
        Row: {
          available_margin: number | null
          created_at: string | null
          id: string
          total_pnl: number | null
          total_value: number | null
          updated_at: string | null
          used_margin: number | null
          user_id: string | null
        }
        Insert: {
          available_margin?: number | null
          created_at?: string | null
          id?: string
          total_pnl?: number | null
          total_value?: number | null
          updated_at?: string | null
          used_margin?: number | null
          user_id?: string | null
        }
        Update: {
          available_margin?: number | null
          created_at?: string | null
          id?: string
          total_pnl?: number | null
          total_value?: number | null
          updated_at?: string | null
          used_margin?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_portfolios_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed: boolean | null
          content_id: string
          content_type: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          progress: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          content_id: string
          content_type?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          progress?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          content_id?: string
          content_type?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          progress?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
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
          started_packs: string[] | null
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
          started_packs?: string[] | null
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
          started_packs?: string[] | null
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
    Enums: {
      "otp-purpose": ["VERIFY", "VERIFY_ORG"],
      "user-status": ["PENDING_VERIFICATION", "VERIFIED"],
    },
  },
} as const
