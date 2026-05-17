import type { VercelRequest, VercelResponse } from '@vercel/node'

function text(value: unknown, max = 500) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' })

  const endpoint =
    process.env.SEDIFEX_SUPPORT_REQUEST_SYNC_URL ||
    process.env.SEDIFEX_SUPPORT_REQUEST_INTAKE_URL ||
    'https://us-central1-sedifex-web.cloudfunctions.net/supportRequestIntake'
  const defaultStoreId = process.env.SEDIFEX_STORE_ID || process.env.VITE_SEDIFEX_STORE_ID || ''
  const incomingStoreId = text(req.body?.storeId, 120)
  const storeId = incomingStoreId || defaultStoreId

  if (!storeId) {
    return res.status(500).json({ error: 'SEDIFEX_STORE_ID is not configured for this charity website.' })
  }

  const payload = {
    ...req.body,
    storeId,
    source: req.body?.source || 'wesoamo-charity-website',
    sourceChannel: req.body?.sourceChannel || 'wesoamo-charity-website',
    pageType: req.body?.pageType || 'request_support',
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await response.json().catch(() => ({}))
    return res.status(response.status).json(data)
  } catch (error) {
    return res.status(502).json({
      error: error instanceof Error ? error.message : 'Unable to reach Sedifex support request endpoint.',
    })
  }
}
