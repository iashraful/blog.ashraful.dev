import type {
  DevtoArticle,
  DevtoArticleSummary,
  DevtoFollower,
  DevtoUser,
} from '../shared/types/devto'

export type {
  DevtoArticle,
  DevtoArticleSummary,
  DevtoFollower,
  DevtoUser,
} from '../shared/types/devto'

export function useDevtoApi() {
  async function getUser(): Promise<DevtoUser> {
    return await $fetch<DevtoUser>('/api/devto/user')
  }

  async function getArticles(page = 1): Promise<DevtoArticleSummary[]> {
    return await $fetch<DevtoArticleSummary[]>(`/api/devto/articles?page=${page}`)
  }

  async function getArticlesByTag(tag: string, page = 1): Promise<DevtoArticleSummary[]> {
    return await $fetch<DevtoArticleSummary[]>(
      `/api/devto/tags/${encodeURIComponent(tag)}?page=${page}`,
    )
  }

  async function getFollowers(): Promise<DevtoFollower[]> {
    return await $fetch<DevtoFollower[]>('/api/devto/followers')
  }

  async function getArticleBySlug(slug: string): Promise<DevtoArticle> {
    return await $fetch<DevtoArticle>(
      `/api/devto/articles/${encodeURIComponent(slug)}`,
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
    getArticlesByTag,
    getFollowers,
    getArticleBySlug,
    normalizeTags,
  }
}
