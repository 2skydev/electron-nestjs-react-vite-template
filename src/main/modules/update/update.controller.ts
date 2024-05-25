import { Injectable } from '@nestjs/common'

import { IPCHandle } from '@main/modules/electron/decorators/ipc-handle.decorator'
import { IPCSender } from '@main/modules/electron/decorators/ipc-sender.decorator'
import { ELECTRON_MAIN_WINDOW_KEY } from '@main/modules/electron/electron.constants'
import type { UpdateStatus } from '@main/modules/update/types/update-status.type'
import { UPDATE_LOADING_WINDOW_KEY } from '@main/modules/update/update.constants'
import { UpdateService } from '@main/modules/update/update.service'

@Injectable()
export class UpdateController {
  constructor(private readonly updateService: UpdateService) {}

  @IPCHandle()
  public getUpdateStatus() {
    return this.updateService.status
  }

  @IPCHandle()
  public async checkForUpdate() {
    return this.updateService.checkForUpdates()
  }

  @IPCHandle({ type: 'on' })
  public quitAndInstall() {
    this.updateService.quitAndInstall()
  }

  @IPCSender({
    windowKeys: [ELECTRON_MAIN_WINDOW_KEY, UPDATE_LOADING_WINDOW_KEY],
  })
  public onChangeUpdateStatus(value: UpdateStatus) {
    return value
  }
}
