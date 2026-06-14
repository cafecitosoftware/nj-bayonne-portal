const CAMPAIGN_PARAMS = {
  utm_source: 'cafecito-software',
  utm_medium: 'calendar',
  utm_campaign: 'bayonne-portal'
}

export function withCampaignParams(rawUrl) {
  if (!rawUrl) return ''

  try {
    const base = typeof window !== 'undefined' && window.location
      ? window.location.origin
      : 'http://localhost'
    const url = new URL(rawUrl, base)

    Object.entries(CAMPAIGN_PARAMS).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })

    return url.toString()
  } catch {
    return rawUrl
  }
}