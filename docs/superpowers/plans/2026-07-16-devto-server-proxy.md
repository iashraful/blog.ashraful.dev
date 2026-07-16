# DEV Server Proxy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Route every blog data request through Nuxt server endpoints so SSR and client navigation both work while the DEV API key remains private and the public article list exposes only published articles.

**Architecture:** Add a focused server-side DEV client and three Nitro API handlers. Keep `useDevtoApi` as the page-facing interface, but make it call same-origin internal routes; share response types between the server client and composable.

**Tech Stack:** Nuxt 3.21, Nitro/H3, TypeScript, Vitest 4, Node 22.12.0, Yarn 1

## Global Constraints

- Run all commands under Node `22.12.0` via `source "$HOME/.nvm/nvm.sh" && nvm use`.
- Keep `DEV_TO_API_KEY` in private Nuxt runtime configuration only.
- Preserve `getUser()`, `getArticles()`, `getArticleById(id)`, and `normalizeTags(tags)` for existing page callers.
- Do not change page layouts, `useAsyncData` usage, or article presentation.
- Do not add caching, rate limiting, pagination, or private article controls.
- Never expose outbound headers, the API key, or raw upstream errors in HTTP responses.
- Keep the article-list request authenticated server-side and use only `/articles/me/published`; never expose drafts or other unpublished articles.

---

## File Structure

- Create `shared/types/devto.ts`: response interfaces shared by browser and server code.
- Create `server/utils/devto.ts`: DEV URL construction, authentication, input validation, and sanitized upstream error mapping.
- Create `server/api/devto/user.get.ts`: public username-based user endpoint.
- Create `server/api/devto/articles/index.get.ts`: authenticated article-list endpoint.
- Create `server/api/devto/articles/[id].get.ts`: public article-detail endpoint.
- Create `tests/server/devto.test.ts`: server DEV client behavior and security tests.
- Create `tests/composables/useDevtoApi.test.ts`: internal-route and tag-normalization tests.
- Modify `composables/useDevtoApi.ts`: consume shared types and call internal routes only.
- Modify `package.json`: add the test command and Vitest.
- Modify `yarn.lock`: record the Vitest dependency resolution.

### Task 1: Server DEV Client and Shared Types

**Files:**
- Create: `shared/types/devto.ts`
- Create: `server/utils/devto.ts`
- Create: `tests/server/devto.test.ts`
- Modify: `package.json:8-23`
- Modify: `yarn.lock`

**Interfaces:**
- Produces: `DevtoUser`, `DevtoArticleSummary`, and `DevtoArticle` interfaces from `shared/types/devto.ts`.
- Produces: `getDevtoUser(username: unknown): Promise<DevtoUser>`.
- Produces: `getDevtoArticles(apiKey: unknown): Promise<DevtoArticleSummary[]>`.
- Produces: `getDevtoArticle(id: unknown): Promise<DevtoArticle>`.

- [ ] **Step 1: Add the test runner**

Run:

```bash
source "$HOME/.nvm/nvm.sh" && nvm use
yarn add --dev vitest@^4.0.0
```

Then add this script to `package.json`:

```json
"test": "vitest run"
```

Expected: `package.json` contains `vitest` in `devDependencies`, `yarn.lock` is updated, and the active runtime is `v22.12.0`.

- [ ] **Step 2: Write the shared DEV response types**

Create `shared/types/devto.ts`:

```ts
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
```

- [ ] **Step 3: Write failing authenticated-request tests**

Create `tests/server/devto.test.ts` with the authenticated behavior first:

```ts
import { afterEach, describe, expect, it, vi } from 'vitest'
import { getDevtoArticles, getDevtoUser } from '../../server/utils/devto'

const fetchMock = vi.fn()

afterEach(() => {
  fetchMock.mockReset()
  vi.unstubAllGlobals()
})

describe('DEV server client authentication', () => {
  it('fetches the public user by username without authentication', async () => {
    vi.stubGlobal('$fetch', fetchMock.mockResolvedValue({ id: 1 }))

    await getDevtoUser('ashraful')

    expect(fetchMock).toHaveBeenCalledWith(
      'https://dev.to/api/users/by_username?url=ashraful',
    )
  })

  it('fetches authenticated published articles with the private API key', async () => {
    vi.stubGlobal('$fetch', fetchMock.mockResolvedValue([]))

    await getDevtoArticles('server-secret')

    expect(fetchMock).toHaveBeenCalledWith('https://dev.to/api/articles/me/published', {
      headers: { 'api-key': 'server-secret' },
    })
  })

  it('rejects a user request when the username is absent', async () => {
    await expect(getDevtoUser('')).rejects.toMatchObject({
      statusCode: 500,
      statusMessage: 'DEV username is not configured',
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })
})
```

- [ ] **Step 4: Run the server tests and verify the expected failure**

Run:

```bash
source "$HOME/.nvm/nvm.sh" && nvm use && yarn test tests/server/devto.test.ts
```

Expected: FAIL because `server/utils/devto.ts` does not exist.

- [ ] **Step 5: Implement authenticated DEV requests minimally**

Create `server/utils/devto.ts` with the authenticated paths and key validation:

```ts
import { createError } from 'h3'
import type {
  DevtoArticle,
  DevtoArticleSummary,
  DevtoUser,
} from '../../shared/types/devto'

const DEV_API_BASE = 'https://dev.to/api'

function requireApiKey(apiKey: unknown): string {
  if (typeof apiKey !== 'string' || apiKey.length === 0) {
    throw createError({
      statusCode: 500,
      statusMessage: 'DEV API is not configured',
    })
  }

  return apiKey
}

async function fetchAuthenticated<T>(path: string, apiKey: unknown): Promise<T> {
  return await $fetch<T>(`${DEV_API_BASE}${path}`, {
    headers: { 'api-key': requireApiKey(apiKey) },
  })
}

export async function getDevtoUser(username: unknown): Promise<DevtoUser> {
  return await $fetch<DevtoUser>(
    `${DEV_API_BASE}/users/by_username?url=${encodeURIComponent(String(username))}`,
  )
}

export async function getDevtoArticles(apiKey: unknown): Promise<DevtoArticleSummary[]> {
  return await fetchAuthenticated<DevtoArticleSummary[]>('/articles/me/published', apiKey)
}
```

Keep the `DevtoArticle` import for the next red-green step.

- [ ] **Step 6: Run the authenticated tests**

Run:

```bash
source "$HOME/.nvm/nvm.sh" && nvm use && yarn test tests/server/devto.test.ts
```

Expected: PASS for all three authentication tests.

- [ ] **Step 7: Add failing article and sanitized-error tests**

Extend `tests/server/devto.test.ts` imports and add these cases:

```ts
import {
  getDevtoArticle,
  getDevtoArticles,
  getDevtoUser,
} from '../../server/utils/devto'

describe('DEV server client article requests', () => {
  it('fetches a public article without authentication', async () => {
    vi.stubGlobal('$fetch', fetchMock.mockResolvedValue({ id: 42 }))

    await getDevtoArticle('42')

    expect(fetchMock).toHaveBeenCalledWith('https://dev.to/api/articles/42')
  })

  it('rejects a missing article ID before calling DEV', async () => {
    await expect(getDevtoArticle('')).rejects.toMatchObject({
      statusCode: 400,
      statusMessage: 'Article ID is required',
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('maps an upstream article 404 to a sanitized response', async () => {
    vi.stubGlobal('$fetch', fetchMock.mockRejectedValue({
      response: { status: 404 },
      message: 'request included server-secret',
    }))

    await expect(getDevtoArticle('404')).rejects.toMatchObject({
      statusCode: 404,
      statusMessage: 'Article not found',
    })
  })

  it('maps an unknown upstream failure to a sanitized 502 response', async () => {
    vi.stubGlobal('$fetch', fetchMock.mockRejectedValue(new Error('server-secret')))

    await expect(getDevtoUser('server-secret')).rejects.toMatchObject({
      statusCode: 502,
      statusMessage: 'DEV request failed',
    })
  })
})
```

- [ ] **Step 8: Run the server tests and verify the expected failure**

Run:

```bash
source "$HOME/.nvm/nvm.sh" && nvm use && yarn test tests/server/devto.test.ts
```

Expected: FAIL because `getDevtoArticle` and sanitized upstream error mapping are not implemented.

- [ ] **Step 9: Add article validation and sanitized error mapping**

Replace `server/utils/devto.ts` with:

```ts
import { createError } from 'h3'
import type {
  DevtoArticle,
  DevtoArticleSummary,
  DevtoUser,
} from '../../shared/types/devto'

const DEV_API_BASE = 'https://dev.to/api'

function requireApiKey(apiKey: unknown): string {
  if (typeof apiKey !== 'string' || apiKey.length === 0) {
    throw createError({
      statusCode: 500,
      statusMessage: 'DEV API is not configured',
    })
  }

  return apiKey
}

function getUpstreamStatus(error: unknown): number | undefined {
  if (typeof error !== 'object' || error === null) return undefined

  const candidate = error as {
    statusCode?: unknown
    response?: { status?: unknown }
  }

  if (typeof candidate.statusCode === 'number') return candidate.statusCode
  if (typeof candidate.response?.status === 'number') return candidate.response.status
  return undefined
}

function throwUpstreamError(error: unknown, notFoundMessage?: string): never {
  const statusCode = getUpstreamStatus(error)

  if (statusCode === 404 && notFoundMessage) {
    throw createError({ statusCode: 404, statusMessage: notFoundMessage })
  }

  throw createError({
    statusCode: statusCode && statusCode >= 400 && statusCode < 600
      ? statusCode
      : 502,
    statusMessage: 'DEV request failed',
  })
}

async function fetchDevto<T>(
  path: string,
  options?: { apiKey?: unknown, notFoundMessage?: string },
): Promise<T> {
  try {
    if (options?.apiKey !== undefined) {
      return await $fetch<T>(`${DEV_API_BASE}${path}`, {
        headers: { 'api-key': requireApiKey(options.apiKey) },
      })
    }

    return await $fetch<T>(`${DEV_API_BASE}${path}`)
  }
  catch (error) {
    throwUpstreamError(error, options?.notFoundMessage)
  }
}

export async function getDevtoUser(username: unknown): Promise<DevtoUser> {
  const configuredUsername = requireUsername(username)
  return await fetchDevto<DevtoUser>(
    `/users/by_username?url=${encodeURIComponent(configuredUsername)}`,
  )
}

export async function getDevtoArticles(apiKey: unknown): Promise<DevtoArticleSummary[]> {
  requireApiKey(apiKey)
  return await fetchDevto<DevtoArticleSummary[]>('/articles/me/published', { apiKey })
}

export async function getDevtoArticle(id: unknown): Promise<DevtoArticle> {
  if (typeof id !== 'string' || id.trim().length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Article ID is required',
    })
  }

  return await fetchDevto<DevtoArticle>(`/articles/${encodeURIComponent(id)}`, {
    notFoundMessage: 'Article not found',
  })
}
```

The explicit `requireApiKey` calls before `fetchDevto` ensure missing configuration remains a local HTTP 500 rather than being remapped as an upstream HTTP 502.

- [ ] **Step 10: Run the complete server client tests**

Run:

```bash
source "$HOME/.nvm/nvm.sh" && nvm use && yarn test tests/server/devto.test.ts
```

Expected: PASS with seven tests and no secret values in thrown status messages.

- [ ] **Step 11: Commit the server client**

```bash
git add package.json yarn.lock shared/types/devto.ts server/utils/devto.ts tests/server/devto.test.ts
git commit -m "feat: add secure DEV server client"
```

### Task 2: Nitro Proxy Endpoints

**Files:**
- Create: `server/api/devto/user.get.ts`
- Create: `server/api/devto/articles/index.get.ts`
- Create: `server/api/devto/articles/[id].get.ts`

**Interfaces:**
- Consumes: `getDevtoUser(username: unknown)`, `getDevtoArticles(apiKey: unknown)`, and `getDevtoArticle(id: unknown)` from Task 1.
- Produces: `GET /api/devto/user`, `GET /api/devto/articles`, and `GET /api/devto/articles/:id`.

- [ ] **Step 1: Create the public username-based user handler**

Create `server/api/devto/user.get.ts`:

```ts
import { getDevtoUser } from '../../utils/devto'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  return await getDevtoUser(config.public.devToUsername)
})
```

- [ ] **Step 2: Create the authenticated article-list handler**

Create `server/api/devto/articles/index.get.ts`:

```ts
import { getDevtoArticles } from '../../../utils/devto'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  return await getDevtoArticles(config.devToApiKey)
})
```

- [ ] **Step 3: Create the public article-detail handler**

Create `server/api/devto/articles/[id].get.ts`:

```ts
import { getRouterParam } from 'h3'
import { getDevtoArticle } from '../../../utils/devto'

export default defineEventHandler(async (event) => {
  return await getDevtoArticle(getRouterParam(event, 'id'))
})
```

- [ ] **Step 4: Generate Nuxt types and compile the handlers**

Run:

```bash
source "$HOME/.nvm/nvm.sh" && nvm use && yarn nuxt prepare
```

Expected: exit 0 and `Types generated in .nuxt` without unresolved imports.

- [ ] **Step 5: Run the server client regression tests**

Run:

```bash
source "$HOME/.nvm/nvm.sh" && nvm use && yarn test tests/server/devto.test.ts
```

Expected: PASS with seven tests.

- [ ] **Step 6: Commit the proxy endpoints**

```bash
git add server/api/devto/user.get.ts server/api/devto/articles/index.get.ts 'server/api/devto/articles/[id].get.ts'
git commit -m "feat: proxy DEV requests through Nitro"
```

### Task 3: Browser-Safe DEV Composable

**Files:**
- Modify: `composables/useDevtoApi.ts:1-82`
- Create: `tests/composables/useDevtoApi.test.ts`

**Interfaces:**
- Consumes: `GET /api/devto/user`, `GET /api/devto/articles`, and `GET /api/devto/articles/:id` from Task 2.
- Preserves: `useDevtoApi()` with `getUser`, `getArticles`, `getArticleById`, and `normalizeTags`.

- [ ] **Step 1: Write failing internal-route tests**

Create `tests/composables/useDevtoApi.test.ts`:

```ts
import { afterEach, describe, expect, it, vi } from 'vitest'
import { useDevtoApi } from '../../composables/useDevtoApi'

const fetchMock = vi.fn()

afterEach(() => {
  fetchMock.mockReset()
  vi.unstubAllGlobals()
})

describe('useDevtoApi requests', () => {
  it('uses the internal user route', async () => {
    vi.stubGlobal('$fetch', fetchMock.mockResolvedValue({ id: 1 }))

    await useDevtoApi().getUser()

    expect(fetchMock).toHaveBeenCalledWith('/api/devto/user')
  })

  it('uses the internal articles route', async () => {
    vi.stubGlobal('$fetch', fetchMock.mockResolvedValue([]))

    await useDevtoApi().getArticles()

    expect(fetchMock).toHaveBeenCalledWith('/api/devto/articles')
  })

  it('uses the encoded internal article route', async () => {
    vi.stubGlobal('$fetch', fetchMock.mockResolvedValue({ id: 42 }))

    await useDevtoApi().getArticleById('42')

    expect(fetchMock).toHaveBeenCalledWith('/api/devto/articles/42')
  })
})

describe('useDevtoApi tag normalization', () => {
  it('preserves tag arrays', () => {
    expect(useDevtoApi().normalizeTags(['nuxt', 'vue'])).toEqual(['nuxt', 'vue'])
  })

  it('splits and trims comma-separated tags', () => {
    expect(useDevtoApi().normalizeTags('nuxt, vue,')).toEqual(['nuxt', 'vue'])
  })

  it('returns an empty array for an empty tag string', () => {
    expect(useDevtoApi().normalizeTags('')).toEqual([])
  })
})
```

- [ ] **Step 2: Run the composable tests and verify the expected failure**

Run:

```bash
source "$HOME/.nvm/nvm.sh" && nvm use && yarn test tests/composables/useDevtoApi.test.ts
```

Expected: FAIL because the composable still calls `https://dev.to/api` and requires Nuxt runtime config.

- [ ] **Step 3: Replace direct DEV calls with internal routes**

Replace `composables/useDevtoApi.ts` with:

```ts
import type {
  DevtoArticle,
  DevtoArticleSummary,
  DevtoUser,
} from '../shared/types/devto'

export type {
  DevtoArticle,
  DevtoArticleSummary,
  DevtoUser,
} from '../shared/types/devto'

export function useDevtoApi() {
  async function getUser(): Promise<DevtoUser> {
    return await $fetch<DevtoUser>('/api/devto/user')
  }

  async function getArticles(): Promise<DevtoArticleSummary[]> {
    return await $fetch<DevtoArticleSummary[]>('/api/devto/articles')
  }

  async function getArticleById(id: string | number): Promise<DevtoArticle> {
    return await $fetch<DevtoArticle>(
      `/api/devto/articles/${encodeURIComponent(String(id))}`,
    )
  }

  function normalizeTags(tags: string | string[]): string[] {
    if (Array.isArray(tags)) return tags
    if (typeof tags === 'string' && tags.length > 0) {
      return tags.split(',').map((tag) => tag.trim()).filter(Boolean)
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

- [ ] **Step 4: Run the composable tests**

Run:

```bash
source "$HOME/.nvm/nvm.sh" && nvm use && yarn test tests/composables/useDevtoApi.test.ts
```

Expected: PASS with six tests.

- [ ] **Step 5: Run the full automated test suite**

Run:

```bash
source "$HOME/.nvm/nvm.sh" && nvm use && yarn test
```

Expected: PASS with thirteen tests across two test files.

- [ ] **Step 6: Commit the composable migration**

```bash
git add composables/useDevtoApi.ts tests/composables/useDevtoApi.test.ts
git commit -m "fix: route browser DEV calls through server"
```

### Task 4: End-to-End Verification

**Files:**
- Verify: `nuxt.config.ts`
- Verify: `.env.example`
- Verify: all files changed in Tasks 1-3

**Interfaces:**
- Consumes: the complete proxy request flow from Tasks 1-3.
- Produces: verified SSR and browser-safe production behavior.

- [ ] **Step 1: Confirm the API key remains private**

Run:

```bash
rg "devToApiKey|DEV_TO_API_KEY|api-key" nuxt.config.ts .env.example composables server shared tests
```

Expected:

- `nuxt.config.ts` declares `devToApiKey` outside `runtimeConfig.public`.
- `.env.example` documents `DEV_TO_API_KEY`.
- No composable, page, component, or shared type references the key or `api-key` header.
- Only server code and server tests reference the `api-key` header.

- [ ] **Step 2: Run all tests under the pinned runtime**

Run:

```bash
source "$HOME/.nvm/nvm.sh" && nvm use && node --version && yarn test
```

Expected: Node prints `v22.12.0`; all thirteen tests pass.

- [ ] **Step 3: Build the production application**

Run:

```bash
source "$HOME/.nvm/nvm.sh" && nvm use && yarn build
```

Expected: exit 0 with `Build complete!`.

- [ ] **Step 4: Start the development server for navigation verification**

Run in a persistent terminal:

```bash
source "$HOME/.nvm/nvm.sh" && nvm use && yarn dev
```

Expected: Nuxt starts on `http://localhost:3000` with no startup error.

- [ ] **Step 5: Verify SSR and client navigation behavior**

In a browser with the Network panel open:

1. Load `http://localhost:3000/` directly and verify the profile and article list render.
2. Navigate to `/about` through the header and verify the profile renders without a 401.
3. Navigate back to `/` through the header and verify the article list renders without a 401.
4. Open an article card and verify the article detail renders.
5. Filter network requests by `dev.to/api` and verify the browser made no direct DEV API requests.
6. Filter network requests by `/api/devto` and verify browser navigation uses same-origin proxy requests returning 2xx statuses.

Expected: direct refreshes and client-side navigation all load data; no browser request receives 401 and no browser request contains an `api-key` header.

- [ ] **Step 6: Inspect the final diff**

Run:

```bash
git diff --check
```

Expected: no whitespace errors; only intended proxy, test, dependency, runtime-version, and documentation changes are present. Existing unrelated user changes remain untouched.

- [ ] **Step 7: Commit final verification adjustments only if needed**

If verification required tracked-file corrections, commit only those corrections:

```bash
git add <exact-files-corrected-during-verification>
git commit -m "test: verify DEV proxy navigation"
```

If verification required no corrections, do not create an empty commit.
