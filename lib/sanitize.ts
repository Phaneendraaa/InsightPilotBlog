import sanitizeHtml from 'sanitize-html'

const ALLOWED_TAGS = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'ul', 'ol', 'li',
  'strong', 'em', 'a', 'img',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'blockquote', 'code', 'pre', 'hr', 'br',
  'div', 'span', 'ins', 'script',
]

const DISALLOWED_TAGS = [
  'iframe', 'style', 'form', 'input',
  'textarea', 'button', 'object', 'embed', 'svg',
]

const ALLOWED_SCRIPT_HOSTS = [
  'pagead2.googlesyndication.com',
  'www.googletagmanager.com',
  'www.google-analytics.com',
]

/** Preserve author-placed scripts (e.g. AdSense) in article HTML while stripping other dangerous tags. */
export function sanitizeArticleHtml(html: string): string {
  const result = sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    disallowedTagsMode: 'discard',
    exclusiveFilter(frame) {
      return DISALLOWED_TAGS.includes(frame.tag)
    },
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height', 'loading'],
      th: ['colspan', 'rowspan', 'scope'],
      td: ['colspan', 'rowspan'],
      div: ['class', 'style', 'id'],
      span: ['class', 'style'],
      ins: [
        'class', 'style',
        'data-ad-client', 'data-ad-slot', 'data-ad-format',
        'data-full-width-responsive', 'data-ad-layout', 'data-ad-layout-key',
      ],
      script: ['async', 'src', 'crossorigin', 'defer', 'type'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    allowVulnerableTags: true,
    allowedScriptHostnames: ALLOWED_SCRIPT_HOSTS,
    transformTags: {
      img: (_tag, attribs) => ({
        tagName: 'img',
        attribs: {
          ...attribs,
          loading: attribs.loading ?? 'lazy',
        },
      }),
      a: (_tag, attribs) => ({
        tagName: 'a',
        attribs: {
          ...attribs,
          rel:
            attribs.target === '_blank'
              ? 'noopener noreferrer'
              : attribs.rel,
        },
      }),
    },
  })
  // sanitize-html serialises boolean attrs as `async=""` but React/browsers
  // emit bare `async`. Normalise so server and client HTML match exactly.
  return result.replace(/ async=""/g, ' async')
}