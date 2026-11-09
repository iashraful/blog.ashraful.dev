import { afterEach, describe, expect, it, vi } from 'vitest'
import sitemapHandler from '../../server/routes/sitemap.xml'

describe('sitemap handler', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('generates sitemap xml with articles', async () => {
    const event = {
      node: {
        res: {
          setHeader: vi.fn(),
        },
      },
    }
    vi.stubGlobal('useRuntimeConfig', () => ({
      public: {
        siteUrl: 'https://blog.ashraful.dev',
        devToUsername: 'ashraful',
      },
    }))
    vi.stubGlobal('$fetch', vi.fn().mockResolvedValue([
      {
        slug: 'test-article',
        published_at: '2026-01-01T00:00:00.000Z',
      },
    ]))

    const xml = await sitemapHandler(event as any)

    expect(event.node.res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/xml')
    expect(xml).toContain('<loc>https://blog.ashraful.dev</loc>')
    expect(xml).toContain('<loc>https://blog.ashraful.dev/about</loc>')
    expect(xml).toContain('<loc>https://blog.ashraful.dev/article/test-article</loc>')
  })
})
