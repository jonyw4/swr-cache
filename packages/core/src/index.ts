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
  maxTimeToLive: 10
  callback: Function
}


export class StaleWhileRevalidateCache {
  constructor(private config: Config){}
  async handle({callback, key, maxTimeToLive}: HandleConfig): Promise<CacheItem> {
    const currentCacheDetails = await this.config.cacheDetailsRepository.getByKey(key)

    if(currentCacheDetails){
      const content = await this.config.cacheContentRepository.getByKey(key) as string
      return { details: currentCacheDetails, content }
    }
    
    const cacheContent = await callback()

    const cacheDetails = new CacheDetails({
      key: key,
      hash: '123',
      createdAt: new Date(),
      maxTimeToLive: maxTimeToLive,
      status: 'valid'
    })

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
  CacheDetails,
  CacheDetailsRepository,
  CacheContentRepository
}
export * from './infra'
