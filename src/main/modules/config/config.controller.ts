import { Injectable } from '@nestjs/common'

import type { ConfigService } from '@main/modules/config/config.service'
import type { ConfigStoreValues } from '@main/modules/config/config.store'
import { IPCHandler } from '@main/modules/electron/decorators/ipc-handler.decorator'

@Injectable()
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  /**
   * 설정 값을 가져옵니다.
   */
  @IPCHandler()
  public getConfig() {
    return this.configService.getAll()
  }

  /**
   * 설정 값을 저장합니다.
   */
  @IPCHandler()
  public setConfig(config: ConfigStoreValues) {
    return this.configService.setAll(config)
  }
}
