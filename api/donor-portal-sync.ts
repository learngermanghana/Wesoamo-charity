import type { VercelRequest, VercelResponse } from '@vercel/node'

const CONTRACT_VERSION = '2026-04-13'

function text(value: unknown, max = 180) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function numberValue(value: unknown) {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : null
}

function getSedifexBaseUrl() {
  return (
    process.env.SEDIFEX_API_BASE_URL ||
    process.env.SEDIFEX_INTEGRATION_API_BASE_URL ||
    'https://us-central1-sedifex-web.cloudfunctions.net'
  ).replace(/\/$/, '')
}

function getIntegrationKey() {
  return (
    process.env.SEDIFEX_INTEGRATION_API_KEY ||
    process.env.SEDIFEX_INTEGRATION_KEY ||
    ''
  ).trim()
}

function resolveReturnUrl(req: VercelRequest) {
  const explicit = text(req.body?.returnUrl ?? req.body?.redirectUrl, 700)
  if (explicit) return explicit
  const origin = text(req.headers.origin, 700)
  return origin ? `${origin.replace(/\/$/, '')}/donation-success` : undefined
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'method-not-allowed' })

  const storeId = text(req.body?.storeId || process.env.SEDIFEX_STORE_ID || process.env.VITE_SEDIFEX_STORE_ID, 180)
  const apiKey = getIntegrationKey()
  const amount = numberValue(req.body?.amount ?? req.body?.donation?.amount)
  const currency = text(req.body?.currency ?? req.body?.donation?.currency, 20) || 'GHS'
  const donor = req.body?.donor && typeof req.body.donor === 'object' ? req.body.donor as Record<string, unknown> : {}
  const donorName = text(donor.name, 140)
  const donorEmail = text(donor.email, 220).toLowerCase()
  const donorPhone = text(donor.phone, 80)
  const sourceChannel = text(req.body?.sourceChannel, 120) || 'wesoamo-charity-website'
  const returnUrl = resolveReturnUrl(req)
  const clientOrderId = `wesoamo-donation-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const metadata = req.body?.metadata && typeof req.body.metadata === 'object' ? req.body.metadata as Record<string, unknown> : {}

  if (!storeId) return res.status(500).json({ ok: false, error: 'SEDIFEX_STORE_ID is not configured for this charity website.' })
  if (!apiKey) return res.status(500).json({ ok: false, error: 'SEDIFEX_INTEGRATION_API_KEY is not configured for this charity website server.' })
  if (!donorName) return res.status(400).json({ ok: false, error: 'Donor name is required.' })
  if (!donorEmail) return res.status(400).json({ ok: false, error: 'Donor email is required for Paystack checkout.' })
  if (!amount || amount <= 0) return res.status(400).json({ ok: false, error: 'Valid donation amount is required.' })

  try {
    const endpoint = `${getSedifexBaseUrl()}/integration/checkout/create`
    const sedifexPayload = {
      storeId,
      clientOrderId,
      orderType: 'custom',
      amount,
      currency,
      customer: {
        name: donorName,
        email: donorEmail,
        phone: donorPhone || null,
      },
      returnUrl,
      sourceChannel,
      sourceLabel: 'Wesoamo donation form',
      metadata: {
        ...metadata,
        pageType: 'donation',
        project: text(req.body?.pageId, 120) || text(metadata.project, 180) || 'Wesoamo donation',
        donorName,
        donorPhone: donorPhone || null,
        donorEmail,
        anonymous: Boolean(metadata.anonymous),
        source: text(metadata.source, 120) || sourceChannel,
        sourcePage: text(metadata.sourcePage, 120) || '/get-involved',
        clientOrderId,
      },
    }

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-api-key': apiKey,
        'X-Sedifex-Contract-Version': CONTRACT_VERSION,
      },
      body: JSON.stringify(sedifexPayload),
    })

    const data = await response.json().catch(() => ({})) as Record<string, unknown>
    const authorizationUrl = text(data.authorizationUrl ?? data.checkoutUrl, 1000)

    if (!response.ok || !authorizationUrl) {
      return res.status(response.ok ? 502 : response.status).json({
        ok: false,
        error: text(data.error, 300) || 'Sedifex checkout did not return a Paystack URL.',
        sedifex: data,
      })
    }

    return res.status(200).json({
      ok: true,
      reference: data.reference ?? data.payment_reference ?? null,
      sedifexOrderId: data.orderId ?? data.reference ?? null,
      clientOrderId,
      payment: {
        authorizationUrl,
        reference: data.reference ?? data.payment_reference ?? null,
        accessCode: data.accessCode ?? null,
      },
      sedifex: data,
    })
  } catch (error) {
    return res.status(502).json({
      ok: false,
      error: error instanceof Error ? error.message : 'Unable to create Sedifex checkout.',
    })
  }
}
