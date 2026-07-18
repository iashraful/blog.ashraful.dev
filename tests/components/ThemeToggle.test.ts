import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const source = (file: string) =>
  readFileSync(new URL(`../../components/${file}`, import.meta.url), 'utf8')

describe('publication shell', () => {
  it('provides an accessible icon-based theme toggle', () => {
    const component = source('ThemeToggle.vue')

    expect(component).toContain('<AppIcon')
    expect(component).toContain("name=\"sun\"")
    expect(component).toContain("name=\"moon\"")
    expect(component).toContain(':aria-label=')
    expect(component).toContain(':title=')
    expect(component).toContain('focus-visible')
    expect(component).toContain('useColorMode()')
    expect(component).toContain('size-11')
  })

  it('defines the publication masthead and navigation routes', () => {
    const component = source('AppHeader.vue')

    expect(component).not.toContain('FIELD NOTES')
    expect(component).toContain('Ashraful’s Blog')
    expect(component).toContain('brand-mark')
    expect(component).toContain('to="/"')
    expect(component).toContain('to="/about"')
    expect(component).toContain('<ThemeToggle')
    expect(component).toContain('min-h-11')
    expect(component).toContain('min-w-11')
  })

  it('submits header searches to the dedicated search page', () => {
    const component = source('AppHeader.vue')

    expect(component).toContain('aria-label="Search articles"')
    expect(component).toContain('type="search"')
    expect(component).toContain("path: '/search'")
    expect(component).toContain('query: { q: query }')
  })

  it('defines a safe icon-led DEV footer link', () => {
    const component = source('AppFooter.vue')

    expect(component).toContain("name=\"devto\"")
    expect(component).toContain("name=\"arrow-up-right\"")
    expect(component).toContain('target="_blank"')
    expect(component).toContain('rel="noopener noreferrer"')
    expect(component).toContain('border-t')
  })
})
