import type { ElectronContext } from './index'

export type ElectronContext = ElectronContext

declare global {
  interface Window {
    electron: ElectronContext
  }
}
