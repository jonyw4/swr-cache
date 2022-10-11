export type CacheUpdatingStatus = 'parked' | 'revalidating'

export interface CacheDetailsProps {
  key: string
  createdAt: Date
  minTimeToStale: number
  updatingStatus: CacheUpdatingStatus
}

export class CacheDetails {
  constructor(private props: CacheDetailsProps) {}

  needsRevalidation(): boolean {
    return this.isStale() && this.updatingStatus === 'parked'
  }

  isStale(): boolean {
    const nowTime = Date.now()
    const createdAtTime = this.props.createdAt.getTime()
    const cachedAge = nowTime - createdAtTime

    return cachedAge >= this.minTimeToStale
  }

  get key(): string{
    return this.props.key
  }

  get createdAt(): Date {
    return this.props.createdAt
  }

  get minTimeToStale(): number {
    return this.props.minTimeToStale
  }
  
  get updatingStatus(): CacheUpdatingStatus {
    return this.props.updatingStatus
  }
}

export interface CacheItem {
  details: CacheDetails
  content: string
}
