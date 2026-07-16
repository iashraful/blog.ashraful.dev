import { createError } from 'h3'
import type {
  DevtoArticle,
  DevtoArticleSummary,
  DevtoUser,
} from '../../shared/types/devto'

const DEV_API_BASE = 'https://dev.to/api'

function requireApiKey(apiKey: unknown): string {
  if (typeof apiKey !== 'string' || apiKey.trim().length === 0) {
    throw createError({
      statusCode: 500,
      statusMessage: 'DEV API is not configured',
    })
  }

  return apiKey.trim()
}

function requireUsername(username: unknown): string {
  if (typeof username !== 'string' || username.trim().length === 0) {
    throw createError({
      statusCode: 500,
      statusMessage: 'DEV username is not configured',
    })
  }

  return username.trim()
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
  const articleId = typeof id === 'string' || typeof id === 'number'
    ? String(id)
    : ''

  if (articleId.trim().length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Article ID is required',
    })
  }

  if (!/^[1-9]\d*$/.test(articleId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Article ID is invalid',
    })
  }

  return await fetchDevto<DevtoArticle>(`/articles/${encodeURIComponent(articleId)}`, {
    notFoundMessage: 'Article not found',
  })
}
