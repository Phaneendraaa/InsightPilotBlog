import fs from 'fs'
import path from 'path'
import { categories } from './categories'
import { sanitizeArticleHtml } from './sanitize'
import { extractFaq, type FaqItem } from './faq'
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

interface ArticleMeta {
  title?: string
  description?: string
  publishDate?: string
  coverImage?: string
  tags?: string[]
  featured?: boolean
  author?: string
  authorImage?: string
  authorBio?: string
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

  const htmlPath = path.join(contentDir, category, `${slug}.html`)
  const jsonPath = path.join(contentDir, category, `${slug}.json`)

  if (!fs.existsSync(htmlPath) || !fs.existsSync(jsonPath)) return undefined

  // Read and parse JSON metadata
  let jsonMeta: ArticleMeta = {}
  try {
    jsonMeta = JSON.parse(fs.readFileSync(jsonPath, 'utf-8')) as ArticleMeta
  } catch {
    jsonMeta = {}
  }

  // Read, token-substitute, and sanitize HTML body
  const rawHtml = substituteSiteTokens(fs.readFileSync(htmlPath, 'utf-8'))
  const content = sanitizeArticleHtml(rawHtml.trim())
  const faq = extractFaq(content)

  const meta: Article = {
    slug,
    category,
    title: jsonMeta.title ?? slug,
    description: jsonMeta.description ?? '',
    publishDate: jsonMeta.publishDate ?? new Date().toISOString().split('T')[0],
    coverImage: jsonMeta.coverImage,
    tags: jsonMeta.tags ?? [],
    featured: jsonMeta.featured ?? false,
    author: jsonMeta.author,
    authorImage: jsonMeta.authorImage,
    authorBio: jsonMeta.authorBio,
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

    // Only pick up slugs that have BOTH .html and .json
    const htmlFiles = fs.readdirSync(catDir).filter((f) => f.endsWith('.html'))

    for (const file of htmlFiles) {
      const slug = file.replace(/\.html$/, '')
      const jsonPath = path.join(catDir, `${slug}.json`)
      if (!fs.existsSync(jsonPath)) continue // skip if no sidecar
      const parsed = parseArticleFile(cat.slug, slug)
      if (parsed) articles.push(parsed.meta)
    }
  }

  return articles.sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  )
}

export function getAllArticles(): Article[] {
  if (!articleIndexCache) articleIndexCache = buildArticleIndex()
  return articleIndexCache
}

export function getArticlesByCategory(category: string): Article[] {
  return getAllArticles().filter((a) => a.category === category)
}

export function getFeaturedArticles(limit = 3): Article[] {
  return getAllArticles().filter((a) => a.featured).slice(0, limit)
}

export function getLatestArticles(limit = 10): Article[] {
  return getAllArticles().slice(0, limit)
}

export function getAllArticlePaths(): { category: string; slug: string }[] {
  return getAllArticles().map((a) => ({ category: a.category, slug: a.slug }))
}

export function getArticleContent(category: string, slug: string): string | undefined {
  return parseArticleFile(category, slug)?.content
}

export function getArticle(category: string, slug: string): Article | undefined {
  return parseArticleFile(category, slug)?.meta
}

export function getArticleFaq(category: string, slug: string): FaqItem[] {
  return parseArticleFile(category, slug)?.faq ?? []
}
