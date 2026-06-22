import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, display_name, plan')
    .eq('id', user.id)
    .single<{ username: string; display_name: string | null; plan: string }>()

  return (
    <main className="min-h-dvh bg-canvas px-4 py-12 max-w-public-page mx-auto">
      <header className="mb-8">
        <h1 className="font-serif text-3xl text-ink">
          Ciao{profile?.display_name ? `, ${profile.display_name}` : ''}
        </h1>
        <p className="text-grigio text-sm mt-1">
          orbitink.it/<strong className="text-cuoio">{profile?.username}</strong>
          {' · '}
          <span className="capitalize">{profile?.plan ?? 'free'}</span>
        </p>
      </header>

      {/* Placeholder — editor blocchi in costruzione */}
      <div className="rounded-card border border-sabbia bg-avorio p-8 text-center">
        <p className="font-serif text-xl text-ink mb-2">Editor in arrivo</p>
        <p className="text-grigio text-sm">
          Il costruttore di pagine è in sviluppo. Torna presto.
        </p>
      </div>
    </main>
  )
}
