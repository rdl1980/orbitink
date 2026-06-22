-- OrbitInk — Tabella waitlist per la landing page (GitHub Pages)
-- Permette insert anonimi dal client (anon key), nessuna lettura pubblica.

CREATE TABLE public.waitlist (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL CHECK (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  source      TEXT DEFAULT 'landing',
  locale      TEXT DEFAULT 'it',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Chiunque (anche anonimo con anon key) può iscriversi
CREATE POLICY "anyone can join waitlist"
  ON public.waitlist FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Nessuna policy SELECT pubblica: solo service-role / dashboard può leggere gli iscritti.
-- Questo evita che la lista email sia esposta via anon key.
