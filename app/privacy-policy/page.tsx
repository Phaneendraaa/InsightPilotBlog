import { createStaticPageMetadata, StaticPage } from '@/components/StaticPage'

export const metadata = createStaticPageMetadata('privacy-policy')

export default function PrivacyPolicyPage() {
  return <StaticPage slug="privacy-policy" />
}
