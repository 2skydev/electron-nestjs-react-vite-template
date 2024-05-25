import { Injectable } from '@nestjs/common'

import { ConfigService } from '@main/modules/config/config.service'
import type { ConfigStoreValues } from '@main/modules/config/config.store'
import { IPCHandle } from '@main/modules/electron/decorators/ipc-handle.decorator'

@Injectable()
export class ConfigController {
  constructor(private readonly configService: ConfigService) {}

  @IPCHandle()
  public getConfig() {
    return this.configService.getAll()
  }

  @IPCHandle()
  public setConfig(config: ConfigStoreValues) {
    return this.configService.setAll(config)
  }
}
