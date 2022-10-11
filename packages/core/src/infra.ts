import { CacheDetails } from './domain';
import { CacheDetailsRepository, CacheContentRepository } from './repositories'

export class InMemoryCacheDetailsRepository implements CacheDetailsRepository {
  private list = {}
  async getByKey(key: string): Promise<CacheDetails> {
    return this.list[key]
  }
  async save(cacheDetails: CacheDetails): Promise<void> {
    this.list[cacheDetails.key] = cacheDetails
  }
  
}

export class InMemoryCacheContentRepository implements CacheContentRepository {
  private list = {}
  async getByKey(key: string): Promise<string> {
    return this.list[key]
  }
  async saveByKey(key: string, content: string): Promise<void> {
    this.list[key] = content
  }
}
