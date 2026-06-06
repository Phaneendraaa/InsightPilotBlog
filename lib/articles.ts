import fs from 'fs'
import path from 'path'
import { categories } from './categories'
import { sanitizeArticleHtml } from './sanitize'
import { extractFaq, type FaqItem } from './faq'
import { parseHtmlMeta } from './html-meta'
import { substituteSiteTokens } from './site'

export interface Article {
  slug: string
  category: string
  title: string
  description: string
  publishDate: string
  coverImage?: string
  tags?: string[]
  featured?: boolean
  author?: string
  authorImage?: string
  authorBio?: string
  faq?: FaqItem[]
}

interface ParsedArticleFile {
  meta: Article
  content: string
  faq: FaqItem[]
}

const contentDir = path.join(process.cwd(), 'content')

let articleIndexCache: Article[] | null = null
const parsedFileCache = new Map<string, ParsedArticleFile>()

function cacheKey(category: string, slug: string) {
  return `${category}/${slug}`
}

function parseArticleFile(category: string, slug: string): ParsedArticleFile | undefined {
  const key = cacheKey(category, slug)
  const cached = parsedFileCache.get(key)
  if (cached) return cached

  const filePath = path.join(contentDir, category, `${slug}.html`)
  if (!fs.existsSync(filePath)) return undefined

  const raw = substituteSiteTokens(fs.readFileSync(filePath, 'utf-8'))
  const { meta: htmlMeta, body } = parseHtmlMeta(raw)
  const content = sanitizeArticleHtml(body.trim())
  const faq = extractFaq(content)

  const meta: Article = {
    slug,
    category,
    title: htmlMeta.title ?? slug,
    description: htmlMeta.description ?? '',
    publishDate: htmlMeta.publishDate ?? new Date().toISOString().split('T')[0],
    coverImage: htmlMeta.coverImage,
    tags: htmlMeta.tags ?? [],
    featured: htmlMeta.featured ?? false,
    author: htmlMeta.author,
    authorImage: htmlMeta.authorImage,
    authorBio: htmlMeta.authorBio,
    faq: faq.length > 0 ? faq : undefined,
  }

  const parsed: ParsedArticleFile = { meta, content, faq }
  parsedFileCache.set(key, parsed)
  return parsed
}

function buildArticleIndex(): Article[] {
  const articles: Article[] = []

  for (const cat of categories) {
    const catDir = path.join(contentDir, cat.slug)
    if (!fs.existsSync(catDir)) continue

    const files = fs.readdirSync(catDir).filter((f) => f.endsWith('.html'))

    for (const file of files) {
      const slug = file.replace(/\.html$/, '')
      const parsed = parseArticleFile(cat.slug, slug)
      if (parsed) articles.push(parsed.meta)
    }
  }

  return articles.sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  )
}

/** Read all articles from all category folders (cached). */
export function getAllArticles(): Article[] {
  if (!articleIndexCache) {
    articleIndexCache = buildArticleIndex()
  }
  return articleIndexCache
}

/** Articles for a single category */
export function getArticlesByCategory(category: string): Article[] {
  return getAllArticles().filter((a) => a.category === category)
}

/** Featured articles only */
export function getFeaturedArticles(limit = 3): Article[] {
  return getAllArticles()
    .filter((a) => a.featured)
    .slice(0, limit)
}

/** Latest articles */
export function getLatestArticles(limit = 10): Article[] {
  return getAllArticles().slice(0, limit)
}

/** All category/slug pairs for static generation */
export function getAllArticlePaths(): { category: string; slug: string }[] {
  return getAllArticles().map((a) => ({ category: a.category, slug: a.slug }))
}

/** Sanitized HTML body */
export function getArticleContent(category: string, slug: string): string | undefined {
  return parseArticleFile(category, slug)?.content
}

/** Single article metadata */
export function getArticle(category: string, slug: string): Article | undefined {
  return parseArticleFile(category, slug)?.meta
}

/** FAQ items for an article */
export function getArticleFaq(category: string, slug: string): FaqItem[] {
  return parseArticleFile(category, slug)?.faq ?? []
}
