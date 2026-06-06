# Developer Guide — Pure HTML Publishing

This site serves **plain HTML only**. No MDX, no Markdown, no YAML frontmatter, no React components inside content.

> **AI agents:** see `HtmlclaudeGuide.md` for content generation rules.

You edit `.html` files. The app reads them at build time, extracts metadata from `<meta>` tags, and renders the HTML body as-is — including your AdSense scripts and ad units.

---

## How it works

```
content/finance/best-credit-cards-2026.html
        ↓ build time
/finance/best-credit-cards-2026  (static page)
```

1. Create or edit a `.html` file in `content/<category>/` or `content/pages/`
2. Add `<meta>` tags at the top for SEO and listings
3. Write the page body in pure HTML — headings, tables, images, **AdSense scripts**
4. Push to GitHub → Vercel rebuilds automatically

**You never edit React/Next.js code to publish content.**

---

## Environment variables (`.env.local`)

All branding comes from env vars. Nothing is hardcoded in the app.

```env
SITE_NAME=YourBrand
SITE_DESCRIPTION=Your site description for SEO
SITE_URL=https://yourdomain.com
SITE_TAGLINE=Your homepage tagline
SITE_SEO_TITLE=YourBrand — Finance, Insurance, Stock Market & Tech Guides
SITE_H1=Finance, Insurance, Stock Market & Best Rates Guides
CONTACT_EMAIL=hello@yourdomain.com
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
| `SITE_SEO_TITLE` | Homepage `<title>` tag — use 20–60 chars with primary keywords |
| `SITE_H1` | Homepage main heading — include finance, insurance, stock market, etc. |
| `CONTACT_EMAIL` | Contact pages, privacy policy |
| `ADSENSE_CLIENT_ID` | Replaced in HTML via `{{ADSENSE_CLIENT_ID}}` token |
| `ADSENSE_PUBLISHER_ID` | Used by `/ads.txt` route |

Copy `.env.example` to `.env.local` and fill in your values.

### SEO checklist (Vercel production)

Set these on Vercel for **magicpush.vercel.app** (or your domain):

```env
SITE_SEO_TITLE=MagicPush — Finance, Insurance, Stock Market & Tech Guides
SITE_H1=Finance, Insurance, Stock Market & Best Rates Guides
SITE_DESCRIPTION=Expert guides on best credit cards, mortgage rates, insurance policies, stock analysis, and tech — updated for 2026.
SITE_URL=https://magicpush.vercel.app
```

**DNS (not code — do in your domain registrar):**

- Add an **SPF TXT record** to prevent email spoofing: `v=spf1 -all` (or include your mail provider)
- Verify `ads.txt` loads at `https://yourdomain.com/ads.txt` after setting `ADSENSE_PUBLISHER_ID`

**Built-in SEO features:**

- Dynamic Open Graph image (`/opengraph-image`) generated from env vars
- JSON-LD: WebSite, Organization, ItemList (homepage), NewsArticle, FAQPage, BreadcrumbList
- Custom 404 page with helpful links
- WebP/AVIF image optimization via Next.js
- `/sitemap.xml`, `/robots.txt`, `/rss.xml`

### Token placeholders in HTML

Use these inside any `.html` file — they are replaced at build time:

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

**Path:** `content/<category>/<slug>.html`  
**URL:** `/<category>/<slug>`

### Example: `content/finance/best-credit-cards-2026.html`

```html
<meta name="title" content="Best Credit Cards for 2026" />
<meta name="description" content="A practical guide to the top credit cards for 2026." />
<meta name="publish-date" content="2026-01-15" />
<meta name="cover-image" content="/images/finance-cards.svg" />
<meta name="tags" content="credit cards, personal finance, rewards" />
<meta name="featured" content="true" />

<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={{ADSENSE_CLIENT_ID}}" crossorigin="anonymous"></script>

<img src="/images/finance-cards.svg" alt="Best Credit Cards for 2026" width="1200" height="675" loading="eager" />

<h1>Best Credit Cards for 2026</h1>

<div class="ad-slot" style="text-align:center;margin:2rem 0">
  <ins class="adsbygoogle"
    style="display:block"
    data-ad-client="{{ADSENSE_CLIENT_ID}}"
    data-ad-format="auto"
    data-full-width-responsive="true"></ins>
</div>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>

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

### Meta tags reference

| Meta name | Required | Description |
|-----------|----------|-------------|
| `title` | Yes | Article headline (also used for SEO and cards) |
| `description` | Yes | SEO summary (1–2 sentences) |
| `publish-date` | Yes | `YYYY-MM-DD` — controls sort order |
| `cover-image` | No | Path in `public/` e.g. `/images/photo.jpg` — shown on cards |
| `tags` | No | Comma-separated tags |
| `featured` | No | `true` or `false` — homepage featured section |
| `author` | No | Author name |
| `author-image` | No | Author photo path |
| `author-bio` | No | Short author bio |

> **Important:** Meta tags are parsed at build time and removed from the visible page. They never render in the browser.

---

## Google AdSense — per-page setup

AdSense is **not** injected by the app. You place scripts and ad units in each HTML file yourself.

### Step 1 — Set env var

```env
ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX
```

### Step 2 — Load the AdSense script (once per page, near top)

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client={{ADSENSE_CLIENT_ID}}" crossorigin="anonymous"></script>
```

### Step 3 — Place ad units where you want ads

```html
<div class="ad-slot" style="text-align:center;margin:2rem 0">
  <ins class="adsbygoogle"
    style="display:block"
    data-ad-client="{{ADSENSE_CLIENT_ID}}"
    data-ad-slot="YOUR_SLOT_ID"
    data-ad-format="auto"
    data-full-width-responsive="true"></ins>
</div>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>
```

Add as many ad units as you want, anywhere in the article body. Common placements:
- After the intro paragraph
- Between major `<h2>` sections
- Before the FAQ section

### Step 4 — ads.txt

Create `public/ads.txt` manually:

```
google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0
```

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

The filename (without `.html`) becomes the URL slug. Use lowercase and hyphens.

---

## Trust / legal pages

Static pages live in `content/pages/`:

```
content/pages/about.html          → /about
content/pages/contact.html        → /contact
content/pages/privacy-policy.html → /privacy-policy
content/pages/terms.html          → /terms
content/pages/disclaimer.html     → /disclaimer
content/pages/editorial-policy.html → /editorial-policy
```

Same format as articles — meta tags + HTML body + your AdSense scripts.

---

## Allowed HTML in content

These tags are permitted (everything else is stripped for security):

```
h1–h6  p  ul  ol  li  strong  em  a  img
table  thead  tbody  tr  th  td  blockquote  code  pre  hr  br
div  span  ins  script
```

Scripts are allowed only from:
- `pagead2.googlesyndication.com` (AdSense)
- `www.googletagmanager.com`
- `www.google-analytics.com`

Inline `(adsbygoogle = window.adsbygoogle || []).push({});` scripts are allowed.

---

## Images

Store files in `public/images/` and reference with absolute paths:

```html
<img src="/images/my-photo.jpg" alt="Descriptive alt text" width="800" height="450" loading="lazy" />
```

Cover images for article cards:

```html
<meta name="cover-image" content="/images/my-photo.jpg" />
```

---

## FAQ section (automatic JSON-LD)

Add a FAQ section using plain HTML — FAQ schema is generated automatically:

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

**Checklist:**
- [ ] Meta title and description correct
- [ ] Cover image loads on homepage card
- [ ] AdSense units appear (requires valid `ADSENSE_CLIENT_ID`)
- [ ] Article listed on category page
- [ ] No YAML `---` blocks remaining in file

---

## Publish workflow

```bash
git add content/finance/my-article.html
git add public/images/my-cover.jpg
git commit -m "Add article: My Article Title"
git push
```

---

## What the app handles automatically

| Feature | Handled by app |
|---------|----------------|
| Article page route | Yes — from filename |
| SEO metadata | Yes — from `<meta>` tags |
| JSON-LD (NewsArticle, FAQ, Breadcrumb) | Yes |
| Sitemap + RSS | Yes |
| Homepage / category listings | Yes — from meta tags |
| AdSense placement | **No — you put it in HTML** |
| Article body content | **No — pure HTML from your file** |

---

## Migration from old format

If you have files with YAML frontmatter (`---` blocks), run:

```bash
node scripts/convert-to-pure-html.mjs
```

This converts YAML → `<meta>` tags and adds AdSense placeholders.

---

## Quick reference

```
Article:     content/<category>/<slug>.html
Static page: content/pages/<slug>.html
Images:      public/images/<file>
Env config:  .env.local
Preview:     npm run dev
Convert old: node scripts/convert-to-pure-html.mjs
```

**Minimum meta tags to publish:**

```html
<meta name="title" content="Your Article Title" />
<meta name="description" content="One or two sentence SEO summary." />
<meta name="publish-date" content="2026-06-06" />
```

That is everything you need to publish on this site.
