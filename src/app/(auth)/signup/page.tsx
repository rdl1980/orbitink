import { Metadata } from 'next'
import SignupForm from './SignupForm'

export const metadata: Metadata = {
  title: 'Registrati',
  description: 'Crea il tuo account OrbitInk.',
}

export default function SignupPage() {
  return (
    <main className="min-h-dvh bg-ink flex items-center justify-center px-4 py-16">
      <div className="pointer-events-none fixed right-0 top-0 w-[600px] h-[600px] opacity-10" aria-hidden>
        <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="500" cy="100" r="280" stroke="#D4603A" strokeWidth="1.5" />
          <circle cx="500" cy="100" r="200" stroke="#D4603A" strokeWidth="1" opacity="0.5" />
          <circle cx="500" cy="100" r="12" fill="#D4603A" />
          <circle cx="300" cy="100" r="7" fill="#D4603A" />
        </svg>
      </div>

      <div className="relative w-full max-w-sm">
        <div className="mb-10 text-center">
          <span className="font-serif text-2xl text-canvas tracking-tight">OrbitInk</span>
          <p className="mt-1 text-sm text-canvas/50">Crea il tuo spazio digitale.</p>
        </div>

        <SignupForm />

        <p className="mt-8 text-center text-xs text-canvas/30">
          Registrandoti accetti i{' '}
          <a href="/termini" className="underline hover:text-canvas/60 transition-colors">Termini</a>{' '}
          e la{' '}
          <a href="/privacy" className="underline hover:text-canvas/60 transition-colors">Privacy</a>.
          I dati restano in Europa.
        </p>
      </div>
    </main>
  )
}
