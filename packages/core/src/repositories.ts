import { CacheDetails } from "./CacheDetails"
import { CacheItem } from "./CacheItem"

export interface CacheDetailsRepository {
  getByKey(key: string): Promise<CacheDetails>
  save(cacheDetails: CacheDetails): Promise<void>
}

// TODO: Change repository
export interface CacheItemRepository {
  getByKey(key: string): Promise<string>
  save(cacheItem: CacheItem): Promise<void>
}
