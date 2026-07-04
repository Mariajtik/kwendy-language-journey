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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      chat_mensagens: {
        Row: {
          criado_em: string
          id: string
          parts: Json
          role: string
          thread_id: string
          user_id: string
        }
        Insert: {
          criado_em?: string
          id?: string
          parts?: Json
          role: string
          thread_id: string
          user_id: string
        }
        Update: {
          criado_em?: string
          id?: string
          parts?: Json
          role?: string
          thread_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_mensagens_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "chat_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_threads: {
        Row: {
          atualizado_em: string
          criado_em: string
          id: string
          titulo: string
          user_id: string
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          id?: string
          titulo?: string
          user_id: string
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          id?: string
          titulo?: string
          user_id?: string
        }
        Relationships: []
      }
      eventos: {
        Row: {
          criado_em: string
          id: string
          payload: Json
          tipo: string
          user_id: string
        }
        Insert: {
          criado_em?: string
          id?: string
          payload?: Json
          tipo: string
          user_id: string
        }
        Update: {
          criado_em?: string
          id?: string
          payload?: Json
          tipo?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          atualizado_em: string
          avatar_url: string | null
          chokwe: string | null
          criado_em: string
          email: string | null
          fonte_kwendi: string | null
          id: string
          motivacao: string | null
          nivel_declarado: string | null
          nome: string | null
          objetivo_diario: string | null
          pais: string | null
          provincia: string | null
          stealth_avisado_em: string | null
          stealth_expira_em: string | null
          tipo: string
        }
        Insert: {
          atualizado_em?: string
          avatar_url?: string | null
          chokwe?: string | null
          criado_em?: string
          email?: string | null
          fonte_kwendi?: string | null
          id: string
          motivacao?: string | null
          nivel_declarado?: string | null
          nome?: string | null
          objetivo_diario?: string | null
          pais?: string | null
          provincia?: string | null
          stealth_avisado_em?: string | null
          stealth_expira_em?: string | null
          tipo?: string
        }
        Update: {
          atualizado_em?: string
          avatar_url?: string | null
          chokwe?: string | null
          criado_em?: string
          email?: string | null
          fonte_kwendi?: string | null
          id?: string
          motivacao?: string | null
          nivel_declarado?: string | null
          nome?: string | null
          objetivo_diario?: string | null
          pais?: string | null
          provincia?: string | null
          stealth_avisado_em?: string | null
          stealth_expira_em?: string | null
          tipo?: string
        }
        Relationships: []
      }
      progresso: {
        Row: {
          ads_off: boolean
          ancao: boolean
          atualizado_em: string
          diamantes: number
          nivelamento_percentagem: number | null
          premium: boolean
          premium_expira_em: string | null
          seccoes_completas: string[]
          streak: number
          unidade_atual: string | null
          user_id: string
          xp: number
        }
        Insert: {
          ads_off?: boolean
          ancao?: boolean
          atualizado_em?: string
          diamantes?: number
          nivelamento_percentagem?: number | null
          premium?: boolean
          premium_expira_em?: string | null
          seccoes_completas?: string[]
          streak?: number
          unidade_atual?: string | null
          user_id: string
          xp?: number
        }
        Update: {
          ads_off?: boolean
          ancao?: boolean
          atualizado_em?: string
          diamantes?: number
          nivelamento_percentagem?: number | null
          premium?: boolean
          premium_expira_em?: string | null
          seccoes_completas?: string[]
          streak?: number
          unidade_atual?: string | null
          user_id?: string
          xp?: number
        }
        Relationships: []
      }
      sessoes: {
        Row: {
          id: string
          iniciada_em: string
          rota: string | null
          terminada_em: string | null
          user_id: string
        }
        Insert: {
          id?: string
          iniciada_em?: string
          rota?: string | null
          terminada_em?: string | null
          user_id: string
        }
        Update: {
          id?: string
          iniciada_em?: string
          rota?: string | null
          terminada_em?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_inventario: {
        Row: {
          atualizado_em: string
          desbloqueios: string[]
          power_ups: Json
          user_id: string
        }
        Insert: {
          atualizado_em?: string
          desbloqueios?: string[]
          power_ups?: Json
          user_id: string
        }
        Update: {
          atualizado_em?: string
          desbloqueios?: string[]
          power_ups?: Json
          user_id?: string
        }
        Relationships: []
      }
      user_missoes: {
        Row: {
          atualizado_em: string
          conquistas: Json
          missoes: Json
          ultimo_reset: Json
          user_id: string
        }
        Insert: {
          atualizado_em?: string
          conquistas?: Json
          missoes?: Json
          ultimo_reset?: Json
          user_id: string
        }
        Update: {
          atualizado_em?: string
          conquistas?: Json
          missoes?: Json
          ultimo_reset?: Json
          user_id?: string
        }
        Relationships: []
      }
      user_nivelamento: {
        Row: {
          acertos: number
          ancao: boolean
          atualizado_em: string
          fez: boolean
          percentagem: number
          popup_pendente: string | null
          todos_desbloqueados: boolean
          total: number
          unidade_sugerida: string | null
          user_id: string
        }
        Insert: {
          acertos?: number
          ancao?: boolean
          atualizado_em?: string
          fez?: boolean
          percentagem?: number
          popup_pendente?: string | null
          todos_desbloqueados?: boolean
          total?: number
          unidade_sugerida?: string | null
          user_id: string
        }
        Update: {
          acertos?: number
          ancao?: boolean
          atualizado_em?: string
          fez?: boolean
          percentagem?: number
          popup_pendente?: string | null
          todos_desbloqueados?: boolean
          total?: number
          unidade_sugerida?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_passaporte: {
        Row: {
          atualizado_em: string
          estado: Json
          user_id: string
        }
        Insert: {
          atualizado_em?: string
          estado?: Json
          user_id: string
        }
        Update: {
          atualizado_em?: string
          estado?: Json
          user_id?: string
        }
        Relationships: []
      }
      user_preferencias: {
        Row: {
          acessibilidade: Json
          atualizado_em: string
          flags: Json
          notificacoes: Json
          user_id: string
        }
        Insert: {
          acessibilidade?: Json
          atualizado_em?: string
          flags?: Json
          notificacoes?: Json
          user_id: string
        }
        Update: {
          acessibilidade?: Json
          atualizado_em?: string
          flags?: Json
          notificacoes?: Json
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          criado_em: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          criado_em?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          criado_em?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_saldo: {
        Row: {
          atualizado_em: string
          baus: Json
          curiosidades_lidas: string[]
          diamantes: number
          fragmentos: number
          ofensiva: number
          ultimo_dia_ativo: string
          user_id: string
          vidas: number
          vidas_extra: number
          xp: number
        }
        Insert: {
          atualizado_em?: string
          baus?: Json
          curiosidades_lidas?: string[]
          diamantes?: number
          fragmentos?: number
          ofensiva?: number
          ultimo_dia_ativo?: string
          user_id: string
          vidas?: number
          vidas_extra?: number
          xp?: number
        }
        Update: {
          atualizado_em?: string
          baus?: Json
          curiosidades_lidas?: string[]
          diamantes?: number
          fragmentos?: number
          ofensiva?: number
          ultimo_dia_ativo?: string
          user_id?: string
          vidas?: number
          vidas_extra?: number
          xp?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_overview: { Args: never; Returns: Json }
      admin_sessions_stats: { Args: never; Returns: Json }
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
    },
  },
} as const
