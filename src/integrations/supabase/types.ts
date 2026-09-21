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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      event_attendees: {
        Row: {
          created_at: string
          event_id: string
          id: string
          profile_id: string
          status: string
        }
        Insert: {
          created_at?: string
          event_id: string
          id?: string
          profile_id: string
          status?: string
        }
        Update: {
          created_at?: string
          event_id?: string
          id?: string
          profile_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_attendees_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "travel_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_attendees_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      event_messages: {
        Row: {
          body: string
          created_at: string
          event_id: string
          id: string
          profile_id: string
        }
        Insert: {
          body: string
          created_at?: string
          event_id: string
          id?: string
          profile_id: string
        }
        Update: {
          body?: string
          created_at?: string
          event_id?: string
          id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_messages_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "travel_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_messages_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      itinerary_items: {
        Row: {
          created_at: string
          event_id: string | null
          id: string
          notes: string
          position: number
          profile_id: string
          title: string
          trip_day: number
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          id?: string
          notes?: string
          position?: number
          profile_id: string
          title: string
          trip_day?: number
        }
        Update: {
          created_at?: string
          event_id?: string | null
          id?: string
          notes?: string
          position?: number
          profile_id?: string
          title?: string
          trip_day?: number
        }
        Relationships: [
          {
            foreignKeyName: "itinerary_items_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "travel_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itinerary_items_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          badges: string[]
          bio: string
          countries_visited: number
          created_at: string
          display_name: string
          handle: string
          home_base: string | null
          id: string
          travel_styles: Database["public"]["Enums"]["travel_style"][]
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          badges?: string[]
          bio?: string
          countries_visited?: number
          created_at?: string
          display_name: string
          handle: string
          home_base?: string | null
          id?: string
          travel_styles?: Database["public"]["Enums"]["travel_style"][]
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          badges?: string[]
          bio?: string
          countries_visited?: number
          created_at?: string
          display_name?: string
          handle?: string
          home_base?: string | null
          id?: string
          travel_styles?: Database["public"]["Enums"]["travel_style"][]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      travel_events: {
        Row: {
          category: Database["public"]["Enums"]["travel_event_category"]
          city: string
          country: string
          cover_url: string | null
          created_at: string
          creator_id: string
          currency: string
          description: string
          id: string
          latitude: number
          longitude: number
          max_attendees: number
          price_amount: number
          rating: number
          starts_at: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          category: Database["public"]["Enums"]["travel_event_category"]
          city: string
          country: string
          cover_url?: string | null
          created_at?: string
          creator_id: string
          currency?: string
          description?: string
          id?: string
          latitude: number
          longitude: number
          max_attendees?: number
          price_amount?: number
          rating?: number
          starts_at: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          category?: Database["public"]["Enums"]["travel_event_category"]
          city?: string
          country?: string
          cover_url?: string | null
          created_at?: string
          creator_id?: string
          currency?: string
          description?: string
          id?: string
          latitude?: number
          longitude?: number
          max_attendees?: number
          price_amount?: number
          rating?: number
          starts_at?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "travel_events_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      traveler_radar: {
        Row: {
          active_until: string
          created_at: string
          id: string
          latitude: number
          longitude: number
          profile_id: string
          radius_km: number
          updated_at: string
        }
        Insert: {
          active_until: string
          created_at?: string
          id?: string
          latitude: number
          longitude: number
          profile_id: string
          radius_km?: number
          updated_at?: string
        }
        Update: {
          active_until?: string
          created_at?: string
          id?: string
          latitude?: number
          longitude?: number
          profile_id?: string
          radius_km?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "traveler_radar_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      travel_event_category:
        | "nightlife"
        | "hiking"
        | "cultural"
        | "foodie"
        | "budget"
        | "extreme"
        | "wellness"
      travel_style:
        | "slow_travel"
        | "backpacker"
        | "luxury"
        | "foodie"
        | "adventure"
        | "culture"
        | "digital_nomad"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      travel_event_category: [
        "nightlife",
        "hiking",
        "cultural",
        "foodie",
        "budget",
        "extreme",
        "wellness",
      ],
      travel_style: [
        "slow_travel",
        "backpacker",
        "luxury",
        "foodie",
        "adventure",
        "culture",
        "digital_nomad",
      ],
    },
  },
} as const
