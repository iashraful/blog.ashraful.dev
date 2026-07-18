import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const source = (path: string) =>
  readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8')

describe('editorial homepage surfaces', () => {
  it('keeps the homepage data contracts and editorial content cues', () => {
    const homepage = source('pages/index.vue')

    expect(homepage).toContain("useAsyncData('devto-user'")
    expect(homepage).toContain("useAsyncData('devto-articles'")
    expect(homepage).toContain('Latest writing')
    expect(homepage).not.toContain('FIELD NOTES')
    expect(homepage).toContain('Latest writing')
    expect(homepage).toContain('articleCount')
  })

  it('uses readable secondary text and a comfortable latest-writing target', () => {
    const homepage = source('pages/index.vue')

    expect(homepage).toContain('text-ink/80 dark:text-paper/80')
    expect(homepage).toContain('min-h-11')
    expect(homepage).toContain('py-2')
    expect(homepage).not.toContain('text-ink/60 dark:text-paper/60')
  })

  it('keeps accent text readable in both themes and makes coral decorative', () => {
    const homepage = source('pages/index.vue')
    const config = source('tailwind.config.js')

    expect(config).toContain("DEFAULT: '#4338ca'")
    expect(config).toContain("hover: '#3730a3'")
    expect(homepage).toContain('dark:text-indigo-300')
    expect(homepage).toContain('border-coral')
    expect(homepage).toContain('text-accent')
    expect(homepage).not.toContain('text-coral">The archive')
  })
})

describe('article terminology', () => {
  it('uses direct article labels instead of field-notes branding', () => {
    for (const path of ['components/AppHeader.vue', 'pages/index.vue', 'pages/article/[slug].vue']) {
      expect(source(path)).not.toContain('FIELD NOTES')
      expect(source(path)).not.toContain('field notes')
    }
  })
})

describe('article search page', () => {
  it('uses the query parameter, shared matcher, and article cards', () => {
    const search = source('pages/search.vue')

    expect(search).toContain("String(route.query.q || '').trim()")
    expect(search).toContain('filterArticles(articles.value || [], query.value)')
    expect(search).toContain('v-for="article in filteredArticles"')
    expect(search).toContain('<ArticleCard')
  })

  it('shows explicit empty, no-match, and request-error states', () => {
    const search = source('pages/search.vue')

    expect(search).toContain('No articles yet. Check back soon.')
    expect(search).toContain('No articles match "{{ query }}".')
    expect(search).toContain("Couldn't load articles. Please try again.")
  })
})

describe('editorial navigation feedback', () => {
  it('mounts the global navigation indicator before the layout', () => {
    const app = source('app.vue')

    expect(app).toContain('<NuxtLoadingIndicator')
    expect(app.indexOf('<NuxtLoadingIndicator')).toBeLessThan(app.indexOf('<NuxtLayout'))
  })

  it('configures the editorial page transition', () => {
    const config = source('nuxt.config.ts')

    expect(config).toContain("name: 'editorial-page'")
    expect(config).toContain('pageTransition')
  })

  it('defines reduced-motion-safe transition classes', () => {
    const css = source('assets/css/main.css')

    expect(css).toContain('.editorial-page-enter-active')
    expect(css).toContain('.editorial-page-leave-active')
    expect(css).toContain('prefers-reduced-motion: reduce')
  })

  it('adds a subtle blur to navigation transition states', () => {
    const css = source('assets/css/main.css')

    expect(css).toContain('filter: blur(2px)')
    expect(css).toContain('filter: blur(0)')
  })

  it('places the loading indicator beneath the responsive masthead', () => {
    const css = source('assets/css/main.css')

    expect(css).toContain('.nuxt-loading-indicator')
    expect(css).toContain('top: 4.75rem')
    expect(css).toContain('@media (min-width: 640px)')
    expect(css).toContain('top: 5.25rem')
    expect(css).toContain('z-index: 40')
  })
})

describe('editorial accent treatments', () => {
  it('keeps prose links readable on dark surfaces', () => {
    const css = source('assets/css/main.css')

    expect(css).toContain('text-accent')
    expect(css).toContain('dark:text-indigo-300')
    expect(css).toContain('dark:hover:text-indigo-200')
  })

  it('applies dark accent text treatment to readable accent labels', () => {
    for (const path of ['pages/about.vue', 'pages/article/[slug].vue', 'error.vue']) {
      expect(source(path)).toContain('dark:text-indigo-300')
    }
  })

  it('keeps dark focus indicators and header hover text readable', () => {
    const css = source('assets/css/main.css')
    const header = source('components/AppHeader.vue')
    const error = source('error.vue')

    expect(css).toContain('.dark :focus-visible')
    expect(css).toContain('outline-indigo-300')
    expect(header).toContain('dark:group-hover:text-indigo-300')
    expect(header).toContain('dark:focus-visible:outline-indigo-300')
    expect(error).toContain('text-accent dark:text-indigo-300')
  })

  it('makes active navigation text override inactive colors', () => {
    const header = source('components/AppHeader.vue')

    expect(header).toContain('exact-active-class="bg-ink !text-paper dark:bg-paper dark:!text-ink"')
    expect(header).toContain('active-class="bg-ink !text-paper dark:bg-paper dark:!text-ink"')
  })
})

describe('editorial article card surface', () => {
  it('keeps article routing and metadata icon contracts', () => {
    const card = source('components/ArticleCard.vue')
    const homepage = source('pages/index.vue')

    expect(card).toContain(':to="`/article/${encodeURIComponent(article.slug)}`"')
    expect(homepage).toContain(':key="article.id"')
    expect(card).toContain('name="calendar"')
    expect(card).toContain('name="clock"')
  })

  it('uses readable tag, description, and metadata contrast', () => {
    const card = source('components/ArticleCard.vue')

    expect(card).toContain('text-ink/80 dark:text-paper/80')
    expect(card).toContain('text-ink/75 dark:text-paper/75')
    expect(card).not.toContain('text-ink/55 dark:text-paper/55')
    expect(card).not.toContain('text-ink/65 dark:text-paper/65')
  })
})

describe('editorial article reader surface', () => {
  it('preserves article data, URL, and retry contracts', () => {
    const article = source('pages/article/[slug].vue')

    expect(article).toContain('v-html="article.body_html"')
    expect(article).toContain(':href="article.url"')
    expect(article).toContain('@retry="refresh()"')
    expect(article).toContain('route.params.slug')
    expect(article).toContain('getArticleBySlug')
  })

  it('uses paper-based dark contrast and editorial loading surfaces', () => {
    const article = source('pages/article/[slug].vue')

    expect(article).toContain('text-ink/75 dark:text-paper/75')
    expect(article).not.toContain('bg-slate-100')
    expect(article).not.toContain('dark:bg-slate-700')
    expect(article).toContain('bg-stone/50 dark:bg-white/10')
  })

  it('makes the back link readable and comfortable to tap', () => {
    const article = source('pages/article/[slug].vue')

    expect(article).toContain('text-ink/80 dark:text-paper/80')
    expect(article).toContain('min-h-11')
    expect(article).toContain('py-2')
  })
})

describe('editorial about surface', () => {
  it('preserves conditional profile links and icon-led identity cues', () => {
    const about = source('pages/about.vue')

    expect(about).toContain('v-if="user.github_username"')
    expect(about).toContain('v-if="user.twitter_username"')
    expect(about).toContain('v-if="user.website_url"')
    expect(about).toContain('name="devto"')
    expect(about).toContain('name="github"')
    expect(about).toContain('name="twitter"')
    expect(about).toContain('name="globe"')
    expect(about).toContain('name="location"')
  })

  it('uses paper-based dark contrast and editorial loading surfaces', () => {
    const about = source('pages/about.vue')

    expect(about).toContain('text-ink/75 dark:text-paper/75')
    expect(about).not.toContain('bg-slate-100')
    expect(about).not.toContain('dark:bg-slate-700')
    expect(about).toContain('bg-stone/50 dark:bg-white/10')
  })

  it('uses readable secondary profile text and link labels', () => {
    const about = source('pages/about.vue')

    expect(about).toContain('text-ink/75 dark:text-paper/75')
    expect(about).toContain('text-ink/75 dark:text-paper/75')
    expect(about).not.toContain('text-ink/60 dark:text-paper/60')
  })
})

describe('editorial footer surface', () => {
  it('uses readable copy and a comfortable footer link target', () => {
    const footer = source('components/AppFooter.vue')

    expect(footer).toContain('text-ink/80')
    expect(footer).toContain('dark:text-paper/80')
    expect(footer).toContain('min-h-11')
    expect(footer).toContain('py-2')
  })
})
