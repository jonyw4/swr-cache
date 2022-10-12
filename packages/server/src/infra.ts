import { CacheContentRepository } from '@swr-cache/core'
import fs from 'node:fs'
import path from 'node:path'

interface Config {
  folder: string
}

export class FsCacheContentRepository implements CacheContentRepository {
  constructor(private config: Config){}
  async getByKey(key: string): Promise<string | void> {
    try {
      const file = await fs.promises.readFile(this.getFilePathByKey(key))
      return file.toString()
    } catch (error) {
      return
    }
  }
  async saveByKey(key: string, content: string): Promise<void> {
    await fs.promises.writeFile(
      this.getFilePathByKey(key),
      content
    )
  }
  private getFilePathByKey(key: string): string {
    const fileName = `${key}.cache`
    return path.resolve(this.config.folder, fileName)
  }
}
