function env(key: string): string {
  return process.env[key] ?? process.env[`NEXT_PUBLIC_${key}`] ?? ''
}

export const siteConfig = {
  name: env('SITE_NAME'),
  displayName: env('SITE_NAME') ? `${env('SITE_NAME')}.` : '',
  tagline: env('SITE_TAGLINE'),
  description: env('SITE_DESCRIPTION'),
  /** Keyword-rich homepage title for SEO (20–60 chars). Falls back to name + tagline. */
  seoTitle: env('SITE_SEO_TITLE'),
  /** Homepage H1 — can include primary keywords. Falls back to seoTitle or name. */
  h1: env('SITE_H1'),
  url: env('SITE_URL') || env('NEXT_PUBLIC_SITE_URL'),
  contactEmail: env('CONTACT_EMAIL'),
  social: {
    twitter: env('TWITTER_URL'),
    facebook: env('FACEBOOK_URL'),
    instagram: env('INSTAGRAM_URL'),
    youtube: env('YOUTUBE_URL'),
    linkedin: env('LINKEDIN_URL'),
  },
  adsenseClientId: env('ADSENSE_CLIENT_ID'),
  adsensePublisherId: env('ADSENSE_PUBLISHER_ID'),
}

export function getSocialLinks() {
  return Object.entries(siteConfig.social).filter(([, url]) => url.length > 0) as [
    keyof typeof siteConfig.social,
    string,
  ][]
}

export function getHomeTitle(): string {
  if (siteConfig.seoTitle) return siteConfig.seoTitle
  const parts = [siteConfig.name, siteConfig.tagline].filter(Boolean)
  return parts.join(' — ') || siteConfig.description.slice(0, 60) || 'Home'
}

export function getHomeH1(): string {
  return siteConfig.h1 || getHomeTitle()
}

/** Replace {{TOKEN}} placeholders in HTML content with env-driven values. */
export function substituteSiteTokens(html: string): string {
  const url = typeof siteConfig.url === 'string' ? siteConfig.url.replace(/\/$/, '') : ''
  return html
    .replace(/\{\{SITE_NAME\}\}/g, siteConfig.name)
    .replace(/\{\{SITE_DESCRIPTION\}\}/g, siteConfig.description)
    .replace(/\{\{SITE_URL\}\}/g, url)
    .replace(/\{\{SITE_TAGLINE\}\}/g, siteConfig.tagline)
    .replace(/\{\{CONTACT_EMAIL\}\}/g, siteConfig.contactEmail)
    .replace(/\{\{ADSENSE_CLIENT_ID\}\}/g, siteConfig.adsenseClientId)
}
