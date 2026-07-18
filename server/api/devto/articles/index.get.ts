import { getDevtoArticles } from '../../../utils/devto'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  return await getDevtoArticles(config.devToApiKey, getQuery(event).page)
})
