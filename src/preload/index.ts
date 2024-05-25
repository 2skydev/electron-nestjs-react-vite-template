import { contextBridge } from 'electron'

import { generatedIpcInvokeContext } from './generated-ipc-invoke-context'
import { generatedIpcOnContext } from './generated-ipc-on-context'

const electronContext = {
  ...generatedIpcInvokeContext,
  ...generatedIpcOnContext,
}

export type ElectronContext = typeof electronContext

contextBridge.exposeInMainWorld('electron', electronContext)
