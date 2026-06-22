-- OrbitInk — Schema iniziale MVP
-- Eseguire su Supabase SQL Editor (progetto EU Frankfurt)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- PROFILES (estende auth.users)
-- ============================================================
CREATE TABLE public.profiles (
  id                    UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username              TEXT UNIQUE NOT NULL CHECK (username ~ '^[a-z0-9_\-]{3,30}$'),
  display_name          TEXT,
  email                 TEXT NOT NULL,
  avatar_url            TEXT,
  plan                  TEXT NOT NULL DEFAULT 'free'
                        CHECK (plan IN ('free','starter','pro','agency')),
  locale                TEXT NOT NULL DEFAULT 'it',
  timezone              TEXT NOT NULL DEFAULT 'Europe/Rome',
  gdpr_consented_at     TIMESTAMPTZ,
  gdpr_consent_version  TEXT DEFAULT '1.0',
  marketing_consent     BOOLEAN DEFAULT FALSE,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at            TIMESTAMPTZ
);

CREATE INDEX idx_profiles_username ON public.profiles(username);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "users read own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Impedisce auto-upgrade del piano dall'utente
CREATE POLICY "no self plan upgrade"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (plan = (SELECT plan FROM public.profiles WHERE id = auth.uid()));

-- Lookup pubblico per username (serve per la pagina pubblica)
CREATE POLICY "public username lookup"
  ON public.profiles FOR SELECT USING (deleted_at IS NULL);

-- ============================================================
-- PAGES
-- ============================================================
CREATE TABLE public.pages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  slug            TEXT UNIQUE NOT NULL CHECK (slug ~ '^[a-z0-9_\-]{2,60}$'),
  title           TEXT NOT NULL DEFAULT '',
  bio             TEXT DEFAULT '',
  avatar_url      TEXT,
  cover_url       TEXT,
  theme           JSONB NOT NULL DEFAULT '{}',
  is_published    BOOLEAN NOT NULL DEFAULT FALSE,
  seo_title       TEXT,
  seo_description TEXT,
  og_image_url    TEXT,
  view_count      BIGINT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_pages_owner ON public.pages(owner_id);
CREATE INDEX idx_pages_slug ON public.pages(slug);

ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner full access on pages"
  ON public.pages FOR ALL
  USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "public read published pages"
  ON public.pages FOR SELECT USING (is_published = TRUE);

-- ============================================================
-- BLOCKS
-- ============================================================
CREATE TYPE block_type AS ENUM (
  'link', 'whatsapp', 'satispay', 'paypal', 'social_icons',
  'qr_code', 'embed_youtube', 'embed_spotify', 'text_header',
  'image_banner', 'contact_form', 'email_capture', 'divider',
  'countdown', 'menu_pdf'
);

CREATE TABLE public.blocks (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_id         UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  owner_id        UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type            block_type NOT NULL,
  position        SMALLINT NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT TRUE,
  data            JSONB NOT NULL DEFAULT '{}',
  scheduled_from  TIMESTAMPTZ,
  scheduled_to    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_blocks_page ON public.blocks(page_id, position);
CREATE INDEX idx_blocks_owner ON public.blocks(owner_id);

ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "owner full access on blocks"
  ON public.blocks FOR ALL
  USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- Block insert: owner deve possedere anche la page target
CREATE POLICY "block owner matches page owner"
  ON public.blocks FOR INSERT
  WITH CHECK (
    auth.uid() = owner_id
    AND EXISTS (
      SELECT 1 FROM public.pages WHERE id = page_id AND owner_id = auth.uid()
    )
  );

-- Pubblico: blocchi attivi su pagine pubblicate
CREATE POLICY "public read active blocks on published pages"
  ON public.blocks FOR SELECT
  USING (
    is_active = TRUE
    AND EXISTS (
      SELECT 1 FROM public.pages p WHERE p.id = page_id AND p.is_published = TRUE
    )
  );

-- ============================================================
-- ANALYTICS EVENTS (no PII — GDPR by design)
-- ============================================================
CREATE TABLE public.analytics_events (
  id              BIGSERIAL PRIMARY KEY,
  page_id         UUID NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  block_id        UUID REFERENCES public.blocks(id) ON DELETE SET NULL,
  event_type      TEXT NOT NULL CHECK (event_type IN ('page_view','block_click','page_share')),
  visitor_hash    TEXT,       -- SHA-256(ip||ua||date||salt), rotazione giornaliera
  referrer_domain TEXT,       -- solo hostname, mai il path
  country_code    CHAR(2),    -- da header Cloudflare CF-IPCountry, IP scartato
  device_type     TEXT CHECK (device_type IN ('mobile','tablet','desktop')),
  utm_source      TEXT,
  utm_medium      TEXT,
  utm_campaign    TEXT,
  occurred_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_analytics_page_time ON public.analytics_events(page_id, occurred_at DESC);
CREATE INDEX idx_analytics_block ON public.analytics_events(block_id);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

-- Owner legge i propri analytics
CREATE POLICY "owner read own analytics"
  ON public.analytics_events FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.pages p WHERE p.id = page_id AND p.owner_id = auth.uid())
  );

-- Insert solo via service role (API route) — nessun insert client-side
CREATE POLICY "service role insert analytics"
  ON public.analytics_events FOR INSERT WITH CHECK (TRUE);

-- ============================================================
-- SUBSCRIPTIONS (mutato solo da webhook via service-role)
-- ============================================================
CREATE TABLE public.subscriptions (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id              UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  provider              TEXT NOT NULL CHECK (provider IN ('stripe','satispay','manual')),
  provider_customer_id  TEXT,
  provider_sub_id       TEXT UNIQUE,
  plan                  TEXT NOT NULL,
  status                TEXT NOT NULL
                        CHECK (status IN ('active','past_due','canceled','trialing','incomplete')),
  current_period_start  TIMESTAMPTZ,
  current_period_end    TIMESTAMPTZ,
  cancel_at_period_end  BOOLEAN DEFAULT FALSE,
  trial_end             TIMESTAMPTZ,
  metadata              JSONB DEFAULT '{}',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_subscriptions_owner ON public.subscriptions(owner_id);
CREATE INDEX idx_subscriptions_provider_sub ON public.subscriptions(provider_sub_id);

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Owner vede il proprio stato abbonamento
CREATE POLICY "owner read own subscription"
  ON public.subscriptions FOR SELECT USING (auth.uid() = owner_id);

-- Nessuna policy INSERT/UPDATE/DELETE per utenti autenticati
-- Tutto gestito da webhook Stripe/Satispay via service-role key

-- ============================================================
-- FUNZIONE: aggiorna updated_at automaticamente
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER pages_updated_at
  BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER blocks_updated_at
  BEFORE UPDATE ON public.blocks
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- FUNZIONE: crea profilo automaticamente al signup
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  counter INT := 0;
BEGIN
  -- Derivare username dall'email (parte prima di @)
  base_username := regexp_replace(
    lower(split_part(NEW.email, '@', 1)),
    '[^a-z0-9_]', '', 'g'
  );
  -- Garantire lunghezza minima 3
  IF length(base_username) < 3 THEN
    base_username := base_username || '000';
  END IF;
  base_username := left(base_username, 25);

  final_username := base_username;

  -- Risolvi conflitti username
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
    counter := counter + 1;
    final_username := base_username || counter::TEXT;
  END LOOP;

  INSERT INTO public.profiles (id, email, username, locale)
  VALUES (
    NEW.id,
    NEW.email,
    final_username,
    COALESCE(NEW.raw_user_meta_data->>'locale', 'it')
  );

  -- Modello "uno slug = un profilo": crea la pagina con slug = username.
  -- L'unicità è garantita: final_username è già univoco e lo slug eredita lo stesso valore.
  INSERT INTO public.pages (owner_id, slug, title, is_published)
  VALUES (
    NEW.id,
    final_username,
    '',
    FALSE
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- SYNC: slug della pagina segue lo username (modello 1 slug = 1 profilo)
-- ============================================================
CREATE OR REPLACE FUNCTION public.sync_page_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.username IS DISTINCT FROM OLD.username THEN
    UPDATE public.pages
    SET slug = NEW.username
    WHERE owner_id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_username_change
  AFTER UPDATE OF username ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.sync_page_slug();
