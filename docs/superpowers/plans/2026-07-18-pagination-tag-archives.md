# Pagination And Tag Archives Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Let readers load older published articles and browse the blog through public tag archive pages.

**Architecture:** The existing authenticated article endpoint gains a validated `page` query parameter for the owner's published DEV posts. A separate tag endpoint uses Forem's public article-list endpoint with the configured username and exact tag. The homepage and new tag page append page responses through a shared composable that removes duplicate article IDs and determines whether another page is available.

**Tech Stack:** Nuxt 3, Vue Composition API, TypeScript, Nitro server routes, Tailwind CSS, Vitest.

## Global Constraints

- Request published articles only; do not expose drafts or analytics.
- Keep `DEV_TO_API_KEY` server-only.
- Use `per_page=12` for paginated article requests.
- Reject missing, non-integer, zero, or negative `page` values with HTTP 400.
- Reject missing, blank, or invalid tag parameters with HTTP 404.
- Use `/tags/<URL-encoded-tag>` for archive links.
- Do not add numbered pagination or modify global search behavior.
- Do not add the phrases `FIELD NOTES` or `field notes` to user-facing copy.

---

## File Structure

- `server/utils/devto.ts`: Validates pagination/tag inputs and makes the two DEV article-list requests.
- `server/api/devto/articles/index.get.ts`: Reads and validates the `page` query parameter for the authenticated owner feed.
- `server/api/devto/tags/[tag].get.ts`: Serves a page of the configured author's articles matching one exact tag.
- `composables/useArticlePagination.ts`: Appends unique article pages and derives the next-page availability state.
- `composables/useDevtoApi.ts`: Adds typed clients for paginated owner articles and tag archive articles.
- `components/ArticleCard.vue`: Changes tags from inert spans to isolated tag archive links.
- `pages/index.vue`: Uses the shared pagination composable and renders Load more.
- `pages/tags/[tag].vue`: Displays one tag's paginated archive and its explicit states.
- `tests/server/devto.test.ts`: Verifies query validation and exact DEV request URLs.
- `tests/composables/useDevtoApi.test.ts`: Verifies paginated client request paths.
- `tests/utils/articlePagination.test.ts`: Verifies page appending, duplicate removal, and next-page state.
- `tests/components/EditorialSurfaces.test.ts`: Verifies tag-link and page-template contracts.

### Task 1: Server-Side Paginated Article Requests

**Files:**
- Modify: `server/utils/devto.ts`
- Modify: `server/api/devto/articles/index.get.ts`
- Create: `server/api/devto/tags/[tag].get.ts`
- Modify: `tests/server/devto.test.ts`

**Interfaces:**
- Consumes: `DEV_TO_API_KEY`, `runtimeConfig.public.devToUsername`, URL query `page`, and tag route parameter.
- Produces: `getDevtoArticles(apiKey: unknown, page: unknown): Promise<DevtoArticleSummary[]>` and `getDevtoArticlesByTag(username: unknown, tag: unknown, page: unknown): Promise<DevtoArticleSummary[]>`.

- [ ] **Step 1: Write the failing server tests**

Add the following tests to `tests/server/devto.test.ts`:

```ts
it('fetches a requested page of the authenticated user\'s published articles', async () => {
  vi.stubGlobal('$fetch', fetchMock.mockResolvedValue([]))

  await getDevtoArticles('server-secret', 2)

  expect(fetchMock).toHaveBeenCalledWith(
    'https://dev.to/api/articles/me/published?page=2&per_page=12',
    { headers: { 'api-key': 'server-secret' } },
  )
})

it.each([undefined, '', '0', '1.5', '-1', 'words'])('rejects invalid article page %j before calling DEV', async (page) => {
  await expect(getDevtoArticles('server-secret', page)).rejects.toMatchObject({
    statusCode: 400,
    statusMessage: 'Article page is invalid',
  })
  expect(fetchMock).not.toHaveBeenCalled()
})

it('fetches an exact tag archive for the configured username', async () => {
  vi.stubGlobal('$fetch', fetchMock.mockResolvedValue([]))

  await getDevtoArticlesByTag('ashraful islam', 'vue & nuxt', 3)

  expect(fetchMock).toHaveBeenCalledWith(
    'https://dev.to/api/articles?username=ashraful%20islam&tag=vue%20%26%20nuxt&page=3&per_page=12',
  )
})

it.each(['', '   ', '../x', 'tag/with/slash'])('rejects invalid tags before calling DEV', async (tag) => {
  await expect(getDevtoArticlesByTag('ashraful', tag, 1)).rejects.toMatchObject({
    statusCode: 404,
    statusMessage: 'Tag not found',
  })
  expect(fetchMock).not.toHaveBeenCalled()
})
```

Add imports for `getDevtoArticlesByTag` and test the two handlers by source contract:

```ts
it('forwards the page query to the owner article client', () => {
  const handler = readFileSync(new URL('../../server/api/devto/articles/index.get.ts', import.meta.url), 'utf8')

  expect(handler).toContain("getQuery(event).page")
  expect(handler).toContain('getDevtoArticles(config.devToApiKey,')
})

it('forwards the encoded tag route and page query to the public tag client', () => {
  const handler = readFileSync(new URL('../../server/api/devto/tags/[tag].get.ts', import.meta.url), 'utf8')

  expect(handler).toContain("getRouterParam(event, 'tag')")
  expect(handler).toContain('config.public.devToUsername')
  expect(handler).toContain('getQuery(event).page')
})
```

- [ ] **Step 2: Run the server tests to verify they fail**

Run: `yarn test tests/server/devto.test.ts`

Expected: FAIL because the new client function, argument signatures, tag handler, and validation do not yet exist.

- [ ] **Step 3: Add input validators and DEV request functions**

In `server/utils/devto.ts`, define the constant and validators:

```ts
const ARTICLES_PER_PAGE = 12

function requirePage(page: unknown): number {
  if (typeof page !== 'number' && typeof page !== 'string') {
    throw createError({ statusCode: 400, statusMessage: 'Article page is invalid' })
  }

  const normalized = String(page).trim()
  if (!/^[1-9]\d*$/.test(normalized)) {
    throw createError({ statusCode: 400, statusMessage: 'Article page is invalid' })
  }

  return Number(normalized)
}

function requireTag(tag: unknown): string {
  if (typeof tag !== 'string' || !/^[a-z0-9]+(?:[ -][a-z0-9]+)*$/i.test(tag.trim())) {
    throw createError({ statusCode: 404, statusMessage: 'Tag not found' })
  }

  return tag.trim()
}
```

Replace `getDevtoArticles` and add `getDevtoArticlesByTag`:

```ts
export async function getDevtoArticles(apiKey: unknown, page: unknown): Promise<DevtoArticleSummary[]> {
  const configuredPage = requirePage(page)
  return await fetchDevto<DevtoArticleSummary[]>(
    `/articles/me/published?page=${configuredPage}&per_page=${ARTICLES_PER_PAGE}`,
    { apiKey },
  )
}

export async function getDevtoArticlesByTag(
  username: unknown,
  tag: unknown,
  page: unknown,
): Promise<DevtoArticleSummary[]> {
  const configuredUsername = requireUsername(username)
  const configuredTag = requireTag(tag)
  const configuredPage = requirePage(page)

  return await fetchDevto<DevtoArticleSummary[]>(
    `/articles?username=${encodeURIComponent(configuredUsername)}&tag=${encodeURIComponent(configuredTag)}&page=${configuredPage}&per_page=${ARTICLES_PER_PAGE}`,
  )
}
```

Update the owner handler:

```ts
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  return await getDevtoArticles(config.devToApiKey, getQuery(event).page)
})
```

Create `server/api/devto/tags/[tag].get.ts`:

```ts
import { getDevtoArticlesByTag } from '../../../utils/devto'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  return await getDevtoArticlesByTag(
    config.public.devToUsername,
    getRouterParam(event, 'tag'),
    getQuery(event).page,
  )
})
```

- [ ] **Step 4: Run the server tests to verify they pass**

Run: `yarn test tests/server/devto.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit the server boundary**

```bash
git add server/utils/devto.ts server/api/devto/articles/index.get.ts server/api/devto/tags/[tag].get.ts tests/server/devto.test.ts
git commit -m "feat: paginate DEV article requests"
```

### Task 2: Reusable Pagination State And Client Requests

**Files:**
- Create: `composables/useArticlePagination.ts`
- Modify: `composables/useDevtoApi.ts`
- Create: `tests/utils/articlePagination.test.ts`
- Modify: `tests/composables/useDevtoApi.test.ts`

**Interfaces:**
- Consumes: `DevtoArticleSummary[]` page responses and `perPage: number`.
- Produces: `appendArticlePage(current: DevtoArticleSummary[], incoming: DevtoArticleSummary[]): DevtoArticleSummary[]` and `hasNextPage(incoming: DevtoArticleSummary[], perPage: number): boolean`.
- Produces: `getArticles(page: number)` and `getArticlesByTag(tag: string, page: number)` in `useDevtoApi()`.

- [ ] **Step 1: Write the failing pagination-state tests**

Create `tests/utils/articlePagination.test.ts`:

```ts
import { describe, expect, it } from 'vitest'
import { appendArticlePage, hasNextPage } from '../../composables/useArticlePagination'

const first = { id: 1 } as any
const second = { id: 2 } as any
const duplicate = { id: 1 } as any

describe('article pagination state', () => {
  it('appends only articles with IDs not already displayed', () => {
    expect(appendArticlePage([first], [duplicate, second])).toEqual([first, second])
  })

  it('uses the received page size to determine whether another page exists', () => {
    expect(hasNextPage(new Array(12).fill(first), 12)).toBe(true)
    expect(hasNextPage(new Array(11).fill(first), 12)).toBe(false)
  })
})
```

In `tests/composables/useDevtoApi.test.ts`, add:

```ts
it('requests a page of the owner article archive', async () => {
  fetchMock.mockResolvedValue([])
  const { getArticles } = useDevtoApi()

  await getArticles(2)

  expect(fetchMock).toHaveBeenCalledWith('/api/devto/articles?page=2')
})

it('requests an encoded tag archive page', async () => {
  fetchMock.mockResolvedValue([])
  const { getArticlesByTag } = useDevtoApi()

  await getArticlesByTag('vue & nuxt', 3)

  expect(fetchMock).toHaveBeenCalledWith('/api/devto/tags/vue%20%26%20nuxt?page=3')
})
```

- [ ] **Step 2: Run the new tests to verify they fail**

Run: `yarn test tests/utils/articlePagination.test.ts tests/composables/useDevtoApi.test.ts`

Expected: FAIL because the pagination composable and client methods do not exist.

- [ ] **Step 3: Implement pure pagination helpers and typed API clients**

Create `composables/useArticlePagination.ts`:

```ts
import type { DevtoArticleSummary } from '~/shared/types/devto'

export const ARTICLES_PER_PAGE = 12

export function appendArticlePage(
  current: DevtoArticleSummary[],
  incoming: DevtoArticleSummary[],
): DevtoArticleSummary[] {
  const displayedIds = new Set(current.map((article) => article.id))
  return [...current, ...incoming.filter((article) => !displayedIds.has(article.id))]
}

export function hasNextPage(incoming: DevtoArticleSummary[], perPage = ARTICLES_PER_PAGE): boolean {
  return incoming.length === perPage
}
```

Change the article client in `composables/useDevtoApi.ts`:

```ts
async function getArticles(page = 1): Promise<DevtoArticleSummary[]> {
  return await $fetch<DevtoArticleSummary[]>(`/api/devto/articles?page=${page}`)
}

async function getArticlesByTag(tag: string, page = 1): Promise<DevtoArticleSummary[]> {
  return await $fetch<DevtoArticleSummary[]>(
    `/api/devto/tags/${encodeURIComponent(tag)}?page=${page}`,
  )
}
```

Return `getArticlesByTag` alongside the existing composable methods.

- [ ] **Step 4: Run the new tests to verify they pass**

Run: `yarn test tests/utils/articlePagination.test.ts tests/composables/useDevtoApi.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit the reusable pagination layer**

```bash
git add composables/useArticlePagination.ts composables/useDevtoApi.ts tests/utils/articlePagination.test.ts tests/composables/useDevtoApi.test.ts
git commit -m "feat: add paginated article client"
```

### Task 3: Tag Links And Homepage Load More

**Files:**
- Modify: `components/ArticleCard.vue`
- Modify: `pages/index.vue`
- Modify: `tests/components/EditorialSurfaces.test.ts`

**Interfaces:**
- Consumes: `appendArticlePage`, `hasNextPage`, `ARTICLES_PER_PAGE`, and `getArticles(page)`.
- Produces: Linked tag labels and append-only homepage article pagination.

- [ ] **Step 1: Write the failing component and homepage tests**

Add these tests to `tests/components/EditorialSurfaces.test.ts`:

```ts
it('links each card tag to its encoded archive without nesting it in the article link', () => {
  const card = source('components/ArticleCard.vue')

  expect(card).toContain(':to="`/tags/${encodeURIComponent(tag)}`"')
  expect(card).toContain('<article')
  expect(card).toContain(':to="`/article/${encodeURIComponent(article.slug)}`"')
})

it('appends older homepage articles through a Load more control', () => {
  const homepage = source('pages/index.vue')

  expect(homepage).toContain('loadMore')
  expect(homepage).toContain('appendArticlePage')
  expect(homepage).toContain('hasNextPage')
  expect(homepage).toContain('Load more')
  expect(homepage).toContain('Loading more articles')
})
```

- [ ] **Step 2: Run the component test to verify it fails**

Run: `yarn test tests/components/EditorialSurfaces.test.ts`

Expected: FAIL because tags are spans and the homepage has no append pagination state.

- [ ] **Step 3: Make tags archive links**

Update the existing article-card route contract test to retain the `:to="\`/article/${encodeURIComponent(article.slug)}\`"` assertion but remove any assertion that requires the route link to be the root element.

Replace `components/ArticleCard.vue` with:

```vue
<template>
  <article class="group relative overflow-hidden border border-stone bg-paper shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-editorial dark:bg-ink">
    <NuxtLink :to="`/article/${encodeURIComponent(article.slug)}`" class="block">
      <div v-if="article.cover_image" class="relative aspect-[16/9] overflow-hidden bg-stone/40 dark:bg-white/10">
        <img :src="article.cover_image" :alt="article.title" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy">
      </div>
      <div v-else class="relative flex aspect-[16/9] items-center justify-center overflow-hidden bg-gradient-to-br from-accent via-accent-hover to-coral">
        <span class="font-display text-8xl text-paper/30">{{ article.title.charAt(0) }}</span>
      </div>
      <span class="absolute left-4 top-4 border border-paper/50 bg-ink/70 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-paper">{{ formatDate(article.published_at) }}</span>
    </NuxtLink>

    <div class="p-5 sm:p-6">
      <div class="mb-4 flex flex-wrap gap-2">
        <NuxtLink
          v-for="tag in tags"
          :key="tag"
          :to="`/tags/${encodeURIComponent(tag)}`"
          class="border border-stone px-2 py-1 text-[11px] font-medium text-ink/75 transition-colors hover:border-accent hover:text-accent dark:text-paper/75 dark:hover:text-indigo-300"
        >
          #{{ tag }}
        </NuxtLink>
      </div>

      <NuxtLink :to="`/article/${encodeURIComponent(article.slug)}`" class="block">
        <h3 class="mb-2 line-clamp-2 text-2xl leading-tight transition-colors group-hover:text-accent dark:group-hover:text-indigo-300">
          {{ article.title }}
        </h3>
      </NuxtLink>
      <p class="mb-5 line-clamp-2 text-sm leading-6 text-ink/80 dark:text-paper/80">{{ article.description || 'Article summary unavailable.' }}</p>
      <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-ink/75 dark:text-paper/75">
        <span class="inline-flex items-center gap-1.5"><AppIcon name="calendar" :size="14" />{{ formatDate(article.published_at) }}</span>
        <span class="inline-flex items-center gap-1.5"><AppIcon name="clock" :size="14" />{{ article.reading_time_minutes }} min read</span>
      </div>
    </div>
  </article>
</template>
```

- [ ] **Step 4: Add homepage append pagination**

In `pages/index.vue`, import the helpers and replace the direct `articles` array usage with an appendable ref:

```ts
import { appendArticlePage, hasNextPage } from '~/composables/useArticlePagination'

const { getUser, getArticles } = useDevtoApi()
const { data: user } = await useAsyncData('devto-user', () => getUser())
const { data: firstPage, error, pending, refresh } = await useAsyncData('devto-articles', () => getArticles(1))

const articles = ref<DevtoArticleSummary[]>([])
const page = ref(1)
const isLoadingMore = ref(false)
const loadMoreError = ref(false)
const hasMore = ref(true)

watch(firstPage, (value) => {
  articles.value = value || []
  page.value = 1
}, { immediate: true })

async function loadMore() {
  isLoadingMore.value = true
  loadMoreError.value = false

  try {
    const nextPage = page.value + 1
    const nextArticles = await getArticles(nextPage)
    articles.value = appendArticlePage(articles.value, nextArticles)
    page.value = nextPage
    hasMore.value = hasNextPage(nextArticles)
  }
  catch {
    loadMoreError.value = true
  }
  finally {
    isLoadingMore.value = false
  }
}
```

In the `watch(firstPage, ...)` callback, set `hasMore.value = hasNextPage(value || [])`. Below the card grid, render:

```vue
      <div v-if="articles.length > 0 && hasMore" class="mt-10 text-center">
        <button
          type="button"
          class="min-h-11 rounded-full border border-stone px-5 py-2 text-sm font-semibold transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-60 dark:hover:text-indigo-300"
          :disabled="isLoadingMore"
          @click="loadMore"
        >
          {{ isLoadingMore ? 'Loading more articles' : 'Load more' }}
        </button>
        <ErrorBanner
          v-if="loadMoreError"
          class="mt-4 text-left"
          message="Couldn't load more articles. Please try again."
          @retry="loadMore"
        />
      </div>
```

When first-page data is assigned, set `hasMore.value = hasNextPage(value || [])`.

- [ ] **Step 5: Run the component test to verify it passes**

Run: `yarn test tests/components/EditorialSurfaces.test.ts`

Expected: PASS.

- [ ] **Step 6: Commit homepage pagination and tag links**

```bash
git add components/ArticleCard.vue pages/index.vue tests/components/EditorialSurfaces.test.ts
git commit -m "feat: add article pagination and tag links"
```

### Task 4: Paginated Tag Archive Page

**Files:**
- Create: `pages/tags/[tag].vue`
- Modify: `tests/components/EditorialSurfaces.test.ts`

**Interfaces:**
- Consumes: `useRoute().params.tag`, `getArticlesByTag(tag, page)`, `appendArticlePage`, and `hasNextPage`.
- Produces: `/tags/[tag]` with a filtered card grid, Load more behavior, and explicit initial/append error states.

- [ ] **Step 1: Write the failing tag archive template tests**

Add this suite to `tests/components/EditorialSurfaces.test.ts`:

```ts
describe('tag archive page', () => {
  it('loads the route tag with the dedicated API client and cards', () => {
    const archive = source('pages/tags/[tag].vue')

    expect(archive).toContain('route.params.tag')
    expect(archive).toContain('decodeURIComponent')
    expect(archive).toContain('getArticlesByTag')
    expect(archive).toContain('v-for="article in articles"')
    expect(archive).toContain('<ArticleCard')
  })

  it('provides tag archive empty, error, and Load more states', () => {
    const archive = source('pages/tags/[tag].vue')

    expect(archive).toContain('No articles use #{{ tag }} yet.')
    expect(archive).toContain("Couldn't load articles. Please try again.")
    expect(archive).toContain('Load more')
    expect(archive).toContain('Back to articles')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `yarn test tests/components/EditorialSurfaces.test.ts`

Expected: FAIL because the tag route page does not exist.

- [ ] **Step 3: Create the tag archive page**

Create `pages/tags/[tag].vue` with this state setup:

```ts
<script setup lang="ts">
import type { DevtoArticleSummary } from '~/shared/types/devto'
import { appendArticlePage, hasNextPage } from '~/composables/useArticlePagination'

const route = useRoute()
const { getArticlesByTag } = useDevtoApi()
const tag = computed(() => decodeURIComponent(String(route.params.tag || '')).trim())
const page = ref(1)
const articles = ref<DevtoArticleSummary[]>([])
const hasMore = ref(true)
const isLoadingMore = ref(false)
const loadMoreError = ref(false)

const { data: firstPage, error, pending, refresh } = await useAsyncData(
  () => `devto-tag-${tag.value}`,
  () => getArticlesByTag(tag.value, 1),
)

watch(firstPage, (value) => {
  articles.value = value || []
  page.value = 1
  hasMore.value = hasNextPage(value || [])
}, { immediate: true })

async function loadMore() {
  isLoadingMore.value = true
  loadMoreError.value = false

  try {
    const nextPage = page.value + 1
    const nextArticles = await getArticlesByTag(tag.value, nextPage)
    articles.value = appendArticlePage(articles.value, nextArticles)
    page.value = nextPage
    hasMore.value = hasNextPage(nextArticles)
  }
  catch {
    loadMoreError.value = true
  }
  finally {
    isLoadingMore.value = false
  }
}

useHead({ title: () => `${tag.value} Articles — Ashraful's Blog` })
</script>
```

Its template must include a `NuxtLink` to `/` labelled `Back to articles`; an `h1` headed `#{{ tag }}`; the initial `ErrorBanner`, loading skeleton, and empty state `No articles use #{{ tag }} yet.`; the `ArticleCard` grid; and the identical Load more/error control from Task 3.

- [ ] **Step 4: Run the tag archive test to verify it passes**

Run: `yarn test tests/components/EditorialSurfaces.test.ts`

Expected: PASS.

- [ ] **Step 5: Run the full suite and production build**

Run: `yarn test && yarn build`

Expected: All Vitest tests pass and the Nuxt production build completes without errors.

- [ ] **Step 6: Commit the tag archive**

```bash
git add pages/tags/[tag].vue tests/components/EditorialSurfaces.test.ts
git commit -m "feat: add tag archive pages"
```

## Self-Review

- Spec coverage: Tasks 1-4 cover server-only API use, page validation, exact tag archives, owner-only pagination, duplicate-safe append state, initial and subsequent errors, tag links, and Load more visibility. Analytics, numbered pages, and global search changes are excluded.
- Placeholder scan: No incomplete implementation steps or unspecified validation behavior remain.
- Type consistency: `getDevtoArticles(apiKey, page)`, `getDevtoArticlesByTag(username, tag, page)`, `getArticles(page)`, `getArticlesByTag(tag, page)`, `appendArticlePage`, and `hasNextPage` are used with the signatures established in this plan.
