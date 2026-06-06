# HTML Claude Guide — HtmlBlogWebsite

This is the AI agent reference for generating content files for this project.
**Read this before writing or editing any `.html` file.**

For human-facing docs see `devGuide.md`.

---

## The One Rule That Overrides Everything

This codebase serves **pure HTML only**.

- NO MDX
- NO Markdown
- NO YAML frontmatter (`---` blocks)
- NO React/JSX components in content
- NO `import` statements
- NO `{ }` expressions

Content files are read by `lib/articles.ts` / `lib/pages.ts`, parsed by `lib/html-meta.ts`, sanitized by `lib/sanitize.ts`, and rendered with `dangerouslySetInnerHTML`.

**Write plain HTML. Nothing else.**

---

## File Locations

```
content/<category>/<slug>.html   →  /<category>/<slug>
content/pages/<slug>.html        →  /<slug>
```

Valid categories (folder name = URL segment):

```
finance | stock-market | business | technology | ai | careers
real-estate | insurance | sports | general
```

Example:

```
content/finance/best-credit-cards-2026.html  →  /finance/best-credit-cards-2026
content/pages/about.html                     →  /about
```

---

## File Structure — Every Article

Every content file has two parts:

1. **`<meta>` tags** at the top (parsed at build time, not shown on page)
2. **HTML body** below (rendered as-is, including AdSense scripts)

```html
<meta name="title" content="Article Title" />
<meta name="description" content="SEO summary in 1–2 sentences." />
<meta name="publish-date" content="2026-01-15" />
<meta name="cover-image" content="/images/cover.jpg" />
<meta name="tags" content="tag one, tag two, tag three" />
<meta name="featured" content="true" />

<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={{ADSENSE_CLIENT_ID}}" crossorigin="anonymous"></script>

<img src="/images/cover.jpg" alt="Article Title" width="1200" height="675" loading="eager" />

<h1>Article Title</h1>

<div class="ad-slot" style="text-align:center;margin:2rem 0">
  <ins class="adsbygoogle" style="display:block"
    data-ad-client="{{ADSENSE_CLIENT_ID}}"
    data-ad-format="auto"
    data-full-width-responsive="true"></ins>
</div>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>

<p>Opening paragraph.</p>

<h2>Section Heading</h2>
<p>Content...</p>
```

---

## Meta Tags — Exact Schema

Only these `<meta name="...">` fields are read by `lib/html-meta.ts`:

| Meta name | Required | Rules |
|-----------|----------|-------|
| `title` | Yes | Under 60 chars. Used for SEO, cards, JSON-LD. |
| `description` | Yes | 1–2 sentences. Google meta + social previews. |
| `publish-date` | Yes (articles) | Format: `YYYY-MM-DD`. Sort order newest-first. |
| `cover-image` | No | Path starting with `/images/`. File in `public/images/`. |
| `tags` | No | Comma-separated string. |
| `featured` | No | `true` or `false`. Homepage featured section (max 3). |
| `subtitle` | No | Static pages only (`content/pages/`). |
| `author` | No | Author name for JSON-LD. |
| `author-image` | No | Path to author photo. |
| `author-bio` | No | Short author bio. |

Do NOT use YAML frontmatter. Do NOT add unsupported meta fields.

---

## Environment Tokens

Branding and AdSense IDs come from env vars — never hardcode site name or publisher ID.

Use these tokens in HTML (replaced by `lib/site.ts` → `substituteSiteTokens()`):

| Token | Env var |
|-------|---------|
| `{{SITE_NAME}}` | `SITE_NAME` |
| `{{SITE_DESCRIPTION}}` | `SITE_DESCRIPTION` |
| `{{SITE_URL}}` | `SITE_URL` |
| `{{SITE_TAGLINE}}` | `SITE_TAGLINE` |
| `{{CONTACT_EMAIL}}` | `CONTACT_EMAIL` |
| `{{ADSENSE_CLIENT_ID}}` | `ADSENSE_CLIENT_ID` |

Example AdSense script:

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={{ADSENSE_CLIENT_ID}}" crossorigin="anonymous"></script>
```

---

## AdSense — Required Per Page

AdSense is **NOT** injected by the app layout. Every article/page must include its own:

1. **Loader script** (once, near top of body content)
2. **Ad unit(s)** wherever ads should appear
3. **Push script** after each `<ins class="adsbygoogle">`

```html
<div class="ad-slot" style="text-align:center;margin:2rem 0">
  <ins class="adsbygoogle" style="display:block"
    data-ad-client="{{ADSENSE_CLIENT_ID}}"
    data-ad-slot="OPTIONAL_SLOT_ID"
    data-ad-format="auto"
    data-full-width-responsive="true"></ins>
</div>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
```

Common placements: after intro, between `<h2>` sections, before FAQ.

---

## Allowed HTML Tags

These pass sanitization (`lib/sanitize.ts`):

```
h1 h2 h3 h4 h5 h6  p  ul  ol  li  strong  em  a  img
table thead tbody tr th td  blockquote  code  pre  hr  br
div  span  ins  script
```

Allowed external script hosts:
- `pagead2.googlesyndication.com`
- `www.googletagmanager.com`
- `www.google-analytics.com`

Inline `(adsbygoogle = window.adsbygoogle || []).push({});` is allowed.

**Stripped (never use):** `iframe`, `style`, `form`, `input`, `svg`, `object`, `embed`

---

## What Is Allowed in the Body

### Headings

```html
<h1>Main title — once per page</h1>
<h2>Section</h2>
<h3>Subsection / FAQ question</h3>
```

### Text

```html
<p>Paragraph with <strong>bold</strong> and <em>italic</em>.</p>
<blockquote><p>💡 <strong>Key point:</strong> highlighted text.</p></blockquote>
```

### Lists

```html
<ul><li>Item</li></ul>
<ol><li>Step</li></ol>
```

### Links

```html
<a href="https://example.com">Link text</a>
<a href="https://example.com" target="_blank" rel="noopener noreferrer">External</a>
```

### Tables

```html
<table>
  <thead><tr><th>Col A</th><th>Col B</th></tr></thead>
  <tbody><tr><td>Data</td><td>Data</td></tr></tbody>
</table>
```

### Images

Files go in `public/images/`. Reference with absolute paths:

```html
<img src="/images/chart.png" alt="Descriptive alt text" width="800" height="450" loading="lazy" />
```

Cover image for cards (meta tag + optional hero img):

```html
<meta name="cover-image" content="/images/cover.jpg" />
<img src="/images/cover.jpg" alt="Title" width="1200" height="675" loading="eager" />
```

### FAQ section (auto JSON-LD)

```html
<h2>Frequently Asked Questions</h2>
<h3>Question here?</h3>
<p>Answer here.</p>
<h3>Another question?</h3>
<p>Another answer.</p>
```

`lib/faq.ts` extracts these for `FAQPage` schema automatically.

---

## What Is NOT Allowed

```
❌ --- YAML frontmatter ---
❌ # Markdown headings
❌ **markdown bold**
❌ import { Something } from '...'
❌ <Callout> or any React component
❌ {/* JSX comments */}
❌ {expressions}
❌ .mdx or .md files
❌ Hardcoded site name or AdSense client ID (use {{TOKENS}})
❌ Global AdSense in app/layout.tsx (per-page only)
```

### Replacements

| Don't use | Use instead |
|-----------|-------------|
| Markdown `# heading` | `<h1>`, `<h2>`, `<h3>` |
| YAML frontmatter | `<meta name="..." content="..." />` |
| `<Callout>` | `<blockquote><p>...</p></blockquote>` |
| Markdown table | `<table>` HTML |
| `![alt](src)` | `<img src="..." alt="..." />` |
| JSX FAQ component | `<h3>` + `<p>` pairs under FAQ `<h2>` |

---

## SEO Strategy

SEO is driven by meta tags + content structure:

1. **`title` meta** — primary keyword, under 60 chars
2. **`description` meta** — primary + secondary keyword, under 160 chars
3. **`tags` meta** — comma-separated search terms
4. **`<h2>` headings** — keyword-rich section titles
5. **FAQ block** — `###`-style Q&A using `<h3>` + `<p>` for Featured Snippets
6. **Tables** — comparison queries rank well
7. **`featured: true`** — homepage visibility + internal links
8. **`publish-date`** — use current date for trending topics

App auto-generates: canonical URL, Open Graph, Twitter cards, JSON-LD (NewsArticle, FAQPage, BreadcrumbList), sitemap, RSS.

---

## Minimal Valid Article

```html
<meta name="title" content="Article Title" />
<meta name="description" content="One or two sentence summary." />
<meta name="publish-date" content="2026-06-06" />

<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={{ADSENSE_CLIENT_ID}}" crossorigin="anonymous"></script>

<h1>Article Title</h1>
<p>Content starts here.</p>
```

---

## Full Working Template

```html
<meta name="title" content="Full Article Title for SEO" />
<meta name="description" content="One to two sentences for Google and social previews." />
<meta name="publish-date" content="2026-06-06" />
<meta name="cover-image" content="/images/your-cover.jpg" />
<meta name="tags" content="primary keyword, secondary keyword, topic" />
<meta name="featured" content="true" />

<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={{ADSENSE_CLIENT_ID}}" crossorigin="anonymous"></script>

<img src="/images/your-cover.jpg" alt="Full Article Title for SEO" width="1200" height="675" loading="eager" />

<h1>Full Article Title for SEO</h1>

<div class="ad-slot" style="text-align:center;margin:2rem 0">
  <ins class="adsbygoogle" style="display:block"
    data-ad-client="{{ADSENSE_CLIENT_ID}}"
    data-ad-format="auto"
    data-full-width-responsive="true"></ins>
</div>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>

<p>Opening paragraph stating what the article covers and why it matters.</p>

<h2>Section One</h2>
<p>Paragraph with <strong>bold</strong> emphasis.</p>
<ul>
  <li>Bullet point</li>
  <li>Another point</li>
</ul>

<h2>Section Two</h2>
<blockquote><p>💡 <strong>Key takeaway:</strong> Use blockquotes for callouts.</p></blockquote>

<table>
  <thead><tr><th>Column A</th><th>Column B</th></tr></thead>
  <tbody><tr><td>Data</td><td>Data</td></tr></tbody>
</table>

<h2>Frequently Asked Questions</h2>
<h3>What is X?</h3>
<p>Answer in plain prose.</p>
<h3>How does Y work?</h3>
<p>Answer in plain prose.</p>

<p><em>Sources: Source One, Source Two. Last updated 2026-06-06.</em></p>
```

---

## Pre-flight Checklist Before Saving

- [ ] File extension is `.html` (not `.mdx`, not `.md`)
- [ ] No `---` YAML frontmatter blocks
- [ ] No Markdown syntax (`#`, `**`, `![`, `[text](url)`)
- [ ] No JSX, imports, or `{ }` expressions
- [ ] `<meta>` tags use `name` + `content` attributes
- [ ] `publish-date` is `YYYY-MM-DD`
- [ ] `cover-image` starts with `/images/`
- [ ] AdSense script uses `{{ADSENSE_CLIENT_ID}}` token
- [ ] At least one `<h1>` in body
- [ ] All images have meaningful `alt` text
- [ ] File is in correct category folder

---

## Common Errors and Fixes

| Problem | Cause | Fix |
|---------|-------|-----|
| Article 404 | Wrong folder or filename | Check `content/<category>/<slug>.html` |
| Missing from listings | Bad/missing meta tags | Add `title`, `description`, `publish-date` |
| Cover image broken | Wrong path | Use `/images/file.jpg` not `./images/` |
| AdSense not loading | Missing env or token | Set `ADSENSE_CLIENT_ID` in `.env.local` |
| AdSense stripped | Wrong script host | Only use `pagead2.googlesyndication.com` |
| Site name hardcoded | Used literal brand name | Use `{{SITE_NAME}}` token |
| YAML parsed as object | Unquoted `{{SITE_NAME}}` in old format | Use HTML meta tags, quote if needed |
| Tags not showing | Used YAML list syntax | Use comma-separated string in meta |

---

## Key Source Files (for agents editing code)

| File | Purpose |
|------|---------|
| `lib/html-meta.ts` | Parses `<meta>` tags from HTML files |
| `lib/articles.ts` | Loads article metadata + body |
| `lib/pages.ts` | Loads static page metadata + body |
| `lib/sanitize.ts` | XSS sanitization, allows AdSense tags |
| `lib/site.ts` | Env config + `{{TOKEN}}` substitution |
| `lib/seo.ts` | Metadata, JSON-LD, sitemap helpers |
| `app/[category]/[slug]/page.tsx` | Thin shell — renders HTML body only |
| `scripts/convert-to-pure-html.mjs` | Migrates old YAML files to HTML meta |

---

## Quick Reference Card

```
File location:     content/<category>/<slug>.html
Static pages:      content/pages/<slug>.html
Images:            public/images/<file>  →  /images/<file>
Article URL:       /<category>/<slug>
Env config:        .env.local (see .env.example)
Human docs:        devGuide.md
Convert old YAML:  node scripts/convert-to-pure-html.mjs

ALWAYS:            plain HTML, <meta> tags, {{TOKENS}}, per-page AdSense
NEVER:             MDX, Markdown, YAML ---, JSX, hardcoded branding
```
