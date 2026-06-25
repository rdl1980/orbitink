const ALLOWED_PROTOCOLS = ['https:', 'http:', 'mailto:', 'tel:']

export function sanitizeUrl(url: string): string {
  if (!url) return ''
  let candidate = url.trim()
  if (!candidate) return ''
  // Se manca lo schema (es. "miosito.it", "www.miosito.it"), assume https://.
  // Non tocca mailto:, tel:, http(s):// già presenti.
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(candidate)) {
    candidate = `https://${candidate}`
  }
  try {
    const parsed = new URL(candidate)
    if (!ALLOWED_PROTOCOLS.includes(parsed.protocol)) return ''
    return parsed.toString()
  } catch {
    return ''
  }
}

export function sanitizeText(text: string, maxLength = 500): string {
  return text
    .replace(/[<>]/g, '') // rimuovi tag HTML
    .trim()
    .slice(0, maxLength)
}

export function sanitizePhone(phone: string): string {
  // Rimuovi tutto tranne + e cifre
  return phone.replace(/[^\d+]/g, '').slice(0, 20)
}

export function buildWhatsAppUrl(phone: string, message?: string): string {
  const clean = sanitizePhone(phone)
  const base = `https://wa.me/${clean.replace('+', '')}`
  if (message) {
    return `${base}?text=${encodeURIComponent(message)}`
  }
  return base
}
