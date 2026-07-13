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
      community_comments: {
        Row: {
          created_at: string
          id: string
          post_id: string
          status: Database["public"]["Enums"]["community_status"]
          text: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id: string
          status?: Database["public"]["Enums"]["community_status"]
          text: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string
          status?: Database["public"]["Enums"]["community_status"]
          text?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          lang: string
          moderation_reason: string | null
          status: Database["public"]["Enums"]["community_status"]
          text: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          lang: string
          moderation_reason?: string | null
          status?: Database["public"]["Enums"]["community_status"]
          text: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          lang?: string
          moderation_reason?: string | null
          status?: Database["public"]["Enums"]["community_status"]
          text?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      community_reactions: {
        Row: {
          created_at: string
          post_id: string
          reaction: string
          user_id: string
        }
        Insert: {
          created_at?: string
          post_id: string
          reaction: string
          user_id: string
        }
        Update: {
          created_at?: string
          post_id?: string
          reaction?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_reactions_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      email_send_log: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_id: string | null
          metadata: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email: string
          status: string
          template_name: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_id?: string | null
          metadata?: Json | null
          recipient_email?: string
          status?: string
          template_name?: string
        }
        Relationships: []
      }
      email_send_state: {
        Row: {
          auth_email_ttl_minutes: number
          batch_size: number
          id: number
          retry_after_until: string | null
          send_delay_ms: number
          transactional_email_ttl_minutes: number
          updated_at: string
        }
        Insert: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Update: {
          auth_email_ttl_minutes?: number
          batch_size?: number
          id?: number
          retry_after_until?: string | null
          send_delay_ms?: number
          transactional_email_ttl_minutes?: number
          updated_at?: string
        }
        Relationships: []
      }
      email_unsubscribe_tokens: {
        Row: {
          created_at: string
          email: string
          id: string
          token: string
          used_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          token: string
          used_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          token?: string
          used_at?: string | null
        }
        Relationships: []
      }
      feedback_log: {
        Row: {
          assunto: string
          created_at: string
          email_autor: string | null
          id: string
          mensagem: string
          user_id: string
        }
        Insert: {
          assunto: string
          created_at?: string
          email_autor?: string | null
          id?: string
          mensagem?: string
          user_id: string
        }
        Update: {
          assunto?: string
          created_at?: string
          email_autor?: string | null
          id?: string
          mensagem?: string
          user_id?: string
        }
        Relationships: []
      }
      friendships: {
        Row: {
          addressee_id: string
          created_at: string
          id: string
          requester_id: string
          status: Database["public"]["Enums"]["friendship_status"]
          updated_at: string
        }
        Insert: {
          addressee_id: string
          created_at?: string
          id?: string
          requester_id: string
          status?: Database["public"]["Enums"]["friendship_status"]
          updated_at?: string
        }
        Update: {
          addressee_id?: string
          created_at?: string
          id?: string
          requester_id?: string
          status?: Database["public"]["Enums"]["friendship_status"]
          updated_at?: string
        }
        Relationships: []
      }
      lesson_events: {
        Row: {
          acertos: number
          created_at: string
          duracao_seg: number
          erros: number
          finished_at: string
          id: string
          licao_id: string | null
          user_id: string
          xp_ganho: number
        }
        Insert: {
          acertos?: number
          created_at?: string
          duracao_seg?: number
          erros?: number
          finished_at?: string
          id?: string
          licao_id?: string | null
          user_id: string
          xp_ganho?: number
        }
        Update: {
          acertos?: number
          created_at?: string
          duracao_seg?: number
          erros?: number
          finished_at?: string
          id?: string
          licao_id?: string | null
          user_id?: string
          xp_ganho?: number
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
          baus: Json
          chamas_congeladas: number
          created_at: string
          curiosidades_lidas: Json
          diamantes: number
          fragmentos: number
          ofensiva: number
          ofensiva_hoje: boolean
          ofensiva_ultimo_dia: string | null
          premium: boolean
          secoes_completas: Json
          unidade_atual: number
          updated_at: string
          user_id: string
          vidas: number
          vidas_recarga_em: string | null
          xp: number
        }
        Insert: {
          baus?: Json
          chamas_congeladas?: number
          created_at?: string
          curiosidades_lidas?: Json
          diamantes?: number
          fragmentos?: number
          ofensiva?: number
          ofensiva_hoje?: boolean
          ofensiva_ultimo_dia?: string | null
          premium?: boolean
          secoes_completas?: Json
          unidade_atual?: number
          updated_at?: string
          user_id: string
          vidas?: number
          vidas_recarga_em?: string | null
          xp?: number
        }
        Update: {
          baus?: Json
          chamas_congeladas?: number
          created_at?: string
          curiosidades_lidas?: Json
          diamantes?: number
          fragmentos?: number
          ofensiva?: number
          ofensiva_hoje?: boolean
          ofensiva_ultimo_dia?: string | null
          premium?: boolean
          secoes_completas?: Json
          unidade_atual?: number
          updated_at?: string
          user_id?: string
          vidas?: number
          vidas_recarga_em?: string | null
          xp?: number
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          ativo: boolean
          auth: string
          created_at: string
          endpoint: string
          hora_local: number
          id: string
          p256dh: string
          tz: string
          ultima_notificacao_em: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ativo?: boolean
          auth: string
          created_at?: string
          endpoint: string
          hora_local?: number
          id?: string
          p256dh: string
          tz?: string
          ultima_notificacao_em?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ativo?: boolean
          auth?: string
          created_at?: string
          endpoint?: string
          hora_local?: number
          id?: string
          p256dh?: string
          tz?: string
          ultima_notificacao_em?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      suppressed_emails: {
        Row: {
          created_at: string
          email: string
          id: string
          metadata: Json | null
          reason: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          metadata?: Json | null
          reason: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          metadata?: Json | null
          reason?: string
        }
        Relationships: []
      }
      tts_log: {
        Row: {
          chars: number
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          chars: number
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          chars?: number
          created_at?: string
          id?: string
          user_id?: string | null
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
          cefr: string | null
          created_at: string
          feito: boolean
          percentagem: number
          pontos_fortes: Json
          pontos_fracos: Json
          respostas: Json
          trilha_sugerida: Json
          unidade_sugerida: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ancião?: string | null
          cefr?: string | null
          created_at?: string
          feito?: boolean
          percentagem?: number
          pontos_fortes?: Json
          pontos_fracos?: Json
          respostas?: Json
          trilha_sugerida?: Json
          unidade_sugerida?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ancião?: string | null
          cefr?: string | null
          created_at?: string
          feito?: boolean
          percentagem?: number
          pontos_fortes?: Json
          pontos_fracos?: Json
          respostas?: Json
          trilha_sugerida?: Json
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
          idioma_app: string
          musica: boolean
          notificacoes: boolean
          reduzir_movimento: boolean
          som: boolean
          tema: string
          updated_at: string
          user_id: string
          vibracao: boolean
          voz_chat_ligada: boolean
        }
        Insert: {
          alto_contraste?: boolean
          created_at?: string
          extras?: Json
          fonte?: string
          idioma_app?: string
          musica?: boolean
          notificacoes?: boolean
          reduzir_movimento?: boolean
          som?: boolean
          tema?: string
          updated_at?: string
          user_id: string
          vibracao?: boolean
          voz_chat_ligada?: boolean
        }
        Update: {
          alto_contraste?: boolean
          created_at?: string
          extras?: Json
          fonte?: string
          idioma_app?: string
          musica?: boolean
          notificacoes?: boolean
          reduzir_movimento?: boolean
          som?: boolean
          tema?: string
          updated_at?: string
          user_id?: string
          vibracao?: boolean
          voz_chat_ligada?: boolean
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
      public_ranking: {
        Row: {
          avatar_url: string | null
          nome: string | null
          ofensiva: number | null
          user_id: string | null
          xp: number | null
        }
        Relationships: []
      }
      public_streaks: {
        Row: {
          avatar_url: string | null
          chamas_congeladas: number | null
          nome: string | null
          ofensiva: number | null
          ofensiva_hoje: boolean | null
          user_id: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      _ensure_progresso_row: { Args: { _uid: string }; Returns: undefined }
      abrir_bau: { Args: { _tipo: string }; Returns: Json }
      aceitar_pedido_amizade: {
        Args: { _id: string }
        Returns: {
          addressee_id: string
          created_at: string
          id: string
          requester_id: string
          status: Database["public"]["Enums"]["friendship_status"]
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "friendships"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      adicionar_bau: { Args: { _qtd?: number; _tipo: string }; Returns: Json }
      adicionar_chama_congelada: { Args: { _qtd?: number }; Returns: number }
      aplicar_ofensiva_diaria: {
        Args: never
        Returns: {
          chamas_congeladas: number
          incrementou: boolean
          ofensiva: number
          ofensiva_hoje: boolean
          quebrada: boolean
        }[]
      }
      aplicar_recompensa: {
        Args: { _diamantes?: number; _fragmentos?: number; _xp?: number }
        Returns: {
          diamantes: number
          fragmentos: number
          xp: number
        }[]
      }
      contar_amizades: {
        Args: { _uid: string }
        Returns: {
          seguidores: number
          seguindo: number
        }[]
      }
      delete_email: {
        Args: { message_id: number; queue_name: string }
        Returns: boolean
      }
      email_queue_dispatch: { Args: never; Returns: undefined }
      enqueue_email: {
        Args: { payload: Json; queue_name: string }
        Returns: number
      }
      enviar_pedido_amizade: {
        Args: { _alvo: string }
        Returns: {
          addressee_id: string
          created_at: string
          id: string
          requester_id: string
          status: Database["public"]["Enums"]["friendship_status"]
          updated_at: string
        }
        SetofOptions: {
          from: "*"
          to: "friendships"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      get_public_profiles: {
        Args: { _ids: string[] }
        Returns: {
          avatar_url: string
          id: string
          nome: string
          pais: string
          provincia: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      hidratar_recursos: {
        Args: never
        Returns: {
          chama_acesa: boolean
          chamas_congeladas: number
          ofensiva: number
          ofensiva_hoje: boolean
          vidas: number
          vidas_recarga_em: string
        }[]
      }
      listar_amigos: {
        Args: { _uid: string }
        Returns: {
          avatar_url: string
          id: string
          nome: string
          xp: number
        }[]
      }
      move_to_dlq: {
        Args: {
          dlq_name: string
          message_id: number
          payload: Json
          source_queue: string
        }
        Returns: number
      }
      perder_vida_progresso: {
        Args: never
        Returns: {
          vidas: number
          vidas_recarga_em: string
        }[]
      }
      read_email_batch: {
        Args: { batch_size: number; queue_name: string; vt: number }
        Returns: {
          message: Json
          msg_id: number
          read_ct: number
        }[]
      }
      registar_curiosidade_lida: { Args: { _id: string }; Returns: Json }
      resgatar_conquista: {
        Args: { _diamantes?: number; _id: string; _xp?: number }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "user"
      community_status: "pending" | "approved" | "rejected"
      friendship_status: "pending" | "accepted" | "blocked"
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
      community_status: ["pending", "approved", "rejected"],
      friendship_status: ["pending", "accepted", "blocked"],
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
