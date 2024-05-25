import Store from 'electron-store'

const IS_DEV = process.env.NODE_ENV === 'development'

export interface ConfigStoreValues {
  general: {
    autoLaunch: boolean
    developerMode: boolean
    zoom: number
    restoreWindowPosition: boolean
    language: string | null
  }
}

export const configStore = new Store<ConfigStoreValues>({
  name: 'config',
  accessPropertiesByDotNotation: true,
  defaults: {
    general: {
      autoLaunch: false,
      developerMode: IS_DEV,
      zoom: 1.0,
      restoreWindowPosition: true,
      language: null,
    },
  },
})
