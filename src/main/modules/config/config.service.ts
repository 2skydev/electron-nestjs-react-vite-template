import { FieldPath, FieldPathValue } from 'react-hook-form'

import { Injectable } from '@nestjs/common'

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
    // @ts-ignore: key 타입 무시
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
    // @ts-ignore: key 타입 무시
    return this.store.get(key)
  }

  public set<Key extends FieldPath<ConfigStoreValues> = FieldPath<ConfigStoreValues>>(
    key: Key,
    value: FieldPathValue<ConfigStoreValues, Key>,
  ) {
    // @ts-ignore: key 타입 무시
    this.store.set(key, value)
  }

  public getAll() {
    return this.store.store
  }

  public setAll(config: ConfigStoreValues) {
    return (this.store.store = config)
  }
}
