import { describe, expect, it } from 'vitest'
import { filterArticles } from '../../utils/articleSearch'

const articles = [
  {
    id: 1,
    title: 'Building with Nuxt',
    slug: 'building-with-nuxt',
    description: 'A guide to server-side rendering.',
    tag_list: ['vue', 'javascript'],
    cover_image: null,
    social_image: null,
    published_at: '2026-01-01',
    reading_time_minutes: 4,
    path: '/building-with-nuxt',
    url: 'https://dev.to/example/building-with-nuxt',
  },
  {
    id: 2,
    title: 'Reliable deployment',
    slug: 'reliable-deployment',
    description: 'Notes on shipping safely.',
    tag_list: 'docker, devops',
    cover_image: null,
    social_image: null,
    published_at: '2026-01-02',
    reading_time_minutes: 5,
    path: '/reliable-deployment',
    url: 'https://dev.to/example/reliable-deployment',
  },
]

describe('filterArticles', () => {
  it.each([
    ['NUXT', [1]],
    ['server-side', [1]],
    ['vue', [1]],
    ['DOCKER', [2]],
  ])('matches %s across article title, description, and tags', (query, expectedIds) => {
    expect(filterArticles(articles, query).map((article) => article.id)).toEqual(expectedIds)
  })

  it('returns all articles for an empty query and none for an unmatched query', () => {
    expect(filterArticles(articles, '   ')).toEqual(articles)
    expect(filterArticles(articles, 'rust')).toEqual([])
  })
})
