import { it, describe, expect, beforeEach, afterEach, vi } from 'vitest'
import { StaleWhileRevalidateCache, InMemoryCacheDetailsRepository, InMemoryCacheContentRepository, CacheDetailsRepository, CacheContentRepository } from '../../src'

describe('SUT', () => {
  let swr: StaleWhileRevalidateCache
  let cacheDetailsRepository: CacheDetailsRepository
  let cacheContentRepository: CacheContentRepository

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2022, 0, 1))
    cacheDetailsRepository = new InMemoryCacheDetailsRepository()
    cacheContentRepository = new InMemoryCacheContentRepository()
    swr = new StaleWhileRevalidateCache({
      cacheDetailsRepository,
      cacheContentRepository
    })
  })
  afterEach(() => {
    vi.useRealTimers()
  })
  describe('Empty Cache', () => {
    it('should return the content and cache it', async () => {
      const output = await swr.handle({
        key: 'test',
        minTimeToStale: 1,
        maxAge: 10,
        callback: () => new Date().toISOString()
      })

      expect(output.content).toBe('2022-01-01T03:00:00.000Z')

      const cacheDetails = await cacheDetailsRepository.getByKey('test')
      const cacheContent = await cacheContentRepository.getByKey('test')

      expect(cacheDetails.key).toBe('test')
      expect(cacheContent).toBe('2022-01-01T03:00:00.000Z')
    })
  })
});
