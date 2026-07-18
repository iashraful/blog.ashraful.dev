import type { DevtoArticleSummary } from '../shared/types/devto'

function normalizeTags(tags: string | string[]): string[] {
  if (Array.isArray(tags)) return tags
  return tags.split(',').map((tag) => tag.trim()).filter(Boolean)
}

export function filterArticles(
  articles: DevtoArticleSummary[],
  query: string,
): DevtoArticleSummary[] {
  const term = query.trim().toLocaleLowerCase()
  if (!term) return articles

  return articles.filter((article) => [
    article.title,
    article.description,
    ...normalizeTags(article.tag_list),
  ].some((value) => value.toLocaleLowerCase().includes(term)))
}
