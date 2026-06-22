import { createBrowserClient } from '@supabase/ssr'

// NB: client non tipizzato con Database — i tipi a mano confliggono coi generics
// di supabase-js v2. Tipizziamo ai call-site con .single<T>() / .returns<T>().
// TODO: rigenerare i tipi con `supabase gen types typescript` e reintrodurre il generic.
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
