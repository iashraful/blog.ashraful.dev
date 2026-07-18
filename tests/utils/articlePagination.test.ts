import { describe, expect, it } from 'vitest'
import { appendArticlePage, hasNextPage } from '../../composables/useArticlePagination'

const first = { id: 1 } as any
const second = { id: 2 } as any
const duplicate = { id: 1 } as any

describe('article pagination state', () => {
  it('appends only articles with IDs not already displayed', () => {
    expect(appendArticlePage([first], [duplicate, second])).toEqual([first, second])
  })

  it('uses the received page size to determine whether another page exists', () => {
    expect(hasNextPage(new Array(12).fill(first), 12)).toBe(true)
    expect(hasNextPage(new Array(11).fill(first), 12)).toBe(false)
  })
})
