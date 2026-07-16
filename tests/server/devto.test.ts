import { afterEach, describe, expect, it, vi } from 'vitest'
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

  it.each(['abc', '-1', '0', '1.5', '   '])(
    'rejects malformed article ID %j before calling DEV',
    async (id) => {
      await expect(getDevtoArticle(id)).rejects.toMatchObject({
        statusCode: 400,
      })
      expect(fetchMock).not.toHaveBeenCalled()
    },
  )

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
