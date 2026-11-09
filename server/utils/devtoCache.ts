import { existsSync, promises as fs } from 'node:fs'
import { join } from 'node:path'
import { createHash } from 'node:crypto'

export interface DevtoCacheEntry<T> {
  timestamp: number
  data: T
}

export interface DevtoCacheOptions {
  cacheDir?: string
  ttlMs?: number
  forceRefresh?: boolean
}

const DEFAULT_CACHE_DIR = join(process.cwd(), '.cache', 'devto')
const DEFAULT_TTL_MS = 60 * 60 * 1000 // 1 hour

function getCacheDir(customDir?: string): string {
  if (customDir) return customDir
  if (process.env.DEVTO_CACHE_DIR) return process.env.DEVTO_CACHE_DIR
  return DEFAULT_CACHE_DIR
}

function getDefaultTtlMs(): number {
  if (process.env.DEV_TO_CACHE_TTL) {
    const parsed = Number(process.env.DEV_TO_CACHE_TTL)
    if (!Number.isNaN(parsed) && parsed > 0) {
      return parsed * 1000
    }
  }
  return DEFAULT_TTL_MS
}

export function getCacheFilePath(key: string, cacheDir: string): string {
  const safePrefix = key.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 40)
  const hash = createHash('md5').update(key).digest('hex').slice(0, 10)
  const fileName = `${safePrefix}_${hash}.json`
  return join(cacheDir, fileName)
}

export async function readDevtoFsCache<T>(
  key: string,
  customDir?: string,
): Promise<DevtoCacheEntry<T> | null> {
  const cacheDir = getCacheDir(customDir)
  const filePath = getCacheFilePath(key, cacheDir)

  try {
    if (!existsSync(filePath)) return null
    const content = await fs.readFile(filePath, 'utf-8')
    const parsed = JSON.parse(content) as DevtoCacheEntry<T>
    if (typeof parsed?.timestamp === 'number' && 'data' in parsed) {
      return parsed
    }
    return null
  }
  catch {
    return null
  }
}

export async function writeDevtoFsCache<T>(
  key: string,
  data: T,
  customDir?: string,
): Promise<void> {
  const cacheDir = getCacheDir(customDir)
  const filePath = getCacheFilePath(key, cacheDir)

  try {
    await fs.mkdir(cacheDir, { recursive: true })
    const entry: DevtoCacheEntry<T> = {
      timestamp: Date.now(),
      data,
    }
    const tempPath = `${filePath}.${Date.now()}.${Math.random().toString(36).slice(2, 8)}.tmp`
    await fs.writeFile(tempPath, JSON.stringify(entry), 'utf-8')
    await fs.rename(tempPath, filePath)
  }
  catch (error) {
    console.warn(`[devto-cache] Failed to write cache for key "${key}":`, error)
  }
}

export async function clearDevtoFsCache(customDir?: string): Promise<void> {
  const cacheDir = getCacheDir(customDir)
  try {
    if (existsSync(cacheDir)) {
      await fs.rm(cacheDir, { recursive: true, force: true })
    }
  }
  catch (error) {
    console.warn('[devto-cache] Failed to clear cache directory:', error)
  }
}

function shouldFallbackToStale(error: unknown): boolean {
  if (typeof error !== 'object' || error === null) return true

  const status = (error as { statusCode?: unknown })?.statusCode
    ?? (error as { response?: { status?: unknown } })?.response?.status

  if (typeof status === 'number') {
    // Client errors like 400 Bad Request, 404 Not Found, 401/403 should not be masked by stale data
    if (status >= 400 && status < 500 && status !== 429) {
      return false
    }
  }

  // 429 Too Many Requests, 5xx server errors, network errors should fall back to stale cache
  return true
}

export async function withDevtoFsCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: DevtoCacheOptions,
): Promise<T> {
  if (process.env.DEVTO_CACHE === 'false') {
    return await fetcher()
  }

  const cacheDir = getCacheDir(options?.cacheDir)
  const ttlMs = options?.ttlMs ?? getDefaultTtlMs()
  const forceRefresh = options?.forceRefresh ?? false

  const existingCache = await readDevtoFsCache<T>(key, cacheDir)

  // If cache is fresh and forceRefresh is false, return from cache immediately
  if (!forceRefresh && existingCache) {
    const isFresh = Date.now() - existingCache.timestamp < ttlMs
    if (isFresh) {
      return existingCache.data
    }
  }

  // Cache is missing or expired, attempt upstream fetch
  try {
    const freshData = await fetcher()
    await writeDevtoFsCache(key, freshData, cacheDir)
    return freshData
  }
  catch (error) {
    // If upstream fails (e.g. 429 Too Many Requests, server error, network issue) and we have any stale cache
    if (existingCache && shouldFallbackToStale(error)) {
      const status = (error as { statusCode?: number, response?: { status?: number } })?.statusCode
        || (error as { response?: { status?: number } })?.response?.status
      console.warn(
        `[devto-cache] Upstream DEV fetch failed for "${key}" (status: ${status || 'unknown'}). Serving stale cache from disk.`,
      )
      return existingCache.data
    }

    // No cache to fall back to or error shouldn't be masked; rethrow the error
    throw error
  }
}
