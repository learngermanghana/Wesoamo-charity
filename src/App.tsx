import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type DonationState = 'idle' | 'submitting' | 'success' | 'error'

type DonationResponse = {
  ok?: boolean
  donorId?: string
  payment?: {
    provider?: string
    reference?: string
    ok?: boolean
    authorizationUrl?: string | null
    accessCode?: string | null
  } | null
  error?: string
}

const presetAmounts = [50, 100, 200, 500]

const sedifexStoreId = import.meta.env.VITE_SEDIFEX_STORE_ID?.trim() ?? ''

function App() {
  const [donorName, setDonorName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [amount, setAmount] = useState('100')
  const [message, setMessage] = useState('')
  const [anonymous, setAnonymous] = useState(false)
  const [status, setStatus] = useState<DonationState>('idle')
  const [feedback, setFeedback] = useState('')

  const amountNumber = useMemo(() => Number(amount), [amount])
  const canSubmit = Boolean(donorName.trim()) && Boolean(email.trim() || phone.trim()) && Number.isFinite(amountNumber) && amountNumber > 0

  const handleDonate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setFeedback('')

    if (!canSubmit) {
      setStatus('error')
      setFeedback('Please enter your name, email or phone, and a valid donation amount.')
      return
    }

    setStatus('submitting')

    try {
      const response = await fetch('/api/donor-portal-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId: sedifexStoreId,
          donor: {
            name: donorName.trim(),
            email: email.trim(),
            phone: phone.trim(),
          },
          amount: amountNumber,
          currency: 'GHS',
          initializePayment: true,
          metadata: {
            source: 'wesoamo-charity-website',
            anonymous,
            message: message.trim(),
          },
        }),
      })

      const data = (await response.json().catch(() => ({}))) as DonationResponse
      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Unable to start donation payment. Please try again.')
      }

      const checkoutUrl = data.payment?.authorizationUrl
      if (checkoutUrl) {
        window.location.href = checkoutUrl
        return
      }

      setStatus('success')
      setFeedback('Thank you. Your donor profile has been synced to Sedifex. Payment checkout is not configured yet.')
    } catch (error) {
      setStatus('error')
      setFeedback(error instanceof Error ? error.message : 'Unable to submit donation right now.')
    }
  }

  return (
    <main className="app">
      <header className="nav">
        <div className="container nav__inner">
          <a href="#top" className="brand" aria-label="Wesoamo Foundation home">
            <span className="brand__mark">W</span>
            <span className="brand__text">
              <span className="brand__name">Wesoamo Foundation</span>
              <span className="brand__sub">Give hope. Track impact.</span>
            </span>
          </a>
          <nav className="nav__links" aria-label="Main navigation">
            <a href="#programs">Programs</a>
            <a href="#impact">Impact</a>
            <a href="#donate" className="btn btn--small btn--primary">Donate</a>
          </nav>
        </div>
      </header>

      <section id="top" className="hero">
        <div className="container hero__inner">
          <div>
            <span className="pill">Community support powered by Sedifex donors</span>
            <h1>Support children, families, and community projects with a transparent donation flow.</h1>
            <p className="lead">
              Wesoamo Foundation connects donors with practical support programs. Your donation is recorded through Sedifex donor management so follow-up and reporting are easier.
            </p>
            <div className="hero__cta">
              <a href="#donate" className="btn btn--primary">Donate now</a>
              <a href="#programs" className="btn btn--outline">See what we support</a>
            </div>
            <div className="hero__mini">
              <div className="miniCard"><div className="miniCard__k">Focus</div><div className="miniCard__v">Education & welfare</div></div>
              <div className="miniCard"><div className="miniCard__k">Payments</div><div className="miniCard__v">Paystack checkout</div></div>
              <div className="miniCard"><div className="miniCard__k">Records</div><div className="miniCard__v">Synced to Sedifex</div></div>
            </div>
          </div>

          <div className="hero__art">
            <div className="heroBlob heroBlob--a" />
            <div className="heroBlob heroBlob--b" />
            <div className="heroCard">
              <div className="heroCard__title">How your donation is handled</div>
              <ul>
                <li>Donor profile is created in Sedifex.</li>
                <li>Donation transaction is recorded as pending.</li>
                <li>Donor is redirected to Paystack checkout.</li>
                <li>Wesoamo can follow up with proper donor records.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="programs" className="section section--soft">
        <div className="container">
          <div className="sectionHead">
            <h2>What your support helps us do</h2>
            <p>Choose an amount that fits your heart. Every contribution helps us plan, communicate, and report more clearly.</p>
          </div>
          <div className="grid3">
            <article className="card card--program">
              <h3>School support</h3>
              <p className="muted">Learning materials, student support, and practical educational assistance for children who need it most.</p>
            </article>
            <article className="card card--program">
              <h3>Family welfare</h3>
              <p className="muted">Food, clothing, basic needs, and emergency support for vulnerable families in our community.</p>
            </article>
            <article className="card card--program">
              <h3>Community outreach</h3>
              <p className="muted">Volunteer-led projects, visits, and outreach programs that bring direct help to people.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="donate" className="section">
        <div className="container twoCol">
          <div>
            <div className="sectionHead">
              <h2>Make a donation</h2>
              <p>Your donor details and pending donation will sync into Sedifex. If payment is configured, you will be redirected to Paystack.</p>
            </div>
            <div className="card card--promise">
              <div className="promiseTitle">Sedifex donor integration</div>
              <ul className="bullets">
                <li>Creates a donor profile.</li>
                <li>Records a pending fund transaction.</li>
                <li>Starts Paystack payment when enabled.</li>
                <li>Keeps donor follow-up organized.</li>
              </ul>
            </div>
          </div>

          <form className="card donationForm" onSubmit={handleDonate}>
            <label className="field">
              <span>Full name</span>
              <input value={donorName} onChange={(event) => setDonorName(event.target.value)} placeholder="Your name" required />
            </label>
            <label className="field">
              <span>Email</span>
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" />
            </label>
            <label className="field">
              <span>Phone</span>
              <input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+233 20 000 0000" />
            </label>
            <label className="field">
              <span>Donation amount (GHS)</span>
              <input type="number" min="1" step="1" value={amount} onChange={(event) => setAmount(event.target.value)} required />
            </label>
            <div className="presetRow" aria-label="Preset donation amounts">
              {presetAmounts.map((value) => (
                <button key={value} type="button" className="btn btn--small" onClick={() => setAmount(String(value))}>GHS {value}</button>
              ))}
            </div>
            <label className="field">
              <span>Message or dedication (optional)</span>
              <textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={3} placeholder="Add a short note" />
            </label>
            <label className="checkRow">
              <input type="checkbox" checked={anonymous} onChange={(event) => setAnonymous(event.target.checked)} />
              <span>Keep my donation anonymous in public updates</span>
            </label>
            {!sedifexStoreId ? (
              <p className="note errorText">Setup needed: add VITE_SEDIFEX_STORE_ID in your hosting environment.</p>
            ) : null}
            <button className="btn btn--primary submitButton" type="submit" disabled={status === 'submitting' || !canSubmit}>
              {status === 'submitting' ? 'Starting secure checkout…' : 'Donate with Paystack'}
            </button>
            {feedback ? <p className={`note ${status === 'error' ? 'errorText' : 'successText'}`}>{feedback}</p> : null}
            <p className="tiny">At least one contact field, email or phone, is required so Wesoamo can issue updates and receipts.</p>
          </form>
        </div>
      </section>

      <section id="impact" className="section section--soft">
        <div className="container stats">
          <div className="stat"><div className="stat__v">01</div><div className="stat__k">Donor profile</div></div>
          <div className="stat"><div className="stat__v">02</div><div className="stat__k">Pending donation</div></div>
          <div className="stat"><div className="stat__v">03</div><div className="stat__k">Paystack checkout</div></div>
          <div className="stat"><div className="stat__v">04</div><div className="stat__k">Sedifex records</div></div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footer__inner">
          <div>
            <div className="footer__brand">Wesoamo Foundation</div>
            <div className="footer__sub">Transparent giving connected to Sedifex donor management.</div>
          </div>
          <div className="footer__links">
            <a href="#donate">Donate</a>
            <a href="#programs">Programs</a>
            <a href="#top">Back to top</a>
          </div>
        </div>
      </footer>
    </main>
  )
}

export default App
