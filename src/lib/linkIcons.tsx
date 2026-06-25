import {
  Globe, ShoppingBag, Calendar, Music, Camera, Mail, MapPin, Star,
  Heart, BookOpen, Play, Download, Gift, Ticket, Coffee, FileText,
  Phone, Link2, type LucideIcon,
} from 'lucide-react'

export interface LinkIconDef { id: string; label: string; Icon: LucideIcon }

export const LINK_ICONS: LinkIconDef[] = [
  { id: 'link', label: 'Link', Icon: Link2 },
  { id: 'globe', label: 'Sito', Icon: Globe },
  { id: 'shop', label: 'Shop', Icon: ShoppingBag },
  { id: 'calendar', label: 'Prenota', Icon: Calendar },
  { id: 'music', label: 'Musica', Icon: Music },
  { id: 'play', label: 'Video', Icon: Play },
  { id: 'camera', label: 'Foto', Icon: Camera },
  { id: 'mail', label: 'Email', Icon: Mail },
  { id: 'phone', label: 'Telefono', Icon: Phone },
  { id: 'map', label: 'Mappa', Icon: MapPin },
  { id: 'star', label: 'Recensioni', Icon: Star },
  { id: 'heart', label: 'Sostieni', Icon: Heart },
  { id: 'book', label: 'Blog', Icon: BookOpen },
  { id: 'file', label: 'Menu/PDF', Icon: FileText },
  { id: 'download', label: 'Download', Icon: Download },
  { id: 'gift', label: 'Regalo', Icon: Gift },
  { id: 'ticket', label: 'Eventi', Icon: Ticket },
  { id: 'coffee', label: 'Caffè', Icon: Coffee },
]

export function linkIcon(id?: string): LinkIconDef | undefined {
  if (!id) return undefined
  return LINK_ICONS.find((i) => i.id === id)
}

export function LinkIconById({ id, size = 18, className }: { id?: string; size?: number; className?: string }) {
  const def = linkIcon(id)
  if (!def) return null
  const Icon = def.Icon
  return <Icon size={size} className={className} aria-hidden />
}
