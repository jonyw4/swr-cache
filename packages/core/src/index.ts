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
  callback: Function
}


export class StaleWhileRevalidateCache {
  constructor(private config: Config){}
  async handle(handleConfig: HandleConfig): Promise<CacheItem> {
    const { key, callback } = handleConfig
    const cacheDetails = await this.config.cacheDetailsRepository.getByKey(key)

    if(cacheDetails){
      const content = await this.config.cacheContentRepository.getByKey(key) as string

      if(cacheDetails.isStale()){
        this.revalidate(cacheDetails, callback)
      }

      return { details: cacheDetails, content }
    }
    
    return this.createCache(handleConfig)
  }
  private async revalidate(cacheDetails: CacheDetails, callback: Function): Promise<void> {
    const newCacheDetails = new CacheDetails({
      key: cacheDetails.key,
      hash: cacheDetails.hash,
      createdAt: cacheDetails.createdAt,
      minTimeToStale: cacheDetails.minTimeToStale,
      updatingStatus: 'revalidating'
    })

    await this.config.cacheDetailsRepository.save(cacheDetails)
    await this.createCache({
      callback, 
      key: newCacheDetails.key, 
      minTimeToStale: newCacheDetails.minTimeToStale
    })
  }
  private async createCache({callback, key, minTimeToStale}: HandleConfig): Promise<CacheItem>  {
    const cacheContent = await callback()

    const cacheDetails = new CacheDetails({
      key,
      hash: '123',
      createdAt: new Date(),
      updatingStatus: 'revalidating',
      minTimeToStale
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
