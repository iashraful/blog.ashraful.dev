import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const component = () =>
  readFileSync(new URL('../../components/AppIcon.vue', import.meta.url), 'utf8')

describe('AppIcon', () => {
  it('defines the complete editorial icon contract', () => {
    const source = component()

    for (const name of [
      'calendar',
      'clock',
      'location',
      'external',
      'github',
      'devto',
      'twitter',
      'globe',
      'arrow-left',
      'arrow-up-right',
      'sun',
      'moon',
    ]) {
      expect(source).toContain(`'${name}'`)
    }
  })

  it('renders a decorative scalable SVG with a default size', () => {
    const source = component()

    expect(source).toContain('aria-hidden="true"')
    expect(source).toContain('viewBox="0 0 24 24"')
    expect(source).toContain('fill="none"')
    expect(source).toContain('stroke="currentColor"')
    expect(source).toContain('stroke-linecap="round"')
    expect(source).toContain('stroke-linejoin="round"')
    expect(source).toContain('size: 18')
    expect(source).toContain(':width="size"')
    expect(source).toContain(':height="size"')
  })

  it('uses a single diagonal segment for the arrow-up-right icon', () => {
    const source = component()

    expect(source).toContain('<path d="M5 19 19 5M14 5h5v5" />')
  })
})
