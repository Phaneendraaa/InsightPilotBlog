import fs from 'fs'
import path from 'path'
import { sanitizeArticleHtml } from './sanitize'
import { parseHtmlMeta } from './html-meta'
import { substituteSiteTokens } from './site'

export interface StaticPage {
  slug: string
  title: string
  description: string
  subtitle?: string
}

const pagesDir = path.join(process.cwd(), 'content', 'pages')

const pageCache = new Map<string, { meta: StaticPage; content: string }>()

function parsePage(slug: string) {
  const cached = pageCache.get(slug)
  if (cached) return cached

  const filePath = path.join(pagesDir, `${slug}.html`)
  if (!fs.existsSync(filePath)) return undefined

  const raw = substituteSiteTokens(fs.readFileSync(filePath, 'utf-8'))
  const { meta: htmlMeta, body } = parseHtmlMeta(raw)
  const content = sanitizeArticleHtml(body.trim())

  const parsed = {
    meta: {
      slug,
      title: htmlMeta.title ?? slug,
      description: htmlMeta.description ?? '',
      subtitle: htmlMeta.subtitle,
    },
    content,
  }

  pageCache.set(slug, parsed)
  return parsed
}

export function getStaticPage(slug: string): StaticPage | undefined {
  return parsePage(slug)?.meta
}

export function getStaticPageContent(slug: string): string | undefined {
  return parsePage(slug)?.content
}

export function getAllStaticPageSlugs(): string[] {
  if (!fs.existsSync(pagesDir)) return []
  return fs.readdirSync(pagesDir)
    .filter((f) => f.endsWith('.html'))
    .map((f) => f.replace(/\.html$/, ''))
}
