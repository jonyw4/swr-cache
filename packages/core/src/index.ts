import { CacheDetails } from "./CacheDetails"
import { CacheItem } from "./CacheItem"
import { CacheDetailsRepository, CacheContentRepository } from './repositories'


interface Config {
  cacheDetailsRepository: CacheDetailsRepository
  cacheContentRepository: CacheContentRepository
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
    
    const cacheContent = await callback()

    const cacheDetails: CacheDetails = {
      key: key,
      hash: '123',
      createdAt: new Date(),
      maxAge: new Date(),
      status: 'valid',
      isStale: true,
      isExpired: true
    }

    const cacheItem: CacheItem = { details: cacheDetails, content: cacheContent }

    await this.config.cacheDetailsRepository.save(cacheDetails)
    await this.config.cacheContentRepository.saveByKey(
      cacheDetails.key, 
      cacheContent
    )

    return cacheItem
  }
}

export {
  CacheDetailsRepository,
  CacheContentRepository
}
export * from './infra'
