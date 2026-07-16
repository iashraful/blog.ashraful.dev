import { getRouterParam } from 'h3'
import { getDevtoArticle } from '../../../utils/devto'

export default defineEventHandler(async (event) => {
  return await getDevtoArticle(getRouterParam(event, 'id'))
})
