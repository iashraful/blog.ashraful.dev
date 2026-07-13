# Blog.ashraful.dev — Design Spec

## Overview

A personal blog site built with Nuxt 3 that mirrors articles from dev.to for user `ashraful`. The blog fetches articles live from the dev.to API via SSR and renders them on-site with a modern, bold visual design and light/dark theme toggle.

## Goals

- Display all published dev.to articles for user `ashraful` on a clean, branded personal blog
- Render full article content on-site (no redirect to dev.to)
- Modern & bold visual style with light/dark mode toggle
- Server-side rendered, always-fresh content via live dev.to API calls

## Non-Goals

- No CMS, database, or local content authoring
- No comments system
- No search functionality
- No unit tests for MVP (manual verification only)

## Tech Stack

- **Framework**: Nuxt 3 (Vue 3 + Nitro server)
- **Styling**: TailwindCSS via `@nuxtjs/tailwindcss`
- **Theming**: `@nuxtjs/color-mode` (defaults to system preference, header toggle)
- **Data fetching**: SSR live fetch via `useAsyncData`/`useFetch` in a composable
- **Deployment**: SSR mode, deployable to Vercel, Netlify, or Node server

## dev.to API Integration

### Endpoints

| Endpoint | Auth | Purpose |
|---|---|---|
| `GET /api/users/me` | API key | Fetch user profile (name, bio, avatar) |
| `GET /api/articles/me/all` | API key | Fetch all published articles for the user |
| `GET /api/articles/{id}` | Public | Fetch single article by ID (full `body_html`) |

### API Key Handling

- Dev.to API key stored in `.env` as `DEV_TO_API_KEY`
- Accessed server-side only via `useRuntimeConfig()` — never exposed to client
- `.env.example` provided as template

### Data Fetching Pattern

- Homepage uses `useAsyncData` (SSR) to fetch user profile + article list
- Article list returns: id, title, description, cover_image, published_at, tags, reading_time_minutes
- Article page fetches single article by ID, renders `body_html` with `v-html` in a styled prose container
- Nitro handles request deduplication; no aggressive caching (live SSR as chosen)

## Pages

### `/` — Homepage

- **Hero section**: Avatar from dev.to profile, name, bio/tagline — centered, large bold typography, subtle gradient background accent
- **Article grid**: Responsive (1 col mobile, 2 col tablet, 3 col desktop). Each card: cover image (or gradient placeholder), title, description excerpt, tags as pills, published date, reading time

### `/article/[id]` — Article Page

- Back link to home
- Article title (large, bold), meta line (date, reading time, tags)
- Cover image if present
- Article body rendered in styled prose container (max-width ~700px, centered)
- "View on dev.to" link at bottom

### `/about` — About Page

- Dev.to profile info (name, bio, avatar)
- Links to dev.to, GitHub, etc.

## UI/UX Design

### Visual Style: Modern & Bold

- Strong typography, accent colors, card-based layout, slight gradients

### Color Palette

- **Light mode**: white background, dark text, indigo/violet accent (`#6366f1`)
- **Dark mode**: slate-900 background (`#0f172a`), light text, same indigo accent
- Dark mode driven by `@nuxtjs/color-mode` with `darkMode: 'class'` in Tailwind config

### Header (all pages)

- Site name/logo on left
- Nav links (Home, About) center-right
- Dark/light toggle switch (sun/moon icon) on far right
- Sticky with subtle backdrop blur

### Footer

- Name, social links, "Powered by dev.to"

## Error Handling

- **API failure on homepage**: Error banner "Couldn't load articles. Please try again." with retry button
- **Article not found**: `404.vue` page with link back to home
- **Network errors**: Graceful fallback UI, no white screen
- **Empty state**: If user has no articles, show "No articles yet" message

## Testing

- No unit tests for MVP
- Manual testing: SSR renders, dark/light toggle persists, articles load, article page renders HTML content
- Build check: `npm run build` must succeed

## Project Structure

```
blog.ashraful.dev/
├── nuxt.config.ts
├── tailwind.config.js
├── package.json
├── .env                    # DEV_TO_API_KEY
├── app.vue
├── assets/
│   └── css/
│       └── main.css
├── components/
│   ├── AppHeader.vue
│   ├── AppFooter.vue
│   ├── ArticleCard.vue
│   ├── ThemeToggle.vue
│   └── ErrorBanner.vue
├── composables/
│   └── useDevtoApi.ts
├── layouts/
│   └── default.vue
├── pages/
│   ├── index.vue
│   ├── about.vue
│   └── article/
│       └── [id].vue
└── error.vue
```

## Key Design Decisions

1. **SSR live fetch** over SSG/ISR — chosen for always-fresh content without rebuilds
2. **On-site article reading** over redirect — keeps users on the blog, renders dev.to HTML
3. **Tailwind + color-mode module** — idiomatic Nuxt approach, easy to maintain and extend
4. **API key server-side only** — authenticated endpoints for reliable user + article data