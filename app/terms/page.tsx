import { createStaticPageMetadata, StaticPage } from '@/components/StaticPage'

export const metadata = createStaticPageMetadata('terms')

export default function TermsPage() {
  return <StaticPage slug="terms" />
}
