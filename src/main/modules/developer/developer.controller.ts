import { Injectable } from '@nestjs/common'

import { DeveloperService } from '@main/modules/developer/developer.service'
import { IPCHandler } from '@main/modules/electron/decorators/ipc-handler.decorator'

@Injectable()
export class DeveloperController {
  constructor(private readonly developerService: DeveloperService) {}

  /**
   * 테스트 용도로 사용합니다.
   */
  @IPCHandler()
  public ping() {
    console.log('pong')
    return 'pong'
  }

  /**
   * 저장소 경로를 가져옵니다.
   */
  @IPCHandler()
  public getStorePath() {
    return this.developerService.getStorePath()
  }

  /**
   * 로그를 가져옵니다.
   */
  @IPCHandler()
  public getLogs() {
    return this.developerService.getLogs()
  }

  /**
   * 로그 지우기
   */
  @IPCHandler()
  public clearLogs() {
    return this.developerService.clearLogs()
  }
}
