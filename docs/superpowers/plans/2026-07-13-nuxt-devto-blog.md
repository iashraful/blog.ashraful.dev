# Nuxt 3 dev.to Blog Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Nuxt 3 blog that mirrors dev.to articles for user `ashraful` with modern UI, light/dark toggle, and on-site article reading.

**Architecture:** Nuxt 3 SSR app using `useAsyncData` to fetch from dev.to API at request time. TailwindCSS for styling, `@nuxtjs/color-mode` for theme toggle. A single composable centralizes all API calls.

**Tech Stack:** Nuxt 3, TailwindCSS (`@nuxtjs/tailwindcss`), `@nuxtjs/color-mode`, dev.to Forem API v1

## Global Constraints

- dev.to username: `ashraful`
- dev.to API base URL: `https://dev.to/api`
- API key stored in `.env` as `DEV_TO_API_KEY`, accessed via `useRuntimeConfig().devToApiKey`
- API key is server-side only — never exposed to client
- Color palette: light = white bg / dark text, dark = slate-900 (`#0f172a`) bg / light text, accent = indigo (`#6366f1`)
- Tailwind `darkMode: 'class'`
- No unit tests for MVP — verification via `npm run build` + manual page checks
- dev.to article list endpoint returns `tag_list` as either string or array depending on endpoint — code must handle both
- dev.to article `body_html` rendered via `v-html` inside a styled prose container

---

## File Structure

```
blog.ashraful.dev/
├── nuxt.config.ts          # Modules, runtimeConfig, app config
├── tailwind.config.js      # Theme, colors, darkMode
├── package.json
├── .env                    # DEV_TO_API_KEY (gitignored)
├── .env.example            # Template
├── tsconfig.json           # Nuxt-generated, no manual edits
├── app.vue                 # Root: NuxtLayout + NuxtPage
├── error.vue               # Global 404/error page
├── assets/
│   └── css/
│       └── main.css        # Tailwind directives + global + prose styles
├── components/
│   ├── AppHeader.vue       # Sticky header, nav, theme toggle slot
│   ├── AppFooter.vue       # Footer with name + dev.to link
│   ├── ArticleCard.vue     # Card for homepage grid
│   ├── ThemeToggle.vue     # Sun/moon toggle
│   └── ErrorBanner.vue     # Error message + retry
├── composables/
│   └── useDevtoApi.ts      # getUser(), getArticles(), getArticleById()
├── layouts/
│   └── default.vue         # AppHeader + slot + AppFooter
├── pages/
│   ├── index.vue           # Homepage: hero + article grid
│   ├── about.vue           # About page
│   └── article/
│       └── [id].vue        # Full article rendering
└── .gitignore              # Already exists, will add node_modules, .nuxt, .env
```

---

### Task 1: Scaffold Nuxt 3 Project and Install Dependencies

**Files:**
- Create: `package.json`, `nuxt.config.ts`, `tailwind.config.js`, `app.vue`, `assets/css/main.css`, `.env.example`
- Modify: `.gitignore`

**Interfaces:**
- Produces: A working Nuxt 3 dev server with TailwindCSS and color-mode module configured

- [ ] **Step 1: Scaffold Nuxt 3 project in the repo root**

Run:
```bash
npx nuxi@latest init . --packageManager npm --no-gitInit --force
```

This creates `package.json`, `nuxt.config.ts`, `app.vue`, and `tsconfig.json` in the current directory. The `--force` flag allows scaffolding into a non-empty directory (we have `.gitignore` and `.vscode`).

If prompted to install dependencies, answer yes. If it doesn't auto-install, run `npm install` after.

- [ ] **Step 2: Install TailwindCSS and color-mode modules**

Run:
```bash
npm install -D @nuxtjs/tailwindcss @nuxtjs/color-mode
```

- [ ] **Step 3: Configure nuxt.config.ts**

Replace contents of `nuxt.config.ts` with:

```ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode'],
  colorMode: {
    classSuffix: '',
    preference: 'system',
    fallback: 'light',
  },
  runtimeConfig: {
    devToApiKey: process.env.DEV_TO_API_KEY || '',
    public: {
      devToUsername: 'ashraful',
    },
  },
  app: {
    head: {
      title: "Ashraful's Blog",
      meta: [
        { name: 'description', content: 'Personal blog powered by dev.to' },
      ],
    },
  },
})
```

- [ ] **Step 4: Create tailwind.config.js**

Create `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './components/**/*.{vue,js,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#6366f1',
          hover: '#4f46e5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 5: Create assets/css/main.css with Tailwind directives + global styles**

Create `assets/css/main.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-300;
  }
}

@layer components {
  .prose-devto {
    @apply max-w-none text-slate-800 dark:text-slate-200 leading-relaxed;
  }
  .prose-devto h1 {
    @apply text-3xl font-bold mt-8 mb-4;
  }
  .prose-devto h2 {
    @apply text-2xl font-bold mt-6 mb-3;
  }
  .prose-devto h3 {
    @apply text-xl font-semibold mt-5 mb-2;
  }
  .prose-devto p {
    @apply my-4;
  }
  .prose-devto a {
    @apply text-accent hover:text-accent-hover underline;
  }
  .prose-devto ul {
    @apply list-disc pl-6 my-4;
  }
  .prose-devto ol {
    @apply list-decimal pl-6 my-4;
  }
  .prose-devto li {
    @apply my-1;
  }
  .prose-devto code {
    @apply bg-slate-100 dark:bg-slate-800 rounded px-1.5 py-0.5 text-sm font-mono;
  }
  .prose-devto pre {
    @apply bg-slate-100 dark:bg-slate-800 rounded-lg p-4 overflow-x-auto my-4;
  }
  .prose-devto pre code {
    @apply bg-transparent p-0;
  }
  .prose-devto blockquote {
    @apply border-l-4 border-accent pl-4 italic my-4 text-slate-600 dark:text-slate-400;
  }
  .prose-devto img {
    @apply rounded-lg my-4 max-w-full h-auto;
  }
  .prose-devto hr {
    @apply my-8 border-slate-200 dark:border-slate-700;
  }
  .prose-devto table {
    @apply w-full my-4 border-collapse;
  }
  .prose-devto th {
    @apply border border-slate-300 dark:border-slate-600 px-4 py-2 bg-slate-100 dark:bg-slate-800 font-semibold;
  }
  .prose-devto td {
    @apply border border-slate-300 dark:border-slate-600 px-4 py-2;
  }
}
```

- [ ] **Step 6: Update app.vue**

Replace contents of `app.vue` with:

```vue
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

- [ ] **Step 7: Create .env.example**

Create `.env.example`:

```
DEV_TO_API_KEY=your_dev_to_api_key_here
```

- [ ] **Step 8: Update .gitignore**

Read the existing `.gitignore` and ensure it includes `node_modules`, `.nuxt`, `.output`, `.env`, `dist`. Add any missing entries. The file already exists so just append what's needed.

- [ ] **Step 9: Verify dev server starts**

Run:
```bash
npm run dev
```

Expected: Server starts without errors at `http://localhost:3000`. A blank page (no pages yet) should load. Stop with Ctrl+C.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "Scaffold Nuxt 3 project with TailwindCSS and color-mode"
```

---

### Task 2: Create dev.to API Composable

**Files:**
- Create: `composables/useDevtoApi.ts`

**Interfaces:**
- Consumes: `useRuntimeConfig()` from Nuxt for `devToApiKey` (server-side) and `public.devToUsername`
- Produces:
  - `getUser(): Promise<DevtoUser>` — returns user profile
  - `getArticles(): Promise<DevtoArticleSummary[]>` — returns article list (no body_html)
  - `getArticleById(id: string | number): Promise<DevtoArticle>` — returns full article with body_html

**Types:**

```ts
interface DevtoUser {
  id: number
  name: string
  username: string
  summary: string | null
  profile_image: string
  location: string | null
  website_url: string | null
  joined_at: string
  twitter_username: string | null
  github_username: string | null
}

interface DevtoArticleSummary {
  id: number
  title: string
  description: string
  cover_image: string | null
  social_image: string | null
  published_at: string
  reading_time_minutes: number
  tag_list: string | string[]
  path: string
  url: string
}

interface DevtoArticle extends DevtoArticleSummary {
  body_html: string
  body_markdown: string
  slug: string
  tags: string | string[]
}
```

- [ ] **Step 1: Create composables/useDevtoApi.ts**

Create `composables/useDevtoApi.ts`:

```ts
const API_BASE = 'https://dev.to/api'

export interface DevtoUser {
  id: number
  name: string
  username: string
  summary: string | null
  profile_image: string
  location: string | null
  website_url: string | null
  joined_at: string
  twitter_username: string | null
  github_username: string | null
}

export interface DevtoArticleSummary {
  id: number
  title: string
  description: string
  cover_image: string | null
  social_image: string | null
  published_at: string
  reading_time_minutes: number
  tag_list: string | string[]
  path: string
  url: string
}

export interface DevtoArticle extends DevtoArticleSummary {
  body_html: string
  body_markdown: string
  slug: string
  tags: string | string[]
}

export function useDevtoApi() {
  const config = useRuntimeConfig()
  const apiKey = config.devToApiKey as string

  function getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (apiKey) {
      headers['api-key'] = apiKey
    }
    return headers
  }

  async function getUser(): Promise<DevtoUser> {
    return await $fetch<DevtoUser>(`${API_BASE}/users/me`, {
      headers: getHeaders(),
    })
  }

  async function getArticles(): Promise<DevtoArticleSummary[]> {
    return await $fetch<DevtoArticleSummary[]>(`${API_BASE}/articles/me/all`, {
      headers: getHeaders(),
    })
  }

  async function getArticleById(id: string | number): Promise<DevtoArticle> {
    return await $fetch<DevtoArticle>(`${API_BASE}/articles/${id}`, {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  function normalizeTags(tags: string | string[]): string[] {
    if (Array.isArray(tags)) return tags
    if (typeof tags === 'string' && tags.length > 0) {
      return tags.split(',').map((t) => t.trim()).filter(Boolean)
    }
    return []
  }

  return {
    getUser,
    getArticles,
    getArticleById,
    normalizeTags,
  }
}
```

- [ ] **Step 2: Verify TypeScript compiles**

Run:
```bash
npx nuxi typecheck
```

Expected: No errors. (If `@nuxtjs/tailwindcss` or other module types are missing, the base config should still pass. If typecheck isn't available, run `npm run dev` briefly to confirm no startup errors, then stop.)

- [ ] **Step 3: Commit**

```bash
git add composables/useDevtoApi.ts
git commit -m "Add dev.to API composable with typed interfaces"
```

---

### Task 3: Create Layout and Shared Components

**Files:**
- Create: `layouts/default.vue`, `components/AppHeader.vue`, `components/AppFooter.vue`, `components/ThemeToggle.vue`, `components/ErrorBanner.vue`

**Interfaces:**
- Consumes: `useColorMode()` from `@nuxtjs/color-mode` for theme toggle
- Produces: Default layout that all pages will use, reusable header/footer/toggle/error banner

- [ ] **Step 1: Create components/ThemeToggle.vue**

Create `components/ThemeToggle.vue`:

```vue
<template>
  <button
    @click="toggle"
    class="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
    :aria-label="colorMode.value === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <svg v-if="colorMode.value === 'dark'" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
    <svg v-else xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  </button>
</template>

<script setup>
const colorMode = useColorMode()

function toggle() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>
```

- [ ] **Step 2: Create components/AppHeader.vue**

Create `components/AppHeader.vue`:

```vue
<template>
  <header class="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
      <NuxtLink to="/" class="text-xl font-bold text-slate-900 dark:text-white hover:text-accent transition-colors">
        Ashraful's Blog
      </NuxtLink>
      <nav class="flex items-center gap-2 sm:gap-4">
        <NuxtLink to="/" class="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-accent transition-colors">
          Home
        </NuxtLink>
        <NuxtLink to="/about" class="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-accent transition-colors">
          About
        </NuxtLink>
        <ThemeToggle />
      </nav>
    </div>
  </header>
</template>
```

- [ ] **Step 3: Create components/AppFooter.vue**

Create `components/AppFooter.vue`:

```vue
<template>
  <footer class="border-t border-slate-200 dark:border-slate-800 mt-16">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p class="text-sm text-slate-500 dark:text-slate-400">
        &copy; {{ new Date().getFullYear() }} Ashraful
      </p>
      <div class="flex items-center gap-4">
        <a
          href="https://dev.to/ashraful"
          target="_blank"
          rel="noopener noreferrer"
          class="text-sm text-slate-500 dark:text-slate-400 hover:text-accent transition-colors"
        >
          Powered by dev.to
        </a>
      </div>
    </div>
  </footer>
</template>
```

- [ ] **Step 4: Create components/ErrorBanner.vue**

Create `components/ErrorBanner.vue`:

```vue
<template>
  <div class="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 text-center">
    <p class="text-red-700 dark:text-red-400 font-medium mb-3">{{ message }}</p>
    <button
      @click="$emit('retry')"
      class="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors text-sm font-medium"
    >
      Try again
    </button>
  </div>
</template>

<script setup>
defineProps<{
  message: string
}>()

defineEmits<{
  retry: []
}>()
</script>
```

- [ ] **Step 5: Create layouts/default.vue**

Create `layouts/default.vue`:

```vue
<template>
  <div class="min-h-screen flex flex-col">
    <AppHeader />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
```

- [ ] **Step 6: Verify dev server renders layout**

Run:
```bash
npm run dev
```

Open `http://localhost:3000` — expect to see header with "Ashraful's Blog", nav links, and a theme toggle button. Footer should show at bottom. Stop the server.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "Add default layout with header, footer, theme toggle, error banner"
```

---

### Task 4: Create ArticleCard Component and Homepage

**Files:**
- Create: `components/ArticleCard.vue`, `pages/index.vue`

**Interfaces:**
- Consumes: `useDevtoApi()` → `getUser()`, `getArticles()`, `normalizeTags()` from Task 2
- Consumes: `DevtoUser`, `DevtoArticleSummary` types from Task 2
- Produces: Homepage at `/` with hero section + article grid

- [ ] **Step 1: Create components/ArticleCard.vue**

Create `components/ArticleCard.vue`:

```vue
<template>
  <NuxtLink
    :to="`/article/${article.id}`"
    class="group block rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-accent transition-all duration-200"
  >
    <div
      v-if="article.cover_image"
      class="aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-700"
    >
      <img
        :src="article.cover_image"
        :alt="article.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        loading="lazy"
      />
    </div>
    <div
      v-else
      class="aspect-[16/9] bg-gradient-to-br from-accent to-purple-600 flex items-center justify-center"
    >
      <span class="text-white text-4xl font-bold opacity-50">{{ article.title.charAt(0) }}</span>
    </div>

    <div class="p-5">
      <div class="flex flex-wrap gap-1.5 mb-3">
        <span
          v-for="tag in tags"
          :key="tag"
          class="px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-accent"
        >
          #{{ tag }}
        </span>
      </div>

      <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-2 group-hover:text-accent transition-colors line-clamp-2">
        {{ article.title }}
      </h3>

      <p class="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">
        {{ article.description }}
      </p>

      <div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
        <span>{{ formatDate(article.published_at) }}</span>
        <span>&middot;</span>
        <span>{{ article.reading_time_minutes }} min read</span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
import type { DevtoArticleSummary } from '~/composables/useDevtoApi'

const props = defineProps<{
  article: DevtoArticleSummary
}>()

const { normalizeTags } = useDevtoApi()
const tags = computed(() => normalizeTags(props.article.tag_list))

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}
</script>
```

- [ ] **Step 2: Create pages/index.vue**

Create `pages/index.vue`:

```vue
<template>
  <div>
    <!-- Hero -->
    <section class="relative overflow-hidden border-b border-slate-200 dark:border-slate-800">
      <div class="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 opacity-80"></div>
      <div class="relative max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
        <img
          v-if="user?.profile_image"
          :src="user.profile_image"
          :alt="user?.name"
          class="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-white dark:border-slate-700 shadow-lg"
        />
        <h1 class="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white mb-3">
          {{ user?.name || 'Ashraful' }}
        </h1>
        <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {{ user?.summary || 'Software developer sharing thoughts on code, tools, and technology.' }}
        </p>
      </div>
    </section>

    <!-- Articles -->
    <section class="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-6">Articles</h2>

      <!-- Error -->
      <ErrorBanner
        v-if="error"
        message="Couldn't load articles. Please try again."
        @retry="refresh()"
      />

      <!-- Loading -->
      <div v-else-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="i in 6"
          :key="i"
          class="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-pulse"
        >
          <div class="aspect-[16/9] bg-slate-100 dark:bg-slate-700"></div>
          <div class="p-5 space-y-3">
            <div class="h-4 bg-slate-100 dark:bg-slate-700 rounded w-3/4"></div>
            <div class="h-3 bg-slate-100 dark:bg-slate-700 rounded"></div>
            <div class="h-3 bg-slate-100 dark:bg-slate-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>

      <!-- Empty -->
      <div v-else-if="articles && articles.length === 0" class="text-center py-16">
        <p class="text-slate-500 dark:text-slate-400 text-lg">No articles yet. Check back soon!</p>
      </div>

      <!-- Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ArticleCard
          v-for="article in articles"
          :key="article.id"
          :article="article"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
const { getUser, getArticles } = useDevtoApi()

const { data: user, error: userError } = await useAsyncData('devto-user', () => getUser())

const { data: articles, error, pending, refresh } = await useAsyncData('devto-articles', () => getArticles())
</script>
```

- [ ] **Step 3: Verify homepage renders**

First create a `.env` file with a real dev.to API key:
```bash
echo "DEV_TO_API_KEY=your_key_here" > .env
```
(Replace `your_key_here` with an actual dev.to API key from https://dev.to/settings/extensions)

Run:
```bash
npm run dev
```

Open `http://localhost:3000` — expect to see:
- Hero section with avatar, name, bio
- Article grid with cards showing cover images, titles, tags, dates

If you don't have an API key, the page should show the error banner gracefully.

Stop the server.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Add homepage with hero section and article grid"
```

---

### Task 5: Create Article Page

**Files:**
- Create: `pages/article/[id].vue`

**Interfaces:**
- Consumes: `useDevtoApi()` → `getArticleById()`, `normalizeTags()` from Task 2
- Consumes: `DevtoArticle` type from Task 2
- Consumes: `prose-devto` CSS class from `assets/css/main.css` (Task 1)
- Produces: Full article reading page at `/article/[id]`

- [ ] **Step 1: Create pages/article/[id].vue**

Create `pages/article/[id].vue`:

```vue
<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 py-8">
    <!-- Back link -->
    <NuxtLink
      to="/"
      class="inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-accent transition-colors mb-8"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </svg>
      Back to articles
    </NuxtLink>

    <!-- Error -->
    <ErrorBanner
      v-if="error"
      message="Couldn't load this article."
      @retry="refresh()"
    />

    <!-- Loading -->
    <div v-else-if="pending" class="space-y-4 animate-pulse">
      <div class="h-10 bg-slate-100 dark:bg-slate-700 rounded w-3/4"></div>
      <div class="h-4 bg-slate-100 dark:bg-slate-700 rounded w-1/2"></div>
      <div class="aspect-[16/9] bg-slate-100 dark:bg-slate-700 rounded-xl"></div>
      <div class="space-y-3">
        <div class="h-4 bg-slate-100 dark:bg-slate-700 rounded" v-for="i in 5" :key="i"></div>
      </div>
    </div>

    <!-- Article -->
    <article v-else-if="article">
      <h1 class="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mb-4">
        {{ article.title }}
      </h1>

      <!-- Meta -->
      <div class="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mb-6">
        <span>{{ formatDate(article.published_at) }}</span>
        <span>&middot;</span>
        <span>{{ article.reading_time_minutes }} min read</span>
        <span v-if="tags.length > 0" class="flex flex-wrap gap-1.5">
          <span
            v-for="tag in tags"
            :key="tag"
            class="px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-accent"
          >
            #{{ tag }}
          </span>
        </span>
      </div>

      <!-- Cover image -->
      <img
        v-if="article.cover_image"
        :src="article.cover_image"
        :alt="article.title"
        class="w-full rounded-xl mb-8"
      />

      <!-- Content -->
      <div
        class="prose-devto"
        v-html="article.body_html"
      ></div>

      <!-- Footer link -->
      <div class="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
        <a
          :href="article.url"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors text-sm font-medium"
        >
          View on dev.to
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M7 17l9.2-9.2M17 17V7H7" />
          </svg>
        </a>
      </div>
    </article>
  </div>
</template>

<script setup>
const route = useRoute()
const { getArticleById, normalizeTags } = useDevtoApi()

const { data: article, error, pending, refresh } = await useAsyncData(
  `article-${route.params.id}`,
  () => getArticleById(route.params.id as string)
)

const tags = computed(() => {
  if (!article.value) return []
  return normalizeTags((article.value as any).tag_list)
})

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

useHead({
  title: () => article.value?.title ? `${article.value.title} — Ashraful's Blog` : "Ashraful's Blog",
})
</script>
```

- [ ] **Step 2: Verify article page renders**

Run:
```bash
npm run dev
```

Open `http://localhost:3000`, click on an article card — expect to see the full article with styled content, cover image, meta line, tags, and "View on dev.to" button at the bottom.

Stop the server.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "Add article page with full body_html rendering"
```

---

### Task 6: Create About Page and Error Page

**Files:**
- Create: `pages/about.vue`, `error.vue`

**Interfaces:**
- Consumes: `useDevtoApi()` → `getUser()` from Task 2
- Produces: About page at `/about`, global error page for 404s and other errors

- [ ] **Step 1: Create pages/about.vue**

Create `pages/about.vue`:

```vue
<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 py-12">
    <!-- Error -->
    <ErrorBanner
      v-if="error"
      message="Couldn't load profile info."
      @retry="refresh()"
    />

    <!-- Loading -->
    <div v-else-if="pending" class="animate-pulse space-y-4">
      <div class="w-28 h-28 rounded-full bg-slate-100 dark:bg-slate-700 mx-auto"></div>
      <div class="h-8 bg-slate-100 dark:bg-slate-700 rounded w-1/3 mx-auto"></div>
      <div class="h-4 bg-slate-100 dark:bg-slate-700 rounded"></div>
      <div class="h-4 bg-slate-100 dark:bg-slate-700 rounded w-3/4"></div>
    </div>

    <!-- Content -->
    <div v-else-if="user" class="text-center">
      <img
        :src="user.profile_image"
        :alt="user.name"
        class="w-28 h-28 rounded-full mx-auto mb-6 border-4 border-white dark:border-slate-700 shadow-lg"
      />
      <h1 class="text-3xl font-bold text-slate-900 dark:text-white mb-3">{{ user.name }}</h1>
      <p class="text-lg text-slate-600 dark:text-slate-400 mb-6">
        @{{ user.username }}
      </p>
      <p
        v-if="user.summary"
        class="text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto mb-8"
      >
        {{ user.summary }}
      </p>

      <div v-if="user.location" class="text-sm text-slate-500 dark:text-slate-400 mb-4">
        {{ user.location }}
      </div>

      <!-- Links -->
      <div class="flex flex-wrap justify-center gap-3 mt-8">
        <a
          href="https://dev.to/ashraful"
          target="_blank"
          rel="noopener noreferrer"
          class="px-5 py-2.5 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors text-sm font-medium"
        >
          Read on dev.to
        </a>
        <a
          v-if="user.github_username"
          :href="`https://github.com/${user.github_username}`"
          target="_blank"
          rel="noopener noreferrer"
          class="px-5 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:border-accent hover:text-accent transition-colors text-sm font-medium"
        >
          GitHub
        </a>
        <a
          v-if="user.twitter_username"
          :href="`https://twitter.com/${user.twitter_username}`"
          target="_blank"
          rel="noopener noreferrer"
          class="px-5 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:border-accent hover:text-accent transition-colors text-sm font-medium"
        >
          Twitter
        </a>
        <a
          v-if="user.website_url"
          :href="user.website_url"
          target="_blank"
          rel="noopener noreferrer"
          class="px-5 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:border-accent hover:text-accent transition-colors text-sm font-medium"
        >
          Website
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
const { getUser } = useDevtoApi()

const { data: user, error, pending, refresh } = await useAsyncData('devto-user-about', () => getUser())

useHead({
  title: "About — Ashraful's Blog",
})
</script>
```

- [ ] **Step 2: Create error.vue (root level)**

Create `error.vue` at the project root (same level as `app.vue`):

```vue
<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="text-center">
      <h1 class="text-6xl font-extrabold text-accent mb-4">{{ error?.statusCode || 500 }}</h1>
      <p class="text-xl text-slate-700 dark:text-slate-300 mb-2">
        {{ error?.statusCode === 404 ? "This page doesn't exist." : 'Something went wrong.' }}
      </p>
      <p v-if="error?.message" class="text-sm text-slate-500 dark:text-slate-400 mb-8">
        {{ error.message }}
      </p>
      <NuxtLink
        to="/"
        class="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors text-sm font-medium"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Back home
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import type { NuxtError } from '#app'

defineProps<{
  error: NuxtError
}>()
</script>
```

- [ ] **Step 3: Verify about page and error page**

Run:
```bash
npm run dev
```

- Open `http://localhost:3000/about` — expect profile info, avatar, links.
- Open `http://localhost:3000/nonexistent` — expect 404 error page with "Back home" link.

Stop the server.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "Add about page and global error page"
```

---

### Task 7: Build Verification

**Files:**
- No new files. Verification only.

- [ ] **Step 1: Run production build**

Run:
```bash
npm run build
```

Expected: Build completes with no errors. Output should show Nitro server built successfully.

- [ ] **Step 2: Run production preview**

Run:
```bash
npm run preview
```

Expected: Server starts at `http://localhost:3000`. Open it and verify:
- Homepage loads with hero + article grid (or error banner if no API key)
- Clicking an article navigates to `/article/[id]`
- About page loads at `/about`
- Dark/light toggle works
- 404 page works on unknown route

Stop the server.

- [ ] **Step 3: Final commit (if any changes needed)**

If any fixes were made during verification:

```bash
git add -A
git commit -m "Fix build issues from verification"
```

If no fixes needed, skip this step.