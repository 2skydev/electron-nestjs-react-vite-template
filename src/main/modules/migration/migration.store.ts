import Store from 'electron-store'

export interface MigrationStoreValues {
  initialInstallationVersion?: string
  migratedVersions?: string[]
  executedMigrationVersions?: string[]
}

export const migrationStore = new Store<MigrationStoreValues>({
  name: 'migration',
  accessPropertiesByDotNotation: false,
  defaults: {},
})
