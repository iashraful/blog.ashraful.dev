import { getRouterParam } from 'h3'
import { getDevtoArticle } from '../../../utils/devto'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  return await getDevtoArticle(
    config.public.devToUsername,
    getRouterParam(event, 'slug'),
  )
})
