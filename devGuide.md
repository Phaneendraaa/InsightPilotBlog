# Developer Guide — JSON + HTML Publishing

This site uses a two-file system for content. No MDX, no Markdown, no YAML, no React inside content.

> **AI agents:** see `HtmlclaudeGuide.md` for content generation rules.

Each article is two files:
- `<slug>.json` — all metadata (title, description, dates, tags)
- `<slug>.html` — pure HTML body (headings, paragraphs, tables, ad units)

**You never edit React/Next.js code to publish content.**

---

## How it works

```
content/finance/best-credit-cards-2026.json  ← metadata
content/finance/best-credit-cards-2026.html  ← body
        ↓ build time
/finance/best-credit-cards-2026  (static page)
```

1. Create `<slug>.json` with article metadata
2. Create `<slug>.html` with article body HTML
3. Add any images to `public/images/`
4. Push to GitHub → Vercel rebuilds automatically

---

## Environment variables (`.env.local`)

All branding comes from env vars. Nothing is hardcoded in the app.

```env
SITE_NAME=MagicPush
SITE_DESCRIPTION=Expert guides on finance, insurance, mortgage rates, stock analysis, and tech.
SITE_URL=https://magicpush.vercel.app
SITE_TAGLINE=Stay Ahead of What Matters.
SITE_SEO_TITLE=MagicPush — Finance, Insurance, Stock Market & Tech Guides
SITE_H1=Finance, Insurance, Stock Market & Best Rates Guides
CONTACT_EMAIL=hello@magicpush.in
ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
ADSENSE_PUBLISHER_ID=pub-XXXXXXXXXXXXXXXX

TWITTER_URL=
FACEBOOK_URL=
INSTAGRAM_URL=
YOUTUBE_URL=
LINKEDIN_URL=
```

| Variable | Used for |
|----------|----------|
| `SITE_NAME` | Header, footer, page titles, JSON-LD |
| `SITE_DESCRIPTION` | Homepage SEO, footer |
| `SITE_URL` | Canonical URLs, sitemap, RSS, Open Graph |
| `SITE_TAGLINE` | Homepage hero subtitle |
| `SITE_SEO_TITLE` | Homepage `<title>` — use 20–60 chars with primary keywords |
| `SITE_H1` | Homepage main heading |
| `CONTACT_EMAIL` | Contact page, privacy policy |
| `ADSENSE_CLIENT_ID` | Global AdSense loader + `{{ADSENSE_CLIENT_ID}}` token in HTML |
| `ADSENSE_PUBLISHER_ID` | Auto-generates `/ads.txt` route |

Copy `.env.example` to `.env.local` and fill in your values.

### Vercel production checklist

Set these in Vercel → Settings → Environment Variables before deploying:

```env
SITE_NAME=MagicPush
SITE_SEO_TITLE=MagicPush — Finance, Insurance, Stock Market & Tech Guides
SITE_H1=Finance, Insurance, Stock Market & Best Rates Guides
SITE_DESCRIPTION=Expert guides on best credit cards, mortgage rates, insurance policies, stock analysis, and tech — updated for 2026.
SITE_URL=https://magicpush.vercel.app
CONTACT_EMAIL=hello@magicpush.in
ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
ADSENSE_PUBLISHER_ID=pub-XXXXXXXXXXXXXXXX
```

After adding env vars, always **manually redeploy** — Vercel does not auto-redeploy on env changes.

### Token placeholders in HTML files

Use these anywhere in `.html` body files — replaced at build time:

| Token | Replaced with |
|-------|---------------|
| `{{SITE_NAME}}` | `SITE_NAME` env var |
| `{{SITE_DESCRIPTION}}` | `SITE_DESCRIPTION` env var |
| `{{SITE_URL}}` | `SITE_URL` env var |
| `{{SITE_TAGLINE}}` | `SITE_TAGLINE` env var |
| `{{CONTACT_EMAIL}}` | `CONTACT_EMAIL` env var |
| `{{ADSENSE_CLIENT_ID}}` | `ADSENSE_CLIENT_ID` env var |

---

## Article file format

**Two files per article. Both must exist or the article will not appear.**

### The JSON file — metadata

**Path:** `content/<category>/<slug>.json`

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

| Field | Required | Description |
|-------|----------|-------------|
| `title` | Yes | Article headline — used for SEO, cards, JSON-LD. Under 60 chars. |
| `description` | Yes | SEO summary — 1–2 sentences, under 160 chars. |
| `publishDate` | Yes | `YYYY-MM-DD` — controls sort order, newest first. |
| `coverImage` | No | Path starting with `/images/`. File must be in `public/images/`. |
| `tags` | No | JSON array of strings (not comma-separated). |
| `featured` | No | `true` or `false`. Appears in homepage featured section (max 3). |
| `author` | No | Author display name. |
| `authorImage` | No | Path to author photo. |
| `authorBio` | No | Short author bio. |

### The HTML file — body only

**Path:** `content/<category>/<slug>.html`

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

<p>Your article content starts here. Pure HTML only.</p>

<h2>Section heading</h2>
<p>Paragraph text.</p>

<table>
  <thead>
    <tr><th>Column</th><th>Value</th></tr>
  </thead>
  <tbody>
    <tr><td>Row</td><td>Data</td></tr>
  </tbody>
</table>
```

**Rules for HTML files:**
- No `<meta>` tags — all metadata goes in the `.json` file
- No AdSense loader `<script async src="...adsbygoogle...">` — injected globally by the app
- Ad unit `<ins class="adsbygoogle">` tags are fine — place wherever you want ads
- Use `{{ADSENSE_CLIENT_ID}}` token in `data-ad-client`

---

## Google AdSense

The AdSense **loader script** is injected once globally by `app/layout.tsx` — you never add it to individual files.

You only place **ad unit slots** in HTML files where you want ads to appear:

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

**Do NOT add** `<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>` — the global loader handles this.

### ads.txt

The `/ads.txt` route is auto-generated from the `ADSENSE_PUBLISHER_ID` env var. No file needed.
Verify it works at `https://magicpush.vercel.app/ads.txt` after deploy.

---

## Categories

| Category | Folder | Example URL |
|----------|--------|-------------|
| Finance | `content/finance/` | `/finance/best-credit-cards-2026` |
| Stock Market | `content/stock-market/` | `/stock-market/apple-stock-analysis` |
| Business | `content/business/` | `/business/my-article` |
| Technology | `content/technology/` | `/technology/spring-boot-roadmap` |
| AI | `content/ai/` | `/ai/chatgpt-productivity-tips` |
| Careers | `content/careers/` | `/careers/my-article` |
| Real Estate | `content/real-estate/` | `/real-estate/my-article` |
| Insurance | `content/insurance/` | `/insurance/best-insurance-policies-usa` |
| Sports | `content/sports/` | `/sports/real-madrid-vs-barcelona` |
| General | `content/general/` | `/general/my-article` |

The filename (without `.html`/`.json`) becomes the URL slug. Use lowercase and hyphens.

---

## Static / legal pages

Pages live in `content/pages/` — same two-file format:

```
content/pages/about.json + about.html             → /about
content/pages/contact.json + contact.html         → /contact
content/pages/privacy-policy.json + *.html        → /privacy-policy
content/pages/terms.json + terms.html             → /terms
content/pages/disclaimer.json + disclaimer.html   → /disclaimer
content/pages/editorial-policy.json + *.html      → /editorial-policy
```

Do not add AdSense ad units to privacy-policy, terms, or disclaimer pages — this violates Google AdSense policy.

---

## Allowed HTML tags in content

```
h1–h6  p  ul  ol  li  strong  em  a  img
table  thead  tbody  tr  th  td  blockquote  code  pre  hr  br
div  span  ins  script
```

Stripped (never use): `iframe`, `style`, `form`, `input`, `textarea`, `svg`, `object`, `embed`

External scripts allowed from:
- `pagead2.googlesyndication.com` (AdSense ad units only — NOT the loader)
- `www.googletagmanager.com`
- `www.google-analytics.com`

---

## Images

Store in `public/images/`, reference with absolute paths:

```html
<img src="/images/my-photo.jpg" alt="Descriptive alt text" width="800" height="450" loading="lazy" />
```

Cover image (referenced in JSON, optionally shown as hero in HTML):

```json
"coverImage": "/images/my-photo.jpg"
```

---

## FAQ section (automatic JSON-LD)

Structure FAQs with `<h3>` + `<p>` under a FAQ `<h2>` — schema generated automatically:

```html
<h2>Frequently Asked Questions</h2>

<h3>Your question here?</h3>
<p>Your answer here.</p>

<h3>Another question?</h3>
<p>Another answer.</p>
```

---

## Local preview

```bash
npm install
npm run dev
```

Open `http://localhost:3000/finance/best-credit-cards-2026`

**Checklist before pushing:**
- [ ] Both `.json` and `.html` files exist for the article
- [ ] JSON has `title`, `description`, `publishDate`
- [ ] `publishDate` is `YYYY-MM-DD`
- [ ] `coverImage` starts with `/images/`
- [ ] `tags` is a JSON array, not a comma string
- [ ] No `<meta>` tags in HTML file
- [ ] No AdSense loader `<script>` in HTML file
- [ ] Cover image file exists in `public/images/`
- [ ] Article appears on category listing page

---

## Publish workflow

```bash
git add content/finance/my-article.json
git add content/finance/my-article.html
git add public/images/my-cover.jpg
git commit -m "Add article: My Article Title"
git push
```

---

## Built-in SEO features

| Feature | How |
|---------|-----|
| Article page route | Auto — from filename |
| Page title, description, canonical | From `.json` metadata |
| Open Graph + Twitter cards | Auto from metadata |
| JSON-LD (NewsArticle, FAQPage, BreadcrumbList) | Auto |
| WebSite + Organization schema | Auto from env vars |
| Sitemap (`/sitemap.xml`) | Auto — all articles + pages |
| RSS feed (`/rss.xml`) | Auto |
| Dynamic OG image (`/opengraph-image`) | Auto from env vars |
| `ads.txt` (`/ads.txt`) | Auto from `ADSENSE_PUBLISHER_ID` |
| `robots.txt` | Auto |
| AdSense loader | Global — `app/layout.tsx` |
| Ad unit placement | You — `<ins>` in HTML body |
| Article body content | You — pure HTML |

---

## What the app does NOT do

- Parse `<meta>` tags in HTML — use `.json` files instead
- Inject AdSense per-page — one global loader in `app/layout.tsx`
- Support Markdown, MDX, or YAML in content files

---

## Quick reference

```
Article:     content/<category>/<slug>.json + <slug>.html
Static page: content/pages/<slug>.json + <slug>.html
Images:      public/images/<file>  →  /images/<file>
Env config:  .env.local (copy from .env.example)
Preview:     npm run dev

ALWAYS:  two files per article, JSON for metadata, HTML for body
NEVER:   meta tags in HTML, AdSense loader in HTML, Markdown, MDX
```
