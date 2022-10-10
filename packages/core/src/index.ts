import { CacheDetails } from "./CacheDetails"
import { CacheItem } from "./CacheItem"
import { CacheDetailsRepository, CacheItemRepository } from './repositories'


interface Config {
  cacheDetailsRepository: CacheDetailsRepository
  cacheItemRepository: CacheItemRepository
}

interface HandleConfig {
  key: string
  minTimeToStale: number
  maxAge: 10
  callback: Function
}


export class StaleWhileRevalidateCache {
  constructor(private config: Config){}
  async handle({callback, key}: HandleConfig): Promise<CacheItem> {
    
    const data = await callback()

    const cacheDetails: CacheDetails = {
      key: key,
      hash: '123',
      createdAt: new Date(),
      maxAge: new Date(),
      status: 'valid',
      isStale: true,
      isExpired: true
    }

    const cacheItem: CacheItem = { details: cacheDetails, value: data }

    await this.config.cacheDetailsRepository.save(cacheDetails)
    await this.config.cacheItemRepository.save(cacheItem)

    return cacheItem
  }
}

export {
  CacheDetailsRepository,
  CacheItemRepository
}
export * from './infra'
