import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { ArticleCard } from '@/components/ArticleCard'
import { getFeaturedArticles, getLatestArticles, getArticlesByCategory } from '@/lib/articles'
import { categories } from '@/lib/categories'
import { siteConfig, getHomeH1 } from '@/lib/site'
import { buildHomeMetadata, buildHomePageJsonLd } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = buildHomeMetadata()

export default function HomePage() {
  const featured = getFeaturedArticles(3)
  const latest = getLatestArticles(8)
  const categoriesWithArticles = categories.filter(
    (cat) => getArticlesByCategory(cat.slug).length > 0
  )

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: buildHomePageJsonLd(latest) }}
      />
      <Header />
      <main>
        <section className="hero">
          <div className="container hero__inner">
            <h1 className="hero__title">{getHomeH1()}</h1>
            {siteConfig.tagline && (
              <p className="hero__tagline">{siteConfig.tagline}</p>
            )}
            {siteConfig.description && (
              <p className="hero__intro">{siteConfig.description}</p>
            )}
          </div>
        </section>

        {featured.length > 0 && (
          <section className="container mt-section" aria-labelledby="featured-heading">
            <h2 id="featured-heading" className="section-title">Featured</h2>
            <div className="grid-featured" style={{ marginTop: '1.5rem' }}>
              {featured.map((article) => (
                <ArticleCard key={`${article.category}/${article.slug}`} article={article} featured />
              ))}
            </div>
          </section>
        )}

        <section className="container mt-section" aria-labelledby="latest-heading">
          <h2 id="latest-heading" className="section-title">Latest Articles</h2>
          <div className="grid-articles" style={{ marginTop: '1.5rem' }}>
            {latest.map((article) => (
              <ArticleCard key={`${article.category}/${article.slug}`} article={article} />
            ))}
          </div>
        </section>

        {categoriesWithArticles.length > 0 && (
          <section className="container mt-section" aria-labelledby="topics-heading">
            <h2 id="topics-heading" className="section-title">Browse by Topic</h2>
            {categoriesWithArticles.map((cat) => {
              const articles = getArticlesByCategory(cat.slug).slice(0, 4)
              return (
                <div key={cat.slug} className="category-block">
                  <div className="section-header">
                    <h3 className="section-title section-title--sub">{cat.name}</h3>
                    <Link href={`/${cat.slug}`} className="section-link" prefetch>
                      View all →
                    </Link>
                  </div>
                  <div className="grid-articles">
                    {articles.map((article) => (
                      <ArticleCard key={article.slug} article={article} />
                    ))}
                  </div>
                </div>
              )
            })}
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}
