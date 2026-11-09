import { createError } from 'h3'
import type {
  DevtoArticle,
  DevtoArticleSummary,
  DevtoFollower,
  DevtoUser,
} from '../../shared/types/devto'
import { withDevtoFsCache } from './devtoCache'

const DEV_API_BASE = 'https://dev.to/api'
const ARTICLES_PER_PAGE = 12
const FOLLOWERS_PER_PAGE = 1000
const ABOUT_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

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

function requireSlug(slug: unknown): string {
  if (typeof slug !== 'string' || slug.trim().length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Article slug is required',
    })
  }

  const articleSlug = slug
  if (!/^-?[a-z0-9]+(?:-[a-z0-9]+)*$/.test(articleSlug)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Article slug is invalid',
    })
  }

  return articleSlug
}

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
  if (typeof tag !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(tag.trim())) {
    throw createError({ statusCode: 404, statusMessage: 'Tag not found' })
  }

  return tag.trim()
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
  return await withDevtoFsCache(
    `user_${configuredUsername}`,
    () => fetchDevto<DevtoUser>(
      `/users/by_username?url=${encodeURIComponent(configuredUsername)}`,
    ),
    { ttlMs: ABOUT_TTL_MS },
  )
}

export async function getDevtoFollowers(apiKey: unknown): Promise<DevtoFollower[]> {
  const configuredApiKey = requireApiKey(apiKey)
  return await withDevtoFsCache(
    'followers',
    async () => {
      const followers: DevtoFollower[] = []
      for (let page = 1; ; page++) {
        const currentPage = await fetchDevto<DevtoFollower[]>(
          `/followers/users?page=${page}&per_page=${FOLLOWERS_PER_PAGE}&sort=-created_at`,
          { apiKey: configuredApiKey },
        )
        followers.push(...currentPage)

        if (currentPage.length < FOLLOWERS_PER_PAGE) return followers
      }
    },
    { ttlMs: ABOUT_TTL_MS },
  )
}

export async function getDevtoArticles(
  apiKey: unknown,
  page: unknown,
): Promise<DevtoArticleSummary[]> {
  requireApiKey(apiKey)
  const configuredPage = requirePage(page)
  return await withDevtoFsCache(
    `articles_me_page_${configuredPage}`,
    () => fetchDevto<DevtoArticleSummary[]>(
      `/articles/me/published?page=${configuredPage}&per_page=${ARTICLES_PER_PAGE}`,
      { apiKey },
    ),
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

  return await withDevtoFsCache(
    `articles_tag_${configuredUsername}_${configuredTag}_page_${configuredPage}`,
    () => fetchDevto<DevtoArticleSummary[]>(
      `/articles?username=${encodeURIComponent(configuredUsername)}&tag=${encodeURIComponent(configuredTag)}&page=${configuredPage}&per_page=${ARTICLES_PER_PAGE}`,
    ),
  )
}

export async function getDevtoArticle(
  username: unknown,
  slug: unknown,
): Promise<DevtoArticle> {
  const configuredUsername = requireUsername(username)
  const articleSlug = requireSlug(slug)

  return await withDevtoFsCache(
    `article_${configuredUsername}_${articleSlug}`,
    () => fetchDevto<DevtoArticle>(
      `/articles/${encodeURIComponent(configuredUsername)}/${encodeURIComponent(articleSlug)}`,
      { notFoundMessage: 'Article not found' },
    ),
    { ttlMs: Infinity },
  )
}

export async function getDevtoAllArticles(
  username: unknown,
): Promise<DevtoArticleSummary[]> {
  const configuredUsername = requireUsername(username)
  return await withDevtoFsCache(
    `articles_all_${configuredUsername}`,
    () => fetchDevto<DevtoArticleSummary[]>(
      `/articles?username=${encodeURIComponent(configuredUsername)}&per_page=200`,
    ),
  )
}
