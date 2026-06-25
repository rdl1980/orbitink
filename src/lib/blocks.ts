import type { BlockType } from '@/types/database'

// Voce del menu "Aggiungi blocco". `key` identifica la voce nel picker
// (può differire dal `type` DB: es. "email" è un link con mailto).
export interface BlockPickerItem {
  key: string
  type: BlockType
  label: string
  description: string
  defaultData: Record<string, unknown>
}

export const EDITOR_BLOCKS: BlockPickerItem[] = [
  {
    key: 'link',
    type: 'link',
    label: 'Link',
    description: 'Un pulsante che porta a un sito',
    defaultData: { url: '', label: 'Il mio link', icon: 'link', open_in_new_tab: true },
  },
  {
    key: 'whatsapp',
    type: 'whatsapp',
    label: 'WhatsApp',
    description: 'Pulsante per scriverti su WhatsApp',
    defaultData: { phone: '+39', message_template: 'Ciao! Ti scrivo da OrbitInk', label: 'Scrivimi su WhatsApp' },
  },
  {
    key: 'email',
    type: 'link',
    label: 'Email',
    description: 'Pulsante per scriverti via email',
    defaultData: { kind: 'email', email: '', url: '', label: 'Scrivimi via email', icon: 'mail', open_in_new_tab: false },
  },
  {
    key: 'social_icons',
    type: 'social_icons',
    label: 'Social',
    description: 'Le tue icone social',
    defaultData: { items: [{ platform: 'instagram', url: '' }] },
  },
  {
    key: 'text_header',
    type: 'text_header',
    label: 'Testo',
    description: 'Un titolo o una frase',
    defaultData: { text: 'Il mio testo', tag: 'h2', align: 'center' },
  },
  {
    key: 'image_banner',
    type: 'image_banner',
    label: 'Immagine',
    description: 'Un banner immagine (via URL)',
    defaultData: { storage_url: '', alt: '', link_url: '' },
  },
  {
    key: 'divider',
    type: 'divider',
    label: 'Separatore',
    description: 'Una linea di separazione',
    defaultData: { style: 'solid' },
  },
]

const TYPE_LABELS: Record<string, string> = {
  link: 'Link',
  whatsapp: 'WhatsApp',
  social_icons: 'Social',
  text_header: 'Testo',
  image_banner: 'Immagine',
  divider: 'Separatore',
}

export function blockLabel(type: BlockType, data?: Record<string, unknown>): string {
  if (type === 'link' && data?.kind === 'email') return 'Email'
  return TYPE_LABELS[type] ?? type
}
