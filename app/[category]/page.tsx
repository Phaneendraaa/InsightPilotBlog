import { notFound } from 'next/navigation'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ArticleCard } from '@/components/ArticleCard'
import { Breadcrumb } from '@/components/Breadcrumb'
import { getArticlesByCategory } from '@/lib/articles'
import { categories, getCategoryBySlug } from '@/lib/categories'
import { buildPageMetadata, buildCollectionPageJsonLd, buildBreadcrumbJsonLd } from '@/lib/seo'
import { siteConfig } from '@/lib/site'

export function generateStaticParams() {
  return categories.map((cat) => ({ category: cat.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) return {}

  return buildPageMetadata({
    title: `${category.name} | ${siteConfig.name}`,
    description: category.description,
    path: `/${slug}`,
  })
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) notFound()

  const articles = getArticlesByCategory(slug)
  const breadcrumbItems = [{ label: 'Home', href: '/' }, { label: category.name }]

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildCollectionPageJsonLd(category, articles.length) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildBreadcrumbJsonLd(breadcrumbItems) }}
      />
      <Header activeCategory={slug} />
      <main className="container page-main">
        <Breadcrumb items={breadcrumbItems} />

        <header className="page-header">
          <h1 className="page-header__title">{category.name}</h1>
          <p className="page-header__desc">{category.description}</p>
        </header>

        {articles.length === 0 ? (
          <p className="text-muted">No articles in this category yet. Check back soon.</p>
        ) : (
          <div className="grid-articles">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
