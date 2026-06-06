import { createStaticPageMetadata, StaticPage } from '@/components/StaticPage'

export const metadata = createStaticPageMetadata('editorial-policy')

export default function EditorialPolicyPage() {
  return <StaticPage slug="editorial-policy" />
}
