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

  it('uses the internal articles route', async () => {
    vi.stubGlobal('$fetch', fetchMock.mockResolvedValue([]))

    await useDevtoApi().getArticles()

    expect(fetchMock).toHaveBeenCalledWith('/api/devto/articles')
  })

  it('uses the encoded internal article route', async () => {
    vi.stubGlobal('$fetch', fetchMock.mockResolvedValue({ id: 42 }))

    await useDevtoApi().getArticleById('42')

    expect(fetchMock).toHaveBeenCalledWith('/api/devto/articles/42')
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
