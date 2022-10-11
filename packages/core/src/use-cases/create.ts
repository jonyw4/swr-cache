import { CacheDetails, CacheItem } from "../domain"
import { CacheDetailsRepository, CacheContentRepository } from "../repositories"

export interface Deps {
  cacheDetailsRepository: CacheDetailsRepository
  cacheContentRepository: CacheContentRepository
}

interface Input {
  callback: Function
  minTimeToStale: number
  key: string
}

export class CreateCache {
  constructor(private deps: Deps) {}

  async handle({ callback, key, minTimeToStale }: Input){
    const cacheContent = await callback()

    const cacheDetails = new CacheDetails({
      key,
      createdAt: new Date(),
      updatingStatus: 'revalidating',
      minTimeToStale
    })

    const cacheItem: CacheItem = { details: cacheDetails, content: cacheContent }

    await this.deps.cacheDetailsRepository.save(cacheDetails)
    await this.deps.cacheContentRepository.saveByKey(
      cacheDetails.key, 
      cacheContent
    )

    return cacheItem
  }
}
