import type { DevtoArticleSummary } from '~/shared/types/devto'

export const ARTICLES_PER_PAGE = 12

export function appendArticlePage(
  current: DevtoArticleSummary[],
  incoming: DevtoArticleSummary[],
): DevtoArticleSummary[] {
  const displayedIds = new Set(current.map((article) => article.id))
  return [...current, ...incoming.filter((article) => !displayedIds.has(article.id))]
}

export function hasNextPage(
  incoming: DevtoArticleSummary[],
  perPage = ARTICLES_PER_PAGE,
): boolean {
  return incoming.length === perPage
}
