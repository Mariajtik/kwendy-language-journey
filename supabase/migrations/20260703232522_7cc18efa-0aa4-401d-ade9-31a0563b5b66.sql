-- Block anonymous auth sessions from accessing user-facing tables
DROP POLICY IF EXISTS "eventos self insert" ON public.eventos;
CREATE POLICY "eventos self insert"
ON public.eventos
FOR INSERT
TO authenticated
WITH CHECK (
  coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  AND (user_id = auth.uid())
);

DROP POLICY IF EXISTS "eventos self select" ON public.eventos;
CREATE POLICY "eventos self select"
ON public.eventos
FOR SELECT
TO authenticated
USING (
  coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  AND (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role))
);

DROP POLICY IF EXISTS "profiles admin update" ON public.profiles;
CREATE POLICY "profiles admin update"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  AND public.has_role(auth.uid(), 'admin'::app_role)
);

DROP POLICY IF EXISTS "profiles self insert" ON public.profiles;
CREATE POLICY "profiles self insert"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (
  coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  AND (auth.uid() = id)
);

DROP POLICY IF EXISTS "profiles self select" ON public.profiles;
CREATE POLICY "profiles self select"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  AND (auth.uid() = id OR public.has_role(auth.uid(), 'admin'::app_role))
);

DROP POLICY IF EXISTS "profiles self update" ON public.profiles;
CREATE POLICY "profiles self update"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  AND (auth.uid() = id)
)
WITH CHECK (
  coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  AND (auth.uid() = id)
);

DROP POLICY IF EXISTS "progresso self select" ON public.progresso;
CREATE POLICY "progresso self select"
ON public.progresso
FOR SELECT
TO authenticated
USING (
  coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  AND (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role))
);

DROP POLICY IF EXISTS "progresso self update" ON public.progresso;
CREATE POLICY "progresso self update"
ON public.progresso
FOR UPDATE
TO authenticated
USING (
  coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  AND (user_id = auth.uid())
)
WITH CHECK (
  coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  AND (user_id = auth.uid())
);

DROP POLICY IF EXISTS "progresso self upsert" ON public.progresso;
CREATE POLICY "progresso self upsert"
ON public.progresso
FOR INSERT
TO authenticated
WITH CHECK (
  coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  AND (user_id = auth.uid())
);

DROP POLICY IF EXISTS "sessoes self insert" ON public.sessoes;
CREATE POLICY "sessoes self insert"
ON public.sessoes
FOR INSERT
TO authenticated
WITH CHECK (
  coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  AND (user_id = auth.uid())
);

DROP POLICY IF EXISTS "sessoes self select" ON public.sessoes;
CREATE POLICY "sessoes self select"
ON public.sessoes
FOR SELECT
TO authenticated
USING (
  coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  AND (user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'::app_role))
);

DROP POLICY IF EXISTS "sessoes self update" ON public.sessoes;
CREATE POLICY "sessoes self update"
ON public.sessoes
FOR UPDATE
TO authenticated
USING (
  coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  AND (user_id = auth.uid())
)
WITH CHECK (
  coalesce((auth.jwt() ->> 'is_anonymous')::boolean, false) = false
  AND (user_id = auth.uid())
);