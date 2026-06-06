import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

function esc(v) {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
}

const AD_SCRIPT =
  '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={{ADSENSE_CLIENT_ID}}" crossorigin="anonymous"></script>'

const AD_UNIT = `<div class="ad-slot" style="text-align:center;margin:2rem 0">
<ins class="adsbygoogle" style="display:block" data-ad-client="{{ADSENSE_CLIENT_ID}}" data-ad-format="auto" data-full-width-responsive="true"></ins>
</div>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>`

function convert(filePath, isPage) {
  const raw = fs.readFileSync(filePath, 'utf-8')
  if (!raw.trimStart().startsWith('---')) return

  const { data, content } = matter(raw)
  const tags = Array.isArray(data.tags) ? data.tags.join(', ') : ''
  const meta = []

  if (data.title) meta.push(`<meta name="title" content="${esc(data.title)}" />`)
  if (data.description) meta.push(`<meta name="description" content="${esc(data.description)}" />`)
  if (data.subtitle) meta.push(`<meta name="subtitle" content="${esc(data.subtitle)}" />`)
  if (data.publishDate) {
    const d = data.publishDate instanceof Date
      ? data.publishDate.toISOString().split('T')[0]
      : String(data.publishDate).slice(0, 10)
    meta.push(`<meta name="publish-date" content="${d}" />`)
  }
  if (data.coverImage) meta.push(`<meta name="cover-image" content="${esc(data.coverImage)}" />`)
  if (tags) meta.push(`<meta name="tags" content="${esc(tags)}" />`)
  if (data.featured !== undefined) {
    meta.push(`<meta name="featured" content="${data.featured ? 'true' : 'false'}" />`)
  }
  if (data.author) meta.push(`<meta name="author" content="${esc(data.author)}" />`)

  let body = content.trim()

  if (data.title && !/^<h1/i.test(body)) {
    body = `<h1>${data.title}</h1>\n\n${body}`
  }

  if (!isPage && data.coverImage) {
    body = `<img src="${data.coverImage}" alt="${esc(data.title)}" width="1200" height="675" loading="eager" />\n\n${body}`
  }

  const firstP = body.indexOf('<p>')
  const finalBody =
    firstP === -1 ? body : `${body.slice(0, firstP)}${AD_UNIT}\n\n${body.slice(firstP)}`

  fs.writeFileSync(filePath, `${meta.join('\n')}\n\n${AD_SCRIPT}\n\n${finalBody}\n`)
  console.log('converted', filePath)
}

const contentDir = path.join(process.cwd(), 'content')

for (const cat of fs.readdirSync(contentDir)) {
  const catPath = path.join(contentDir, cat)
  if (!fs.statSync(catPath).isDirectory()) continue

  for (const file of fs.readdirSync(catPath).filter((f) => f.endsWith('.html'))) {
    convert(path.join(catPath, file), cat === 'pages')
  }
}
