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
      auth_otp: {
        Row: {
          code_hash: string
          consumed_at: string | null
          created_at: string
          expires_at: string
          id: string
          purpose: Database["public"]["Enums"]["otp_purpose"]
          tentativas: number
          user_id: string
        }
        Insert: {
          code_hash: string
          consumed_at?: string | null
          created_at?: string
          expires_at: string
          id?: string
          purpose: Database["public"]["Enums"]["otp_purpose"]
          tentativas?: number
          user_id: string
        }
        Update: {
          code_hash?: string
          consumed_at?: string | null
          created_at?: string
          expires_at?: string
          id?: string
          purpose?: Database["public"]["Enums"]["otp_purpose"]
          tentativas?: number
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          chokwe: boolean
          created_at: string
          email: string | null
          fonte_kwendi: string | null
          id: string
          motivacao: string | null
          nivel_declarado: string | null
          nome: string | null
          objetivo_diario: number | null
          pais: string | null
          provincia: string | null
          stealth_avisado_em: string | null
          stealth_expira_em: string | null
          tipo: Database["public"]["Enums"]["profile_tipo"]
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          chokwe?: boolean
          created_at?: string
          email?: string | null
          fonte_kwendi?: string | null
          id: string
          motivacao?: string | null
          nivel_declarado?: string | null
          nome?: string | null
          objetivo_diario?: number | null
          pais?: string | null
          provincia?: string | null
          stealth_avisado_em?: string | null
          stealth_expira_em?: string | null
          tipo?: Database["public"]["Enums"]["profile_tipo"]
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          chokwe?: boolean
          created_at?: string
          email?: string | null
          fonte_kwendi?: string | null
          id?: string
          motivacao?: string | null
          nivel_declarado?: string | null
          nome?: string | null
          objetivo_diario?: number | null
          pais?: string | null
          provincia?: string | null
          stealth_avisado_em?: string | null
          stealth_expira_em?: string | null
          tipo?: Database["public"]["Enums"]["profile_tipo"]
          updated_at?: string
        }
        Relationships: []
      }
      progresso: {
        Row: {
          created_at: string
          diamantes: number
          ofensiva: number
          ofensiva_ultimo_dia: string | null
          premium: boolean
          secoes_completas: Json
          unidade_atual: number
          updated_at: string
          user_id: string
          vidas: number
          xp: number
        }
        Insert: {
          created_at?: string
          diamantes?: number
          ofensiva?: number
          ofensiva_ultimo_dia?: string | null
          premium?: boolean
          secoes_completas?: Json
          unidade_atual?: number
          updated_at?: string
          user_id: string
          vidas?: number
          xp?: number
        }
        Update: {
          created_at?: string
          diamantes?: number
          ofensiva?: number
          ofensiva_ultimo_dia?: string | null
          premium?: boolean
          secoes_completas?: Json
          unidade_atual?: number
          updated_at?: string
          user_id?: string
          vidas?: number
          xp?: number
        }
        Relationships: []
      }
      user_devices: {
        Row: {
          created_at: string
          device_id: string
          device_name: string | null
          id: string
          ultimo_uso: string
          user_id: string
        }
        Insert: {
          created_at?: string
          device_id: string
          device_name?: string | null
          id?: string
          ultimo_uso?: string
          user_id: string
        }
        Update: {
          created_at?: string
          device_id?: string
          device_name?: string | null
          id?: string
          ultimo_uso?: string
          user_id?: string
        }
        Relationships: []
      }
      user_inventario: {
        Row: {
          created_at: string
          itens: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          itens?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          itens?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_missoes: {
        Row: {
          conquistas: Json
          created_at: string
          diarias: Json
          reset_diario_em: string | null
          reset_semanal_em: string | null
          semanais: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          conquistas?: Json
          created_at?: string
          diarias?: Json
          reset_diario_em?: string | null
          reset_semanal_em?: string | null
          semanais?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          conquistas?: Json
          created_at?: string
          diarias?: Json
          reset_diario_em?: string | null
          reset_semanal_em?: string | null
          semanais?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_nivelamento: {
        Row: {
          ancião: string | null
          created_at: string
          feito: boolean
          percentagem: number
          respostas: Json
          unidade_sugerida: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ancião?: string | null
          created_at?: string
          feito?: boolean
          percentagem?: number
          respostas?: Json
          unidade_sugerida?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ancião?: string | null
          created_at?: string
          feito?: boolean
          percentagem?: number
          respostas?: Json
          unidade_sugerida?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_passaporte: {
        Row: {
          created_at: string
          provincias_visitadas: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          provincias_visitadas?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          provincias_visitadas?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_preferencias: {
        Row: {
          alto_contraste: boolean
          created_at: string
          extras: Json
          fonte: string
          musica: boolean
          notificacoes: boolean
          reduzir_movimento: boolean
          som: boolean
          tema: string
          updated_at: string
          user_id: string
          vibracao: boolean
        }
        Insert: {
          alto_contraste?: boolean
          created_at?: string
          extras?: Json
          fonte?: string
          musica?: boolean
          notificacoes?: boolean
          reduzir_movimento?: boolean
          som?: boolean
          tema?: string
          updated_at?: string
          user_id: string
          vibracao?: boolean
        }
        Update: {
          alto_contraste?: boolean
          created_at?: string
          extras?: Json
          fonte?: string
          musica?: boolean
          notificacoes?: boolean
          reduzir_movimento?: boolean
          som?: boolean
          tema?: string
          updated_at?: string
          user_id?: string
          vibracao?: boolean
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
      otp_purpose:
        | "login"
        | "password_change"
        | "email_change"
        | "account_delete"
      profile_tipo: "signup" | "stealth"
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
      app_role: ["admin", "user"],
      otp_purpose: [
        "login",
        "password_change",
        "email_change",
        "account_delete",
      ],
      profile_tipo: ["signup", "stealth"],
    },
  },
} as const
