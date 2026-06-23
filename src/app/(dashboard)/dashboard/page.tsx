import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import type { Block, Page } from '@/types/database'
import Editor from '@/components/editor/Editor'

export const metadata: Metadata = { title: 'Dashboard' }
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Nuovo flusso: chi si registra via magic link deve prima impostare la password.
  // Il flag vive in user_metadata (nessuna colonna DB necessaria).
  if (!user.user_metadata?.password_set) redirect('/completa-profilo')

  const { data: profile } = await supabase
    .from('profiles')
    .select('username, display_name, plan')
    .eq('id', user.id)
    .single<{ username: string; display_name: string | null; plan: string }>()

  const { data: page } = await supabase
    .from('pages')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: true })
    .limit(1)
    .single<Page>()

  // Fallback: se per qualche motivo la pagina non esiste, creala
  let resolvedPage = page
  if (!resolvedPage && profile) {
    const { data: created } = await supabase
      .from('pages')
      .insert({ owner_id: user.id, slug: profile.username, title: '', is_published: false })
      .select('*')
      .single<Page>()
    resolvedPage = created ?? null
  }

  if (!resolvedPage) {
    return (
      <main className="min-h-dvh bg-canvas grid place-items-center px-4">
        <p className="text-grigio">Errore nel caricamento della pagina. Ricarica.</p>
      </main>
    )
  }

  const { data: blocks } = await supabase
    .from('blocks')
    .select('*')
    .eq('page_id', resolvedPage.id)
    .order('position', { ascending: true })
    .returns<Block[]>()

  return (
    <Editor
      ownerId={user.id}
      username={profile?.username ?? resolvedPage.slug}
      plan={profile?.plan ?? 'free'}
      page={resolvedPage}
      initialBlocks={blocks ?? []}
    />
  )
}
