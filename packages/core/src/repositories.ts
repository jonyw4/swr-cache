import { CacheDetails } from "./CacheDetails"

export interface CacheDetailsRepository {
  getByKey(key: string): Promise<CacheDetails>
  save(cacheDetails: CacheDetails): Promise<void>
}

export interface CacheContentRepository {
  getByKey(key: string): Promise<string>
  saveByKey(key: string, content: string): Promise<void>
}
