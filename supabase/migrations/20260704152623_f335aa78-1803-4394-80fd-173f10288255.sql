-- 1. Add streak/lives columns
ALTER TABLE public.progresso
  ADD COLUMN IF NOT EXISTS chamas_congeladas int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ofensiva_hoje boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS vidas_recarga_em timestamptz;

-- 2. Ensure a row exists for the caller (idempotent).
CREATE OR REPLACE FUNCTION public._ensure_progresso_row(_uid uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.progresso (user_id) VALUES (_uid)
    ON CONFLICT (user_id) DO NOTHING;
END;
$$;

-- 3. RPC: aplicar_ofensiva_diaria
--    Chamada quando o utilizador termina uma lição.
--    Regras (baseadas em UTC/current_date do servidor):
--      - se ofensiva_ultimo_dia = hoje → idempotente, apenas garante ofensiva_hoje=true.
--      - se ofensiva_ultimo_dia = ontem → ofensiva += 1.
--      - se saltou N ≥ 1 dias:
--          * consome min(N, chamas_congeladas) chamas; se sobrar quebra → ofensiva := 1 (hoje conta como novo início).
--          * se chamas_congeladas cobriu tudo → mantém ofensiva; += 1 se saltou N dias e agora completou hoje.
--      - actualiza ofensiva_ultimo_dia = current_date, ofensiva_hoje = true.
CREATE OR REPLACE FUNCTION public.aplicar_ofensiva_diaria()
RETURNS TABLE (
  ofensiva int,
  chamas_congeladas int,
  ofensiva_hoje boolean,
  quebrada boolean,
  incrementou boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _row public.progresso%ROWTYPE;
  _dias_saltados int;
  _quebrada boolean := false;
  _incrementou boolean := false;
  _hoje date := current_date;
BEGIN
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  PERFORM public._ensure_progresso_row(_uid);

  SELECT * INTO _row FROM public.progresso WHERE user_id = _uid FOR UPDATE;

  IF _row.ofensiva_ultimo_dia = _hoje THEN
    -- Já validou hoje — idempotente.
    UPDATE public.progresso
       SET ofensiva_hoje = true
     WHERE user_id = _uid
    RETURNING public.progresso.ofensiva,
             public.progresso.chamas_congeladas,
             public.progresso.ofensiva_hoje
      INTO ofensiva, chamas_congeladas, ofensiva_hoje;
    quebrada := false;
    incrementou := false;
    RETURN NEXT;
    RETURN;
  END IF;

  IF _row.ofensiva_ultimo_dia IS NULL THEN
    -- Primeira lição de sempre — arranca em 1.
    UPDATE public.progresso
       SET ofensiva = 1,
           ofensiva_hoje = true,
           ofensiva_ultimo_dia = _hoje
     WHERE user_id = _uid
    RETURNING public.progresso.ofensiva,
             public.progresso.chamas_congeladas,
             public.progresso.ofensiva_hoje
      INTO ofensiva, chamas_congeladas, ofensiva_hoje;
    quebrada := false;
    incrementou := true;
    RETURN NEXT;
    RETURN;
  END IF;

  _dias_saltados := (_hoje - _row.ofensiva_ultimo_dia) - 1; -- 0 se ontem.

  IF _dias_saltados <= 0 THEN
    -- Ontem → apenas incrementa.
    UPDATE public.progresso
       SET ofensiva = _row.ofensiva + 1,
           ofensiva_hoje = true,
           ofensiva_ultimo_dia = _hoje
     WHERE user_id = _uid
    RETURNING public.progresso.ofensiva,
             public.progresso.chamas_congeladas,
             public.progresso.ofensiva_hoje
      INTO ofensiva, chamas_congeladas, ofensiva_hoje;
    quebrada := false;
    incrementou := true;
    RETURN NEXT;
    RETURN;
  END IF;

  -- Saltou 1+ dias completos.
  IF _row.chamas_congeladas >= _dias_saltados THEN
    -- Chamas cobrem tudo — sequência mantida, +1 por hoje.
    UPDATE public.progresso
       SET chamas_congeladas = _row.chamas_congeladas - _dias_saltados,
           ofensiva = _row.ofensiva + 1,
           ofensiva_hoje = true,
           ofensiva_ultimo_dia = _hoje
     WHERE user_id = _uid
    RETURNING public.progresso.ofensiva,
             public.progresso.chamas_congeladas,
             public.progresso.ofensiva_hoje
      INTO ofensiva, chamas_congeladas, ofensiva_hoje;
    quebrada := false;
    incrementou := true;
    RETURN NEXT;
    RETURN;
  END IF;

  -- Chamas insuficientes → quebra; hoje inicia sequência em 1.
  UPDATE public.progresso
     SET chamas_congeladas = 0,
         ofensiva = 1,
         ofensiva_hoje = true,
         ofensiva_ultimo_dia = _hoje
   WHERE user_id = _uid
  RETURNING public.progresso.ofensiva,
           public.progresso.chamas_congeladas,
           public.progresso.ofensiva_hoje
    INTO ofensiva, chamas_congeladas, ofensiva_hoje;
  quebrada := true;
  incrementou := false;
  RETURN NEXT;
END;
$$;

GRANT EXECUTE ON FUNCTION public.aplicar_ofensiva_diaria() TO authenticated;

-- 4. RPC: hidratar_recursos
--    Chamada na abertura da app. Avalia se a chama deve estar apagada hoje
--    (ofensiva_ultimo_dia < hoje) e se as vidas devem recarregar.
CREATE OR REPLACE FUNCTION public.hidratar_recursos()
RETURNS TABLE (
  ofensiva int,
  chamas_congeladas int,
  ofensiva_hoje boolean,
  chama_acesa boolean,
  vidas int,
  vidas_recarga_em timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _row public.progresso%ROWTYPE;
  _hoje date := current_date;
  _now timestamptz := now();
BEGIN
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'not_authenticated';
  END IF;

  PERFORM public._ensure_progresso_row(_uid);

  SELECT * INTO _row FROM public.progresso WHERE user_id = _uid FOR UPDATE;

  -- Reset "ofensiva_hoje" se o dia mudou.
  IF _row.ofensiva_ultimo_dia IS DISTINCT FROM _hoje AND _row.ofensiva_hoje THEN
    UPDATE public.progresso SET ofensiva_hoje = false WHERE user_id = _uid;
    _row.ofensiva_hoje := false;
  END IF;

  -- Recarga automática das vidas.
  IF _row.vidas < 5 AND _row.vidas_recarga_em IS NOT NULL AND _row.vidas_recarga_em <= _now THEN
    UPDATE public.progresso
       SET vidas = 5,
           vidas_recarga_em = NULL
     WHERE user_id = _uid;
    _row.vidas := 5;
    _row.vidas_recarga_em := NULL;
  END IF;

  ofensiva := _row.ofensiva;
  chamas_congeladas := _row.chamas_congeladas;
  ofensiva_hoje := _row.ofensiva_hoje;
  chama_acesa := (_row.ofensiva > 0 AND _row.ofensiva_hoje);
  vidas := _row.vidas;
  vidas_recarga_em := _row.vidas_recarga_em;
  RETURN NEXT;
END;
$$;

GRANT EXECUTE ON FUNCTION public.hidratar_recursos() TO authenticated;

-- 5. RPC utilitária: comprar_chama_congelada (chamada pela Loja após débito de diamantes).
CREATE OR REPLACE FUNCTION public.adicionar_chama_congelada(_qtd int DEFAULT 1)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _novo int;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  IF _qtd <= 0 THEN RAISE EXCEPTION 'invalid_qty'; END IF;
  PERFORM public._ensure_progresso_row(_uid);
  UPDATE public.progresso
     SET chamas_congeladas = chamas_congeladas + _qtd
   WHERE user_id = _uid
  RETURNING chamas_congeladas INTO _novo;
  RETURN _novo;
END;
$$;

GRANT EXECUTE ON FUNCTION public.adicionar_chama_congelada(int) TO authenticated;

-- 6. RPC: perder_vida — consome vidas_extra primeiro (não persistido aqui pois vidas_extra
--    ainda vive em kwendi_saldo_v1; esta função só toca em vidas normais). Devolve novo total.
CREATE OR REPLACE FUNCTION public.perder_vida_progresso()
RETURNS TABLE (vidas int, vidas_recarga_em timestamptz)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _uid uuid := auth.uid();
  _row public.progresso%ROWTYPE;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  PERFORM public._ensure_progresso_row(_uid);
  SELECT * INTO _row FROM public.progresso WHERE user_id = _uid FOR UPDATE;
  IF _row.vidas <= 0 THEN
    vidas := 0;
    vidas_recarga_em := _row.vidas_recarga_em;
    RETURN NEXT;
    RETURN;
  END IF;
  UPDATE public.progresso
     SET vidas = _row.vidas - 1,
         vidas_recarga_em = CASE
           WHEN _row.vidas - 1 < 5 AND _row.vidas_recarga_em IS NULL
             THEN now() + interval '4 hours'
           ELSE _row.vidas_recarga_em
         END
   WHERE user_id = _uid
  RETURNING public.progresso.vidas, public.progresso.vidas_recarga_em INTO vidas, vidas_recarga_em;
  RETURN NEXT;
END;
$$;

GRANT EXECUTE ON FUNCTION public.perder_vida_progresso() TO authenticated;