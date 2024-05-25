import { UpdaterEvents } from 'electron-updater'

export type UpdateStatusEvent = Omit<UpdaterEvents, 'login'>

export interface UpdateStatus {
  event: UpdateStatusEvent
  time: number
  data: any
}
