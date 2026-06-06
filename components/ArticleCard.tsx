import Image from 'next/image'
import Link from 'next/link'
import { getCategoryBySlug } from '@/lib/categories'
import type { Article } from '@/lib/articles'

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function ArticleCard({
  article,
  featured = false,
}: {
  article: Article
  featured?: boolean
}) {
  const category = getCategoryBySlug(article.category)
  const href = `/${article.category}/${article.slug}`

  return (
    <Link href={href} className={`card${featured ? ' card--featured' : ''}`} prefetch>
      {article.coverImage ? (
        <div className="card__image-wrap">
          <Image
            src={article.coverImage}
            alt={article.title}
            fill
            className="card__image"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={featured}
          />
        </div>
      ) : (
        <div className="no-article-img" aria-hidden="true">
          {category?.name.charAt(0) ?? '?'}
        </div>
      )}
      <div className="card__body">
        {category && (
          <span
            className="card__category"
            style={{ color: category.color, background: category.bgColor }}
          >
            {category.name}
          </span>
        )}
        <p className="card__title">{article.title}</p>
        {article.description && <p className="card__desc">{article.description}</p>}
        <time className="card__meta" dateTime={article.publishDate}>
          {formatDate(article.publishDate)}
        </time>
      </div>
    </Link>
  )
}
