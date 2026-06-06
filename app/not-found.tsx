import Link from 'next/link'
import { Header } from '@/components/Header'
import { Footer } from '@/components/Footer'
import { categories } from '@/lib/categories'
import { getLatestArticles } from '@/lib/articles'
import { siteConfig } from '@/lib/site'
import { buildPageMetadata } from '@/lib/seo'
import type { Metadata } from 'next'

export const metadata: Metadata = buildPageMetadata({
  title: `Page Not Found | ${siteConfig.name || '404'}`,
  description: 'The page you are looking for could not be found.',
  path: '/404',
})

export default function NotFound() {
  const latest = getLatestArticles(5)

  return (
    <>
      <Header />
      <main className="container page-main">
        <div className="not-found">
          <p className="not-found__code">404</p>
          <h1 className="not-found__title">Page not found</h1>
          <p className="not-found__desc">
            The page you requested does not exist or may have been moved.
            Try one of the links below or return to the homepage.
          </p>

          <div className="not-found__actions">
            <Link href="/" className="not-found__btn" prefetch>Go to Homepage</Link>
            <Link href="/contact" className="not-found__btn not-found__btn--secondary" prefetch>Contact Us</Link>
          </div>

          <section className="not-found__section">
            <h2 className="section-title">Popular Categories</h2>
            <ul className="not-found__links">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/${cat.slug}`} prefetch>{cat.name}</Link>
                </li>
              ))}
            </ul>
          </section>

          {latest.length > 0 && (
            <section className="not-found__section">
              <h2 className="section-title">Recent Articles</h2>
              <ul className="not-found__links">
                {latest.map((article) => (
                  <li key={`${article.category}/${article.slug}`}>
                    <Link href={`/${article.category}/${article.slug}`} prefetch>
                      {article.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="not-found__section">
            <h2 className="section-title">Help &amp; Policies</h2>
            <ul className="not-found__links">
              <li><Link href="/about" prefetch>About</Link></li>
              <li><Link href="/contact" prefetch>Contact</Link></li>
              <li><Link href="/privacy-policy" prefetch>Privacy Policy</Link></li>
              <li><Link href="/editorial-policy" prefetch>Editorial Policy</Link></li>
            </ul>
          </section>
        </div>
      </main>
      <Footer />
    </>
  )
}
