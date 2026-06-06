import { createStaticPageMetadata, StaticPage } from '@/components/StaticPage'

export const metadata = createStaticPageMetadata('disclaimer')

export default function DisclaimerPage() {
  return <StaticPage slug="disclaimer" />
}
