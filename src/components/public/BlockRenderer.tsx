import type { Block } from '@/types/database'
import { buildWhatsAppUrl, sanitizeUrl } from '@/lib/utils/sanitize'
import { LinkIconById } from '@/lib/linkIcons'
import { SocialIcon } from '@/lib/socialPlatforms'

interface Props {
  block: Block
}

export default function BlockRenderer({ block }: Props) {
  if (!block.is_active) return null

  switch (block.type) {
    case 'link': {
      const d = block.data as { url: string; label: string; icon?: string; open_in_new_tab?: boolean }
      const url = sanitizeUrl(d.url)
      if (!url) return null
      return (
        <a
          href={url}
          target={d.open_in_new_tab === false ? '_self' : '_blank'}
          rel="noopener noreferrer"
          className="block-item relative flex items-center justify-center w-full min-h-touch px-12 py-3 text-sm font-medium text-center"
          style={{
            background: 'var(--btn-bg)',
            color: 'var(--btn-fg)',
            borderColor: 'var(--btn-border-color)',
            borderWidth: 'var(--btn-border-width)',
            borderStyle: 'solid',
            borderRadius: 'var(--block-radius)',
          }}
        >
          {d.icon && (
            <span className="absolute left-4 flex items-center">
              <LinkIconById id={d.icon} size={18} />
            </span>
          )}
          {d.label}
        </a>
      )
    }

    case 'whatsapp': {
      const d = block.data as { phone: string; message_template?: string; label?: string }
      const url = buildWhatsAppUrl(d.phone, d.message_template)
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="block-item flex items-center justify-center gap-2 w-full min-h-touch px-4 py-3 text-sm font-medium text-center"
          style={{ background: '#25D366', color: '#fff', borderRadius: 'var(--block-radius)' }}
        >
          <SocialIcon id="whatsapp" size={18} />
          {d.label ?? 'Scrivimi su WhatsApp'}
        </a>
      )
    }

    case 'text_header': {
      const d = block.data as { text: string; tag?: string; align?: string }
      const Tag = (d.tag ?? 'p') as keyof React.JSX.IntrinsicElements
      const isHeading = d.tag === 'h1' || d.tag === 'h2' || d.tag === 'h3'
      return (
        <Tag
          className={isHeading ? 'text-center px-2 text-xl font-semibold' : 'text-center px-2'}
          style={{
            color: 'var(--text)',
            fontFamily: isHeading ? 'var(--page-font-heading)' : 'var(--page-font-body)',
            textAlign: (d.align as 'left' | 'center' | 'right') ?? 'center',
          }}
        >
          {d.text}
        </Tag>
      )
    }

    case 'divider':
      return <hr style={{ borderColor: 'var(--text)', opacity: 0.15 }} className="border-t my-1" />

    case 'image_banner': {
      const d = block.data as { storage_url: string; alt: string; link_url?: string }
      if (!d.storage_url) return null
      const url = d.link_url ? sanitizeUrl(d.link_url) : null
      const img = (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={d.storage_url}
          alt={d.alt}
          className="w-full object-cover"
          style={{ borderRadius: 'var(--block-radius)' }}
          loading="lazy"
        />
      )
      if (url) {
        return (
          <a href={url} target="_blank" rel="noopener noreferrer" className="block-item block">
            {img}
          </a>
        )
      }
      return <div>{img}</div>
    }

    case 'social_icons': {
      const d = block.data as { items: { platform: string; url: string }[] }
      return (
        <div className="flex flex-wrap justify-center gap-5 py-2">
          {d.items.map((item, i) => {
            const url = sanitizeUrl(item.url)
            if (!url) return null
            return (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-70"
                aria-label={item.platform}
                style={{ color: 'var(--text)' }}
              >
                <SocialIcon id={item.platform} size={26} />
              </a>
            )
          })}
        </div>
      )
    }

    default:
      return null
  }
}
