import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import './App.css'

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'
type DonationResponse = { ok?: boolean; payment?: { authorizationUrl?: string | null } | null; error?: string }
type IntakeResponse = { ok?: boolean; id?: string; error?: string }

const presetAmounts = [25, 50, 100, 200, 500]
const sedifexStoreId = import.meta.env.VITE_SEDIFEX_STORE_ID?.trim() ?? ''

function clean(value: string, max = 500) {
  return value.trim().slice(0, max)
}

function money(value: number) {
  return `GHS ${value.toLocaleString('en-GH', { minimumFractionDigits: value % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })}`
}

function getCurrentPath() {
  const cleanPath = window.location.pathname.replace(/\/+$/, '')
  return cleanPath || '/'
}

function goTo(path: string) {
  window.location.assign(path)
}

function Nav() {
  return (
    <header className="nav">
      <div className="container nav__inner">
        <a href="/" className="brand" aria-label="Wesoamo Foundation home">
          <span className="brand__mark">W</span>
          <span className="brand__text">
            <span className="brand__name">Wesoamo Foundation</span>
            <span className="brand__sub">Give hope. Track impact.</span>
          </span>
        </a>
        <nav className="nav__links" aria-label="Main navigation">
          <a href="/get-involved" className="btn btn--small btn--primary">Donate</a>
          <a href="/request-support">Request support</a>
        </nav>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <div className="footer__brand">Wesoamo Foundation</div>
          <div className="footer__sub">Donations and support requests are connected to Sedifex.</div>
        </div>
        <div className="footer__links">
          <a href="/get-involved">Donate</a>
          <a href="/request-support">Request support</a>
        </div>
      </div>
    </footer>
  )
}

function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="container hero__inner">
          <div>
            <span className="pill">Powered by Sedifex</span>
            <h1>Support Wesoamo Foundation with transparent giving and organised follow-up.</h1>
            <p className="lead">Donors can fill their details and pay online. Support requests are saved into Sedifex for review and follow-up.</p>
            <div className="hero__cta">
              <a href="/get-involved" className="btn btn--primary">Donate now</a>
              <a href="/request-support" className="btn btn--outline">Request support</a>
            </div>
          </div>
          <div className="hero__art">
            <div className="heroBlob heroBlob--a" />
            <div className="heroBlob heroBlob--b" />
            <div className="heroCard">
              <div className="heroCard__title">Connected pages</div>
              <ul>
                <li>Donor records sync to Sedifex.</li>
                <li>Online donations open payment checkout.</li>
                <li>Support requests are saved for review.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="grid3">
            <article className="card card--program"><h3>Donate</h3><p className="muted">Give any amount and continue to payment.</p><a className="textLink" href="/get-involved">Open donor page</a></article>
            <article className="card card--program"><h3>Request support</h3><p className="muted">Submit a request for review by the Wesoamo team.</p><a className="textLink" href="/request-support">Open request form</a></article>
            <article className="card card--program"><h3>Track impact</h3><p className="muted">Sedifex keeps records organised for reporting and follow-up.</p><a className="textLink" href="/get-involved">Support now</a></article>
          </div>
        </div>
      </section>
    </>
  )
}

function DonatePage() {
  const [donorName, setDonorName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [amount, setAmount] = useState('100')
  const [message, setMessage] = useState('')
  const [anonymous, setAnonymous] = useState(false)
  const [status, setStatus] = useState<SubmitState>('idle')
  const [feedback, setFeedback] = useState('')
  const amountNumber = useMemo(() => Number(amount), [amount])
  const canSubmit = Boolean(donorName.trim()) && Boolean(email.trim() || phone.trim()) && Number.isFinite(amountNumber) && amountNumber > 0

  async function handleDonate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeedback('')
    if (!canSubmit) { setStatus('error'); setFeedback('Please enter your name, contact, and a valid amount.'); return }
    if (!sedifexStoreId) { setStatus('error'); setFeedback('Setup needed: add VITE_SEDIFEX_STORE_ID in Vercel.'); return }

    try {
      setStatus('submitting')
      const successUrl = `${window.location.origin}/donation-success`
      const response = await fetch('/api/donor-portal-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId: sedifexStoreId,
          pageId: 'get-involved',
          pageType: 'donation',
          sourceChannel: 'wesoamo-charity-website',
          donor: { name: clean(donorName, 140), email: clean(email, 180).toLowerCase(), phone: clean(phone, 80) },
          amount: amountNumber,
          donation: { amount: amountNumber, currency: 'GHS', type: 'custom_amount', message: clean(message, 1000), anonymous },
          currency: 'GHS',
          initializePayment: true,
          returnUrl: successUrl,
          redirectUrl: successUrl,
          metadata: { source: 'wesoamo-charity-website', sourcePage: '/get-involved', message: clean(message, 1000), anonymous },
        }),
      })
      const data = (await response.json().catch(() => ({}))) as DonationResponse
      if (!response.ok || !data.ok) throw new Error(data.error || 'Unable to start donation payment.')
      if (data.payment?.authorizationUrl) { window.location.href = data.payment.authorizationUrl; return }
      goTo('/donation-success')
    } catch (error) {
      setStatus('error')
      setFeedback(error instanceof Error ? error.message : 'Unable to submit donation right now.')
    }
  }

  return (
    <section className="section pageSection">
      <div className="container twoCol">
        <div>
          <span className="pill">Donor page connected to Sedifex</span>
          <div className="sectionHead pageTitleBlock"><h1>Donate to Wesoamo Foundation</h1><p>Fill your donor details, enter the amount, and continue to payment. The record syncs to Sedifex.</p></div>
          <div className="card card--promise"><div className="promiseTitle">Donation flow</div><ul className="bullets"><li>Donor profile is saved.</li><li>Donation amount is tracked.</li><li>Payment checkout opens.</li><li>Wesoamo can follow up from Sedifex.</li></ul></div>
        </div>
        <form className="card donationForm" onSubmit={handleDonate}>
          <label className="field"><span>Full name</span><input value={donorName} onChange={(event) => setDonorName(event.target.value)} required /></label>
          <label className="field"><span>Email</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <label className="field"><span>Phone</span><input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} /></label>
          <label className="field"><span>Donation amount (GHS)</span><input type="number" min="1" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} required /></label>
          <div className="presetRow">{presetAmounts.map((value) => <button key={value} type="button" className="btn btn--small" onClick={() => setAmount(String(value))}>{money(value)}</button>)}</div>
          <label className="field"><span>Message or dedication</span><textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={3} /></label>
          <label className="checkRow"><input type="checkbox" checked={anonymous} onChange={(event) => setAnonymous(event.target.checked)} /><span>Keep my donation anonymous in public updates</span></label>
          <button className="btn btn--primary submitButton" type="submit" disabled={status === 'submitting' || !canSubmit}>{status === 'submitting' ? 'Starting checkout…' : `Donate ${Number.isFinite(amountNumber) && amountNumber > 0 ? money(amountNumber) : ''}`}</button>
          {feedback ? <p className={`note ${status === 'error' ? 'errorText' : 'successText'}`}>{feedback}</p> : null}
        </form>
      </div>
    </section>
  )
}

function RequestSupportPage() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [supportType, setSupportType] = useState('')
  const [needSummary, setNeedSummary] = useState('')
  const [location, setLocation] = useState('')
  const [householdSize, setHouseholdSize] = useState('')
  const [priority, setPriority] = useState('normal')
  const [status, setStatus] = useState<SubmitState>('idle')
  const [feedback, setFeedback] = useState('')
  const canSubmit = Boolean(name.trim()) && Boolean(supportType.trim()) && Boolean(phone.trim() || email.trim())

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeedback('')
    if (!canSubmit) { setStatus('error'); setFeedback('Please enter your name, contact, and support type.'); return }
    if (!sedifexStoreId) { setStatus('error'); setFeedback('Setup needed: add VITE_SEDIFEX_STORE_ID in Vercel.'); return }

    try {
      setStatus('submitting')
      const response = await fetch('/api/support-request-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeId: sedifexStoreId, name: clean(name, 140), phone: clean(phone, 80), email: clean(email, 180).toLowerCase(), supportType: clean(supportType, 160), needSummary: clean(needSummary, 1000), location: clean(location, 180), householdSize: clean(householdSize, 80), priority, urgency: priority, source: 'wesoamo-charity-website', sourcePage: '/request-support' }),
      })
      const data = (await response.json().catch(() => ({}))) as IntakeResponse
      if (!response.ok || !data.ok) throw new Error(data.error || 'Unable to submit support request.')
      goTo('/request-success')
    } catch (error) {
      setStatus('error')
      setFeedback(error instanceof Error ? error.message : 'Unable to submit right now.')
    }
  }

  return <FormPage title="Request support" subtitle="Submit a request for review. The details are saved in Sedifex for Wesoamo Foundation to follow up." asideItems={['Submit request', 'Saved into Sedifex', 'Team reviews urgency', 'Follow-up is tracked']} onSubmit={handleSubmit} status={status} feedback={feedback} buttonText="Submit support request" canSubmit={canSubmit}><label className="field"><span>Full name</span><input value={name} onChange={(e) => setName(e.target.value)} required /></label><label className="field"><span>Phone</span><input value={phone} onChange={(e) => setPhone(e.target.value)} /></label><label className="field"><span>Email</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label><label className="field"><span>Support type</span><input value={supportType} onChange={(e) => setSupportType(e.target.value)} required /></label><label className="field"><span>Location</span><input value={location} onChange={(e) => setLocation(e.target.value)} /></label><label className="field"><span>Household size</span><input value={householdSize} onChange={(e) => setHouseholdSize(e.target.value)} /></label><label className="field"><span>Priority</span><select value={priority} onChange={(e) => setPriority(e.target.value)}><option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option></select></label><label className="field"><span>Need summary</span><textarea value={needSummary} onChange={(e) => setNeedSummary(e.target.value)} rows={4} /></label></FormPage>
}

function FormPage({ title, subtitle, asideItems, children, onSubmit, status, feedback, buttonText, canSubmit }: { title: string; subtitle: string; asideItems: string[]; children: React.ReactNode; onSubmit: (event: FormEvent<HTMLFormElement>) => void; status: SubmitState; feedback: string; buttonText: string; canSubmit: boolean }) {
  return <section className="section pageSection"><div className="container twoCol"><div><span className="pill">Connected to Sedifex</span><div className="sectionHead pageTitleBlock"><h1>{title}</h1><p>{subtitle}</p></div><div className="card card--promise"><div className="promiseTitle">What happens next</div><ul className="bullets">{asideItems.map((item) => <li key={item}>{item}</li>)}</ul></div></div><form className="card donationForm" onSubmit={onSubmit}>{children}<button className="btn btn--primary submitButton" type="submit" disabled={status === 'submitting' || !canSubmit}>{status === 'submitting' ? 'Sending…' : buttonText}</button>{feedback ? <p className={`note ${status === 'error' ? 'errorText' : 'successText'}`}>{feedback}</p> : null}</form></div></section>
}

function SuccessPage({ kind }: { kind: 'donation' | 'request' }) {
  const donation = kind === 'donation'
  return <section className="section pageSection"><div className="container twoCol"><div><span className="pill">{donation ? 'Donation received' : 'Support request sent'}</span><div className="sectionHead pageTitleBlock"><h1>{donation ? 'Thank you for supporting Wesoamo Foundation.' : 'Your request has been received.'}</h1><p>{donation ? 'Your donor and donation record has been sent to Sedifex. Payment confirmation is matched after checkout verification.' : 'Wesoamo Foundation will review the request in Sedifex and follow up.'}</p></div><div className="hero__cta"><a href="/" className="btn btn--primary">Return home</a><a href={donation ? '/get-involved' : '/request-support'} className="btn btn--outline">{donation ? 'Donate again' : 'Submit another request'}</a></div></div></div></section>
}

function App() {
  const path = getCurrentPath()
  let page = <HomePage />
  if (path === '/get-involved' || path === '/donate') page = <DonatePage />
  if (path === '/donation-success') page = <SuccessPage kind="donation" />
  if (path === '/request' || path === '/request-support') page = <RequestSupportPage />
  if (path === '/request-success') page = <SuccessPage kind="request" />

  return <main className="app"><Nav />{page}<Footer /><div className="floatWrap" aria-label="Quick actions"><a className="floatBtn floatBtn--donate" href="/get-involved">Donate</a><a className="floatBtn" href="/request-support">Request help</a></div></main>
}

export default App
