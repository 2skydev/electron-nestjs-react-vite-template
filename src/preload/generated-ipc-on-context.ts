import { ipcRenderer } from 'electron'
import type { ElectronController } from '@main/modules/electron/electron.controller'
import type { UpdateController } from '@main/modules/update/update.controller'

// prettier-ignore
type Methods = Pick<
  ElectronController,
  'onNeedUpdateLater' | 'onChangeConfigValue' | 'onChangeLanguage'
> &
  Pick<UpdateController, 'onChangeUpdateStatus'>

const channelNames = [
  'onNeedUpdateLater',
  'onChangeConfigValue',
  'onChangeLanguage',
  'onChangeUpdateStatus',
]

type Unsubscribe = () => void

type GeneratedIpcOnContext = {
  [key in keyof Methods]: (callback: (data: ReturnType<Methods[key]>) => void) => Unsubscribe
}

export const generatedIpcOnContext: GeneratedIpcOnContext = channelNames.reduce(
  (acc, channelName) => {
    acc[channelName] = (callback: (data: any) => void): Unsubscribe => {
      const handler = (_: any, data: any[]) => callback(data)
      ipcRenderer.on(channelName, handler)
      return () => ipcRenderer.off(channelName, handler)
    }

    return acc
  },
  {} as GeneratedIpcOnContext,
)
