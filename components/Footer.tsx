import Link from 'next/link'
import { categories } from '@/lib/categories'
import { siteConfig, getSocialLinks } from '@/lib/site'

const trustLinks = [
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/disclaimer', label: 'Disclaimer' },
  { href: '/editorial-policy', label: 'Editorial Policy' },
]

const socialLabels: Record<string, string> = {
  twitter: 'Twitter',
  facebook: 'Facebook',
  instagram: 'Instagram',
  youtube: 'YouTube',
  linkedin: 'LinkedIn',
}

export function Footer() {
  const year = new Date().getFullYear()
  const socialLinks = getSocialLinks()

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <p className="footer-brand">{siteConfig.displayName}</p>
            <p className="footer-desc">{siteConfig.description}</p>
            {socialLinks.length > 0 && (
              <ul className="footer-list" style={{ marginTop: '1rem' }}>
                {socialLinks.map(([platform, url]) => (
                  <li key={platform}>
                    <a href={url} target="_blank" rel="noopener noreferrer">
                      {socialLabels[platform]}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <p className="footer-heading">Categories</p>
            <ul className="footer-list">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/${cat.slug}`} prefetch>{cat.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="footer-heading">More</p>
            <ul className="footer-list">
              {categories.slice(5).map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/${cat.slug}`} prefetch>{cat.name}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="footer-heading">Company</p>
            <ul className="footer-list">
              {trustLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} prefetch>{link.label}</Link>
                </li>
              ))}
              <li>
                <Link href="/rss.xml" prefetch>RSS Feed</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {year} {siteConfig.displayName} All rights reserved.</span>
          <span style={{ marginLeft: '1rem' }}>
            <Link href="/privacy-policy" style={{ opacity: 0.7 }} prefetch>Privacy</Link>
            {' · '}
            <Link href="/contact" style={{ opacity: 0.7 }} prefetch>Contact</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
