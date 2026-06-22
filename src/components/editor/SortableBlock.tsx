'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { BlockType } from '@/types/database'
import { blockLabel } from '@/lib/blocks'

interface Props {
  id: string
  type: BlockType
  data: Record<string, unknown>
  isActive: boolean
  onChange: (data: Record<string, unknown>) => void
  onToggleActive: () => void
  onRemove: () => void
}

const inputCls =
  'w-full h-10 rounded-block border border-sabbia bg-canvas px-3 text-sm focus:border-ink focus:outline-none'

export default function SortableBlock({
  id, type, data, isActive, onChange, onToggleActive, onRemove,
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  }

  const set = (patch: Record<string, unknown>) => onChange({ ...data, ...patch })

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`rounded-card border bg-white p-4 ${isActive ? 'border-sabbia' : 'border-sabbia/60 opacity-60'}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-grigio hover:text-ink px-1"
          aria-label="Trascina per riordinare"
          type="button"
        >
          ⠿
        </button>
        <span className="text-xs font-semibold uppercase tracking-wide text-grigio">
          {blockLabel(type)}
        </span>
        <div className="ml-auto flex items-center gap-1">
          <button
            onClick={onToggleActive}
            type="button"
            className="text-xs text-grigio hover:text-ink px-2 py-1 rounded hover:bg-avorio"
          >
            {isActive ? 'Nascondi' : 'Mostra'}
          </button>
          <button
            onClick={onRemove}
            type="button"
            className="text-xs text-error hover:text-rosso px-2 py-1 rounded hover:bg-error/10"
          >
            Elimina
          </button>
        </div>
      </div>

      {/* Form per tipo */}
      {type === 'link' && (
        <div className="space-y-2">
          <input
            className={inputCls}
            placeholder="Etichetta (es. Il mio sito)"
            value={(data.label as string) ?? ''}
            onChange={(e) => set({ label: e.target.value })}
          />
          <input
            className={inputCls}
            placeholder="https://…"
            value={(data.url as string) ?? ''}
            onChange={(e) => set({ url: e.target.value })}
          />
        </div>
      )}

      {type === 'whatsapp' && (
        <div className="space-y-2">
          <input
            className={inputCls}
            placeholder="Numero (es. +39 333 1234567)"
            value={(data.phone as string) ?? ''}
            onChange={(e) => set({ phone: e.target.value })}
          />
          <input
            className={inputCls}
            placeholder="Etichetta pulsante"
            value={(data.label as string) ?? ''}
            onChange={(e) => set({ label: e.target.value })}
          />
          <input
            className={inputCls}
            placeholder="Messaggio precompilato (opzionale)"
            value={(data.message_template as string) ?? ''}
            onChange={(e) => set({ message_template: e.target.value })}
          />
        </div>
      )}

      {type === 'text_header' && (
        <div className="space-y-2">
          <input
            className={inputCls}
            placeholder="Testo"
            value={(data.text as string) ?? ''}
            onChange={(e) => set({ text: e.target.value })}
          />
          <div className="flex gap-2">
            <select
              className={inputCls}
              value={(data.tag as string) ?? 'h2'}
              onChange={(e) => set({ tag: e.target.value })}
            >
              <option value="h2">Titolo grande</option>
              <option value="h3">Titolo medio</option>
              <option value="p">Paragrafo</option>
            </select>
            <select
              className={inputCls}
              value={(data.align as string) ?? 'center'}
              onChange={(e) => set({ align: e.target.value })}
            >
              <option value="left">Sinistra</option>
              <option value="center">Centro</option>
              <option value="right">Destra</option>
            </select>
          </div>
        </div>
      )}

      {type === 'social_icons' && (
        <SocialEditor data={data} onChange={onChange} />
      )}

      {type === 'image_banner' && (
        <div className="space-y-2">
          <input
            className={inputCls}
            placeholder="URL immagine (https://…)"
            value={(data.storage_url as string) ?? ''}
            onChange={(e) => set({ storage_url: e.target.value })}
          />
          <input
            className={inputCls}
            placeholder="Testo alternativo (alt)"
            value={(data.alt as string) ?? ''}
            onChange={(e) => set({ alt: e.target.value })}
          />
          <input
            className={inputCls}
            placeholder="Link al click (opzionale)"
            value={(data.link_url as string) ?? ''}
            onChange={(e) => set({ link_url: e.target.value })}
          />
        </div>
      )}

      {type === 'divider' && (
        <p className="text-xs text-grigio">Una linea di separazione tra i blocchi.</p>
      )}
    </div>
  )
}

function SocialEditor({
  data,
  onChange,
}: {
  data: Record<string, unknown>
  onChange: (data: Record<string, unknown>) => void
}) {
  const items = (data.items as { platform: string; url: string }[]) ?? []

  const update = (i: number, patch: Partial<{ platform: string; url: string }>) => {
    const next = items.map((it, idx) => (idx === i ? { ...it, ...patch } : it))
    onChange({ ...data, items: next })
  }
  const add = () => onChange({ ...data, items: [...items, { platform: 'Instagram', url: '' }] })
  const remove = (i: number) => onChange({ ...data, items: items.filter((_, idx) => idx !== i) })

  return (
    <div className="space-y-2">
      {items.map((it, i) => (
        <div key={i} className="flex gap-2">
          <input
            className={`${inputCls} max-w-[40%]`}
            placeholder="Piattaforma"
            value={it.platform}
            onChange={(e) => update(i, { platform: e.target.value })}
          />
          <input
            className={inputCls}
            placeholder="https://…"
            value={it.url}
            onChange={(e) => update(i, { url: e.target.value })}
          />
          <button
            onClick={() => remove(i)}
            type="button"
            className="text-error text-sm px-2 hover:text-rosso"
            aria-label="Rimuovi"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        onClick={add}
        type="button"
        className="text-xs text-ink hover:text-terracotta font-medium"
      >
        + Aggiungi social
      </button>
    </div>
  )
}
