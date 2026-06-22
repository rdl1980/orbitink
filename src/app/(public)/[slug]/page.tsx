import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Metadata } from 'next'
import type { Block, Page } from '@/types/database'
import PublicPageShell from '@/components/public/PublicPageShell'
import BlockRenderer from '@/components/public/BlockRenderer'

export const revalidate = 60

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: page } = await supabase
    .from('pages')
    .select('title, seo_title, seo_description, og_image_url, avatar_url')
    .eq('slug', slug)
    .eq('is_published', true)
    .single<{
      title: string
      seo_title: string | null
      seo_description: string | null
      og_image_url: string | null
      avatar_url: string | null
    }>()

  if (!page) return { title: 'Pagina non trovata' }

  return {
    title: page.seo_title || page.title || slug,
    description: page.seo_description ?? undefined,
    openGraph: {
      images: page.og_image_url ? [page.og_image_url] : page.avatar_url ? [page.avatar_url] : [],
    },
  }
}

export default async function PublicPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: page } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single<Page>()

  if (!page) notFound()

  const { data: blocks } = await supabase
    .from('blocks')
    .select('*')
    .eq('page_id', page.id)
    .eq('is_active', true)
    .order('position', { ascending: true })
    .returns<Block[]>()

  // Registra page_view (fire-and-forget, non blocca il render)
  void fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/analytics/event`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ page_id: page.id, event_type: 'page_view' }),
  }).catch(() => {})

  return (
    <PublicPageShell page={page as Page}>
      {(blocks ?? []).map((block) => (
        <BlockRenderer key={block.id} block={block as Block} />
      ))}
    </PublicPageShell>
  )
}
