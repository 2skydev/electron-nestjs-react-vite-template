import { Injectable } from '@nestjs/common'
import i18next from 'i18next'

import type { ConfigStoreValues } from '@main/modules/config/config.store'
import { IPCHandle } from '@main/modules/electron/decorators/ipc-handle.decorator'
import { IPCSender } from '@main/modules/electron/decorators/ipc-sender.decorator'
import { ELECTRON_MAIN_WINDOW_KEY } from '@main/modules/electron/electron.constants'
import { ElectronService } from '@main/modules/electron/electron.service'
import type { AppControlAction } from '@main/modules/electron/types/app-control.type'
import { app } from 'electron'

@Injectable()
export class ElectronController {
  constructor(private electronService: ElectronService) {}

  @IPCHandle()
  public getVersions() {
    return process.versions
  }

  @IPCHandle()
  public getAppVersion() {
    return app.getVersion()
  }

  @IPCHandle({ type: 'on' })
  public appControl(action: AppControlAction) {
    this.electronService.appControl(action)
  }

  @IPCHandle({ type: 'on' })
  public relaunch() {
    this.electronService.relaunch()
  }

  @IPCHandle()
  public getCurrentI18nextResource() {
    return {
      language: i18next.language,
      resource: i18next.getResourceBundle(i18next.language, 'translation'),
      ns: 'translation',
    }
  }

  @IPCHandle()
  public getLanguageOptions() {
    return this.electronService.languageOptions
  }

  @IPCSender({
    windowKeys: [ELECTRON_MAIN_WINDOW_KEY],
  })
  public onNeedUpdateLater() {}

  @IPCSender({
    windowKeys: [ELECTRON_MAIN_WINDOW_KEY],
  })
  public onChangeConfigValue(value: ConfigStoreValues) {
    return value
  }

  @IPCSender({
    windowKeys: [ELECTRON_MAIN_WINDOW_KEY],
  })
  public onChangeLanguage(value: string) {
    return value
  }
}
