import type { Page, PageTheme } from '@/types/database'

interface Props {
  page: Page
  children: React.ReactNode
}

function themeVars(theme: PageTheme): string {
  const vars: string[] = []
  if (theme.colorBg)       vars.push(`--bg:${theme.colorBg}`)
  if (theme.colorSurface)  vars.push(`--surface:${theme.colorSurface}`)
  if (theme.colorText)     vars.push(`--text:${theme.colorText}`)
  if (theme.colorMuted)    vars.push(`--text-muted:${theme.colorMuted}`)
  if (theme.colorAccent)   vars.push(`--accent:${theme.colorAccent}`)
  if (theme.colorAccentFg) vars.push(`--accent-fg:${theme.colorAccentFg}`)
  if (theme.borderRadius)  vars.push(`--block-radius:${theme.borderRadius}`)
  return vars.join(';')
}

export default function PublicPageShell({ page, children }: Props) {
  const inlineStyle = themeVars(page.theme)

  return (
    <div className="page-canvas" style={inlineStyle ? ({ cssText: inlineStyle } as React.CSSProperties) : undefined}>
      <main className="mx-auto w-full max-w-[480px] px-4 py-10 pb-16">
        {/* Header: avatar + nome + bio */}
        <header className="mb-8 text-center">
          {page.avatar_url && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={page.avatar_url}
              alt={page.title}
              width={80}
              height={80}
              className="mx-auto mb-4 rounded-full object-cover"
              style={{ width: 80, height: 80 }}
            />
          )}
          {page.title && (
            <h1 className="font-serif text-2xl" style={{ color: 'var(--text)' }}>
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
        <div className="flex flex-col gap-3">
          {children}
        </div>

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
