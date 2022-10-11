import { CacheDetails } from "./CacheDetails"

export interface CacheDetailsRepository {
  getByKey(key: string): Promise<CacheDetails | void>
  save(cacheDetails: CacheDetails): Promise<void>
}

export interface CacheContentRepository {
  getByKey(key: string): Promise<string | void>
  saveByKey(key: string, content: string): Promise<void>
}
