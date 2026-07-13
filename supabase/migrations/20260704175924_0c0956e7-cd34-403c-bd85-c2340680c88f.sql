ALTER TABLE public.feedback_log
  ADD COLUMN mensagem text NOT NULL DEFAULT '',
  ADD COLUMN email_autor text;