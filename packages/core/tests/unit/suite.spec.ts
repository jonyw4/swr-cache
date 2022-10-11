import { it, describe, expect, beforeEach, afterEach, vi } from 'vitest'
import { StaleWhileRevalidateCache, InMemoryCacheDetailsRepository, InMemoryCacheContentRepository, CacheDetailsRepository, CacheContentRepository, CacheDetails } from '../../src'

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
  describe('Giving an empty cache', () => {
    it('should return the content and cache it', async () => {
      const output = await swr.handle({
        key: 'test',
        minTimeToStale: 1,
        maxTimeToLive: 10,
        callback: () => new Date().toISOString()
      })

      expect(output.content).toBe('2022-01-01T03:00:00.000Z')

      const cacheDetails = await cacheDetailsRepository.getByKey('test') as CacheDetails
      const cacheContent = await cacheContentRepository.getByKey('test') as string

      expect(cacheDetails.key).toBe('test')
      expect(cacheContent).toBe('2022-01-01T03:00:00.000Z')
    })
  })

  describe('Giving an existing cache', () => {
    describe('when is not stale', () => {
      it('should return the cached content without revalidating', async () => {
        await cacheDetailsRepository.save(new CacheDetails({
          key: 'test',
          hash: '123',
          createdAt: new Date(2022, 0, 1),
          maxTimeToLive: 1000,
          status: 'valid',
        }))
        await cacheContentRepository.saveByKey('test', '2022-01-01T03:00:00.000Z')

        vi.setSystemTime(new Date(2022, 0, 1, 0 , 1, 0, 0))

        const output = await swr.handle({
          key: 'test',
          minTimeToStale: 1,
          maxTimeToLive: 10,
          callback: () => new Date().toISOString()
        })
  
        expect(output.content).toBe('2022-01-01T03:00:00.000Z')
  
        const cacheDetails = await cacheDetailsRepository.getByKey('test') as CacheDetails
        const cacheContent = await cacheContentRepository.getByKey('test') as string
  
        expect(cacheDetails.key).toBe('test')
        expect(cacheDetails.createdAt.toISOString()).toBe('2022-01-01T03:00:00.000Z')
        expect(cacheContent).toBe('2022-01-01T03:00:00.000Z')
      })
    })
  })
});
