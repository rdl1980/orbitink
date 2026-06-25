'use client'

import type { PageTheme } from '@/types/database'
import { BACKGROUNDS, ACCENTS, BUTTON_STYLES, BUTTON_SHAPES, FONTS, DEFAULT_THEME } from '@/lib/themes'

interface Props {
  theme: PageTheme
  onChange: (theme: PageTheme) => void
}

const GROUPS = [
  { id: 'tinta', label: 'Tinte' },
  { id: 'gradiente', label: 'Gradienti' },
  { id: 'mesh', label: 'Mesh' },
  { id: 'animato', label: 'Animati' },
  { id: 'pattern', label: 'Pattern' },
] as const

export default function AppearancePanel({ theme, onChange }: Props) {
  const t = { ...DEFAULT_THEME, ...theme }
  const set = (patch: Partial<PageTheme>) => onChange({ ...theme, ...patch })

  return (
    <section className="mb-8 rounded-card border border-sabbia bg-white p-5">
      <h2 className="font-serif text-xl text-ink mb-4">Aspetto</h2>

      {/* Sfondo — raggruppato per categoria */}
      <label className="block text-xs font-semibold text-grigio uppercase tracking-wide mb-2">Sfondo</label>
      {GROUPS.map((g) => {
        const items = BACKGROUNDS.filter((b) => b.group === g.id)
        if (!items.length) return null
        return (
          <div key={g.id} className="mb-3">
            <p className="text-[11px] text-grigio mb-1.5">{g.label}</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {items.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => set({ background: b.id })}
                  className={`rounded-block border-2 overflow-hidden transition-colors ${t.background === b.id ? 'border-ink' : 'border-sabbia'}`}
                  title={b.label}
                >
                  <span className="block h-10 w-full" style={{ background: b.swatch, backgroundSize: 'cover' }} />
                  <span className="block text-[10px] text-cuoio py-1 text-center truncate">{b.label}</span>
                </button>
              ))}
            </div>
          </div>
        )
      })}
      <div className="mb-5" />

      {/* Accento */}
      <label className="block text-xs font-semibold text-grigio uppercase tracking-wide mb-2">Colore accento</label>
      <div className="flex flex-wrap gap-2 mb-5">
        {ACCENTS.map((a) => (
          <button
            key={a.id}
            type="button"
            onClick={() => set({ accent: a.id })}
            className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${t.accent === a.id ? 'border-ink' : 'border-transparent'}`}
            style={{ background: a.color }}
            title={a.label}
            aria-label={a.label}
          />
        ))}
      </div>

      {/* Stile pulsanti */}
      <label className="block text-xs font-semibold text-grigio uppercase tracking-wide mb-2">Stile pulsanti</label>
      <div className="flex gap-2 mb-4">
        {BUTTON_STYLES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => set({ buttonStyle: s.id })}
            className={`flex-1 rounded-block border px-3 py-2 text-sm transition-colors ${t.buttonStyle === s.id ? 'border-ink bg-avorio text-ink' : 'border-sabbia text-grigio'}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Forma pulsanti */}
      <label className="block text-xs font-semibold text-grigio uppercase tracking-wide mb-2">Forma pulsanti</label>
      <div className="flex gap-2 mb-5">
        {BUTTON_SHAPES.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => set({ buttonShape: s.id })}
            className={`flex-1 border px-3 py-2 text-sm transition-colors ${t.buttonShape === s.id ? 'border-ink bg-avorio text-ink' : 'border-sabbia text-grigio'}`}
            style={{ borderRadius: s.radius === '9999px' ? '9999px' : s.radius }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Font */}
      <label className="block text-xs font-semibold text-grigio uppercase tracking-wide mb-2">Font</label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {FONTS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => set({ font: f.id })}
            className={`rounded-block border px-3 py-3 text-center transition-colors ${t.font === f.id ? 'border-ink bg-avorio' : 'border-sabbia'}`}
            style={{ fontFamily: f.heading }}
          >
            <span className="block text-lg text-ink leading-none">Aa</span>
            <span className="block text-[11px] text-grigio mt-1" style={{ fontFamily: 'var(--font-dm-sans)' }}>{f.label}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
