import { Injectable, type OnModuleInit } from '@nestjs/common'
import type { ModuleRef } from '@nestjs/core'
import { app, BrowserWindow } from 'electron'
import log from 'electron-log'
import { autoUpdater } from 'electron-updater'

import { ExecuteLog } from '@main/decorators/execute-log.decorator'
import { AppWindow } from '@main/modules/electron/decorators/app-window.decorator'
import type { ElectronService } from '@main/modules/electron/electron.service'
import type { UpdateStatus, UpdateStatusEvent } from '@main/modules/update/types/update-status.type'
import { UPDATE_LOADING_WINDOW_KEY } from '@main/modules/update/update.constants'
import { UpdateController } from '@main/modules/update/update.controller'

const LISTEN_EVENTS = [
  'checking-for-update',
  'update-available',
  'update-not-available',
  'download-progress',
  'update-downloaded',
  'error',
] as const

@Injectable()
export class UpdateService implements OnModuleInit {
  public status: UpdateStatus = {
    event: 'checking-for-update',
    data: null,
    time: Date.now(),
  }

  @AppWindow(UPDATE_LOADING_WINDOW_KEY)
  public updateLoadingWindow: BrowserWindow | null = null

  private controller: UpdateController

  constructor(
    private readonly electronService: ElectronService,
    private readonly moduleRef: ModuleRef,
  ) {
    autoUpdater.logger = log
    autoUpdater.autoInstallOnAppQuit = true
    autoUpdater.disableWebInstaller = true

    LISTEN_EVENTS.forEach(event => {
      autoUpdater.on(event, this.handleUpdateEvent(event))
    })
  }

  onModuleInit() {
    this.controller = this.moduleRef.get(UpdateController)
  }

  // execute by `src/main/index.ts`
  @ExecuteLog()
  async autoUpdate() {
    return new Promise<boolean>(resolve => {
      const stopAutoUpdate = () => {
        autoUpdater.off('update-available', handleUpdateAvailable)
        autoUpdater.off('update-not-available', handleUpdateNotAvailable)
        autoUpdater.off('update-downloaded', handleUpdateDownloaded)
        resolve(false)
      }

      const handleUpdateAvailable = async () => {
        if (!this.electronService.IS_HIDDEN_LAUNCH) {
          this.electronService.isNeedUpdate = true
          this.openUpdateLoadingWindow()
        }
      }

      const handleUpdateNotAvailable = () => {
        stopAutoUpdate()
      }

      const handleUpdateDownloaded = () => {
        autoUpdater.quitAndInstall(true, true)
        resolve(true)
      }

      autoUpdater.on('update-available', handleUpdateAvailable)
      autoUpdater.on('update-not-available', handleUpdateNotAvailable)
      autoUpdater.on('update-downloaded', handleUpdateDownloaded)

      autoUpdater.checkForUpdates().then(result => {
        if (!result) stopAutoUpdate()
      })
    })
  }

  async openUpdateLoadingWindow() {
    this.updateLoadingWindow = new BrowserWindow({
      width: 300,
      height: 300,
      backgroundColor: '#2F3242',
      darkTheme: true,
      show: false,
      autoHideMenuBar: true,
      frame: false,
      icon: this.electronService.ICON,
      resizable: false,
      webPreferences: {
        preload: this.electronService.PRELOAD_PATH,
      },
    })

    this.updateLoadingWindow.on('ready-to-show', () => {
      this.updateLoadingWindow?.show()
    })

    if (app.isPackaged) {
      await this.updateLoadingWindow.loadFile(this.electronService.PROD_LOAD_FILE_PATH, {
        hash: '#/windows/update-loading',
      })
    } else {
      await this.updateLoadingWindow.loadURL(
        `${this.electronService.DEV_URL}#/windows/update-loading`,
      )
    }
  }

  private handleUpdateEvent(event: UpdateStatusEvent) {
    return (data: any) => {
      this.status = {
        event,
        data,
        time: Date.now(),
      }

      this.controller.onChangeUpdateStatus(this.status)
    }
  }

  public async checkForUpdates() {
    return autoUpdater.checkForUpdates()
  }

  public quitAndInstall() {
    autoUpdater.quitAndInstall()
  }
}
