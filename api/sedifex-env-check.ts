import type { VercelRequest, VercelResponse } from '@vercel/node'

function clean(value: unknown, max = 500) {
  return typeof value === 'string' ? value.trim().slice(0, max) : ''
}

function mask(value: string) {
  if (!value) return null
  if (value.length <= 8) return `${value.slice(0, 2)}***${value.slice(-2)}`
  return `${value.slice(0, 4)}***${value.slice(-4)}`
}

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const storeId = clean(process.env.SEDIFEX_STORE_ID || process.env.VITE_SEDIFEX_STORE_ID, 180)
  const baseUrl = clean(
    process.env.SEDIFEX_API_BASE_URL ||
      process.env.SEDIFEX_INTEGRATION_API_BASE_URL ||
      'https://us-central1-sedifex-web.cloudfunctions.net',
    700,
  ).replace(/\/$/, '')
  const keyFromNewName = clean(process.env.SEDIFEX_INTEGRATION_API_KEY, 500)
  const keyFromLegacyName = clean(process.env.SEDIFEX_INTEGRATION_KEY, 500)
  const selectedKey = keyFromNewName || keyFromLegacyName

  res.status(200).json({
    ok: true,
    expectedDonationEndpoint: `${baseUrl}/integration/checkout/create`,
    hasStoreId: Boolean(storeId),
    storeIdMasked: mask(storeId),
    hasSedifexIntegrationApiKey: Boolean(keyFromNewName),
    hasSedifexIntegrationKey: Boolean(keyFromLegacyName),
    selectedKeySource: keyFromNewName ? 'SEDIFEX_INTEGRATION_API_KEY' : keyFromLegacyName ? 'SEDIFEX_INTEGRATION_KEY' : null,
    selectedKeyLength: selectedKey.length || 0,
    selectedKeyMasked: mask(selectedKey),
    baseUrlLooksCorrect: baseUrl === 'https://us-central1-sedifex-web.cloudfunctions.net',
    warning:
      baseUrl.includes('/integration/checkout/create')
        ? 'SEDIFEX_API_BASE_URL must be only the base URL, not the full checkout path.'
        : null,
  })
}
