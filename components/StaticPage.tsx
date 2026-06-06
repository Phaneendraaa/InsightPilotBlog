import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Breadcrumb } from '@/components/Breadcrumb'
import { buildPageMetadata, buildBreadcrumbJsonLd } from '@/lib/seo'
import { siteConfig } from '@/lib/site'
import { getStaticPage, getStaticPageContent } from '@/lib/pages'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export function createStaticPageMetadata(slug: string): Metadata {
  const page = getStaticPage(slug)
  if (!page) return {}
  const title = siteConfig.name ? `${page.title} | ${siteConfig.name}` : page.title
  return buildPageMetadata({
    title,
    description: page.description,
    path: `/${slug}`,
  })
}

export function StaticPage({ slug }: { slug: string }) {
  const page = getStaticPage(slug)
  const content = getStaticPageContent(slug)
  if (!page || !content) notFound()

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: page.title },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildBreadcrumbJsonLd(breadcrumbItems) }}
      />
      <Header />
      <main className="container page-main">
        <Breadcrumb items={breadcrumbItems} />
        <div
          className="prose page-body"
          style={{ maxWidth: '720px', margin: '2rem auto' }}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </main>
      <Footer />
    </>
  )
}
