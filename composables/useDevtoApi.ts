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
