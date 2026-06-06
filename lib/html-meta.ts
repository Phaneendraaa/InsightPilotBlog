export interface HtmlMeta {
  title?: string
  description?: string
  publishDate?: string
  coverImage?: string
  tags?: string[]
  featured?: boolean
  author?: string
  authorImage?: string
  authorBio?: string
  subtitle?: string
}

const META_ALIASES: Record<string, keyof HtmlMeta> = {
  title: 'title',
  'article:title': 'title',
  description: 'description',
  'article:description': 'description',
  subtitle: 'subtitle',
  'article:subtitle': 'subtitle',
  'publish-date': 'publishDate',
  'article:publish-date': 'publishDate',
  publishdate: 'publishDate',
  'cover-image': 'coverImage',
  'article:cover-image': 'coverImage',
  coverimage: 'coverImage',
  tags: 'tags',
  'article:tags': 'tags',
  featured: 'featured',
  'article:featured': 'featured',
  author: 'author',
  'article:author': 'author',
  'author-image': 'authorImage',
  'article:author-image': 'authorImage',
  authorimage: 'authorImage',
  'author-bio': 'authorBio',
  'article:author-bio': 'authorBio',
  authorbio: 'authorBio',
}

function decode(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

/** Parse HTML meta tags and return metadata + remaining body HTML. */
export function parseHtmlMeta(raw: string): { meta: HtmlMeta; body: string } {
  const meta: HtmlMeta = {}
  let body = raw.trim()

  // Legacy YAML frontmatter — strip if present so old files still load during migration
  if (body.startsWith('---')) {
    const end = body.indexOf('---', 3)
    if (end !== -1) {
      body = body.slice(end + 3).trim()
    }
  }

  const metaTagRegex = /<meta\s+[^>]*\/?>/gi
  const removed: string[] = []

  body = body.replace(metaTagRegex, (tag) => {
    const nameMatch = tag.match(/name=["']([^"']+)["']/i)
    const contentMatch = tag.match(/content=["']([^"']*)["']/i)
    if (!nameMatch || !contentMatch) return tag

    const key = META_ALIASES[nameMatch[1].toLowerCase()]
    if (!key) return tag

    const value = decode(contentMatch[1])

    switch (key) {
      case 'tags':
        meta.tags = value.split(',').map((t) => t.trim()).filter(Boolean)
        break
      case 'featured':
        meta.featured = value === 'true' || value === '1'
        break
      case 'publishDate': {
        const parsed = new Date(value)
        meta.publishDate = Number.isNaN(parsed.getTime())
          ? value.slice(0, 10)
          : parsed.toISOString().split('T')[0]
        break
      }
      default:
        meta[key] = value
    }

    removed.push(tag)
    return ''
  })

  // Optional <head> wrapper — unwrap and discard empty head shell
  body = body
    .replace(/<head[^>]*>/gi, '')
    .replace(/<\/head>/gi, '')
    .replace(/<body[^>]*>/gi, '')
    .replace(/<\/body>/gi, '')
    .trim()

  return { meta, body }
}
