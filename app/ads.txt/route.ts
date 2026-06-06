import { siteConfig } from '@/lib/site'

export function GET() {
  const raw = siteConfig.adsensePublisherId.trim()
  const publisherId = raw
    ? raw.startsWith('pub-')
      ? raw
      : `pub-${raw}`
    : siteConfig.adsenseClientId.replace(/^ca-pub-/, 'pub-')

  const body = publisherId && publisherId !== 'pub-'
    ? `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0`
    : '# Set ADSENSE_PUBLISHER_ID or ADSENSE_CLIENT_ID in environment variables'

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
