import { CacheContentRepository, CacheDetailsRepository } from './repositories'
import { CreateCache } from './use-cases/create'
import { RevalidateCache } from './use-cases/revalidate'
import { StaleWhileRevalidateCache } from './use-cases/staleWhileRevalidate'

export interface Config {
  cacheDetailsRepository: CacheDetailsRepository
  cacheContentRepository: CacheContentRepository
}

export function createStaleWhileRevalidateCache(config: Config): StaleWhileRevalidateCache {
  const createCache = new CreateCache({
    cacheDetailsRepository: config.cacheDetailsRepository,
    cacheContentRepository: config.cacheContentRepository
  })

  const revalidateCache = new RevalidateCache({
    cacheDetailsRepository: config.cacheDetailsRepository,
    createCache
  })

  return new StaleWhileRevalidateCache({
    ...config,
    createCache,
    revalidateCache
  })
}

export * from './domain'
export * from './repositories'
export * from './infra'

export { StaleWhileRevalidateCache }
