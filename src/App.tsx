import { useEffect, useMemo, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import './App.css'

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

type DonationResponse = {
  ok?: boolean
  payment?: { authorizationUrl?: string | null } | null
  error?: string
}

type IntakeResponse = { ok?: boolean; id?: string; error?: string }

type BlogPost = {
  id: string
  title: string
  slug?: string
  summary?: string
  content?: string
  imageUrl?: string
  linkUrl?: string
  publishedAt?: string
}

type SuccessPageKind = 'donation' | 'volunteer' | 'request'

const presetAmounts = [25, 50, 100, 200, 500]
const sedifexStoreId = import.meta.env.VITE_SEDIFEX_STORE_ID?.trim() ?? ''
const volunteerIntakeUrl = import.meta.env.VITE_SEDIFEX_VOLUNTEER_INTAKE_URL?.trim() || 'https://us-central1-sedifex-web.cloudfunctions.net/volunteerIntake'
const supportRequestIntakeUrl = import.meta.env.VITE_SEDIFEX_SUPPORT_REQUEST_INTAKE_URL?.trim() || 'https://us-central1-sedifex-web.cloudfunctions.net/supportRequestIntake'
const publicBlogUrl = import.meta.env.VITE_SEDIFEX_PUBLIC_BLOG_URL?.trim() || 'https://www.sedifex.com/api/public-blog'

const successCopy: Record<SuccessPageKind, { eyebrow: string; title: string; body: string; steps: string[]; primaryHref: string; primaryLabel: string; secondaryHref: string; secondaryLabel: string }> = {
  donation: {
    eyebrow: 'Donation received',
    title: 'Thank you for supporting Wesoamo Foundation.',
    body: 'Your donation request has been received. If you completed online payment, the confirmation will be matched to the donation record in Sedifex.',
    steps: ['The donor record is saved.', 'The donation amount is tracked.', 'The Wesoamo team can review and follow up.', 'You may receive updates when impact stories are published.'],
    primaryHref: '/inspiring-stories',
    primaryLabel: 'Read inspiring stories',
    secondaryHref: '/donate',
    secondaryLabel: 'Make another donation',
  },
  volunteer: {
    eyebrow: 'Volunteer application sent',
    title: 'Thank you for offering your time.',
    body: 'Your volunteer application has been sent to Wesoamo Foundation and saved in Sedifex for review.',
    steps: ['The team will review your details.', 'They may contact you for a short discussion.', 'Your skills and availability will be matched to a project.', 'You can support outreach, fundraising, mentoring, or operations.'],
    primaryHref: '/inspiring-stories',
    primaryLabel: 'See our stories',
    secondaryHref: '/volunteer',
    secondaryLabel: 'Submit another volunteer',
  },
  request: {
    eyebrow: 'Support request sent',
    title: 'Your request has been received.',
    body: 'Wesoamo Foundation will review the support request and follow up using the contact details provided.',
    steps: ['The request is saved securely for review.', 'The team checks urgency and available resources.', 'A team member may contact you for verification.', 'Approved support is tracked for follow-up and reporting.'],
    primaryHref: '/',
    primaryLabel: 'Return home',
    secondaryHref: '/request-support',
    secondaryLabel: 'Submit another request',
  },
}

function getCurrentPath() {
  const cleanPath = window.location.pathname.replace(/\/+$/, '')
  return cleanPath || '/'
}

function clean(value: string, max = 500) {
  return value.trim().slice(0, max)
}

function money(value: number) {
  return `GHS ${value.toLocaleString('en-GH', { minimumFractionDigits: value % 1 === 0 ? 0 : 2, maximumFractionDigits: 2 })}`
}

function optionalString(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : ''
}

function parseBlogPosts(raw: unknown): BlogPost[] {
  const source = Array.isArray(raw)
    ? raw
    : Array.isArray((raw as { posts?: unknown })?.posts)
      ? (raw as { posts: unknown[] }).posts
      : Array.isArray((raw as { items?: unknown })?.items)
        ? (raw as { items: unknown[] }).items
        : Array.isArray((raw as { data?: unknown })?.data)
          ? (raw as { data: unknown[] }).data
          : []

  return source.reduce<BlogPost[]>((items, item, index) => {
    const record = item as Record<string, unknown>
    const title = optionalString(record.title)
    if (!title) return items

    const slug = optionalString(record.slug)
    const summary = optionalString(record.summary) || optionalString(record.excerpt)
    const content = optionalString(record.content)
    const imageUrl = optionalString(record.imageUrl)
    const externalLinkUrl = optionalString(record.linkUrl)
    const publishedAt = optionalString(record.publishedAt) || optionalString(record.createdAt)
    const post: BlogPost = {
      id: String(record.id ?? slug ?? index),
      title,
    }

    if (slug) post.slug = slug
    if (summary) post.summary = summary
    if (content) post.content = content
    if (imageUrl) post.imageUrl = imageUrl
    if (externalLinkUrl) post.linkUrl = externalLinkUrl
    else if (slug && sedifexStoreId) post.linkUrl = `https://www.sedifex.com/public-blog/${encodeURIComponent(sedifexStoreId)}/${encodeURIComponent(slug)}`
    if (publishedAt) post.publishedAt = publishedAt

    items.push(post)
    return items
  }, [])
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
          <a href="/inspiring-stories">Inspiring stories</a>
          <a href="/volunteer">Volunteer</a>
          <a href="/request-support">Request support</a>
          <a href="/donate" className="btn btn--small btn--primary">Donate</a>
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
          <div className="footer__sub">Connected to Sedifex for donations, volunteers, requests, and stories.</div>
        </div>
        <div className="footer__links">
          <a href="/donate">Donate</a>
          <a href="/volunteer">Volunteer</a>
          <a href="/request-support">Request support</a>
          <a href="/inspiring-stories">Stories</a>
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
            <span className="pill">Community support powered by Sedifex</span>
            <h1>Support Wesoamo Foundation with transparent giving and organised follow-up.</h1>
            <p className="lead">Donate, volunteer, request support, and read updates. The important records feed into Sedifex so the NGO can manage work from one dashboard.</p>
            <div className="hero__cta">
              <a href="/donate" className="btn btn--primary">Donate now</a>
              <a href="/volunteer" className="btn btn--outline">Become a volunteer</a>
              <a href="/request-support" className="btn btn--outline">Request support</a>
            </div>
            <div className="hero__mini">
              <div className="miniCard"><div className="miniCard__k">Donations</div><div className="miniCard__v">Any amount</div></div>
              <div className="miniCard"><div className="miniCard__k">Volunteers</div><div className="miniCard__v">Website intake</div></div>
              <div className="miniCard"><div className="miniCard__k">Stories</div><div className="miniCard__v">From Sedifex blog</div></div>
            </div>
          </div>
          <div className="hero__art">
            <div className="heroBlob heroBlob--a" />
            <div className="heroBlob heroBlob--b" />
            <div className="heroCard">
              <div className="heroCard__title">Website pages now connected</div>
              <ul>
                <li>Donations use custom amounts.</li>
                <li>Stories load from Sedifex public blog.</li>
                <li>Volunteer forms post to Sedifex.</li>
                <li>Support requests post to Sedifex.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--soft">
        <div className="container">
          <div className="sectionHead">
            <h2>Choose how you want to help</h2>
            <p>Every action is structured so the NGO can review, follow up, and report properly.</p>
          </div>
          <div className="grid3">
            <article className="card card--program"><h3>Donate</h3><p className="muted">Give any amount and continue to Paystack checkout when configured.</p><a className="textLink" href="/donate">Open donation page</a></article>
            <article className="card card--program"><h3>Volunteer</h3><p className="muted">Submit your details, skills, and availability to the NGO volunteer list.</p><a className="textLink" href="/volunteer">Open volunteer page</a></article>
            <article className="card card--program"><h3>Request support</h3><p className="muted">Send a request for review and follow-up by the Wesoamo team.</p><a className="textLink" href="/request-support">Open request page</a></article>
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
      const donationSuccessUrl = `${window.location.origin}/donation-success`
      const response = await fetch('/api/donor-portal-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId: sedifexStoreId,
          pageId: 'donate',
          pageType: 'donation',
          sourceChannel: 'wesoamo-charity-website',
          donor: { name: clean(donorName, 140), email: clean(email, 180).toLowerCase(), phone: clean(phone, 80) },
          amount: amountNumber,
          donation: { amount: amountNumber, currency: 'GHS', type: 'custom_amount' },
          currency: 'GHS',
          initializePayment: true,
          returnUrl: donationSuccessUrl,
          redirectUrl: donationSuccessUrl,
          metadata: { source: 'wesoamo-charity-website', sourcePage: '/donate', anonymous, message: clean(message, 1000), donationAmount: amountNumber, successUrl: donationSuccessUrl },
        }),
      })

      const data = (await response.json().catch(() => ({}))) as DonationResponse
      if (!response.ok || !data.ok) throw new Error(data.error || 'Unable to start donation payment. Please try again.')

      const checkoutUrl = data.payment?.authorizationUrl
      if (checkoutUrl) {
        window.location.href = checkoutUrl
        return
      }

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
          <span className="pill">Any amount donation</span>
          <div className="sectionHead pageTitleBlock"><h1>Donate to Wesoamo Foundation</h1><p>Enter any amount. Sedifex records the donation and Paystack checkout receives the same amount.</p></div>
          <div className="card card--promise"><div className="promiseTitle">Donation flow</div><ul className="bullets"><li>Donor profile is synced to Sedifex.</li><li>The exact donation amount is recorded.</li><li>Paystack checkout starts when configured.</li><li>The NGO can follow up with clean records.</li></ul></div>
        </div>
        <form className="card donationForm" onSubmit={handleDonate}>
          <label className="field"><span>Full name</span><input value={donorName} onChange={(event) => setDonorName(event.target.value)} placeholder="Your name" required /></label>
          <label className="field"><span>Email</span><input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" /></label>
          <label className="field"><span>Phone</span><input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+233 20 000 0000" /></label>
          <label className="field"><span>Donation amount (GHS)</span><input type="number" min="1" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} required /></label>
          <div className="presetRow" aria-label="Preset donation amounts">{presetAmounts.map((value) => <button key={value} type="button" className="btn btn--small" onClick={() => setAmount(String(value))}>{money(value)}</button>)}</div>
          <label className="field"><span>Message or dedication (optional)</span><textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={3} placeholder="Add a short note" /></label>
          <label className="checkRow"><input type="checkbox" checked={anonymous} onChange={(event) => setAnonymous(event.target.checked)} /><span>Keep my donation anonymous in public updates</span></label>
          {!sedifexStoreId ? <p className="note errorText">Setup needed: add VITE_SEDIFEX_STORE_ID in Vercel.</p> : null}
          <button className="btn btn--primary submitButton" type="submit" disabled={status === 'submitting' || !canSubmit}>{status === 'submitting' ? 'Starting checkout…' : `Donate ${Number.isFinite(amountNumber) && amountNumber > 0 ? money(amountNumber) : ''}`}</button>
          {feedback ? <p className={`note ${status === 'error' ? 'errorText' : 'successText'}`}>{feedback}</p> : null}
          <p className="tiny">At least one contact field, email or phone, is required.</p>
        </form>
      </div>
    </section>
  )
}

function InspiringStoriesPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    async function loadStories() {
      if (!sedifexStoreId) {
        setError('Setup needed: add VITE_SEDIFEX_STORE_ID so stories can load from Sedifex.')
        setLoading(false)
        return
      }
      try {
        const response = await fetch(`${publicBlogUrl}?${new URLSearchParams({ storeId: sedifexStoreId }).toString()}`, { cache: 'no-store' })
        const data = await response.json().catch(() => ({}))
        if (!response.ok) throw new Error((data as { error?: string }).error || 'Unable to load stories.')
        if (!active) return
        setPosts(parseBlogPosts(data))
        setError('')
      } catch (loadError) {
        if (active) setError(loadError instanceof Error ? loadError.message : 'Unable to load stories from Sedifex.')
      } finally {
        if (active) setLoading(false)
      }
    }
    void loadStories()
    return () => { active = false }
  }, [])

  return (
    <section className="section pageSection">
      <div className="container">
        <div className="routeHero"><span className="pill">Sedifex public blog</span><h1>Inspiring stories</h1><p>Stories published in Sedifex appear here automatically.</p></div>
        {loading ? <p className="note">Loading inspiring stories…</p> : null}
        {error ? <p className="note errorText">{error}</p> : null}
        {!loading && !error && posts.length === 0 ? <div className="card emptyState"><h3>No stories published yet</h3><p className="muted">Create posts in Sedifex Blog and they will appear here.</p></div> : null}
        {posts.length > 0 ? <div className="blogGrid storiesGrid">{posts.map((post) => <article className="card card--blog storyCard" key={post.id}>{post.imageUrl ? <img className="blogThumb" src={post.imageUrl} alt={post.title} loading="lazy" /> : null}<div className="blogPostMeta">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Wesoamo story'}</div><h3>{post.title}</h3><p className="muted">{post.summary || post.content?.replace(/<[^>]+>/g, '').slice(0, 180) || 'Read this update from Wesoamo Foundation.'}</p>{post.linkUrl ? <a className="textLink" href={post.linkUrl} target="_blank" rel="noreferrer">Read story</a> : null}</article>)}</div> : null}
      </div>
    </section>
  )
}

function VolunteerPage() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [skill, setSkill] = useState('')
  const [availability, setAvailability] = useState('')
  const [preferredProject, setPreferredProject] = useState('')
  const [location, setLocation] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState<SubmitState>('idle')
  const [feedback, setFeedback] = useState('')
  const canSubmit = Boolean(name.trim()) && Boolean(phone.trim() || email.trim())

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFeedback('')
    if (!canSubmit) { setStatus('error'); setFeedback('Please enter your name and at least one contact.'); return }
    if (!sedifexStoreId) { setStatus('error'); setFeedback('Setup needed: add VITE_SEDIFEX_STORE_ID in Vercel.'); return }
    try {
      setStatus('submitting')
      const response = await fetch(volunteerIntakeUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ storeId: sedifexStoreId, name: clean(name, 140), phone: clean(phone, 80), email: clean(email, 180).toLowerCase(), skill: clean(skill, 180), availability: clean(availability, 180), preferredProject: clean(preferredProject, 180), location: clean(location, 180), notes: clean(notes, 1000) }) })
      const data = (await response.json().catch(() => ({}))) as IntakeResponse
      if (!response.ok || !data.ok) throw new Error(data.error || 'Unable to submit volunteer application.')
      goTo('/volunteer-success')
    } catch (submitError) { setStatus('error'); setFeedback(submitError instanceof Error ? submitError.message : 'Unable to submit right now.') }
  }

  return <FormPage title="Become a volunteer" subtitle="Share your time, skills, or network. Your form goes straight into the Wesoamo volunteer list in Sedifex." asideTitle="Volunteer areas" asideItems={['Field support', 'Fundraising', 'Mentoring', 'Operations']} onSubmit={handleSubmit} status={status} feedback={feedback} buttonText="Submit volunteer form" canSubmit={canSubmit}><label className="field"><span>Full name</span><input value={name} onChange={(e) => setName(e.target.value)} required /></label><label className="field"><span>Phone</span><input value={phone} onChange={(e) => setPhone(e.target.value)} /></label><label className="field"><span>Email</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label><label className="field"><span>Skill / interest</span><input value={skill} onChange={(e) => setSkill(e.target.value)} /></label><label className="field"><span>Availability</span><input value={availability} onChange={(e) => setAvailability(e.target.value)} /></label><label className="field"><span>Preferred project</span><input value={preferredProject} onChange={(e) => setPreferredProject(e.target.value)} /></label><label className="field"><span>Location</span><input value={location} onChange={(e) => setLocation(e.target.value)} /></label><label className="field"><span>Notes</span><textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} /></label></FormPage>
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
      const response = await fetch(supportRequestIntakeUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ storeId: sedifexStoreId, name: clean(name, 140), phone: clean(phone, 80), email: clean(email, 180).toLowerCase(), supportType: clean(supportType, 160), needSummary: clean(needSummary, 1000), location: clean(location, 180), householdSize: clean(householdSize, 80), priority, urgency: priority }) })
      const data = (await response.json().catch(() => ({}))) as IntakeResponse
      if (!response.ok || !data.ok) throw new Error(data.error || 'Unable to submit support request.')
      goTo('/request-success')
    } catch (submitError) { setStatus('error'); setFeedback(submitError instanceof Error ? submitError.message : 'Unable to submit right now.') }
  }

  return <FormPage title="Request support" subtitle="Send a request for review. The details are saved in Sedifex for Wesoamo Foundation to follow up." asideTitle="Request flow" asideItems={['Submit request', 'Team reviews details', 'Follow-up is recorded', 'Status is tracked']} onSubmit={handleSubmit} status={status} feedback={feedback} buttonText="Submit support request" canSubmit={canSubmit}><label className="field"><span>Full name</span><input value={name} onChange={(e) => setName(e.target.value)} required /></label><label className="field"><span>Phone</span><input value={phone} onChange={(e) => setPhone(e.target.value)} /></label><label className="field"><span>Email</span><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label><label className="field"><span>Support type</span><input value={supportType} onChange={(e) => setSupportType(e.target.value)} required /></label><label className="field"><span>Location</span><input value={location} onChange={(e) => setLocation(e.target.value)} /></label><label className="field"><span>Household size</span><input value={householdSize} onChange={(e) => setHouseholdSize(e.target.value)} /></label><label className="field"><span>Priority</span><select value={priority} onChange={(e) => setPriority(e.target.value)}><option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option></select></label><label className="field"><span>Need summary</span><textarea value={needSummary} onChange={(e) => setNeedSummary(e.target.value)} rows={4} /></label></FormPage>
}

function FormPage({ title, subtitle, asideTitle, asideItems, children, onSubmit, status, feedback, buttonText, canSubmit }: { title: string; subtitle: string; asideTitle: string; asideItems: string[]; children: ReactNode; onSubmit: (event: FormEvent<HTMLFormElement>) => void; status: SubmitState; feedback: string; buttonText: string; canSubmit: boolean }) {
  return <section className="section pageSection"><div className="container twoCol"><div><span className="pill">Connected to Sedifex</span><div className="sectionHead pageTitleBlock"><h1>{title}</h1><p>{subtitle}</p></div><div className="card card--promise"><div className="promiseTitle">{asideTitle}</div><ul className="bullets">{asideItems.map((item) => <li key={item}>{item}</li>)}</ul></div></div><form className="card donationForm" onSubmit={onSubmit}>{children}<button className="btn btn--primary submitButton" type="submit" disabled={status === 'submitting' || !canSubmit}>{status === 'submitting' ? 'Sending…' : buttonText}</button>{feedback ? <p className={`note ${status === 'error' ? 'errorText' : 'successText'}`}>{feedback}</p> : null}<p className="tiny">This form posts directly to Sedifex Firebase Functions, so it does not add a Vercel serverless API route.</p></form></div></section>
}

function SuccessPage({ kind }: { kind: SuccessPageKind }) {
  const copy = successCopy[kind]
  return (
    <section className="section pageSection">
      <div className="container twoCol">
        <div>
          <span className="pill">{copy.eyebrow}</span>
          <div className="sectionHead pageTitleBlock">
            <h1>{copy.title}</h1>
            <p>{copy.body}</p>
          </div>
          <div className="hero__cta">
            <a href={copy.primaryHref} className="btn btn--primary">{copy.primaryLabel}</a>
            <a href={copy.secondaryHref} className="btn btn--outline">{copy.secondaryLabel}</a>
          </div>
        </div>
        <div className="card card--promise">
          <div className="promiseTitle">What happens next</div>
          <ul className="bullets">
            {copy.steps.map((step) => <li key={step}>{step}</li>)}
          </ul>
        </div>
      </div>
    </section>
  )
}

function App() {
  const path = getCurrentPath()
  let page = <HomePage />
  if (path === '/donate') page = <DonatePage />
  if (path === '/donation-success') page = <SuccessPage kind="donation" />
  if (path === '/inspiring-stories') page = <InspiringStoriesPage />
  if (path === '/volunteer' || path === '/volunter') page = <VolunteerPage />
  if (path === '/volunteer-success') page = <SuccessPage kind="volunteer" />
  if (path === '/request' || path === '/request-support') page = <RequestSupportPage />
  if (path === '/request-success') page = <SuccessPage kind="request" />

  return <main className="app"><Nav />{page}<Footer /><div className="floatWrap" aria-label="Quick actions"><a className="floatBtn floatBtn--donate" href="/donate">Donate</a><a className="floatBtn" href="/request-support">Request help</a></div></main>
}

export default App