import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Source_Serif_4 } from 'next/font/google'
import './globals.css'
import { ThemeScript } from '@/components/ThemeScript'
import { siteConfig } from '@/lib/site'
import { buildHomeMetadata, buildWebSiteJsonLd, buildOrganizationJsonLd } from '@/lib/seo'

const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
})

const fontSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  preload: false,
  adjustFontFallback: true,
})

export const metadata: Metadata = {
  ...buildHomeMetadata(),
  title: {
    default: buildHomeMetadata().title as string,
    template: siteConfig.name ? `%s | ${siteConfig.name}` : '%s',
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Build AdSense snippet as a plain string — keeps it outside React's
  // reconciliation entirely, preventing the hydration mismatch caused by
  // browser extensions injecting scripts into <head>.
  const adsenseSnippet = siteConfig.adsenseClientId
    ? `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${siteConfig.adsenseClientId}" crossorigin="anonymous"></script>`
    : ''

  return (
    <html lang="en" className={`${fontSans.variable} ${fontSerif.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        {/* AdSense loader — injected via dangerouslySetInnerHTML so React never
            reconciles the <script> element, avoiding hydration mismatches from
            browser extensions that inject their own AdSense scripts. */}
        {adsenseSnippet && (
          <div
            id="adsense-loader"
            style={{ display: 'none' }}
            dangerouslySetInnerHTML={{ __html: adsenseSnippet }}
          />
        )}
        {siteConfig.name && (
          <>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: buildWebSiteJsonLd() }}
            />
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: buildOrganizationJsonLd() }}
            />
          </>
        )}
        {children}
      </body>
    </html>
  )
}
