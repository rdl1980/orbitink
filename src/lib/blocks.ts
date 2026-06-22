import type { BlockType } from '@/types/database'

export interface BlockMeta {
  type: BlockType
  label: string
  description: string
  defaultData: Record<string, unknown>
}

// Blocchi disponibili nell'editor MVP (un sottoinsieme dei 15 tipi dello schema)
export const EDITOR_BLOCKS: BlockMeta[] = [
  {
    type: 'link',
    label: 'Link',
    description: 'Un pulsante che porta a un sito',
    defaultData: { url: '', label: 'Il mio link', open_in_new_tab: true },
  },
  {
    type: 'whatsapp',
    label: 'WhatsApp',
    description: 'Pulsante per scriverti su WhatsApp',
    defaultData: { phone: '+39', message_template: 'Ciao! Ti scrivo da OrbitInk', label: 'Scrivimi su WhatsApp' },
  },
  {
    type: 'social_icons',
    label: 'Social',
    description: 'Le tue icone social',
    defaultData: { items: [{ platform: 'Instagram', url: '' }] },
  },
  {
    type: 'text_header',
    label: 'Testo',
    description: 'Un titolo o una frase',
    defaultData: { text: 'Il mio testo', tag: 'h2', align: 'center' },
  },
  {
    type: 'image_banner',
    label: 'Immagine',
    description: 'Un banner immagine (via URL)',
    defaultData: { storage_url: '', alt: '', link_url: '' },
  },
  {
    type: 'divider',
    label: 'Separatore',
    description: 'Una linea di separazione',
    defaultData: { style: 'solid' },
  },
]

export function blockMeta(type: BlockType): BlockMeta | undefined {
  return EDITOR_BLOCKS.find((b) => b.type === type)
}

export function blockLabel(type: BlockType): string {
  return blockMeta(type)?.label ?? type
}
