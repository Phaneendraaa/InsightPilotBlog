import type { MetadataRoute } from 'next'
import { getAllArticles } from '@/lib/articles'
import { categories } from '@/lib/categories'
import { getAllStaticPageSlugs } from '@/lib/pages'
import { siteConfig } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url.replace(/\/$/, '')
  if (!base) return []

  const home = {
    url: base,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }

  const staticPages = getAllStaticPageSlugs().map((slug) => ({
    url: `${base}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }))

  const categoryPages = categories.map((cat) => ({
    url: `${base}/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const articlePages = getAllArticles().map((article) => ({
    url: `${base}/${article.category}/${article.slug}`,
    lastModified: new Date(article.publishDate),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }))

  return [home, ...staticPages, ...categoryPages, ...articlePages]
}
