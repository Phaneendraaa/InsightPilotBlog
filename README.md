# InsightHub — Simple MDX Content Site

A lightweight, SEO-friendly content website built with Next.js. Publish articles by adding MDX files — everything else updates automatically.

## Tech Stack

- Next.js App Router (static generation)
- TypeScript
- Tailwind CSS + custom styles
- MDX with YouTube & X/Twitter embeds
- Vercel-ready deployment

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Publishing Workflow

1. **Create an article** — add a file to the matching category folder:

   ```
   content/finance/my-article.mdx
   ```

2. **Add frontmatter:**

   ```yaml
   ---
   title: My Article Title
   description: Short SEO description
   category: finance
   publishDate: 2026-06-01
   coverImage: /images/my-image.jpg
   tags:
     - tag-one
   featured: false
   ---
   ```

3. **Upload images** to `public/images/`

4. **Paste YouTube or X links** on their own line in the MDX body — they auto-embed.

5. **Push to GitHub** — Vercel rebuilds automatically.

## Folder Structure

```
content/
├── finance/
├── stock-market/
├── business/
├── technology/
├── ai/
├── careers/
├── real-estate/
├── insurance/
├── sports/
└── general/

public/images/     # Article images
app/               # Next.js pages
components/        # UI components
lib/               # Articles, categories, SEO, MDX
```

## Environment Variables

Copy `.env.example` to `.env.local`:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production URL for SEO (sitemap, canonical, OG) |
| `NEXT_PUBLIC_ADS_ENABLED` | Set `true` to enable AdSense |
| `NEXT_PUBLIC_ADSENSE_CLIENT_ID` | Your AdSense publisher ID |

## Google AdSense

Ad placeholders are built in and disabled by default. To enable:

1. Set `NEXT_PUBLIC_ADS_ENABLED=true`
2. Set `NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-...`
3. Replace slot IDs in `components/ads/` with your real AdSense slot IDs

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the project at [vercel.com/new](https://vercel.com/new)
3. Set `NEXT_PUBLIC_SITE_URL` to your production domain
4. Deploy — all pages are statically generated at build time

## Commands

```bash
npm run dev      # Development server
npm run build    # Production build (SSG)
npm run start    # Serve production build
```
