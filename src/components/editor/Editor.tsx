'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { createClient } from '@/lib/supabase/client'
import type { Block, BlockType, Page, PageTheme } from '@/types/database'
import { EDITOR_BLOCKS, type BlockPickerItem } from '@/lib/blocks'
import SortableBlock from './SortableBlock'
import AppearancePanel from './AppearancePanel'

interface Props {
  ownerId: string
  username: string
  plan: string
  page: Page
  initialBlocks: Block[]
}

type EditableBlock = {
  id: string
  type: BlockType
  is_active: boolean
  data: Record<string, unknown>
}

function uid(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.floor(Math.random() * 16))
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export default function Editor({ ownerId, username, plan, page, initialBlocks }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState(page.title ?? '')
  const [bio, setBio] = useState(page.bio ?? '')
  const [avatarUrl, setAvatarUrl] = useState(page.avatar_url ?? '')
  const [isPublished, setIsPublished] = useState(page.is_published)
  const [theme, setTheme] = useState<PageTheme>(page.theme ?? {})
  const [blocks, setBlocks] = useState<EditableBlock[]>(
    initialBlocks.map((b) => ({
      id: b.id,
      type: b.type,
      is_active: b.is_active,
      data: (b.data as Record<string, unknown>) ?? {},
    }))
  )
  const [deletedIds, setDeletedIds] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ text: string; kind: 'ok' | 'err' } | null>(null)
  const [showAdd, setShowAdd] = useState(false)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const addBlock = useCallback((item: BlockPickerItem) => {
    setBlocks((prev) => [
      ...prev,
      { id: uid(), type: item.type, is_active: true, data: { ...item.defaultData } },
    ])
    setShowAdd(false)
  }, [])

  const updateBlockData = useCallback((id: string, data: Record<string, unknown>) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, data } : b)))
  }, [])

  const toggleBlockActive = useCallback((id: string) => {
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, is_active: !b.is_active } : b)))
  }, [])

  const removeBlock = useCallback((id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id))
    setDeletedIds((prev) => [...prev, id])
  }, [])

  function onDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setBlocks((prev) => {
      const oldIndex = prev.findIndex((b) => b.id === active.id)
      const newIndex = prev.findIndex((b) => b.id === over.id)
      return arrayMove(prev, oldIndex, newIndex)
    })
  }

  async function save(publishOverride?: boolean) {
    setSaving(true)
    setMsg(null)
    const publish = publishOverride ?? isPublished
    try {
      const { error: pageErr } = await supabase
        .from('pages')
        .update({
          title: title.trim(),
          bio: bio.trim(),
          avatar_url: avatarUrl.trim() || null,
          theme,
          is_published: publish,
        })
        .eq('id', page.id)
      if (pageErr) throw pageErr

      if (deletedIds.length) {
        const { error: delErr } = await supabase.from('blocks').delete().in('id', deletedIds)
        if (delErr) throw delErr
        setDeletedIds([])
      }

      if (blocks.length) {
        const rows = blocks.map((b, i) => ({
          id: b.id,
          page_id: page.id,
          owner_id: ownerId,
          type: b.type,
          position: i,
          is_active: b.is_active,
          data: b.data,
        }))
        const { error: upErr } = await supabase.from('blocks').upsert(rows)
        if (upErr) throw upErr
      }

      setIsPublished(publish)
      setMsg({ text: publish ? 'Salvato e pubblicato!' : 'Modifiche salvate.', kind: 'ok' })
      router.refresh()
    } catch {
      setMsg({ text: 'Errore durante il salvataggio. Riprova.', kind: 'err' })
    } finally {
      setSaving(false)
    }
  }

  async function logout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const publicUrl = `/${username}`

  return (
    <div className="min-h-dvh bg-canvas">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-sabbia bg-canvas/90 backdrop-blur">
        <div className="mx-auto max-w-3xl px-4 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-serif text-lg text-ink">OrbitInk</span>
            <span className="text-grigio text-sm truncate hidden sm:block">
              orbitink.it/<strong className="text-cuoio">{username}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={publicUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-cuoio hover:text-ink px-3 py-2 rounded-block hover:bg-avorio transition-colors"
            >
              Anteprima
            </a>
            <button
              onClick={logout}
              className="text-sm text-grigio hover:text-ink px-3 py-2 rounded-block hover:bg-avorio transition-colors"
            >
              Esci
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 pb-32">
        {/* Stato pubblicazione */}
        <div className="mb-6 flex items-center justify-between rounded-card border border-sabbia bg-avorio px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <span className={`inline-block h-2 w-2 rounded-full ${isPublished ? 'bg-success' : 'bg-grigio'}`} />
            <span className="text-cuoio">
              {isPublished ? 'Pagina pubblica' : 'Bozza (non visibile)'}
            </span>
          </div>
          <span className="text-xs text-grigio capitalize">Piano {plan}</span>
        </div>

        {/* Header pagina */}
        <section className="mb-8 rounded-card border border-sabbia bg-white p-5">
          <h2 className="font-serif text-xl text-ink mb-4">La tua intestazione</h2>
          <label className="block text-xs font-semibold text-grigio uppercase tracking-wide mb-1">Nome / Titolo</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Es. Pizzeria Mario"
            className="w-full h-11 rounded-block border border-sabbia bg-canvas px-3 text-sm mb-4 focus:border-ink focus:outline-none"
          />
          <label className="block text-xs font-semibold text-grigio uppercase tracking-wide mb-1">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Una frase che ti descrive"
            rows={2}
            className="w-full rounded-block border border-sabbia bg-canvas px-3 py-2 text-sm mb-4 focus:border-ink focus:outline-none resize-none"
          />
          <label className="block text-xs font-semibold text-grigio uppercase tracking-wide mb-1">URL avatar (opzionale)</label>
          <input
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://…/foto.jpg"
            className="w-full h-11 rounded-block border border-sabbia bg-canvas px-3 text-sm focus:border-ink focus:outline-none"
          />
        </section>

        {/* Aspetto / tema */}
        <AppearancePanel theme={theme} onChange={setTheme} />

        {/* Blocchi */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-xl text-ink">I tuoi blocchi</h2>
            <button
              onClick={() => setShowAdd((s) => !s)}
              className="text-sm font-medium bg-ink text-canvas rounded-block px-3 py-2 hover:bg-terracotta transition-colors"
            >
              + Aggiungi blocco
            </button>
          </div>

          {showAdd && (
            <div className="mb-4 grid grid-cols-2 sm:grid-cols-3 gap-2 rounded-card border border-sabbia bg-avorio p-3">
              {EDITOR_BLOCKS.map((b) => (
                <button
                  key={b.key}
                  onClick={() => addBlock(b)}
                  className="text-left rounded-block border border-sabbia bg-white px-3 py-2 hover:border-ink transition-colors"
                >
                  <div className="text-sm font-medium text-ink">{b.label}</div>
                  <div className="text-xs text-grigio">{b.description}</div>
                </button>
              ))}
            </div>
          )}

          {blocks.length === 0 ? (
            <div className="rounded-card border border-dashed border-sabbia bg-avorio/50 p-8 text-center">
              <p className="text-grigio text-sm">Nessun blocco ancora. Aggiungi il primo!</p>
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
              <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                <div className="flex flex-col gap-3">
                  {blocks.map((b) => (
                    <SortableBlock
                      key={b.id}
                      id={b.id}
                      type={b.type}
                      data={b.data}
                      isActive={b.is_active}
                      onChange={(data) => updateBlockData(b.id, data)}
                      onToggleActive={() => toggleBlockActive(b.id)}
                      onRemove={() => removeBlock(b.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </section>
      </main>

      {/* Barra salvataggio fissa */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-sabbia bg-canvas/95 backdrop-blur">
        <div className="mx-auto max-w-2xl px-4 py-3 flex items-center gap-3">
          {msg && (
            <span className={`text-sm ${msg.kind === 'ok' ? 'text-success' : 'text-error'}`}>
              {msg.text}
            </span>
          )}
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => save(false)}
              disabled={saving}
              className="text-sm font-medium border border-ink text-ink rounded-block px-4 py-2 hover:bg-avorio transition-colors disabled:opacity-40"
            >
              {saving ? 'Salvo…' : 'Salva bozza'}
            </button>
            <button
              onClick={() => save(true)}
              disabled={saving}
              className="text-sm font-medium bg-terracotta text-canvas rounded-block px-4 py-2 hover:bg-ink transition-colors disabled:opacity-40"
            >
              {isPublished ? 'Salva e aggiorna' : 'Pubblica'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
