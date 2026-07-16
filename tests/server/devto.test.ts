import { afterEach, describe, expect, it, vi } from 'vitest'
import { readFileSync } from 'node:fs'
import {
  getDevtoArticle,
  getDevtoArticles,
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

    await getDevtoArticles('server-secret')

    expect(fetchMock).toHaveBeenCalledWith('https://dev.to/api/articles/me/published', {
      headers: { 'api-key': 'server-secret' },
    })
  })

  it('rejects a whitespace-only API key before calling DEV', async () => {
    await expect(getDevtoArticles('   ')).rejects.toMatchObject({
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
})
