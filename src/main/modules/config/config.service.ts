import { Injectable } from '@nestjs/common'
import type { FieldPath, FieldPathValue } from 'react-hook-form'

import type { ConfigStoreValues } from '@main/modules/config/config.store'
import { configStore } from '@main/modules/config/config.store'

@Injectable()
export class ConfigService {
  private readonly store = configStore
  public readonly storeFilePath = this.store.path

  public onChange<Key extends FieldPath<ConfigStoreValues> = FieldPath<ConfigStoreValues>>(
    key: Key,
    callback: (
      newValue: FieldPathValue<ConfigStoreValues, Key>,
      oldValue: FieldPathValue<ConfigStoreValues, Key>,
    ) => void,
  ) {
    // @ts-expect-error: ignore key type
    return this.store.onDidChange(key, callback)
  }

  public onAnyChange(
    callback: (newValue?: ConfigStoreValues, oldValue?: ConfigStoreValues) => void,
  ) {
    return this.store.onDidAnyChange(callback)
  }

  public get<Key extends FieldPath<ConfigStoreValues> = FieldPath<ConfigStoreValues>>(
    key: Key,
  ): FieldPathValue<ConfigStoreValues, Key> {
    // @ts-expect-error: ignore key type
    return this.store.get(key)
  }

  public set<Key extends FieldPath<ConfigStoreValues> = FieldPath<ConfigStoreValues>>(
    key: Key,
    value: FieldPathValue<ConfigStoreValues, Key>,
  ) {
    this.store.set(key, value)
  }

  public getAll() {
    return this.store.store
  }

  public setAll(config: ConfigStoreValues) {
    this.store.store = config
    return this.store.store
  }
}
