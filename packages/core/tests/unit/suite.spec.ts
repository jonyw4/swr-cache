import { it, describe, expect, beforeEach, afterEach, vi } from 'vitest'
import { createStaleWhileRevalidateCache, StaleWhileRevalidateCache, InMemoryCacheDetailsRepository, InMemoryCacheContentRepository, CacheDetailsRepository, CacheContentRepository, CacheDetails } from '../../src'

const DATE_TEST_BASELINE = new Date(2022, 0, 1)

const callback = () => new Date().toISOString()

describe('SUT', () => {
  let swr: StaleWhileRevalidateCache
  let cacheDetailsRepository: CacheDetailsRepository
  let cacheContentRepository: CacheContentRepository

  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(DATE_TEST_BASELINE)
    cacheDetailsRepository = new InMemoryCacheDetailsRepository()
    cacheContentRepository = new InMemoryCacheContentRepository()
    
    swr = createStaleWhileRevalidateCache({
      cacheDetailsRepository,
      cacheContentRepository
    })
  })
  afterEach(() => {
    vi.useRealTimers()
  })
  describe('Giving an empty cache', () => {
    it('should return the content and cache it', async () => {
      const cache = await swr.handle({
        key: 'test',
        minTimeToStale: 1,
        callback
      })

      expect(await cache.getContent()).toBe('2022-01-01T03:00:00.000Z')

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
          createdAt: DATE_TEST_BASELINE,
          minTimeToStale: 2000,
          updatingStatus: 'parked',
        }))
        await cacheContentRepository.saveByKey('test', '2022-01-01T03:00:00.000Z')

        vi.setSystemTime(new Date(2022, 0, 1, 0 , 0, 1, 0))

        const cache = await swr.handle({
          key: 'test',
          minTimeToStale: 2000,
          callback
        })
  
        expect(await cache.getContent()).toBe('2022-01-01T03:00:00.000Z')
  
        const cacheDetails = await cacheDetailsRepository.getByKey('test') as CacheDetails
        const cacheContent = await cacheContentRepository.getByKey('test') as string
  
        expect(cacheDetails.key).toBe('test')
        expect(cacheDetails.createdAt.toISOString()).toBe('2022-01-01T03:00:00.000Z')
        expect(cacheContent).toBe('2022-01-01T03:00:00.000Z')
      })
    })
    describe('when is stale', () => {
      it('should return the content and revalidate', async () => {
        await cacheDetailsRepository.save(new CacheDetails({
          key: 'test',
          createdAt: DATE_TEST_BASELINE,
          minTimeToStale: 1000,
          updatingStatus: 'parked',
        }))
        await cacheContentRepository.saveByKey('test', '2022-01-01T03:00:00.000Z')

        vi.setSystemTime(new Date(2022, 0, 1, 0 , 0, 1, 0))

        const cache = await swr.handle({
          key: 'test',
          minTimeToStale: 1000,
          callback
        })
  
        expect(await cache.getContent()).toBe('2022-01-01T03:00:00.000Z')

        await new Promise(process.nextTick);
  
        const cacheDetails = await cacheDetailsRepository.getByKey('test') as CacheDetails
        const cacheContent = await cacheContentRepository.getByKey('test') as string

        expect(cacheDetails.key).toBe('test')
        expect(cacheDetails.createdAt.toISOString()).toBe('2022-01-01T03:00:01.000Z')
        expect(cacheContent).toBe('2022-01-01T03:00:01.000Z')
      })

      it('should return the content and not revalidate when is already updating in proccess', async () => {
        await cacheDetailsRepository.save(new CacheDetails({
          key: 'test',
          createdAt: DATE_TEST_BASELINE,
          minTimeToStale: 1000,
          updatingStatus: 'revalidating',
        }))
        await cacheContentRepository.saveByKey('test', '2022-01-01T03:00:00.000Z')

        vi.setSystemTime(new Date(2022, 0, 1, 0 , 0, 1, 0))

        const cache = await swr.handle({
          key: 'test',
          minTimeToStale: 1000,
          callback
        })
  
        expect(await cache.getContent()).toBe('2022-01-01T03:00:00.000Z')

        await new Promise(process.nextTick);
  
        const cacheDetails = await cacheDetailsRepository.getByKey('test') as CacheDetails
        const cacheContent = await cacheContentRepository.getByKey('test') as string

        expect(cacheDetails.key).toBe('test')
        expect(cacheDetails.createdAt.toISOString()).toBe('2022-01-01T03:00:00.000Z')
        expect(cacheContent).toBe('2022-01-01T03:00:00.000Z')
      })
    })
  })
});
