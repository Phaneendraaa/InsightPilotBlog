import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { Breadcrumb } from '@/components/Breadcrumb'
import {
  getAllArticlePaths,
  getArticle,
  getArticleContent,
  getArticleFaq,
} from '@/lib/articles'
import { getCategoryBySlug } from '@/lib/categories'
import {
  buildArticleMetadata,
  buildArticleJsonLd,
  buildBreadcrumbJsonLd,
  buildFaqJsonLd,
} from '@/lib/seo'
import { notFound } from 'next/navigation'

export function generateStaticParams() {
  return getAllArticlePaths()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}) {
  const { category, slug } = await params
  const article = getArticle(category, slug)
  if (!article) return {}
  return buildArticleMetadata(article)
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>
}) {
  const { category, slug } = await params
  const article = getArticle(category, slug)
  const categoryMeta = getCategoryBySlug(category)
  if (!article || !categoryMeta) notFound()

  const content = getArticleContent(category, slug)
  if (!content) notFound()

  const faq = getArticleFaq(category, slug)

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: categoryMeta.name, href: `/${category}` },
    { label: article.title },
  ]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildArticleJsonLd(article) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildBreadcrumbJsonLd(breadcrumbItems) }}
      />
      {faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: buildFaqJsonLd(faq) }}
        />
      )}
      <Header activeCategory={category} />
      <main className="container article-page">
        <Breadcrumb items={breadcrumbItems} />
        <div
          className="prose article-body"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </main>
      <Footer />
    </>
  )
}
