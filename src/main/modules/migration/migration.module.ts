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

    // 마이그레이션 스토어가 비어있는 경우
    if (!migratedVersions || !executedMigrationVersions) {
      migratedVersions = []
      executedMigrationVersions = []

      migrationStore.store = {
        initialInstallationVersion: currentVersion,
        migratedVersions,
        executedMigrationVersions,
      }
    }

    // 선언된 모든 마이그레이션 불러오기
    const migrationVersions = Object.getOwnPropertyNames(this).filter(propertyName =>
      valid(propertyName),
    )

    if (isInitialInstallation) {
      // 초기 설치라면 현재 모든 마이그레이션을 실행할 필요가 없으므로 실행된 것으로 간주
      migrationStore.set('migratedVersions', migrationVersions)
    } else {
      // 초기 설치가 아니라면 마이그레이션 실행
      const executableMigrationVersions = migrationVersions.filter(version => {
        const isExecutable = !migratedVersions!.includes(version)

        // 개발 모드라면 버전 비교 없이 실행
        if (!app.isPackaged) return isExecutable

        // 프로덕션 모드라면 하위 및 같은 버전만 실행
        return isExecutable && lte(version, currentVersion)
      })

      // 실행 가능한 마이그레이션이 있다면 실행
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
