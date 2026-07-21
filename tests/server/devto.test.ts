import { afterEach, describe, expect, it, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import {
  getDevtoArticle,
  getDevtoArticles,
  getDevtoArticlesByTag,
  getDevtoFollowers,
  getDevtoUser,
} from '../../server/utils/devto'

const fetchMock = vi.fn()

afterEach(() => {
  fetchMock.mockReset()
  vi.unstubAllGlobals()
})

describe('DEV server client requests', () => {
  it('fetches the public user by URL-encoded username without authentication', async () => {
    vi.stubGlobal('$fetch', fetchMock.mockResolvedValue({ id: 1 }))

    await getDevtoUser('ashraful islam')

    expect(fetchMock).toHaveBeenCalledWith(
      'https://dev.to/api/users/by_username?url=ashraful%20islam',
    )
  })

  it('fetches authenticated published articles with the private API key', async () => {
    vi.stubGlobal('$fetch', fetchMock.mockResolvedValue([]))

    await getDevtoArticles('server-secret', 1)

    expect(fetchMock).toHaveBeenCalledWith('https://dev.to/api/articles/me/published?page=1&per_page=12', {
      headers: { 'api-key': 'server-secret' },
    })
  })

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

    await getDevtoArticlesByTag('ashraful islam', 'vue-nuxt', 3)

    expect(fetchMock).toHaveBeenCalledWith(
      'https://dev.to/api/articles?username=ashraful%20islam&tag=vue-nuxt&page=3&per_page=12',
    )
  })

  it.each(['', '   ', '../x', 'tag/with/slash'])('rejects invalid tags before calling DEV', async (tag) => {
    await expect(getDevtoArticlesByTag('ashraful', tag, 1)).rejects.toMatchObject({
      statusCode: 404,
      statusMessage: 'Tag not found',
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('rejects a whitespace-only API key before calling DEV', async () => {
    await expect(getDevtoArticles('   ', 1)).rejects.toMatchObject({
      statusCode: 500,
      statusMessage: 'DEV API is not configured',
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('rejects a user request when the username is absent', async () => {
    await expect(getDevtoUser('')).rejects.toMatchObject({
      statusCode: 500,
      statusMessage: 'DEV username is not configured',
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('fetches every page of followers with the private API key', async () => {
    const firstPage = Array.from({ length: 1000 }, (_, id) => ({ id }))
    const lastPage = [{ id: 1000 }]
    vi.stubGlobal('$fetch', fetchMock
      .mockResolvedValueOnce(firstPage)
      .mockResolvedValueOnce(lastPage))

    await expect(getDevtoFollowers('server-secret')).resolves.toEqual([...firstPage, ...lastPage])
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      'https://dev.to/api/followers/users?page=1&per_page=1000&sort=-created_at',
      { headers: { 'api-key': 'server-secret' } },
    )
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      'https://dev.to/api/followers/users?page=2&per_page=1000&sort=-created_at',
      { headers: { 'api-key': 'server-secret' } },
    )
  })
})

describe('DEV server client article requests', () => {
  it('fetches a public article by encoded username and slug without authentication', async () => {
    vi.stubGlobal('$fetch', fetchMock.mockResolvedValue({ id: 42 }))

    await getDevtoArticle('ashraful name', 'building-a-blog-42')

    expect(fetchMock).toHaveBeenCalledWith(
      'https://dev.to/api/articles/ashraful%20name/building-a-blog-42',
    )
  })

  it.each(['', '   '])('rejects a missing slug %j before calling DEV', async (slug) => {
    await expect(getDevtoArticle('ashraful', slug)).rejects.toMatchObject({
      statusCode: 400,
      statusMessage: 'Article slug is required',
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('accepts a slug with leading hyphen (valid on DEV)', async () => {
    vi.stubGlobal('$fetch', fetchMock.mockResolvedValue({ id: 42 }))

    await getDevtoArticle('ashraful', '-what-is-load-balancing-3pap')

    expect(fetchMock).toHaveBeenCalledWith(
      'https://dev.to/api/articles/ashraful/-what-is-load-balancing-3pap',
    )
  })

  it.each(['../x', '?', 'building-a-blog-\u0000-42'])('rejects a malformed nonblank slug %j before calling DEV', async (slug) => {
    await expect(getDevtoArticle('ashraful', slug)).rejects.toMatchObject({
      statusCode: 400,
      statusMessage: 'Article slug is invalid',
    })
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('maps an upstream article 404 to a sanitized response', async () => {
    vi.stubGlobal('$fetch', fetchMock.mockRejectedValue({
      response: { status: 404 },
      message: 'request included server-secret',
    }))

    await expect(getDevtoArticle('ashraful', 'missing-article')).rejects.toMatchObject({
      statusCode: 404,
      statusMessage: 'Article not found',
    })
  })

  it('maps an unknown upstream failure to a sanitized 502 response', async () => {
    vi.stubGlobal('$fetch', fetchMock.mockRejectedValue(new Error('server-secret')))

    await expect(getDevtoUser('ashraful')).rejects.toMatchObject({
      statusCode: 502,
      statusMessage: 'DEV request failed',
    })
  })
})

describe('DEV user handler configuration', () => {
  it('reads the public DEV username', async () => {
    const event = {}
    const handlerMock = vi.fn((handler) => handler)
    const runtimeConfigMock = vi.fn(() => ({
      devToApiKey: 'server-secret',
      public: { devToUsername: 'ashraful' },
    }))
    vi.stubGlobal('defineEventHandler', handlerMock)
    vi.stubGlobal('useRuntimeConfig', runtimeConfigMock)
    vi.stubGlobal('$fetch', fetchMock.mockResolvedValue({ id: 1 }))

    const { default: handler } = await import('../../server/api/devto/user.get')
    await handler(event)

    expect(runtimeConfigMock).toHaveBeenCalledWith(event)
    expect(fetchMock).toHaveBeenCalledWith(
      'https://dev.to/api/users/by_username?url=ashraful',
    )
  })
})

describe('DEV article handler configuration', () => {
  it('reads the public username and forwards only the route slug', () => {
    const handler = readFileSync(new URL('../../server/api/devto/articles/[slug].get.ts', import.meta.url), 'utf8')

    expect(handler).toContain('config.public.devToUsername')
    expect(handler).toContain("getRouterParam(event, 'slug')")
    expect(handler).toContain("getDevtoArticle(\n    config.public.devToUsername,\n    getRouterParam(event, 'slug'),\n  )")
    expect(handler).not.toContain('config.devToApiKey')
  })

  it('forwards the page query to the owner article client', () => {
    const handler = readFileSync(new URL('../../server/api/devto/articles/index.get.ts', import.meta.url), 'utf8')

    expect(handler).toContain('getQuery(event).page')
    expect(handler).toContain('getDevtoArticles(config.devToApiKey,')
  })

  it('forwards the tag route and page query to the public tag client', () => {
    const handler = readFileSync(new URL('../../server/api/devto/tags/[tag].get.ts', import.meta.url), 'utf8')

    expect(handler).toContain("getRouterParam(event, 'tag')")
    expect(handler).toContain('config.public.devToUsername')
    expect(handler).toContain('getQuery(event).page')
  })

  it('keeps follower requests server-side with the private API key', () => {
    const handler = readFileSync(new URL('../../server/api/devto/followers.get.ts', import.meta.url), 'utf8')

    expect(handler).toContain('getDevtoFollowers(config.devToApiKey)')
    expect(handler).not.toContain('config.public')
  })
})

describe('Docker runtime configuration', () => {
  it('maps the DEV API key to Nuxt runtime config', () => {
    const compose = readFileSync(new URL('../../docker-compose.yml', import.meta.url), 'utf8')

    expect(compose).toContain('NUXT_DEV_TO_API_KEY: ${DEV_TO_API_KEY}')
  })
})
