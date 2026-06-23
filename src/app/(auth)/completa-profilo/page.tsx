import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import CompletaProfiloForm from './CompletaProfiloForm'

export const metadata: Metadata = { title: 'Completa il profilo' }
export const dynamic = 'force-dynamic'

export default async function CompletaProfiloPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Se ha già impostato la password, salta lo step
  if (user.user_metadata?.password_set) redirect('/dashboard')

  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single<{ username: string }>()

  return (
    <main className="min-h-dvh bg-ink flex items-center justify-center px-4 py-16">
      <div className="pointer-events-none fixed right-0 top-0 w-[600px] h-[600px] opacity-10" aria-hidden>
        <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="500" cy="100" r="280" stroke="#D4603A" strokeWidth="1.5" />
          <circle cx="500" cy="100" r="200" stroke="#D4603A" strokeWidth="1" opacity="0.5" />
          <circle cx="500" cy="100" r="12" fill="#D4603A" />
          <circle cx="300" cy="100" r="7" fill="#D4603A" />
        </svg>
      </div>

      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="font-serif text-2xl text-canvas tracking-tight">Quasi fatto!</span>
          <p className="mt-1 text-sm text-canvas/50">
            Scegli username e password per finire la registrazione.
          </p>
        </div>

        <CompletaProfiloForm initialUsername={profile?.username ?? ''} />
      </div>
    </main>
  )
}
