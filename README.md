# Comic Collection

A personal website to browse my comic book collection, powered by Next.js and Notion.

## Setup

### 1. Notion Integration

1. Go to [notion.so/my-integrations](https://www.notion.so/my-integrations) and create a new **Internal** integration
2. Copy the **Internal Integration Token**
3. Open your Comic Collection database in Notion → click `...` menu → **Connect to** → select your integration
4. Copy `.env.local.example` to `.env.local` and paste your token

```bash
cp .env.local .env.local  # already exists, just fill in NOTION_TOKEN
```

### 2. Cover Images

Cover images live in `/public/covers/` and are named by the Notion page ID:

```
public/
  covers/
    placeholder.jpg          ← fallback shown when no cover exists
    abc123-def456-....jpg    ← named after the Notion page UUID
```

To get page IDs for naming your files, run the app and check the URL when clicking a comic — it will be `/comic/<page-id>`.

### 3. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deploy to Vercel

1. Push this repo to GitHub
2. Import the repo at [vercel.com/new](https://vercel.com/new)
3. Add environment variables in Vercel project settings:
   - `NOTION_TOKEN` — your integration token
   - `NOTION_DATA_SOURCE_ID` — `dfac3e5d-6b3c-47e9-8000-7ec75e546cac` (already set)

Vercel will auto-deploy on every push to `main`.

## Structure

```
app/
  page.tsx              ← Home page (stats + key issues + recent)
  collection/page.tsx   ← Full gallery with filters
  comic/[id]/page.tsx   ← Individual comic detail
  api/comic/[id]/       ← API route for comic data
components/
  ComicCard.tsx         ← Cover card used in grids
  CollectionFilters.tsx ← Publisher/sort filter bar
lib/
  notion.ts             ← Notion API data fetching
  utils.ts              ← Publisher colours, formatters
public/
  covers/               ← Comic cover images (JPG, named by Notion page ID)
```
