'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type MsgState = { text: string; kind: 'ok' | 'err' | '' }

export default function Waitlist() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<MsgState>({ text: '', kind: '' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const clean = email.trim().toLowerCase()
    if (!clean) return

    setLoading(true)
    setMsg({ text: '', kind: '' })

    try {
      const supabase = createClient()
      const { error } = await supabase
        .from('waitlist')
        .insert({ email: clean, source: 'landing', locale: 'it' })

      if (error) {
        if (error.code === '23505') {
          setMsg({ text: 'Sei già nella lista! Ti avvisiamo noi.', kind: 'ok' })
        } else {
          throw error
        }
      } else {
        setMsg({ text: 'Perfetto! Sei nella waitlist. Ci sentiamo presto.', kind: 'ok' })
        setEmail('')
      }
    } catch {
      setMsg({ text: 'Ops, qualcosa è andato storto. Riprova tra poco.', kind: 'err' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <form className="wl-form" onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="la-tua-email@example.it"
          required
          autoComplete="email"
          aria-label="Email"
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Invio…' : 'Avvisami al lancio'}
        </button>
      </form>
      {msg.text && <div className={`wl-msg ${msg.kind}`}>{msg.text}</div>}
    </>
  )
}
