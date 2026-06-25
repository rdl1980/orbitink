export type BlockType =
  | 'link'
  | 'whatsapp'
  | 'satispay'
  | 'paypal'
  | 'social_icons'
  | 'qr_code'
  | 'embed_youtube'
  | 'embed_spotify'
  | 'text_header'
  | 'image_banner'
  | 'contact_form'
  | 'email_capture'
  | 'divider'
  | 'countdown'
  | 'menu_pdf'

export type Plan = 'free' | 'starter' | 'pro' | 'agency'
export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'trialing' | 'incomplete'

export interface Profile {
  id: string
  username: string
  display_name: string | null
  email: string
  avatar_url: string | null
  plan: Plan
  locale: string
  timezone: string
  gdpr_consented_at: string | null
  gdpr_consent_version: string | null
  marketing_consent: boolean
  created_at: string
  updated_at: string
  deleted_at: string | null
}

export interface PageTheme {
  // Nuovo modello a preset (selezionabili nell'editor)
  background?: string          // id sfondo (vedi lib/themes BACKGROUNDS)
  accent?: string              // id accento
  buttonStyle?: 'fill' | 'outline' | 'soft' | 'glass'
  buttonShape?: 'sharp' | 'rounded' | 'pill'
  font?: string                // id font pairing
  // Campi legacy (non più usati, mantenuti per compatibilità)
  colorBg?: string
  colorSurface?: string
  colorText?: string
  colorMuted?: string
  colorAccent?: string
  colorAccentFg?: string
  fontFamily?: string
  borderRadius?: string
}

export interface Page {
  id: string
  owner_id: string
  slug: string
  title: string
  bio: string | null
  avatar_url: string | null
  cover_url: string | null
  theme: PageTheme
  is_published: boolean
  seo_title: string | null
  seo_description: string | null
  og_image_url: string | null
  view_count: number
  created_at: string
  updated_at: string
}

// Block data shapes per tipo
export interface LinkBlockData {
  url: string
  label: string
  icon?: string
  thumbnail_url?: string
  open_in_new_tab?: boolean
}

export interface WhatsAppBlockData {
  phone: string
  message_template?: string
  label?: string
}

export interface SatispayBlockData {
  amount?: number
  currency: 'EUR'
  description: string
  recipient_code: string
}

export interface SocialIconsBlockData {
  items: { platform: string; url: string }[]
}

export interface QrCodeBlockData {
  url: string
  label?: string
  foreground_color?: string
  background_color?: string
}

export interface TextHeaderBlockData {
  text: string
  tag: 'h1' | 'h2' | 'h3' | 'p'
  align?: 'left' | 'center' | 'right'
}

export interface ImageBannerBlockData {
  storage_url: string
  alt: string
  link_url?: string
}

export interface MenuPdfBlockData {
  storage_url: string
  label: string
  language?: string
}

export type BlockData =
  | LinkBlockData
  | WhatsAppBlockData
  | SatispayBlockData
  | SocialIconsBlockData
  | QrCodeBlockData
  | TextHeaderBlockData
  | ImageBannerBlockData
  | MenuPdfBlockData
  | Record<string, unknown>

export interface Block {
  id: string
  page_id: string
  owner_id: string
  type: BlockType
  position: number
  is_active: boolean
  data: BlockData
  scheduled_from: string | null
  scheduled_to: string | null
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: string
  owner_id: string
  provider: 'stripe' | 'satispay' | 'manual'
  provider_customer_id: string | null
  provider_sub_id: string | null
  plan: Plan
  status: SubscriptionStatus
  current_period_start: string | null
  current_period_end: string | null
  cancel_at_period_end: boolean
  trial_end: string | null
  metadata: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface WaitlistEntry {
  id: string
  email: string
  source: string
  locale: string
  created_at: string
}

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile
        Insert: Partial<Profile> & { id: string; username: string; email: string }
        Update: Partial<Profile>
        Relationships: []
      }
      pages: {
        Row: Page
        Insert: Partial<Page> & { owner_id: string; slug: string }
        Update: Partial<Page>
        Relationships: []
      }
      blocks: {
        Row: Block
        Insert: Partial<Block> & { page_id: string; owner_id: string; type: BlockType }
        Update: Partial<Block>
        Relationships: []
      }
      subscriptions: {
        Row: Subscription
        Insert: Partial<Subscription> & { owner_id: string; provider: string; plan: Plan; status: SubscriptionStatus }
        Update: Partial<Subscription>
        Relationships: []
      }
      waitlist: {
        Row: WaitlistEntry
        Insert: { email: string; source?: string; locale?: string }
        Update: Partial<WaitlistEntry>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      block_type: BlockType
    }
    CompositeTypes: Record<string, never>
  }
}
