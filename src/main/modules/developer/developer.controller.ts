import { Injectable } from '@nestjs/common'

import { DeveloperService } from '@main/modules/developer/developer.service'
import { IPCHandle } from '@main/modules/electron/decorators/ipc-handle.decorator'

@Injectable()
export class DeveloperController {
  constructor(private readonly developerService: DeveloperService) {}

  @IPCHandle()
  public ping() {
    console.log('pong')
    return 'pong'
  }

  @IPCHandle()
  public getStorePath() {
    return this.developerService.getStorePath()
  }

  @IPCHandle()
  public getLogs() {
    return this.developerService.getLogs()
  }

  @IPCHandle()
  public clearLogs() {
    return this.developerService.clearLogs()
  }
}
