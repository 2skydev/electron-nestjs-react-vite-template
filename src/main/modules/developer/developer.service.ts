import { Injectable } from '@nestjs/common'
import log from 'electron-log'

import type { ConfigService } from '@main/modules/config/config.service'
import type { Log } from '@main/modules/developer/types/log.type'

@Injectable()
export class DeveloperService {
  constructor(private readonly configService: ConfigService) {}

  public getStorePath() {
    return this.configService.storeFilePath
  }

  public getLogs(): Log[] {
    const logs = log.transports.file.readAllLogs()

    return logs.map(item => ({
      size: log.transports.file.getFile().size,
      path: item.path,
      lines: item.lines.filter(Boolean),
    }))
  }

  public clearLogs() {
    return log.transports.file.getFile().clear()
  }
}
