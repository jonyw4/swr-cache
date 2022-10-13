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

    if(!cacheDetails){
      await this.deps.createCache.handle(handleConfig)

      return this.handle(handleConfig)
    }

    if(cacheDetails.needsRevalidation()){
      this.deps.revalidateCache.handle({ cacheDetails, callback })
    }

    return { details: cacheDetails, getContent: () => this.deps.cacheContentRepository.getByKey(key) }
  }
}
