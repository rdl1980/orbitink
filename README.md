# OrbitInk

La piattaforma link-in-bio italiana. GDPR nativo, Satispay integrato, 0% commissioni.

> Il tuo spazio digitale. Tutto italiano.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS
- **Supabase** (auth + DB + storage) — regione EU (West EU / Ireland)
- **Vercel** — hosting & deploy automatico da `main`
- Pagamenti: Stripe + Satispay + PayPal
- Email: Resend (transazionale) + Brevo (marketing)

## Setup locale

```bash
npm install --legacy-peer-deps
cp .env.example .env.local   # poi compila i valori
npm run dev
```

## Variabili d'ambiente

Vedi `.env.example`. Su Vercel vanno impostate in **Project Settings → Environment Variables**.
Le variabili `NEXT_PUBLIC_*` sono inlined al build: vanno impostate **prima** del deploy.

## Database

Le migration SQL sono in `supabase/migrations/`. Eseguirle in ordine nello **SQL Editor** di Supabase:

1. `001_initial_schema.sql` — profiles, pages, blocks, analytics_events, subscriptions (con RLS + trigger)
2. `002_waitlist.sql` — tabella waitlist per la landing

## Architettura

- Modello **uno slug = un profilo**: `pages.slug` = `profiles.username`, creati automaticamente al signup.
- GDPR by design: dati solo su server EU, nessun IP grezzo negli analytics, cookie consent.
- Pagine pubbliche SSR con ISR (60s), zero JS per i blocchi statici.
