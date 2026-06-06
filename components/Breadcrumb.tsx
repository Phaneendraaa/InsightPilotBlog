import Link from 'next/link'

export function Breadcrumb({
  items,
}: {
  items: { label: string; href?: string }[]
}) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      {items.map((item, i) => (
        <span key={item.label} style={{ display: 'contents' }}>
          {i > 0 && <span className="breadcrumb__sep">/</span>}
          {item.href ? <Link href={item.href}>{item.label}</Link> : <span>{item.label}</span>}
        </span>
      ))}
    </nav>
  )
}
