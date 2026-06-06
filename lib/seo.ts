import type { Metadata } from 'next'
import { siteConfig, getHomeTitle } from './site'
import type { Article } from './articles'
import type { Category } from './categories'
import type { FaqItem } from './faq'

export function joinUrl(base: string, path: string): string {
  const cleanBase = base.replace(/\/+$/, '')
  if (!path) return cleanBase
  return `${cleanBase}${path.startsWith('/') ? path : `/${path}`}`
}

function baseUrl() {
  return siteConfig.url.replace(/\/+$/, '')
}

function resolveImage(image?: string): string | undefined {
  if (!image) return undefined
  const base = baseUrl()
  return image.startsWith('http') ? image : joinUrl(base, image)
}

export function buildPageMetadata({
  title,
  description,
  path = '',
  image,
  type = 'website',
}: {
  title: string
  description: string
  path?: string
  image?: string
  type?: 'website' | 'article'
}): Metadata {
  const url = joinUrl(baseUrl(), path)
  const ogImage = resolveImage(image)

  return {
    title,
    description,
    ...(siteConfig.url ? { metadataBase: new URL(joinUrl(baseUrl(), '/')) } : {}),
    alternates: { canonical: url },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type,
      ...(ogImage
        ? { images: [{ url: ogImage, width: 1200, height: 630, alt: title }] }
        : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  }
}

export function buildHomeMetadata(): Metadata {
  return buildPageMetadata({
    title: getHomeTitle(),
    description: siteConfig.description,
    path: '/',
  })
}

export function buildArticleMetadata(article: Article): Metadata {
  const title = siteConfig.name ? `${article.title} | ${siteConfig.name}` : article.title
  return buildPageMetadata({
    title,
    description: article.description,
    path: `/${article.category}/${article.slug}`,
    image: article.coverImage,
    type: 'article',
  })
}

export function buildWebSiteJsonLd(): string {
  const base = baseUrl()
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: base,
    description: siteConfig.description,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: base,
    },
  })
}

export function buildOrganizationJsonLd(): string {
  const base = baseUrl()
  const sameAs = Object.values(siteConfig.social).filter(Boolean)

  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: base,
    description: siteConfig.description,
    ...(siteConfig.contactEmail ? { email: siteConfig.contactEmail } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  })
}

export function buildHomePageJsonLd(articles: Article[]): string {
  const base = baseUrl()
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${base}/#webpage`,
        url: base,
        name: getHomeTitle(),
        description: siteConfig.description,
        isPartOf: { '@id': `${base}/#website` },
      },
      {
        '@type': 'WebSite',
        '@id': `${base}/#website`,
        url: base,
        name: siteConfig.name,
        description: siteConfig.description,
        publisher: { '@id': `${base}/#organization` },
      },
      {
        '@type': 'Organization',
        '@id': `${base}/#organization`,
        name: siteConfig.name,
        url: base,
        description: siteConfig.description,
      },
      {
        '@type': 'ItemList',
        '@id': `${base}/#articles`,
        name: 'Latest Articles',
        itemListElement: articles.slice(0, 10).map((article, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          url: joinUrl(base, `/${article.category}/${article.slug}`),
          name: article.title,
        })),
      },
    ],
  })
}

export function buildCollectionPageJsonLd(category: Category, articleCount: number): string {
  const base = baseUrl()
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: category.description,
    url: joinUrl(base, `/${category.slug}`),
    numberOfItems: articleCount,
    isPartOf: {
      '@type': 'WebSite',
      name: siteConfig.name,
      url: base,
    },
  })
}

export function buildArticleJsonLd(article: Article): string {
  const base = baseUrl()
  const url = joinUrl(base, `/${article.category}/${article.slug}`)

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.description,
    datePublished: article.publishDate,
    dateModified: article.publishDate,
    url,
    ...(article.coverImage ? { image: resolveImage(article.coverImage) } : {}),
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: base,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  }

  if (article.author) {
    jsonLd.author = {
      '@type': 'Person',
      name: article.author,
      ...(article.authorImage ? { image: resolveImage(article.authorImage) } : {}),
      ...(article.authorBio ? { description: article.authorBio } : {}),
    }
  }

  return JSON.stringify(jsonLd)
}

export function buildFaqJsonLd(faq: FaqItem[]): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  })
}

export function buildBreadcrumbJsonLd(
  items: { label: string; href?: string }[]
): string {
  const base = baseUrl()
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: joinUrl(base, item.href) } : {}),
    })),
  })
}
