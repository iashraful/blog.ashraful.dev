import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { existsSync, promises as fs } from 'node:fs'
import { join } from 'node:path'
import {
  clearDevtoFsCache,
  readDevtoFsCache,
  withDevtoFsCache,
} from '../../server/utils/devtoCache'

const TEST_CACHE_DIR = join(process.cwd(), '.cache', 'test-devto')

describe('devto filesystem cache', () => {
  beforeEach(async () => {
    await clearDevtoFsCache(TEST_CACHE_DIR)
  })

  afterEach(async () => {
    await clearDevtoFsCache(TEST_CACHE_DIR)
  })

  it('calls fetcher and writes result to disk on cache miss', async () => {
    const fetcher = vi.fn().mockResolvedValue({ id: 1, title: 'Test Article' })

    const result = await withDevtoFsCache('test_key', fetcher, {
      cacheDir: TEST_CACHE_DIR,
      ttlMs: 60000,
    })

    expect(result).toEqual({ id: 1, title: 'Test Article' })
    expect(fetcher).toHaveBeenCalledTimes(1)

    // Verify cache file was written
    const cached = await readDevtoFsCache('test_key', TEST_CACHE_DIR)
    expect(cached).not.toBeNull()
    expect(cached?.data).toEqual({ id: 1, title: 'Test Article' })
  })

  it('returns cached data without calling fetcher on cache hit within TTL', async () => {
    const fetcher = vi.fn().mockResolvedValue({ id: 1, title: 'Test Article' })

    // First call primes the cache
    await withDevtoFsCache('test_key', fetcher, {
      cacheDir: TEST_CACHE_DIR,
      ttlMs: 60000,
    })
    expect(fetcher).toHaveBeenCalledTimes(1)

    // Second call should hit the cache
    const secondFetcher = vi.fn().mockResolvedValue({ id: 2, title: 'Different Article' })
    const cachedResult = await withDevtoFsCache('test_key', secondFetcher, {
      cacheDir: TEST_CACHE_DIR,
      ttlMs: 60000,
    })

    expect(cachedResult).toEqual({ id: 1, title: 'Test Article' })
    expect(secondFetcher).not.toHaveBeenCalled()
  })

  it('refetches and updates cache when cache is expired', async () => {
    const fetcher1 = vi.fn().mockResolvedValue({ id: 1, version: 'old' })
    await withDevtoFsCache('test_key', fetcher1, {
      cacheDir: TEST_CACHE_DIR,
      ttlMs: 50,
    })

    // Wait for TTL to expire
    await new Promise((resolve) => setTimeout(resolve, 60))

    const fetcher2 = vi.fn().mockResolvedValue({ id: 2, version: 'new' })
    const result = await withDevtoFsCache('test_key', fetcher2, {
      cacheDir: TEST_CACHE_DIR,
      ttlMs: 50,
    })

    expect(result).toEqual({ id: 2, version: 'new' })
    expect(fetcher2).toHaveBeenCalledTimes(1)
  })

  it('falls back to stale cache if fetcher fails with 429 Too Many Requests', async () => {
    const fetcher1 = vi.fn().mockResolvedValue({ id: 1, title: 'Original Article' })
    await withDevtoFsCache('test_429_key', fetcher1, {
      cacheDir: TEST_CACHE_DIR,
      ttlMs: 10,
    })

    // Wait for TTL to expire
    await new Promise((resolve) => setTimeout(resolve, 20))

    // Second call fails with 429 error
    const rateLimitError = Object.assign(new Error('Too Many Requests'), {
      statusCode: 429,
    })
    const failingFetcher = vi.fn().mockRejectedValue(rateLimitError)

    const result = await withDevtoFsCache('test_429_key', failingFetcher, {
      cacheDir: TEST_CACHE_DIR,
      ttlMs: 10,
    })

    // Should return stale cached data instead of throwing
    expect(result).toEqual({ id: 1, title: 'Original Article' })
    expect(failingFetcher).toHaveBeenCalledTimes(1)
  })

  it('does not fall back to stale cache if fetcher fails with 404 Not Found', async () => {
    const fetcher1 = vi.fn().mockResolvedValue({ id: 1, title: 'Original Article' })
    await withDevtoFsCache('test_404_key', fetcher1, {
      cacheDir: TEST_CACHE_DIR,
      ttlMs: 10,
    })

    await new Promise((resolve) => setTimeout(resolve, 20))

    const notFoundError = Object.assign(new Error('Article not found'), {
      statusCode: 404,
    })
    const failingFetcher = vi.fn().mockRejectedValue(notFoundError)

    await expect(
      withDevtoFsCache('test_404_key', failingFetcher, {
        cacheDir: TEST_CACHE_DIR,
        ttlMs: 10,
      }),
    ).rejects.toMatchObject({ statusCode: 404 })
  })

  it('throws error if fetcher fails and no cache exists', async () => {
    const rateLimitError = Object.assign(new Error('Too Many Requests'), {
      statusCode: 429,
    })
    const failingFetcher = vi.fn().mockRejectedValue(rateLimitError)

    await expect(
      withDevtoFsCache('non_existent_key', failingFetcher, {
        cacheDir: TEST_CACHE_DIR,
        ttlMs: 60000,
      }),
    ).rejects.toMatchObject({ statusCode: 429 })
  })

  it('sanitizes cache key to create safe filenames', async () => {
    const fetcher = vi.fn().mockResolvedValue('safe')

    await withDevtoFsCache('article/user:123?tag=vue&page=1', fetcher, {
      cacheDir: TEST_CACHE_DIR,
      ttlMs: 60000,
    })

    // Should not throw and should write file
    const cached = await readDevtoFsCache('article/user:123?tag=vue&page=1', TEST_CACHE_DIR)
    expect(cached?.data).toBe('safe')
  })

  it('treats ttlMs: Infinity as never expiring', async () => {
    const fetcher1 = vi.fn().mockResolvedValue({ id: 1, title: 'Forever Article' })
    await withDevtoFsCache('forever_key', fetcher1, {
      cacheDir: TEST_CACHE_DIR,
      ttlMs: Infinity,
    })

    // Manually write an entry with an old timestamp (1 year ago)
    const { getCacheFilePath } = await import('../../server/utils/devtoCache')
    const filePath = getCacheFilePath('forever_key', TEST_CACHE_DIR)
    const oldEntry = {
      timestamp: Date.now() - 1000 * 60 * 60 * 24 * 365,
      data: { id: 1, title: 'Forever Article' },
    }
    await fs.writeFile(filePath, JSON.stringify(oldEntry), 'utf-8')

    // Second call with ttlMs: Infinity should still hit cache even with old timestamp
    const fetcher2 = vi.fn().mockResolvedValue({ id: 2, title: 'Newer Article' })
    const result = await withDevtoFsCache('forever_key', fetcher2, {
      cacheDir: TEST_CACHE_DIR,
      ttlMs: Infinity,
    })

    expect(result).toEqual({ id: 1, title: 'Forever Article' })
    expect(fetcher2).not.toHaveBeenCalled()
  })

  it('bypasses cache when DEVTO_CACHE is set to false', async () => {
    process.env.DEVTO_CACHE = 'false'
    const fetcher = vi.fn().mockResolvedValue({ id: 99 })

    const result = await withDevtoFsCache('bypass_key', fetcher, {
      cacheDir: TEST_CACHE_DIR,
    })
    expect(result).toEqual({ id: 99 })

    // Check that nothing was written to disk
    const cached = await readDevtoFsCache('bypass_key', TEST_CACHE_DIR)
    expect(cached).toBeNull()

    delete process.env.DEVTO_CACHE
  })
})
