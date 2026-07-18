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

  it('uses the internal paginated articles route', async () => {
    vi.stubGlobal('$fetch', fetchMock.mockResolvedValue([]))

    await useDevtoApi().getArticles(2)

    expect(fetchMock).toHaveBeenCalledWith('/api/devto/articles?page=2')
  })

  it('uses an encoded paginated tag archive route', async () => {
    vi.stubGlobal('$fetch', fetchMock.mockResolvedValue([]))

    await useDevtoApi().getArticlesByTag('vue-nuxt', 3)

    expect(fetchMock).toHaveBeenCalledWith('/api/devto/tags/vue-nuxt?page=3')
  })

  it('encodes special characters in the internal slug route', async () => {
    const slug = 'blog 42/nuxt?'
    vi.stubGlobal('$fetch', fetchMock.mockResolvedValue({ id: 42, slug }))

    await useDevtoApi().getArticleBySlug(slug)

    expect(fetchMock).toHaveBeenCalledWith(
      `/api/devto/articles/${encodeURIComponent(slug)}`,
    )
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
