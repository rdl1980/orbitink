'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'

const inputCls = cn(
  'w-full h-touch rounded-block border bg-canvas/5 px-4',
  'text-canvas placeholder-canvas/25 text-sm',
  'border-canvas/15 focus:border-terracotta focus:outline-none',
  'transition-colors duration-fast',
)

const USERNAME_RE = /^[a-z0-9_-]{3,30}$/

export default function CompletaProfiloForm({ initialUsername }: { initialUsername: string }) {
  const router = useRouter()
  const supabase = createClient()

  const [username, setUsername] = useState(initialUsername)
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    const uname = username.trim().toLowerCase()
    if (!USERNAME_RE.test(uname)) {
      setError('Username: 3-30 caratteri, solo lettere minuscole, numeri, _ e -.')
      return
    }
    if (password.length < 8) {
      setError('La password deve avere almeno 8 caratteri.')
      return
    }
    if (password !== password2) {
      setError('Le due password non coincidono.')
      return
    }

    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // 1. Imposta la password + flag in user_metadata (niente colonna DB)
      const { error: pwErr } = await supabase.auth.updateUser({
        password,
        data: { password_set: true },
      })
      if (pwErr) throw pwErr

      // 2. Aggiorna username (lo slug della pagina si sincronizza via trigger)
      const { error: profErr } = await supabase
        .from('profiles')
        .update({ username: uname })
        .eq('id', user.id)

      if (profErr) {
        // Conflitto username (unique) o altro
        if ((profErr as { code?: string }).code === '23505') {
          setError('Questo username è già preso. Scegline un altro.')
        } else {
          setError('Errore nel salvataggio. Riprova.')
        }
        setLoading(false)
        return
      }

      // Assicura che il cookie di sessione abbia il flag aggiornato prima di navigare
      await supabase.auth.refreshSession()

      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Errore durante il completamento. Riprova.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="username" className="block text-xs font-semibold text-canvas/60 mb-2 uppercase tracking-wider">
          Username (il tuo indirizzo pubblico)
        </label>
        <div className="flex items-center gap-1">
          <span className="text-canvas/40 text-sm shrink-0">orbitink.it/</span>
          <input
            id="username"
            type="text"
            autoCapitalize="none"
            autoCorrect="off"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="il-tuo-nome"
            className={inputCls}
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="block text-xs font-semibold text-canvas/60 mb-2 uppercase tracking-wider">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Almeno 8 caratteri"
          className={inputCls}
        />
      </div>

      <div>
        <label htmlFor="password2" className="block text-xs font-semibold text-canvas/60 mb-2 uppercase tracking-wider">
          Conferma password
        </label>
        <input
          id="password2"
          type="password"
          autoComplete="new-password"
          required
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          placeholder="Ripeti la password"
          className={inputCls}
        />
      </div>

      {error && (
        <p className="text-sm text-error bg-error/10 rounded-block px-3 py-2">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className={cn(
          'w-full h-touch rounded-block font-sans font-medium text-sm',
          'bg-terracotta text-canvas transition-colors duration-fast',
          'hover:bg-ink disabled:opacity-40 disabled:cursor-not-allowed',
        )}
      >
        {loading ? 'Salvataggio…' : 'Completa e vai alla dashboard'}
      </button>
    </form>
  )
}
