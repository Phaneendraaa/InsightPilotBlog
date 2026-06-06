import fs from 'fs'
import path from 'path'

const contentDir = path.join(process.cwd(), 'content')

function fixDates(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      fixDates(full)
      continue
    }
    if (!entry.name.endsWith('.html')) continue

    let html = fs.readFileSync(full, 'utf-8')
    const updated = html.replace(
      /<meta name="publish-date" content="[^"]*" \/>/g,
      (tag) => {
        const match = tag.match(/content="([^"]*)"/)
        if (!match) return tag
        const parsed = new Date(match[1])
        if (Number.isNaN(parsed.getTime())) return tag
        const iso = parsed.toISOString().split('T')[0]
        return `<meta name="publish-date" content="${iso}" />`
      }
    )
    if (updated !== html) {
      fs.writeFileSync(full, updated)
      console.log('fixed', full)
    }
  }
}

fixDates(contentDir)
