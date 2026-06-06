import { getAllArticles } from '@/lib/articles'
import { siteConfig } from '@/lib/site'

export function GET() {
  const base = siteConfig.url.replace(/\/$/, '')
  const articles = getAllArticles()

  const items = articles
    .map((article) => {
      const url = `${base}/${article.category}/${article.slug}`
      return `<item>
  <title><![CDATA[${escapeXml(article.title)}]]></title>
  <link>${url}</link>
  <guid isPermaLink="true">${url}</guid>
  <description><![CDATA[${escapeXml(article.description)}]]></description>
  <pubDate>${new Date(article.publishDate).toUTCString()}</pubDate>
</item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)}</title>
    <link>${base}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${base}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
