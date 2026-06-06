import { createStaticPageMetadata, StaticPage } from '@/components/StaticPage'

export const metadata = createStaticPageMetadata('contact')

export default function ContactPage() {
  return <StaticPage slug="contact" />
}
