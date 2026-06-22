'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'

type Step = 'email' | 'sent'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [step, setStep] = useState<Step>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
        data: { locale: 'it' },
      },
    })

    setLoading(false)

    if (error) {
      setError('Qualcosa è andato storto. Riprova tra qualche secondo.')
      return
    }

    setStep('sent')
  }

  if (step === 'sent') {
    return (
      <div className="rounded-card bg-canvas/5 border border-canvas/10 p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-terracotta/20">
          <svg className="h-6 w-6 text-terracotta" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="font-serif text-xl text-canvas mb-2">Controlla la tua email</h2>
        <p className="text-sm text-canvas/60">
          Abbiamo inviato un link di accesso a{' '}
          <strong className="text-canvas/80">{email}</strong>.
          <br />
          Clicca il link per entrare — è valido per 1 ora.
        </p>
        <button
          onClick={() => setStep('email')}
          className="mt-6 text-xs text-canvas/40 hover:text-canvas/60 transition-colors underline"
        >
          Usa un&apos;altra email
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-xs font-semibold text-canvas/60 mb-2 uppercase tracking-wider">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          autoFocus
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="mario@example.it"
          className={cn(
            'w-full h-touch rounded-block border bg-canvas/5 px-4',
            'text-canvas placeholder-canvas/25 text-sm',
            'border-canvas/15 focus:border-terracotta focus:outline-none',
            'transition-colors duration-fast',
          )}
        />
      </div>

      {error && (
        <p className="text-sm text-error bg-error/10 rounded-block px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || !email}
        className={cn(
          'w-full h-touch rounded-block font-sans font-medium text-sm',
          'bg-terracotta text-canvas transition-colors duration-fast',
          'hover:bg-ink disabled:opacity-40 disabled:cursor-not-allowed',
        )}
      >
        {loading ? 'Invio in corso…' : 'Entra con link magico'}
      </button>

      <p className="text-center text-xs text-canvas/30">
        Nessuna password. Nessun tracciamento.
      </p>
    </form>
  )
}
