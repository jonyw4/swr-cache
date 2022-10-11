import { CacheDetails } from "../domain"
import { CacheDetailsRepository } from "../repositories"
import { CreateCache } from './create'

export interface Deps {
  createCache: CreateCache
  cacheDetailsRepository: CacheDetailsRepository
}

export interface Input {
  cacheDetails: CacheDetails
  callback: Function
}

export class RevalidateCache {
  constructor(private deps: Deps){}
  async handle({ cacheDetails, callback }: Input): Promise<void> {
    const newCacheDetails = new CacheDetails({
      key: cacheDetails.key,
      createdAt: cacheDetails.createdAt,
      minTimeToStale: cacheDetails.minTimeToStale,
      updatingStatus: 'revalidating'
    })

    await this.deps.cacheDetailsRepository.save(cacheDetails)
    await this.deps.createCache.handle({
      callback, 
      key: newCacheDetails.key, 
      minTimeToStale: newCacheDetails.minTimeToStale 
    })
  }
}
