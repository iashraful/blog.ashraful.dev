# Public DEV Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fetch the DEV profile and published article list through public endpoints so client-side requests never need an API key.

**Architecture:** Keep all DEV access in `useDevtoApi`. Replace the two authenticated `me` URLs with fixed public URLs for `ashraful`, remove the now-unused private DEV configuration, and preserve the existing slug-based article-detail request and `useAsyncData` error handling. Add a focused Vitest regression test that captures `$fetch` options and asserts neither public request includes authentication headers.

**Tech Stack:** Nuxt 3, Vue 3 composables, TypeScript, Vitest, Yarn

## Global Constraints

- Display published DEV articles for the fixed username `ashraful` only.
- Use `GET https://dev.to/api/users/ashraful` for profile data.
- Use `GET https://dev.to/api/articles?username=ashraful` for article-list data.
- Do not expose or require `DEV_TO_API_KEY` for any browser-facing request.
- Remove the unused private `DEV_TO_API_KEY` runtime configuration and example.
- Preserve public `GET https://dev.to/api/articles/{username}/{slug}` article-detail behavior.

---

## File Structure

- Modify: `package.json` to add the focused `test` script and Vitest development dependency.
- Modify: `composables/useDevtoApi.ts` to replace private DEV endpoints with public equivalents and remove unused runtime configuration/header logic.
- Create: `composables/useDevtoApi.test.ts` to lock down public DEV request URLs and headers.
- Modify: `nuxt.config.ts` to remove unused private DEV runtime configuration.
- Modify: `.env.example` to remove the unused DEV API key placeholder.
- Modify: `yarn.lock` to record the Vitest dependency tree.

### Task 1: Add Regression-Test Support

**Files:**
- Modify: `package.json:5-20`
- Modify: `yarn.lock`

**Interfaces:**
- Produces: `yarn test`, which runs files matching `*.test.ts` through Vitest.

- [ ] **Step 1: Add Vitest and its test command**

Update `package.json` so its scripts and development dependencies include:

```json
{
  "scripts": {
    "test": "vitest run"
  },
  "devDependencies": {
    "vitest": "^4.0.0"
  }
}
```

Keep every existing script and dependency unchanged.

- [ ] **Step 2: Install the declared dependency**

Run:

```bash
yarn install
```

Expected: installation exits with status 0 and updates `yarn.lock`.

### Task 2: Lock Down Public DEV Requests

**Files:**
- Create: `composables/useDevtoApi.test.ts`
- Modify: `composables/useDevtoApi.ts:36-81`
- Modify: `nuxt.config.ts:12-16`
- Modify: `.env.example:1`

**Interfaces:**
- Consumes: `useDevtoApi(): { getUser(): Promise<DevtoUser>; getArticles(): Promise<DevtoArticleSummary[]> }`.
- Produces: `getUser()` calling `https://dev.to/api/users/ashraful` without headers, and `getArticles()` calling `https://dev.to/api/articles?username=ashraful` without headers.

- [ ] **Step 1: Write the failing regression tests**

Create `composables/useDevtoApi.test.ts`:

```ts
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useDevtoApi } from './useDevtoApi'

const fetchMock = vi.fn()

describe('useDevtoApi', () => {
  beforeEach(() => {
    fetchMock.mockReset()
    vi.stubGlobal('$fetch', fetchMock)
  })

  it('fetches the public profile without authentication headers', async () => {
    fetchMock.mockResolvedValueOnce({})

    await useDevtoApi().getUser()

    expect(fetchMock).toHaveBeenCalledWith('https://dev.to/api/users/ashraful')
  })

  it('fetches published articles from the public username endpoint', async () => {
    fetchMock.mockResolvedValueOnce([])

    await useDevtoApi().getArticles()

    expect(fetchMock).toHaveBeenCalledWith('https://dev.to/api/articles?username=ashraful')
  })
})
```

- [ ] **Step 2: Run the test to verify it fails**

Run:

```bash
yarn test composables/useDevtoApi.test.ts
```

Expected: FAIL because `getUser()` calls `/users/me` and `getArticles()` calls `/articles/me/all` with request options.

- [ ] **Step 3: Implement the minimal public-endpoint change**

In `composables/useDevtoApi.ts`, delete the `useRuntimeConfig()` and `apiKey` declarations and delete `getHeaders()`. Replace the two methods with:

```ts
async function getUser(): Promise<DevtoUser> {
  return await $fetch<DevtoUser>(`${API_BASE}/users/ashraful`)
}

async function getArticles(): Promise<DevtoArticleSummary[]> {
  return await $fetch<DevtoArticleSummary[]>(`${API_BASE}/articles?username=ashraful`)
}
```

Do not change `getArticleBySlug(slug)` or tag normalization.

- [ ] **Step 4: Remove unused API-key configuration**

In `nuxt.config.ts`, remove this private runtime-config property:

```ts
devToApiKey: process.env.DEV_TO_API_KEY || '',
```

Leave `runtimeConfig.public.devToUsername` unchanged. Delete the only line in `.env.example`, as the application no longer uses a DEV API key.

- [ ] **Step 5: Run the regression test to verify it passes**

Run:

```bash
yarn test composables/useDevtoApi.test.ts
```

Expected: PASS with 2 tests.

### Task 3: Verify Production Build and Public API Behavior

**Files:**
- Verify only: `composables/useDevtoApi.ts`, `composables/useDevtoApi.test.ts`

**Interfaces:**
- Verifies: public requests work without `DEV_TO_API_KEY`, while the Nuxt production bundle remains buildable.

- [ ] **Step 1: Run the complete test suite**

Run:

```bash
yarn test
```

Expected: PASS with 2 tests and no failures.

- [ ] **Step 2: Verify DEV’s public endpoints without a key**

Run:

```bash
curl --fail --silent --show-error 'https://dev.to/api/users/ashraful' > /dev/null
curl --fail --silent --show-error 'https://dev.to/api/articles?username=ashraful' > /dev/null
```

Expected: both commands exit with status 0 without adding an `api-key` header.

- [ ] **Step 3: Build the Nuxt application**

Run:

```bash
yarn build
```

Expected: exit status 0 and `Build complete!`.

- [ ] **Step 4: Inspect the final change set**

Run:

```bash
git status --short
git diff --check HEAD
```

Expected: only intended changes are present and `git diff --check HEAD` produces no output.
