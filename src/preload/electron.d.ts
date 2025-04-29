import type { ElectronContext } from './index'

export type ElectronContext = ElectronContext

declare global {
  interface Window {
    /**
     * 전역 electron 컨텍스트
     * @description IPCHandle, IPCSender 데코레이터에 의해 자동으로 생성된 컨텍스트입니다.
     */
    electron: ElectronContext
  }
}
