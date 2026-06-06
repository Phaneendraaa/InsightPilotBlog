import { ImageResponse } from 'next/og'
import { siteConfig } from '@/lib/site'

export const runtime = 'edge'
export const alt = siteConfig.name || 'Site preview'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  const name = siteConfig.name || 'Blog'
  const tagline = siteConfig.tagline || siteConfig.description.slice(0, 80)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#0f172a',
          padding: 80,
        }}
      >
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: '#f8fafc',
            textAlign: 'center',
            lineHeight: 1.2,
          }}
        >
          {name}
        </div>
        {tagline && (
          <div
            style={{
              fontSize: 28,
              color: '#94a3b8',
              textAlign: 'center',
              marginTop: 24,
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            {tagline}
          </div>
        )}
      </div>
    ),
    { ...size }
  )
}
