import { ipcRenderer } from 'electron'

import type { ConfigController } from '@main/modules/config/config.controller'
import type { DeveloperController } from '@main/modules/developer/developer.controller'
import type { ElectronController } from '@main/modules/electron/electron.controller'
import type { UpdateController } from '@main/modules/update/update.controller'

// prettier-ignore
type Methods = Pick<ConfigController, 'getConfig' | 'setConfig'> &
  Pick<DeveloperController, 'ping' | 'getStorePath' | 'getLogs' | 'clearLogs'> &
  Pick<
    ElectronController,
    | 'getVersions'
    | 'getAppVersion'
    | 'appControl'
    | 'relaunch'
    | 'getCurrentI18nextResource'
    | 'getLanguageOptions'
  > &
  Pick<UpdateController, 'getUpdateStatus' | 'checkForUpdate' | 'quitAndInstall'>

const channelNames = [
  'getConfig',
  'setConfig',
  'ping',
  'getStorePath',
  'getLogs',
  'clearLogs',
  'getVersions',
  'getAppVersion',
  'appControl',
  'relaunch',
  'getCurrentI18nextResource',
  'getLanguageOptions',
  'getUpdateStatus',
  'checkForUpdate',
  'quitAndInstall',
]

type GeneratedIpcInvokeContext = {
  [key in keyof Methods]: (...args: Parameters<Methods[key]>) => Promise<ReturnType<Methods[key]>>
}

export const generatedIpcInvokeContext: GeneratedIpcInvokeContext = channelNames.reduce(
  (acc, channelName) => {
    acc[channelName] = (...args: any[]) => ipcRenderer.invoke(channelName, ...args)
    return acc
  },
  {} as GeneratedIpcInvokeContext,
)
