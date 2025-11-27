import { Injectable } from '@nestjs/common'
import { app } from 'electron'
import i18next from 'i18next'

import type { ConfigStoreValues } from '@main/modules/config/config.store'
import { IPCHandler } from '@main/modules/electron/decorators/ipc-handler.decorator'
import { IPCSender } from '@main/modules/electron/decorators/ipc-sender.decorator'
import { ELECTRON_MAIN_WINDOW_KEY } from '@main/modules/electron/electron.constants'
import type { ElectronService } from '@main/modules/electron/electron.service'
import type { AppControlAction } from '@main/modules/electron/types/app-control.type'

@Injectable()
export class ElectronController {
  constructor(private electronService: ElectronService) {}

  /**
   * 버전 정보를 가져옵니다.
   */
  @IPCHandler()
  public getVersions() {
    return process.versions
  }

  /**
   * 앱 버전을 가져옵니다.
   */
  @IPCHandler()
  public getAppVersion() {
    return app.getVersion()
  }

  /**
   * 앱 메인 창에 대한 액션을 실행합니다.
   */
  @IPCHandler({ type: 'on' })
  public appControl(action: AppControlAction) {
    this.electronService.appControl(action)
  }

  /**
   * 앱을 재시작합니다.
   */
  @IPCHandler({ type: 'on' })
  public relaunch() {
    this.electronService.relaunch()
  }

  /**
   * 현재 사용 중인 i18next 리소스를 가져옵니다.
   */
  @IPCHandler()
  public getCurrentI18nextResource() {
    return {
      language: i18next.language,
      resource: i18next.getResourceBundle(i18next.language, 'translation'),
      ns: 'translation',
    }
  }

  /**
   * 언어 옵션을 가져옵니다.
   */
  @IPCHandler()
  public getLanguageOptions() {
    return this.electronService.languageOptions
  }

  /**
   * 추후 업데이트가 필요할 경우 트리거 됩니다.
   */
  @IPCSender({
    windowKeys: [ELECTRON_MAIN_WINDOW_KEY],
  })
  public onNeedUpdateLater() {}

  /**
   * 설정 값이 변경되면 트리거 됩니다.
   */
  @IPCSender({
    windowKeys: [ELECTRON_MAIN_WINDOW_KEY],
  })
  public onChangeConfigValue(value: ConfigStoreValues) {
    return value
  }

  /**
   * 언어 옵션이 변경되면 트리거 됩니다.
   */
  @IPCSender({
    windowKeys: [ELECTRON_MAIN_WINDOW_KEY],
  })
  public onChangeLanguage(value: string) {
    return value
  }
}
