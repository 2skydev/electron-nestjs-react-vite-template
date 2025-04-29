import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  MenuItemConstructorOptions,
  nativeImage,
  shell,
  Tray,
} from 'electron'

import { Injectable, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import AutoLaunch from 'auto-launch'
import { writeFile, readdir, readFile } from 'fs/promises'
import i18next from 'i18next'
import { parse as jsoncParse } from 'jsonc-parser'
import { join } from 'path'
import { match } from 'path-to-regexp'

import { productName, protocols } from '@main/../../electron-builder.json'
import { ExecuteLog } from '@main/decorators/execute-log.decorator'
import { ConfigService } from '@main/modules/config/config.service'
import { AppWindow, AppWindowMap } from '@main/modules/electron/decorators/app-window.decorator'
import { DeepLinkHandlerMap } from '@main/modules/electron/decorators/deep-link-handler.decorator'
import { IPCHandlerMap } from '@main/modules/electron/decorators/ipc-handler.decorator'
import { IPCSenderMap } from '@main/modules/electron/decorators/ipc-sender.decorator'
import {
  ELECTRON_MAIN_WINDOW_KEY,
  ZOOM_PERCENT_ARRAY,
} from '@main/modules/electron/electron.constants'
import { ElectronController } from '@main/modules/electron/electron.controller'
import { electronStore } from '@main/modules/electron/electron.store'
import { AppControlAction } from '@main/modules/electron/types/app-control.type'
import { LanguageOption } from '@main/modules/electron/types/language.type'
import {
  generateIPCInvokeContextPreloadFileText,
  generateIPCOnContextPreloadFileText,
} from '@main/modules/electron/utils/generate-preload.utils'
import { execPromise } from '@main/utils/shell.utils'

@Injectable()
export class ElectronService implements OnModuleInit, OnApplicationBootstrap {
  private readonly store = electronStore

  public readonly APP_PATH = app.getAppPath()
  public readonly PROTOCOL = protocols.name
  public readonly IS_MAC = process.platform === 'darwin'
  public readonly DEV_URL = process.env['ELECTRON_RENDERER_URL']
  public readonly PROD_LOAD_FILE_PATH = join(this.APP_PATH, 'out/renderer/index.html')
  public readonly PRELOAD_PATH = join(this.APP_PATH, 'out/preload/index.js')
  public readonly RESOURCES_PATH = app.isPackaged
    ? join(process.resourcesPath, 'resources')
    : join(this.APP_PATH, 'resources')
  public readonly ICON = nativeImage.createFromPath(
    `${this.RESOURCES_PATH}/icons/${this.IS_MAC ? 'logo@512.png' : 'logo@256.ico'}`,
  )
  public readonly IS_HIDDEN_LAUNCH = process.argv.includes('--hidden')

  public readonly APP_WIDTH = 800
  public readonly APP_HEIGHT = 600

  public readonly ZOOM_PERCENT_ARRAY = ZOOM_PERCENT_ARRAY

  // main window
  @AppWindow(ELECTRON_MAIN_WINDOW_KEY)
  public window: BrowserWindow | null = null

  public tray: Tray | null = null

  // deep link handlers
  public deepLinkHandlers: Record<string, (params: object) => void> = {}

  // update.module.ts -> autoUpdate()
  public isNeedUpdate = false
  public isNeedUpdateLater = false

  public isStarted = false

  public zoom: number

  public autoLauncher = new AutoLaunch({
    name: app.getName(),
    path: app.getPath('exe'),
    isHidden: true,
  })

  public languageOptions: LanguageOption[] = []

  private controller: ElectronController

  constructor(
    private readonly configService: ConfigService,
    private readonly moduleRef: ModuleRef,
  ) {
    // smooth scrolling
    app.commandLine.appendSwitch(`--enable-smooth-scrolling`)

    // protocol
    app.setAsDefaultProtocolClient(this.PROTOCOL)

    // zoom
    this.zoom = this.configService.get('general.zoom')
  }

  @ExecuteLog()
  public async onModuleInit() {
    this.controller = this.moduleRef.get(ElectronController)

    await app.whenReady()
    await this.initI18Next()

    const gotTheLock = app.requestSingleInstanceLock()

    if (!gotTheLock) {
      app.quit()
      process.exit(0)
    }

    this.registerEvents()
    this.createTray()
  }

  @ExecuteLog()
  public async onApplicationBootstrap() {
    DeepLinkHandlerMap.forEach(({ path, handler, target }) => {
      const instance = this.moduleRef.get(target, { strict: false })
      this.deepLinkHandlers[path] = handler.bind(instance)
    })

    IPCHandlerMap.forEach(({ channel, type, handler, target }) => {
      const instance = this.moduleRef.get(target, { strict: false })

      ipcMain[type](channel, (_, ...args) => handler.apply(instance, args))
    })

    IPCSenderMap.forEach(({ channel, windowKeys, handler, target }) => {
      const instance = this.moduleRef.get(target, { strict: false })

      const windows = windowKeys.map(windowKey => {
        const windowMetadata = AppWindowMap.get(windowKey)

        if (!windowMetadata) throw new Error(`[ @AppWindow ] Window key '${windowKey}' not found.`)

        const instance = this.moduleRef.get(windowMetadata.target, { strict: false })

        return {
          propertyName: windowMetadata.propertyName,
          instance,
        }
      })

      const originalHandler = handler

      const newHandler = function (...args: any[]) {
        const result = originalHandler.apply(instance, args)

        windows.forEach(({ propertyName, instance }) => {
          instance[propertyName]?.webContents.send(channel, result)
        })
      }

      instance[channel] = newHandler
    })

    await this.generateIpcInvokeContextPreloadFile()
    await this.generateIpcOnContextPreloadFile()
  }

  public async generateIpcInvokeContextPreloadFile() {
    if (app.isPackaged) return

    const path = 'src/preload/generated-ipc-invoke-context.ts'
    const text = generateIPCInvokeContextPreloadFileText()

    await writeFile(path, text)
    await execPromise(`pnpm exec prettier --write ${path}`)
  }

  public async generateIpcOnContextPreloadFile() {
    if (app.isPackaged) return

    const path = 'src/preload/generated-ipc-on-context.ts'
    const text = generateIPCOnContextPreloadFileText()

    await writeFile(path, text)
    await execPromise(`pnpm exec prettier --write ${path}`)
  }

  // execute by `src/main/index.ts`
  @ExecuteLog()
  public async start() {
    if (!this.IS_HIDDEN_LAUNCH && !this.isNeedUpdate) {
      await this.createWindow()

      if (this.isNeedUpdateLater) {
        setTimeout(() => {
          this.controller.onNeedUpdateLater()
        }, 3000)
      }
    }

    this.isStarted = true
  }

  public async createWindow() {
    return new Promise<void>(async resolve => {
      if (this.window) {
        if (this.window.isMinimized()) this.window.restore()
        this.window.focus()
        return
      }

      const windowPosition = this.store.get('windowPosition')

      this.window = new BrowserWindow({
        width: this.APP_WIDTH,
        height: this.APP_HEIGHT,
        backgroundColor: '#2F3242',
        darkTheme: true,
        show: false,
        autoHideMenuBar: true,
        icon: this.ICON,
        webPreferences: {
          preload: this.PRELOAD_PATH,
        },
        ...windowPosition,
      })

      this.window.on('ready-to-show', () => {
        this.applyZoom(this.zoom)
        this.window!.show()
        resolve()
      })

      this.window.on('close', () => {
        this.window = null
      })

      this.window.on('moved', () => {
        this.saveCurrentWindowPosition()
      })

      this.window.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('https:')) {
          shell.openExternal(url)
        }

        return { action: 'deny' }
      })

      if (app.isPackaged) {
        await this.window.loadFile(this.PROD_LOAD_FILE_PATH, {
          hash: '#',
        })
      } else {
        await this.window.loadURL(this.DEV_URL + '#')
        this.window.webContents.openDevTools()
      }
    })
  }

  public async appControl(action: AppControlAction) {
    if (!this.window) return

    switch (action) {
      case 'devtools': {
        this.window.webContents.toggleDevTools()
        break
      }

      case 'minimize': {
        this.window.minimize()
        break
      }

      case 'maximize': {
        this.window.isMaximized() ? this.window.unmaximize() : this.window.maximize()
        break
      }

      case 'close': {
        this.window.close()
        break
      }
    }
  }

  public setZoom(zoom: number) {
    this.zoom = zoom
    this.configService.set('general.zoom', zoom)
    this.applyZoom(zoom)
    this.reloadContextMenu()
  }

  public relaunch() {
    app.relaunch()
    app.quit()
  }

  private applyZoom(zoom: number) {
    if (!this.window) return

    // setMinimumSize를 사용하는 이유는 아래 setSize만 사용했을 때 의도된 설계인지 모르겠지만 최소 크기가 자동으로 변경되어 크기를 줄일 수 없다.
    // 그래서 setMinimumSize를 사용하여 직접 최소 크기를 변경 후 setSize를 사용하여 크기를 변경한다.
    this.window.setMinimumSize(this.APP_WIDTH * zoom, this.APP_HEIGHT * zoom)
    this.window.setSize(this.APP_WIDTH * zoom, this.APP_HEIGHT * zoom, true)
    this.window.webContents.setZoomFactor(zoom)
  }

  private registerEvents() {
    app.on('activate', () => {
      this.createWindow()
    })

    app.on('window-all-closed', () => {
      this.window = null
    })

    app.on('second-instance', (_, argv) => {
      if (!this.IS_MAC) {
        const url = argv.find(arg => arg.startsWith(`${this.PROTOCOL}://`))
        if (url) this.resolveDeepLink(url)
      }
    })

    app.on('open-url', (_, url) => {
      this.resolveDeepLink(url)
    })

    this.configService.onAnyChange(newValue => {
      if (!this.window || !newValue) return
      this.controller.onChangeConfigValue(newValue)
    })

    this.configService.onChange('general.zoom', value => {
      this.setZoom(value)
    })

    this.configService.onChange('general.autoLaunch', async value => {
      const isEnabled = await this.autoLauncher.isEnabled()

      // 아래 enable/disable 실행 시 오류가 발생 할 수 있기 때문에 두 값이 같을 경우 아무것도 하지 않는다.
      if (isEnabled === value || (!isEnabled && !value)) return

      this.autoLauncher[value ? 'enable' : 'disable']()
    })

    this.configService.onChange('general.language', async value => {
      await i18next.changeLanguage(value!)
      this.controller.onChangeLanguage(value!)
    })

    this.configService.onChange('general.restoreWindowPosition', value => {
      if (value) {
        this.saveCurrentWindowPosition()
      } else {
        this.store.delete('windowPosition')
      }
    })
  }

  private createTray() {
    this.tray = new Tray(this.ICON.resize({ width: 20, height: 20 }))

    this.tray.on('double-click', () => this.createWindow())
    this.tray.setToolTip(productName)

    this.reloadContextMenu()
  }

  private saveCurrentWindowPosition() {
    if (this.configService.get('general.restoreWindowPosition') === false || !this.window) return

    const { x, y } = this.window.getBounds()

    this.store.set('windowPosition', {
      x,
      y,
    })
  }

  private resetWindowPosition() {
    if (this.window) {
      this.window.center()
      this.window.focus()
      this.saveCurrentWindowPosition()
    } else {
      this.store.delete('windowPosition')
    }
  }

  private reloadContextMenu() {
    const template: MenuItemConstructorOptions[] = [
      {
        label: i18next.t('main.contextMenu.showHome'),
        type: 'normal',
        click: () => this.createWindow(),
      },
      {
        label: i18next.t('main.contextMenu.resetWindowPosition'),
        type: 'normal',
        click: () => this.resetWindowPosition(),
      },
      {
        label: i18next.t('main.contextMenu.setAppZoom'),
        type: 'submenu',
        submenu: [
          ...this.ZOOM_PERCENT_ARRAY.map(
            percent =>
              ({
                label: `${percent}%${
                  percent === this.zoom * 100 ? ` (${i18next.t('main.contextMenu.nowValue')})` : ''
                }`,
                type: 'normal',
                click: () => this.setZoom(percent / 100),
              }) as MenuItemConstructorOptions,
          ),
        ],
      },
      { type: 'separator' },
      { label: i18next.t('main.contextMenu.quit'), role: 'quit', type: 'normal' },
    ]

    this.tray?.setContextMenu(Menu.buildFromTemplate(template))
  }

  private resolveDeepLink(url: string) {
    const pathname = url.replace(`${this.PROTOCOL}://`, '/')

    for (const path in this.deepLinkHandlers) {
      const data = match(path)(pathname)

      if (data) {
        this.deepLinkHandlers[path](data.params)
        break
      }
    }
  }

  private async initI18Next() {
    const fileNames = await readdir(`${this.RESOURCES_PATH}/locales`)

    const files = await Promise.all(
      fileNames.map(fileName =>
        readFile(`${this.RESOURCES_PATH}/locales/${fileName}`, { encoding: 'utf-8' }),
      ),
    )

    const resources: Record<string, any> = files.reduce((resources, file, index) => {
      const json = jsoncParse(file)
      const locale = fileNames[index].replace('.json', '')

      resources[locale] = {
        translation: json,
      }

      this.languageOptions.push({
        label: json?.label,
        value: locale,
      })

      return resources
    }, {})

    const systemLocale = app.getSystemLocale().replace('-', '_')
    const configLocale = this.configService.get('general.language')

    const inputLocale = configLocale ?? systemLocale
    const outputLocale = resources[inputLocale] ? inputLocale : 'en_US'

    await i18next.init({
      lng: outputLocale,
      resources,
    })

    if (!configLocale) {
      this.configService.set('general.language', outputLocale)
    }
  }
}
