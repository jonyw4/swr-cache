import { CacheDetails } from './CacheDetails';
import { CacheItem } from './CacheItem';
import { CacheDetailsRepository, CacheItemRepository } from './repositories'

export class InMemoryCacheDetailsRepository implements CacheDetailsRepository {
  private list = {}
  async getByKey(key: string): Promise<CacheDetails> {
    return this.list[key]
  }
  async save(cacheDetails: CacheDetails): Promise<void> {
    this.list[cacheDetails.key] = cacheDetails
  }
  
}

export class InMemoryCacheItemRepository implements CacheItemRepository {
  private list = {}
  async getByKey(key: string): Promise<string> {
    return this.list[key]
  }
  async save(cacheItem: CacheItem): Promise<void> {
    this.list[cacheItem.details.key] = cacheItem
  }
}
