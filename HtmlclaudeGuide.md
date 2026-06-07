# HTML Claude Guide — InsightPilotBlog

AI agent reference for generating content files.
Read this before writing or editing any content file.

---

## The One Rule That Overrides Everything

Content = **two files per article**:

```
content/<category>/<slug>.json   ← metadata only
content/<category>/<slug>.html   ← body HTML only
```

- NO meta tags in HTML files
- NO AdSense scripts in HTML files (injected globally by layout)
- NO MDX, Markdown, YAML, JSX, imports, or { } expressions
- NO hardcoded site name or publisher ID

---

## File Locations

```
content/<category>/<slug>.html    →  /<category>/<slug>
content/<category>/<slug>.json    →  metadata sidecar
content/pages/<slug>.html         →  /<slug>
content/pages/<slug>.json         →  metadata sidecar
```

Valid categories:
```
finance | stock-market | business | technology | ai
careers | real-estate | insurance | sports | general
```

---

## The JSON Sidecar — All Metadata Here

**`content/finance/best-credit-cards-2026.json`**

```json
{
  "title": "Best Credit Cards for 2026",
  "description": "A practical guide to the top credit cards for rewards, travel, and everyday spending in 2026.",
  "publishDate": "2026-01-15",
  "coverImage": "/images/finance-cards.svg",
  "tags": ["credit cards", "personal finance", "rewards"],
  "featured": true
}
```

| Field | Required | Rules |
|-------|----------|-------|
| `title` | Yes | Under 60 chars. SEO + cards + JSON-LD. |
| `description` | Yes | 1–2 sentences, under 160 chars. |
| `publishDate` | Yes | `YYYY-MM-DD` format. |
| `coverImage` | No | `/images/filename.jpg` path. |
| `tags` | No | Array of strings. |
| `featured` | No | `true` or `false`. |
| `author` | No | Author name. |
| `authorImage` | No | Path to author photo. |
| `authorBio` | No | Short author bio. |

---

## The HTML File — Pure Body Only

**`content/finance/best-credit-cards-2026.html`**

```html
<img src="/images/finance-cards.svg" alt="Best Credit Cards for 2026" width="1200" height="675" loading="eager" />

<h1>Best Credit Cards for 2026</h1>

<div class="ad-slot" style="text-align:center;margin:2rem 0">
  <ins class="adsbygoogle" style="display:block"
    data-ad-client="{{ADSENSE_CLIENT_ID}}"
    data-ad-slot="YOUR_SLOT_ID"
    data-ad-format="auto"
    data-full-width-responsive="true"></ins>
</div>

<p>Opening paragraph here.</p>

<h2>Section Heading</h2>
<p>Content paragraph.</p>

<h2>Frequently Asked Questions</h2>
<h3>What is the best credit card for travel?</h3>
<p>Answer here in plain prose.</p>
```

**Key rules:**
- No `<meta>` tags — they go in the `.json` file
- No AdSense loader `<script async src="...adsbygoogle...">` — injected globally by `app/layout.tsx`
- Ad unit `<ins class="adsbygoogle">` tags are allowed — place wherever you want ads
- Use `{{ADSENSE_CLIENT_ID}}` token in `data-ad-client` attribute
- At least one `<h1>` in the body

---

## Environment Tokens

Use in HTML files — replaced at build time:

| Token | Replaced with |
|-------|--------------|
| `{{SITE_NAME}}` | Site name |
| `{{SITE_DESCRIPTION}}` | Site description |
| `{{SITE_URL}}` | Site URL |
| `{{SITE_TAGLINE}}` | Site tagline |
| `{{CONTACT_EMAIL}}` | Contact email |
| `{{ADSENSE_CLIENT_ID}}` | AdSense client ID |

---

## Ad Placement

The AdSense loader script is **injected once globally** by `app/layout.tsx`.

You only need to place `<ins>` ad units in the HTML body:

```html
<div class="ad-slot" style="text-align:center;margin:2rem 0">
  <ins class="adsbygoogle" style="display:block"
    data-ad-client="{{ADSENSE_CLIENT_ID}}"
    data-ad-slot="YOUR_SLOT_ID"
    data-ad-format="auto"
    data-full-width-responsive="true"></ins>
</div>
```

Common placements: after intro paragraph, between `<h2>` sections, before FAQ.

---

## Allowed HTML Tags

```
h1 h2 h3 h4 h5 h6  p  ul  ol  li  strong  em  a  img
table thead tbody tr th td  blockquote  code  pre  hr  br
div  span  ins  script
```

**Stripped (never use):** `iframe`, `style`, `form`, `input`, `svg`, `object`, `embed`

---

## FAQ Section (auto JSON-LD)

```html
<h2>Frequently Asked Questions</h2>
<h3>Question here?</h3>
<p>Answer here.</p>
<h3>Another question?</h3>
<p>Another answer.</p>
```

`lib/faq.ts` auto-extracts these for `FAQPage` schema.

---

## Minimal Valid Article

Two files minimum:

**`content/general/my-article.json`**
```json
{
  "title": "Article Title",
  "description": "One or two sentence summary.",
  "publishDate": "2026-06-07"
}
```

**`content/general/my-article.html`**
```html
<h1>Article Title</h1>
<p>Content starts here.</p>
```

---

## Full Template

**`<slug>.json`**
```json
{
  "title": "Full Article Title for SEO",
  "description": "One to two sentences for Google and social previews.",
  "publishDate": "2026-06-07",
  "coverImage": "/images/your-cover.jpg",
  "tags": ["primary keyword", "secondary keyword"],
  "featured": true
}
```

**`<slug>.html`**
```html
<img src="/images/your-cover.jpg" alt="Full Article Title for SEO" width="1200" height="675" loading="eager" />

<h1>Full Article Title for SEO</h1>

<div class="ad-slot" style="text-align:center;margin:2rem 0">
  <ins class="adsbygoogle" style="display:block"
    data-ad-client="{{ADSENSE_CLIENT_ID}}"
    data-ad-format="auto"
    data-full-width-responsive="true"></ins>
</div>

<p>Opening paragraph.</p>

<h2>Section One</h2>
<p>Content with <strong>bold</strong> and <em>italic</em>.</p>
<ul>
  <li>Bullet point</li>
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

<p><em>Last updated 2026-06-07.</em></p>
```

---

## Pre-flight Checklist

- [ ] Two files created: `<slug>.json` + `<slug>.html`
- [ ] JSON has `title`, `description`, `publishDate`
- [ ] `publishDate` is `YYYY-MM-DD`
- [ ] `coverImage` starts with `/images/`
- [ ] No `<meta>` tags in HTML
- [ ] No `<script async src="...adsbygoogle...">` in HTML
- [ ] `data-ad-client` uses `{{ADSENSE_CLIENT_ID}}` token
- [ ] At least one `<h1>` in HTML body
- [ ] File is in correct category folder
- [ ] Tags in JSON are an array, not a comma string

---

## Common Errors

| Problem | Cause | Fix |
|---------|-------|-----|
| Article 404 | Missing `.json` or `.html` | Both files must exist |
| Missing from listings | Bad/missing JSON fields | Check `title`, `description`, `publishDate` in JSON |
| Cover image broken | Wrong path | Use `/images/file.jpg` |
| Tags not array | Used string | Use `["tag1", "tag2"]` not `"tag1, tag2"` |
| AdSense not loading | Missing `data-ad-client` | Add `{{ADSENSE_CLIENT_ID}}` to `<ins>` tag |

---

## Key Source Files

| File | Purpose |
|------|---------|
| `lib/articles.ts` | Reads `.json` + `.html`, builds article index |
| `lib/pages.ts` | Reads `.json` + `.html` for static pages |
| `lib/sanitize.ts` | XSS sanitization, allows AdSense `<ins>` tags |
| `lib/site.ts` | Env config + `{{TOKEN}}` substitution |
| `lib/faq.ts` | Auto-extracts FAQ pairs for JSON-LD |
| `lib/seo.ts` | Metadata, JSON-LD builders |
| `app/layout.tsx` | Global AdSense loader (one place, no duplication) |

---

## Quick Reference

```
Article:      content/<category>/<slug>.json + <slug>.html
Static page:  content/pages/<slug>.json + <slug>.html
Images:       public/images/<file>  →  /images/<file>
Env config:   .env.local

ALWAYS:  two files per article, JSON for meta, HTML for body
NEVER:   meta tags in HTML, AdSense loader in HTML, MDX, Markdown
```
