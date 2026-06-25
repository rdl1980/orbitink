import type { CSSProperties } from 'react'
import type { PageTheme } from '@/types/database'

/* ============================================================
   SFONDI — ognuno definisce i colori di testo/superficie e,
   opzionalmente, un background CSS (gradiente/pattern).
   ============================================================ */
export interface BackgroundPreset {
  id: string
  label: string
  group: 'tinta' | 'gradiente' | 'mesh' | 'animato' | 'pattern'
  bg: string            // colore base / fallback
  surface: string
  text: string
  muted: string
  backgroundImage?: string  // gradiente / mesh / pattern CSS
  bgSize?: string           // override background-size (per animati/pattern)
  animated?: boolean        // gradiente in movimento
  grain?: boolean           // texture grana sopra lo sfondo
  swatch: string            // anteprima nel picker
}

export const BACKGROUNDS: BackgroundPreset[] = [
  // ── Tinte semplici ──
  { id: 'carta', label: 'Carta', group: 'tinta', bg: '#FDFAF6', surface: '#F5F0E8', text: '#1A1A2E', muted: '#8C8279', swatch: '#FDFAF6' },
  { id: 'notte', label: 'Notte', group: 'tinta', bg: '#1A1A2E', surface: '#252540', text: '#FDFAF6', muted: '#9D98AE', swatch: '#1A1A2E' },
  { id: 'oliva', label: 'Oliva', group: 'tinta', bg: '#EBEBDD', surface: '#DCDCC8', text: '#2E2E22', muted: '#6E6E55', swatch: '#EBEBDD' },
  { id: 'rosa',  label: 'Rosa',  group: 'tinta', bg: '#FDEEF2', surface: '#FAD9E3', text: '#3A1A28', muted: '#9A6E7E', swatch: '#FDEEF2' },

  // ── Gradienti ──
  { id: 'tramonto', label: 'Tramonto', group: 'gradiente', bg: '#C95C8A', surface: 'rgba(255,255,255,0.18)', text: '#FFF4EC', muted: 'rgba(255,244,236,0.7)', backgroundImage: 'linear-gradient(160deg,#FFD6A5 0%,#FF8FA3 55%,#C95C8A 100%)', swatch: 'linear-gradient(135deg,#FFD6A5,#C95C8A)' },
  { id: 'mare',     label: 'Mare',     group: 'gradiente', bg: '#1E5A8E', surface: 'rgba(255,255,255,0.15)', text: '#F2FAFF', muted: '#BFE0F0', backgroundImage: 'linear-gradient(160deg,#A7D7E8 0%,#1E5A8E 100%)', swatch: 'linear-gradient(135deg,#A7D7E8,#1E5A8E)' },
  { id: 'agrumi',   label: 'Agrumi',   group: 'gradiente', bg: '#FFB347', surface: 'rgba(255,255,255,0.28)', text: '#3A2A00', muted: '#8A6E2A', backgroundImage: 'linear-gradient(160deg,#FFEFB0 0%,#FFB347 100%)', swatch: 'linear-gradient(135deg,#FFEFB0,#FFB347)' },

  // ── Mesh gradient (stile Beacons / premium) ──
  { id: 'mesh-nebulosa', label: 'Nebulosa', group: 'mesh', bg: '#1A1430', surface: 'rgba(255,255,255,0.10)', text: '#F5F0FF', muted: '#C3B8E0',
    backgroundImage: 'radial-gradient(at 18% 22%, #6C4AB6 0px, transparent 55%), radial-gradient(at 82% 8%, #D4603A 0px, transparent 50%), radial-gradient(at 12% 82%, #1E5A8E 0px, transparent 55%), radial-gradient(at 86% 80%, #C0397B 0px, transparent 50%)',
    swatch: 'radial-gradient(at 20% 20%,#6C4AB6,transparent 60%),radial-gradient(at 80% 30%,#D4603A,transparent 60%),radial-gradient(at 50% 90%,#1E5A8E,transparent 60%) #1A1430' },
  { id: 'mesh-pesca', label: 'Pesca', group: 'mesh', bg: '#FDEFE6', surface: 'rgba(255,255,255,0.5)', text: '#3A1E14', muted: '#9A6E5A',
    backgroundImage: 'radial-gradient(at 15% 20%, #FFD6C4 0px, transparent 55%), radial-gradient(at 85% 15%, #FFC9D9 0px, transparent 50%), radial-gradient(at 25% 85%, #FFE8B0 0px, transparent 55%), radial-gradient(at 80% 80%, #E0C3FC 0px, transparent 55%)',
    swatch: 'radial-gradient(at 20% 20%,#FFD6C4,transparent 60%),radial-gradient(at 80% 20%,#FFC9D9,transparent 60%),radial-gradient(at 50% 90%,#E0C3FC,transparent 60%) #FDEFE6' },
  { id: 'mesh-menta', label: 'Menta', group: 'mesh', bg: '#0E2A26', surface: 'rgba(255,255,255,0.10)', text: '#EAFBF4', muted: '#A8D8C8',
    backgroundImage: 'radial-gradient(at 20% 20%, #1FB89A 0px, transparent 55%), radial-gradient(at 80% 10%, #3AA0D4 0px, transparent 50%), radial-gradient(at 15% 85%, #16725F 0px, transparent 55%), radial-gradient(at 85% 85%, #6C4AB6 0px, transparent 55%)',
    swatch: 'radial-gradient(at 20% 20%,#1FB89A,transparent 60%),radial-gradient(at 80% 20%,#3AA0D4,transparent 60%),radial-gradient(at 50% 90%,#6C4AB6,transparent 60%) #0E2A26' },

  // ── Gradienti animati ──
  { id: 'aurora', label: 'Aurora', group: 'animato', bg: '#1A1A2E', surface: 'rgba(255,255,255,0.10)', text: '#F5F0FF', muted: '#C3B8E0', animated: true, bgSize: '300% 300%',
    backgroundImage: 'linear-gradient(125deg,#1A1A2E,#3A2A6E,#6C4AB6,#C0397B,#3A2A6E)', swatch: 'linear-gradient(135deg,#3A2A6E,#6C4AB6,#C0397B)' },
  { id: 'flusso-caldo', label: 'Flusso', group: 'animato', bg: '#FF8FA3', surface: 'rgba(255,255,255,0.22)', text: '#3A1810', muted: '#7A4A38', animated: true, bgSize: '300% 300%',
    backgroundImage: 'linear-gradient(125deg,#FFEFB0,#FFB347,#FF8FA3,#C95C8A,#FFB347)', swatch: 'linear-gradient(135deg,#FFB347,#FF8FA3,#C95C8A)' },

  // ── Pattern + grana ──
  { id: 'griglia', label: 'Griglia', group: 'pattern', bg: '#FDFAF6', surface: '#F5F0E8', text: '#1A1A2E', muted: '#8C8279', bgSize: '24px 24px',
    backgroundImage: 'linear-gradient(#E8DDD0 1px, transparent 1px), linear-gradient(90deg, #E8DDD0 1px, transparent 1px)', swatch: '#FDFAF6' },
  { id: 'pois', label: 'Pois', group: 'pattern', bg: '#FDFAF6', surface: '#F5F0E8', text: '#1A1A2E', muted: '#8C8279', bgSize: '16px 16px',
    backgroundImage: 'radial-gradient(#E8DDD0 1.5px, transparent 1.5px)', swatch: '#FDFAF6' },
  { id: 'grana-notte', label: 'Grana', group: 'pattern', bg: '#16131F', surface: 'rgba(255,255,255,0.08)', text: '#F0ECF5', muted: '#A39DB0', grain: true,
    backgroundImage: 'linear-gradient(160deg,#16131F 0%,#2A2440 100%)', swatch: 'linear-gradient(135deg,#2A2440,#16131F)' },
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
  { id: 'glass',   label: 'Vetro' },
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
  } else if (style === 'glass') {
    btnBg = isDark(b.text) ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.14)'
    btnFg = b.text
    btnBorderColor = isDark(b.text) ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.30)'
    btnBorderWidth = '1px'
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
    vars['--page-bg-size'] = b.bgSize ?? 'cover'
  }
  return vars as CSSProperties
}

/* Classi modificatore da applicare al wrapper .page-canvas */
export function themeClasses(theme: PageTheme | undefined | null): string {
  const t = theme ?? {}
  const b = bg(t.background)
  const classes: string[] = []
  if (b.animated) classes.push('bg-animated')
  if (b.grain) classes.push('bg-grain')
  if ((t.buttonStyle ?? DEFAULT_THEME.buttonStyle) === 'glass') classes.push('btn-glass')
  return classes.join(' ')
}

// testo chiaro (#Fxx) → sfondo scuro; usato per scegliere l'opacità del vetro
function isDark(textColor: string): boolean {
  const h = textColor.replace('#', '')
  if (h.length < 6) return false
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  // testo luminoso ⇒ sfondo scuro
  return (r * 299 + g * 587 + b * 114) / 1000 > 160
}

function hexA(hex: string, alpha: number): string {
  const h = hex.replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  return `rgba(${r},${g},${b},${alpha})`
}
