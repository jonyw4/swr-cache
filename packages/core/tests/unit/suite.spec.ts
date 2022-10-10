import { it, describe, expect, beforeEach, afterEach, vi } from 'vitest'
import { StaleWhileRevalidateCache, InMemoryCacheDetailsRepository, InMemoryCacheItemRepository, CacheDetailsRepository, CacheItemRepository } from '../../src'

describe('Empty Cache', () => {
  let swr: StaleWhileRevalidateCache
  let cacheDetailsRepository: CacheDetailsRepository
  let cacheItemRepository: CacheItemRepository

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2022, 0, 1))
    cacheDetailsRepository = new InMemoryCacheDetailsRepository()
    cacheItemRepository = new InMemoryCacheItemRepository()
    swr = new StaleWhileRevalidateCache({
      cacheDetailsRepository,
      cacheItemRepository
    })
  })
  afterEach(() => {
    vi.useRealTimers()
  })
  it('should return the content and cache it', async () => {
    const output = await swr.handle({
      key: 'test',
      minTimeToStale: 1,
      maxAge: 10,
      callback: () => new Date().toISOString()
    })

    expect(output.value).toBe('2022-01-01T03:00:00.000Z')

    const cacheDetails = await cacheDetailsRepository.getByKey('test')
    const cacheItem = await cacheItemRepository.getByKey('test')

    expect(cacheDetails.key).toBe('test')
  })
});
