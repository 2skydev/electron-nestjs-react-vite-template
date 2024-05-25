import { app } from 'electron'
import log from 'electron-log'

import { Module } from '@nestjs/common'
import { omit } from 'lodash'
import { lte, valid } from 'semver'

import { migrationStore } from '@main/modules/migration/migration.store'

@Module({})
export class MigrationModule {
  public static async forRootAsync() {
    const currentVersion = `v${app.getVersion()}`
    const initialInstallationVersion = migrationStore.get('initialInstallationVersion')
    const isInitialInstallation =
      !initialInstallationVersion &&
      !Object.keys(omit(migrationStore.store, ['migratedVersions', 'initialInstallationVersion']))
        .length

    let migratedVersions = migrationStore.get('migratedVersions')
    let executedMigrationVersions = migrationStore.get('executedMigrationVersions')

    // If the migration store is empty
    if (!migratedVersions || !executedMigrationVersions) {
      migratedVersions = []
      executedMigrationVersions = []

      migrationStore.store = {
        initialInstallationVersion: currentVersion,
        migratedVersions,
        executedMigrationVersions,
      }
    }

    // Import all declared migrations
    const migrationVersions = Object.getOwnPropertyNames(this).filter(propertyName =>
      valid(propertyName),
    )

    if (isInitialInstallation) {
      // If it's an initial installation, you don't need to run all current migrations, so consider it executed
      migrationStore.set('migratedVersions', migrationVersions)
    } else {
      // Run migration unless it is an initial installation
      const executableMigrationVersions = migrationVersions.filter(version => {
        const isExecutable = !migratedVersions!.includes(version)

        // Run without version comparison if in development mode
        if (!app.isPackaged) return isExecutable

        // If it's production mode, run only the lower and the same versions
        return isExecutable && lte(version, currentVersion)
      })

      // Run if there is a viable migration
      if (executableMigrationVersions.length) {
        for (const version of executableMigrationVersions) {
          try {
            await this[version]()
            log.info(`[Migration Module] Migrated to ${version}`)
          } catch (error) {
            log.error(`[Migration Module] ${version}\n`, error)
          }
        }

        migratedVersions.push(...executableMigrationVersions)
        executedMigrationVersions.push(...executableMigrationVersions)
        migrationStore.set('migratedVersions', migratedVersions)
        migrationStore.set('executedMigrationVersions', executedMigrationVersions)
      }
    }

    return {
      module: MigrationModule,
    }
  }

  public static async 'v0.0.1'() {}
}
