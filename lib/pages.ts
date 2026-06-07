import fs from 'fs'
import path from 'path'
import { sanitizeArticleHtml } from './sanitize'
import { substituteSiteTokens } from './site'

export interface StaticPage {
  slug: string
  title: string
  description: string
  subtitle?: string
}

interface PageMeta {
  title?: string
  description?: string
  subtitle?: string
}

const pagesDir = path.join(process.cwd(), 'content', 'pages')
const pageCache = new Map<string, { meta: StaticPage; content: string }>()

function parsePage(slug: string) {
  const cached = pageCache.get(slug)
  if (cached) return cached

  const htmlPath = path.join(pagesDir, `${slug}.html`)
  const jsonPath = path.join(pagesDir, `${slug}.json`)

  if (!fs.existsSync(htmlPath) || !fs.existsSync(jsonPath)) return undefined

  let jsonMeta: PageMeta = {}
  try {
    jsonMeta = JSON.parse(
      substituteSiteTokens(fs.readFileSync(jsonPath, 'utf-8'))
    ) as PageMeta
  } catch {
    jsonMeta = {}
  }

  const rawHtml = substituteSiteTokens(fs.readFileSync(htmlPath, 'utf-8'))
  const content = sanitizeArticleHtml(rawHtml.trim())

  const parsed = {
    meta: {
      slug,
      title: jsonMeta.title ?? slug,
      description: jsonMeta.description ?? '',
      subtitle: jsonMeta.subtitle,
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
