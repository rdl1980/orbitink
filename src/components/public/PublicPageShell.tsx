import type { Page } from '@/types/database'
import { computeThemeStyle, themeClasses } from '@/lib/themes'

interface Props {
  page: Page
  children: React.ReactNode
}

export default function PublicPageShell({ page, children }: Props) {
  const themeStyle = computeThemeStyle(page.theme)
  const extraClasses = themeClasses(page.theme)

  return (
    <div className={`page-canvas ${extraClasses}`} style={themeStyle}>
      <main className="mx-auto w-full max-w-[480px] px-4 py-10 pb-16">
        {/* Header: avatar + nome + bio */}
        <header className="mb-8 text-center">
          {page.avatar_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={page.avatar_url}
              alt={page.title}
              width={88}
              height={88}
              className="mx-auto mb-4 rounded-full object-cover"
              style={{ width: 88, height: 88 }}
            />
          )}
          {page.title && (
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--text)', fontFamily: 'var(--page-font-heading)' }}>
              {page.title}
            </h1>
          )}
          {page.bio && (
            <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              {page.bio}
            </p>
          )}
        </header>

        {/* Blocks */}
        <div className="flex flex-col gap-3">{children}</div>

        {/* Footer OrbitInk */}
        <footer className="mt-10 text-center">
          <a
            href={`${process.env.NEXT_PUBLIC_APP_URL ?? 'https://orbitink.it'}?ref=page`}
            className="text-[9px] uppercase tracking-widest"
            style={{ color: 'var(--text-muted)', opacity: 0.5 }}
            target="_blank"
            rel="noopener noreferrer"
          >
            ORBITINK.IT · GDPR
          </a>
        </footer>
      </main>
    </div>
  )
}
