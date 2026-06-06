import Link from 'next/link'
import { categories } from '@/lib/categories'

export function CategoryNav({ active }: { active?: string }) {
  return (
    <nav className="cat-nav" aria-label="Categories">
      <div className="container">
        <ul className="cat-nav__list">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <Link
                href={`/${cat.slug}`}
                className="cat-nav__link"
                data-active={active === cat.slug ? 'true' : undefined}
              >
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
