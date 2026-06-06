import { createStaticPageMetadata, StaticPage } from '@/components/StaticPage'

export const metadata = createStaticPageMetadata('about')

export default function AboutPage() {
  return <StaticPage slug="about" />
}
