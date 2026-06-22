import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

// Next.js 16: il convention file è `proxy.ts` (ex `middleware.ts`)
// e la funzione deve chiamarsi `proxy`.

const PUBLIC_APP_DOMAIN = process.env.NEXT_PUBLIC_APP_DOMAIN ?? 'orbitink.it'

export async function proxy(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl

  // Custom domain routing: se l'hostname non è il dominio principale
  // e non è localhost/vercel, trattalo come pagina pubblica del creator
  const isMainDomain =
    hostname === PUBLIC_APP_DOMAIN ||
    hostname === `www.${PUBLIC_APP_DOMAIN}` ||
    hostname === 'localhost' ||
    hostname.endsWith('.vercel.app')

  if (!isMainDomain) {
    const url = request.nextUrl.clone()
    url.pathname = `/_custom-domain${pathname}`
    url.searchParams.set('host', hostname)
    return NextResponse.rewrite(url)
  }

  // Auth per route protette
  let response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  if (pathname.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (pathname === '/login' && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
