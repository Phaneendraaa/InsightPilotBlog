export interface FaqItem {
  question: string
  answer: string
}

/** Extract FAQ pairs from frontmatter or HTML body (h2 FAQ section + h3/p pairs). */
export function extractFaq(
  html: string,
  frontmatterFaq?: FaqItem[]
): FaqItem[] {
  if (frontmatterFaq && frontmatterFaq.length > 0) {
    return frontmatterFaq
  }

  const faqHeading = /<h2[^>]*>(?:[^<]*(?:FAQ|Frequently Asked Questions)[^<]*)<\/h2>/i
  const match = html.match(faqHeading)
  if (!match || match.index === undefined) return []

  const section = html.slice(match.index + match[0].length)
  const items: FaqItem[] = []
  const blockRegex = /<h3[^>]*>([\s\S]*?)<\/h3>\s*<p[^>]*>([\s\S]*?)<\/p>/gi
  let block: RegExpExecArray | null

  while ((block = blockRegex.exec(section)) !== null) {
    const question = stripTags(block[1]).trim()
    const answer = stripTags(block[2]).trim()
    if (question && answer) {
      items.push({ question, answer })
    }

    const after = section.slice(block.index + block[0].length)
    if (/^\s*<h2[^>]*>/i.test(after)) break
  }

  return items
}

function stripTags(html: string): string {
  return html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
}
