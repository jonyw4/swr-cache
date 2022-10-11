import { CacheItem } from "../domain"
import { CacheDetailsRepository, CacheContentRepository } from '../repositories'
import { CreateCache } from './create'
import { RevalidateCache } from './revalidate'

interface HandleConfig {
  key: string
  minTimeToStale: number
  callback: Function
}

export interface Deps {
  createCache: CreateCache
  revalidateCache: RevalidateCache
  cacheDetailsRepository: CacheDetailsRepository
  cacheContentRepository: CacheContentRepository
}

export class StaleWhileRevalidateCache {
  constructor(private deps: Deps){}
  async handle(handleConfig: HandleConfig): Promise<CacheItem> {
    const { key, callback } = handleConfig
    const cacheDetails = await this.deps.cacheDetailsRepository.getByKey(key)

    if(cacheDetails){
      const content = await this.deps.cacheContentRepository.getByKey(key) as string

      if(cacheDetails.needsRevalidation()){
        this.deps.revalidateCache.handle({ cacheDetails, callback })
      }

      return { details: cacheDetails, content }
    }
    
    return this.deps.createCache.handle(handleConfig)
  }
}
