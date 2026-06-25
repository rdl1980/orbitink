import type { CSSProperties } from 'react'
import type { PageTheme } from '@/types/database'

/* ============================================================
   SFONDI — ognuno definisce i colori di testo/superficie e,
   opzionalmente, un background CSS (gradiente/pattern).
   ============================================================ */
export interface BackgroundPreset {
  id: string
  label: string
  bg: string            // colore base / fallback
  surface: string
  text: string
  muted: string
  backgroundImage?: string  // gradiente o pattern CSS opzionale
  swatch: string        // anteprima nel picker
}

export const BACKGROUNDS: BackgroundPreset[] = [
  { id: 'carta',     label: 'Carta',     bg: '#FDFAF6', surface: '#F5F0E8', text: '#1A1A2E', muted: '#8C8279', swatch: '#FDFAF6' },
  { id: 'notte',     label: 'Notte',     bg: '#1A1A2E', surface: '#252540', text: '#FDFAF6', muted: '#9D98AE', swatch: '#1A1A2E' },
  { id: 'oliva',     label: 'Oliva',     bg: '#EBEBDD', surface: '#DCDCC8', text: '#2E2E22', muted: '#6E6E55', swatch: '#EBEBDD' },
  { id: 'rosa',      label: 'Rosa',      bg: '#FDEEF2', surface: '#FAD9E3', text: '#3A1A28', muted: '#9A6E7E', swatch: '#FDEEF2' },
  { id: 'tramonto',  label: 'Tramonto',  bg: '#FFD6A5', surface: 'rgba(255,255,255,0.25)', text: '#3A1810', muted: '#7A4A38', backgroundImage: 'linear-gradient(160deg,#FFD6A5 0%,#FF8FA3 55%,#C95C8A 100%)', swatch: 'linear-gradient(135deg,#FFD6A5,#C95C8A)' },
  { id: 'mare',      label: 'Mare',      bg: '#1E5A8E', surface: 'rgba(255,255,255,0.15)', text: '#F2FAFF', muted: '#BFE0F0', backgroundImage: 'linear-gradient(160deg,#A7D7E8 0%,#1E5A8E 100%)', swatch: 'linear-gradient(135deg,#A7D7E8,#1E5A8E)' },
  { id: 'aurora',    label: 'Aurora',    bg: '#2A1A4E', surface: 'rgba(255,255,255,0.12)', text: '#F5F0FF', muted: '#C3B8E0', backgroundImage: 'linear-gradient(160deg,#1A1A2E 0%,#3A2A6E 50%,#6C4AB6 100%)', swatch: 'linear-gradient(135deg,#3A2A6E,#6C4AB6)' },
  { id: 'agrumi',    label: 'Agrumi',    bg: '#FFEFB0', surface: 'rgba(255,255,255,0.3)', text: '#3A2A00', muted: '#8A6E2A', backgroundImage: 'linear-gradient(160deg,#FFEFB0 0%,#FFB347 100%)', swatch: 'linear-gradient(135deg,#FFEFB0,#FFB347)' },
  { id: 'pois',      label: 'Pois',      bg: '#FDFAF6', surface: '#F5F0E8', text: '#1A1A2E', muted: '#8C8279', backgroundImage: 'radial-gradient(#E8DDD0 1.5px, transparent 1.5px)', swatch: '#FDFAF6' },
]

/* ============================================================
   ACCENTI — colore dei pulsanti "pieni" e degli highlight.
   ============================================================ */
export interface AccentPreset { id: string; label: string; color: string; fg: string }

export const ACCENTS: AccentPreset[] = [
  { id: 'terracotta', label: 'Terracotta', color: '#D4603A', fg: '#FDFAF6' },
  { id: 'inchiostro', label: 'Inchiostro', color: '#1A1A2E', fg: '#FDFAF6' },
  { id: 'verde',      label: 'Verde',      color: '#2A7A4B', fg: '#FFFFFF' },
  { id: 'blu',        label: 'Blu',        color: '#1E5A8E', fg: '#FFFFFF' },
  { id: 'rosa',       label: 'Rosa',       color: '#C0397B', fg: '#FFFFFF' },
  { id: 'viola',      label: 'Viola',      color: '#6C4AB6', fg: '#FFFFFF' },
  { id: 'oro',        label: 'Oro',        color: '#C9820A', fg: '#1A1A2E' },
]

/* ============================================================
   FORMA E STILE PULSANTI
   ============================================================ */
export const BUTTON_SHAPES = [
  { id: 'sharp',   label: 'Squadrato',   radius: '4px' },
  { id: 'rounded', label: 'Arrotondato', radius: '12px' },
  { id: 'pill',    label: 'Pillola',     radius: '9999px' },
] as const

export const BUTTON_STYLES = [
  { id: 'fill',    label: 'Pieno' },
  { id: 'outline', label: 'Contorno' },
  { id: 'soft',    label: 'Tenue' },
] as const

/* ============================================================
   FONT (le var --font-* sono caricate in layout.tsx)
   ============================================================ */
export interface FontPreset { id: string; label: string; heading: string; body: string }

export const FONTS: FontPreset[] = [
  { id: 'classico', label: 'Classico', heading: 'var(--font-dm-serif), Georgia, serif', body: 'var(--font-dm-sans), system-ui, sans-serif' },
  { id: 'moderno',  label: 'Moderno',  heading: 'var(--font-poppins), sans-serif',     body: 'var(--font-poppins), sans-serif' },
  { id: 'elegante', label: 'Elegante', heading: 'var(--font-fraunces), Georgia, serif', body: 'var(--font-dm-sans), system-ui, sans-serif' },
  { id: 'friendly', label: 'Friendly', heading: 'var(--font-nunito), sans-serif',       body: 'var(--font-nunito), sans-serif' },
]

/* ============================================================
   Default + risoluzione
   ============================================================ */
export const DEFAULT_THEME: Required<Pick<PageTheme,
  'background' | 'accent' | 'buttonStyle' | 'buttonShape' | 'font'>> = {
  background: 'carta',
  accent: 'terracotta',
  buttonStyle: 'fill',
  buttonShape: 'rounded',
  font: 'classico',
}

export function bg(id?: string) { return BACKGROUNDS.find(b => b.id === id) ?? BACKGROUNDS[0] }
export function accent(id?: string) { return ACCENTS.find(a => a.id === id) ?? ACCENTS[0] }
export function font(id?: string) { return FONTS.find(f => f.id === id) ?? FONTS[0] }
export function shape(id?: string) { return BUTTON_SHAPES.find(s => s.id === id) ?? BUTTON_SHAPES[1] }

/* Converte il tema in CSS custom properties da applicare sul wrapper pagina. */
export function computeThemeStyle(theme: PageTheme | undefined | null): CSSProperties {
  const t = theme ?? {}
  const b = bg(t.background)
  const a = accent(t.accent)
  const f = font(t.font)
  const sh = shape(t.buttonShape)
  const style = t.buttonStyle ?? DEFAULT_THEME.buttonStyle

  // Stile pulsanti (link) derivato da accento + stile
  let btnBg = a.color, btnFg = a.fg, btnBorderColor = 'transparent', btnBorderWidth = '0px'
  if (style === 'outline') {
    btnBg = 'transparent'; btnFg = b.text; btnBorderColor = b.text; btnBorderWidth = '1.5px'
  } else if (style === 'soft') {
    btnBg = hexA(a.color, 0.14); btnFg = b.text; btnBorderColor = 'transparent'; btnBorderWidth = '0px'
  }

  const vars: Record<string, string> = {
    '--bg': b.bg,
    '--surface': b.surface,
    '--text': b.text,
    '--text-muted': b.muted,
    '--accent': a.color,
    '--accent-fg': a.fg,
    '--block-radius': sh.radius,
    '--page-font-heading': f.heading,
    '--page-font-body': f.body,
    '--btn-bg': btnBg,
    '--btn-fg': btnFg,
    '--btn-border-color': btnBorderColor,
    '--btn-border-width': btnBorderWidth,
  }
  if (b.backgroundImage) {
    vars['--page-bg-image'] = b.backgroundImage
    if (b.id === 'pois') vars['--page-bg-size'] = '16px 16px'
  }
  return vars as CSSProperties
}

function hexA(hex: string, alpha: number): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}
