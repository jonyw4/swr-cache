type CacheStatus = 'valid' | 'revalidating'

export interface CacheDetailsProps {
  key: string
  hash: string
  createdAt: Date
  maxTimeToLive: number
  status: CacheStatus
}

export class CacheDetails {
  constructor(private props: CacheDetailsProps){}
  isStale(): boolean {
    return false
  }
  get key(): string{
    return this.props.key
  }
  get hash(): string{
    return this.props.hash
  }
  get createdAt(): Date {
    return this.props.createdAt
  }
  get maxTimeToLive(): number {
    return this.props.maxTimeToLive
  }
  get status(): CacheStatus {
    return this.props.status
  }
}
