import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('google analytics client plugin', () => {
  let mockHead: { appendChild: ReturnType<typeof vi.fn> }
  let mockDocument: {
    createElement: ReturnType<typeof vi.fn>
    head: typeof mockHead
  }
  let mockWindow: { dataLayer?: any[]; gtag?: any }

  beforeEach(() => {
    mockHead = { appendChild: vi.fn() }
    mockDocument = {
      createElement: vi.fn((tag: string) => ({
        tagName: tag.toUpperCase(),
        src: '',
        async: false,
        setAttribute: vi.fn(),
        getAttribute: vi.fn(),
      })),
      head: mockHead,
    }
    mockWindow = {}
    vi.stubGlobal('document', mockDocument)
    vi.stubGlobal('window', mockWindow)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('does nothing when googleAnalyticsId is empty or absent', async () => {
    vi.stubGlobal('useRuntimeConfig', () => ({
      public: { googleAnalyticsId: '' },
    }))
    vi.stubGlobal('defineNuxtPlugin', (fn: any) => fn)

    const { default: plugin } = await import('../../plugins/analytics.client')
    plugin()

    expect(mockHead.appendChild).not.toHaveBeenCalled()
    expect(mockWindow.gtag).toBeUndefined()
  })

  it('injects gtag script and initializes tracking when googleAnalyticsId is configured', async () => {
    const afterEachMock = vi.fn()
    vi.stubGlobal('useRuntimeConfig', () => ({
      public: { googleAnalyticsId: 'G-TEST123456' },
    }))
    vi.stubGlobal('useRouter', () => ({
      currentRoute: { value: { fullPath: '/' } },
      afterEach: afterEachMock,
    }))
    vi.stubGlobal('defineNuxtPlugin', (fn: any) => fn)

    const { default: plugin } = await import('../../plugins/analytics.client')
    plugin()

    // Verifies script element was created and appended
    expect(mockDocument.createElement).toHaveBeenCalledWith('script')
    expect(mockHead.appendChild).toHaveBeenCalledTimes(1)
    const createdScript = mockDocument.createElement.mock.results[0].value
    expect(createdScript.src).toBe('https://www.googletagmanager.com/gtag/js?id=G-TEST123456')
    expect(createdScript.async).toBe(true)

    // Verifies gtag function exists and dataLayer is initialized
    expect(typeof mockWindow.gtag).toBe('function')
    expect(Array.isArray(mockWindow.dataLayer)).toBe(true)

    // Verifies router afterEach hook is registered
    expect(afterEachMock).toHaveBeenCalledTimes(1)

    // Simulate route navigation
    const routeCallback = afterEachMock.mock.calls[0][0]
    routeCallback({ fullPath: '/about' })

    const lastEvent = mockWindow.dataLayer?.at(-1)
    expect(lastEvent[0]).toBe('event')
    expect(lastEvent[1]).toBe('page_view')
    expect(lastEvent[2]).toEqual({ page_path: '/about' })
  })
})
