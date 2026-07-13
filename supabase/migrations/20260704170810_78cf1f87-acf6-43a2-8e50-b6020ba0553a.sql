
ALTER TABLE public.progresso
  ADD COLUMN IF NOT EXISTS fragmentos int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS baus jsonb NOT NULL DEFAULT '{"comum":0,"raro":0,"lendario":0}'::jsonb,
  ADD COLUMN IF NOT EXISTS curiosidades_lidas jsonb NOT NULL DEFAULT '[]'::jsonb;

CREATE OR REPLACE FUNCTION public.aplicar_recompensa(_xp int DEFAULT 0, _diamantes int DEFAULT 0, _fragmentos int DEFAULT 0)
RETURNS TABLE (xp int, diamantes int, fragmentos int)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE _uid uuid := auth.uid();
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  PERFORM public._ensure_progresso_row(_uid);
  UPDATE public.progresso
     SET xp = GREATEST(0, xp + COALESCE(_xp,0)),
         diamantes = GREATEST(0, diamantes + COALESCE(_diamantes,0)),
         fragmentos = GREATEST(0, fragmentos + COALESCE(_fragmentos,0))
   WHERE user_id = _uid
  RETURNING public.progresso.xp, public.progresso.diamantes, public.progresso.fragmentos INTO xp, diamantes, fragmentos;
  RETURN NEXT;
END;
$$;

CREATE OR REPLACE FUNCTION public.registar_curiosidade_lida(_id text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE _uid uuid := auth.uid(); _lidas jsonb;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  IF _id IS NULL OR length(_id) = 0 THEN RAISE EXCEPTION 'invalid_id'; END IF;
  PERFORM public._ensure_progresso_row(_uid);
  UPDATE public.progresso
     SET curiosidades_lidas = CASE
       WHEN curiosidades_lidas @> to_jsonb(_id) THEN curiosidades_lidas
       ELSE curiosidades_lidas || to_jsonb(_id)
     END
   WHERE user_id = _uid
  RETURNING curiosidades_lidas INTO _lidas;
  RETURN _lidas;
END;
$$;

CREATE OR REPLACE FUNCTION public.abrir_bau(_tipo text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE _uid uuid := auth.uid(); _baus jsonb; _actual int;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  IF _tipo NOT IN ('comum','raro','lendario') THEN RAISE EXCEPTION 'invalid_type'; END IF;
  PERFORM public._ensure_progresso_row(_uid);
  SELECT baus INTO _baus FROM public.progresso WHERE user_id = _uid FOR UPDATE;
  _actual := COALESCE((_baus->>_tipo)::int, 0);
  IF _actual <= 0 THEN RAISE EXCEPTION 'no_chest'; END IF;
  UPDATE public.progresso
     SET baus = jsonb_set(baus, ARRAY[_tipo], to_jsonb(_actual - 1), false)
   WHERE user_id = _uid
  RETURNING baus INTO _baus;
  RETURN _baus;
END;
$$;

CREATE OR REPLACE FUNCTION public.adicionar_bau(_tipo text, _qtd int DEFAULT 1)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE _uid uuid := auth.uid(); _baus jsonb; _actual int;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'not_authenticated'; END IF;
  IF _tipo NOT IN ('comum','raro','lendario') THEN RAISE EXCEPTION 'invalid_type'; END IF;
  IF _qtd <= 0 THEN RAISE EXCEPTION 'invalid_qty'; END IF;
  PERFORM public._ensure_progresso_row(_uid);
  SELECT baus INTO _baus FROM public.progresso WHERE user_id = _uid FOR UPDATE;
  _actual := COALESCE((_baus->>_tipo)::int, 0);
  UPDATE public.progresso
     SET baus = jsonb_set(baus, ARRAY[_tipo], to_jsonb(_actual + _qtd), true)
   WHERE user_id = _uid
  RETURNING baus INTO _baus;
  RETURN _baus;
END;
$$;
