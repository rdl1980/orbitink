import './(marketing)/landing.css'
import Waitlist from '@/components/Waitlist'

export default function Home() {
  return (
    <div className="landing">
      {/* NAV */}
      <nav>
        <div className="wrap nav-inner">
          <a href="#top" className="logo">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="13" stroke="#1A1A2E" strokeWidth="1.5" />
              <circle cx="16" cy="16" r="8.5" stroke="#1A1A2E" strokeWidth="1" opacity="0.35" />
              <circle cx="16" cy="16" r="4" fill="#1A1A2E" />
              <circle cx="26" cy="10" r="3" fill="#D4603A" />
            </svg>
            <span>OrbitInk</span>
          </a>
          <a href="#waitlist" className="nav-cta">Entra nella waitlist</a>
        </div>
      </nav>

      {/* HERO */}
      <header className="hero" id="top">
        <svg className="hero-orbit" viewBox="0 0 520 520" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="380" cy="140" r="240" stroke="#D4603A" strokeWidth="1.5" />
          <circle cx="380" cy="140" r="170" stroke="#D4603A" strokeWidth="1" opacity="0.6" />
          <circle cx="380" cy="140" r="14" fill="#D4603A" />
          <circle className="spin" cx="620" cy="140" r="9" fill="#D4603A" />
        </svg>
        <div className="wrap">
          <p className="eyebrow">Il link-in-bio italiano</p>
          <h1 className="serif">
            Un solo link.<br />Tutta la tua <span className="accent">attività</span>.
          </h1>
          <p className="sub">
            La piattaforma link-in-bio costruita in Italia, per l&apos;Italia. GDPR nativo,
            Satispay integrato, WhatsApp a un tocco. E zero commissioni su quello che guadagni.
          </p>
          <div className="hero-actions">
            <a href="#waitlist" className="btn-primary">Entra nella waitlist — è gratis</a>
            <a href="#come-funziona" className="btn-ghost">Scopri come funziona</a>
          </div>
        </div>
      </header>

      {/* FEATURES */}
      <section className="block" id="come-funziona">
        <div className="wrap">
          <p className="section-eyebrow">Perché OrbitInk</p>
          <h2 className="section-title serif">Pensato per chi lavora in Italia.</h2>
          <p className="section-lead">
            Gli strumenti americani non conoscono Satispay, non integrano WhatsApp, non si
            preoccupano del GDPR. Noi sì — perché siamo nati qui.
          </p>

          <div className="features">
            <Feature title="GDPR nativo" desc="I dati dei tuoi clienti restano in Europa. Sempre. Conforme al GDPR dalla prima riga di codice, con banner cookie incluso.">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 0v20m-10-10h20" />
            </Feature>
            <Feature title="Satispay integrato" desc="Incassa con Satispay direttamente dalla tua pagina. Niente carta, niente attese. Il pagamento che gli italiani usano davvero.">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h2m-2 4h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </Feature>
            <Feature title="WhatsApp a un tocco" desc="Il tuo cliente ti scrive su WhatsApp, non su Messenger. Un pulsante che apre la chat giusta, col messaggio già pronto.">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h8M8 14h5m-9 7l2.5-2.5A9 9 0 1121 12a9 9 0 01-13 8L4 21z" />
            </Feature>
            <Feature title="QR code per il locale" desc="Stampa il QR per il tavolo, la vetrina, il bancone. Porta chi entra dal vivo direttamente sulla tua pagina e sul tuo menù.">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m-6 4h6m-6 4h4M5 3h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2z" />
            </Feature>
            <Feature title="0% commissioni" desc="Tieni il 100% dei tuoi guadagni. Nessuna percentuale nascosta su vendite, mance o prenotazioni. Mai.">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.66 0-3 .9-3 2s1.34 2 3 2 3 .9 3 2-1.34 2-3 2m0-8c1.11 0 2.08.4 2.6 1M12 8V6m0 10v2" />
            </Feature>
            <Feature title="Analytics chiare" desc="Quanti clic, da dove arrivano, su quale link. Statistiche in italiano, senza tracciare le persone una per una.">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h4l3 8 4-16 3 8h4" />
            </Feature>
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="block compare">
        <div className="wrap">
          <p className="section-eyebrow">OrbitInk vs Linktree</p>
          <h2 className="section-title serif">La differenza si vede subito.</h2>
          <div className="compare-grid">
            <div className="compare-card them">
              <h3 className="serif">Linktree</h3>
              <ul>
                <CompareItem ok={false}>Dati su server americani</CompareItem>
                <CompareItem ok={false}>Fino al 12% di commissioni</CompareItem>
                <CompareItem ok={false}>Non conosce Satispay</CompareItem>
                <CompareItem ok={false}>WhatsApp non nativo</CompareItem>
                <CompareItem ok={false}>Interfaccia solo in inglese</CompareItem>
                <CompareItem ok={false}>€15/mese per il piano Pro</CompareItem>
              </ul>
            </div>
            <div className="compare-card us">
              <h3 className="serif">OrbitInk</h3>
              <ul>
                <CompareItem ok>Dati in Europa, GDPR nativo</CompareItem>
                <CompareItem ok>0% commissioni su ogni piano</CompareItem>
                <CompareItem ok>Satispay integrato</CompareItem>
                <CompareItem ok>WhatsApp a un tocco</CompareItem>
                <CompareItem ok>Tutto in italiano, supporto IT</CompareItem>
                <CompareItem ok>Da €6,90/mese, prezzi in euro</CompareItem>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="block">
        <div className="wrap">
          <p className="section-eyebrow">Prezzi chiari. Nessuna sorpresa.</p>
          <h2 className="section-title serif">Cresci al tuo ritmo.</h2>
          <p className="section-lead">
            Quattro piani che seguono la tua attività. Zero commissioni su tutti, anche sul gratuito.
          </p>

          <div className="pricing">
            <Plan name="Radici" spirit="Le radici vengono prima di tutto. Inizia qui." price="€0" />
            <Plan name="Bottega" spirit="Hai una tua bottega. È il momento di farla girare." price="€6,90" per />
            <Plan name="Mestiere" spirit="Chi conosce il suo mestiere, non ha concorrenti." price="€12,90" per featured />
            <Plan name="Marchio" spirit="Non sei più solo. Sei un marchio." price="€24,90" per />
          </div>
        </div>
      </section>

      {/* WAITLIST */}
      <section className="block waitlist" id="waitlist">
        <div className="wrap narrow">
          <p className="section-eyebrow">Stiamo arrivando</p>
          <h2 className="section-title serif">Entra nella waitlist.</h2>
          <p className="section-lead">
            OrbitInk è in costruzione. Lascia la tua email: sarai tra i primi a provarlo,
            con un piano Pro gratuito per i primi iscritti.
          </p>
          <Waitlist />
          <p className="wl-note">
            Niente spam. Solo un avviso quando OrbitInk è pronto. I tuoi dati restano in Europa.
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="wrap footer-inner">
          <small>© 2026 OrbitInk · Fatto in Italia · Dati in Europa 🇪🇺</small>
          <div className="footer-links">
            <a href="#come-funziona">Come funziona</a>
            <a href="#waitlist">Waitlist</a>
            <a href="mailto:ciao@orbitink.it">Contatti</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function Feature({ title, desc, children }: { title: string; desc: string; children: React.ReactNode }) {
  return (
    <div className="feature">
      <div className="icon">
        <svg fill="none" viewBox="0 0 24 24">{children}</svg>
      </div>
      <h3 className="serif">{title}</h3>
      <p>{desc}</p>
    </div>
  )
}

function CompareItem({ ok, children }: { ok: boolean; children: React.ReactNode }) {
  return (
    <li>
      <span className={`mark ${ok ? 'yes' : 'no'}`}>{ok ? '✓' : '✕'}</span>
      {children}
    </li>
  )
}

function Plan({ name, spirit, price, per, featured }: { name: string; spirit: string; price: string; per?: boolean; featured?: boolean }) {
  return (
    <div className={`plan${featured ? ' featured' : ''}`}>
      {featured && <span className="badge">Il più scelto</span>}
      <div className="plan-name serif">{name}</div>
      <div className="plan-spirit">{spirit}</div>
      <div className="price">{price}{per && <small>/mese</small>}</div>
      <div className="fee">0% commissioni</div>
    </div>
  )
}
