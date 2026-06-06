import Link from 'next/link'
import { siteConfig } from '@/lib/site'
import { CategoryNav } from '@/components/CategoryNav'
import { ThemeToggle } from '@/components/ThemeToggle'

export function Header({ activeCategory }: { activeCategory?: string }) {
  return (
    <>
      <header className="site-header">
        <div className="container site-header__inner">
          <Link href="/" className="site-logo">
            {siteConfig.displayName}
          </Link>
          <ThemeToggle />
        </div>
      </header>
      <CategoryNav active={activeCategory} />
    </>
  )
}
