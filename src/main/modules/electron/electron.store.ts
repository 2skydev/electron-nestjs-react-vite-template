import Store from 'electron-store'

export interface ElectronStoreValues {
  windowPosition?: {
    x: number
    y: number
  }
}

export const electronStore = new Store<ElectronStoreValues>({
  name: 'electron',
  accessPropertiesByDotNotation: true,
  defaults: {},
})
