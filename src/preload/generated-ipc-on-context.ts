import { ipcRenderer } from 'electron';

import { ElectronController } from '@main/modules/electron/electron.controller';
import { UpdateController } from '@main/modules/update/update.controller';

type Unsubscribe = () => void

export const generatedIpcOnContext = {
  // ElectronController
  onNeedUpdateLater: (callback: (data: ReturnType<typeof ElectronController.prototype.onNeedUpdateLater>) => void): Unsubscribe => {
    const handler = (_, data) => callback(data)
    ipcRenderer.on('onNeedUpdateLater', handler)
    return () => ipcRenderer.off('onNeedUpdateLater', handler)
  },
  onChangeConfigValue: (callback: (data: ReturnType<typeof ElectronController.prototype.onChangeConfigValue>) => void): Unsubscribe => {
    const handler = (_, data) => callback(data)
    ipcRenderer.on('onChangeConfigValue', handler)
    return () => ipcRenderer.off('onChangeConfigValue', handler)
  },
  onChangeLanguage: (callback: (data: ReturnType<typeof ElectronController.prototype.onChangeLanguage>) => void): Unsubscribe => {
    const handler = (_, data) => callback(data)
    ipcRenderer.on('onChangeLanguage', handler)
    return () => ipcRenderer.off('onChangeLanguage', handler)
  },

  // UpdateController
  onChangeUpdateStatus: (callback: (data: ReturnType<typeof UpdateController.prototype.onChangeUpdateStatus>) => void): Unsubscribe => {
    const handler = (_, data) => callback(data)
    ipcRenderer.on('onChangeUpdateStatus', handler)
    return () => ipcRenderer.off('onChangeUpdateStatus', handler)
  },
};
