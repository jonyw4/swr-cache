export interface CacheDetails {
  key: string
  hash: string
  createdAt: Date
  maxAge: Date
  status: 'valid' | 'revalidating'
  // TODO: Create logic for both
  isStale: boolean
  isExpired: boolean
}
