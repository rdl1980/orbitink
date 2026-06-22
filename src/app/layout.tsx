import type { Metadata } from 'next'
import { DM_Sans, DM_Serif_Display } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  weight: ['300', '400', '500', '700'],
})

const dmSerif = DM_Serif_Display({
  variable: '--font-dm-serif',
  subsets: ['latin', 'latin-ext'],
  display: 'swap',
  weight: '400',
})

export const metadata: Metadata = {
  title: {
    template: '%s | OrbitInk',
    default: 'OrbitInk — Il tuo spazio digitale. Tutto italiano.',
  },
  description:
    'La piattaforma link-in-bio italiana. GDPR nativo, Satispay integrato, 0% commissioni. Per creator e PMI italiane.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://orbitink.it'),
  openGraph: {
    siteName: 'OrbitInk',
    locale: 'it_IT',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="it"
      className={`${dmSans.variable} ${dmSerif.variable} h-full`}
    >
      <body className="min-h-full flex flex-col font-sans bg-canvas text-cuoio antialiased">
        {children}
      </body>
    </html>
  )
}
