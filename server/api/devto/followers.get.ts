import { getDevtoFollowers } from '../../utils/devto'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  return await getDevtoFollowers(config.devToApiKey)
})
