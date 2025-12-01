import { contextBridge } from 'electron'

import { generatedIpcInvokeContext } from './generated-ipc-invoke-context'
import { generatedIpcOnContext } from './generated-ipc-on-context'

const electronContext = {
  ...generatedIpcInvokeContext,
  ...generatedIpcOnContext,
}

/**
 * 전역 electron 컨텍스트
 * @description IPCHandle, IPCSender 데코레이터에 의해 자동으로 생성된 컨텍스트입니다.
 */
export type ElectronContext = typeof electronContext

contextBridge.exposeInMainWorld('electron', electronContext)
