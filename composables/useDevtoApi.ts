const API_BASE = 'https://dev.to/api'

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

export function useDevtoApi() {
  const config = useRuntimeConfig()
  const apiKey = config.devToApiKey as string

  function getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    if (apiKey) {
      headers['api-key'] = apiKey
    }
    return headers
  }

  async function getUser(): Promise<DevtoUser> {
    return await $fetch<DevtoUser>(`${API_BASE}/users/me`, {
      headers: getHeaders(),
    })
  }

  async function getArticles(): Promise<DevtoArticleSummary[]> {
    return await $fetch<DevtoArticleSummary[]>(`${API_BASE}/articles/me/all`, {
      headers: getHeaders(),
    })
  }

  async function getArticleById(id: string | number): Promise<DevtoArticle> {
    return await $fetch<DevtoArticle>(`${API_BASE}/articles/${id}`, {
      headers: { 'Content-Type': 'application/json' },
    })
  }

  function normalizeTags(tags: string | string[]): string[] {
    if (Array.isArray(tags)) return tags
    if (typeof tags === 'string' && tags.length > 0) {
      return tags.split(',').map((t) => t.trim()).filter(Boolean)
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