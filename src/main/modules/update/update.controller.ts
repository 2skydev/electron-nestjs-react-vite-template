import { Injectable } from '@nestjs/common'

import { IPCHandler } from '@main/modules/electron/decorators/ipc-handler.decorator'
import { IPCSender } from '@main/modules/electron/decorators/ipc-sender.decorator'
import { ELECTRON_MAIN_WINDOW_KEY } from '@main/modules/electron/electron.constants'
import type { UpdateStatus } from '@main/modules/update/types/update-status.type'
import { UPDATE_LOADING_WINDOW_KEY } from '@main/modules/update/update.constants'
import type { UpdateService } from '@main/modules/update/update.service'

@Injectable()
export class UpdateController {
  constructor(private readonly updateService: UpdateService) {}

  /**
   * 업데이트 상태를 가져옵니다.
   */
  @IPCHandler()
  public getUpdateStatus() {
    return this.updateService.status
  }

  /**
   * 업데이트를 확인합니다.
   */
  @IPCHandler()
  public async checkForUpdate() {
    return this.updateService.checkForUpdates()
  }

  /**
   * 업데이트를 설치 및 재시작합니다.
   */
  @IPCHandler({ type: 'on' })
  public quitAndInstall() {
    this.updateService.quitAndInstall()
  }

  /**
   * 업데이트 상태가 변경되면 트리거 됩니다.
   */
  @IPCSender({
    windowKeys: [ELECTRON_MAIN_WINDOW_KEY, UPDATE_LOADING_WINDOW_KEY],
  })
  public onChangeUpdateStatus(value: UpdateStatus) {
    return value
  }
}
