import { getDevtoArticlesByTag } from '../../../utils/devto'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  return await getDevtoArticlesByTag(
    config.public.devToUsername,
    getRouterParam(event, 'tag'),
    getQuery(event).page,
  )
})
