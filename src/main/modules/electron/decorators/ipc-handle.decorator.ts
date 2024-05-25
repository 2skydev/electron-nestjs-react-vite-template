export interface IPCHandleOptions {
  channel?: string
  type?: IPCHandleType
}

export interface IPCHandleMetadata {
  channel: string
  type: IPCHandleType
  handler: (...args: any[]) => any
  target: any
}

export type IPCHandleType = 'handle' | 'handleOnce' | 'on' | 'once'

export const IPCHandleMap = new Map<string, IPCHandleMetadata>()

export function IPCHandle(options: IPCHandleOptions = {}) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const { channel = key, type = 'handle' } = options

    IPCHandleMap.set(channel, {
      channel,
      type,
      handler: descriptor.value,
      target: target.constructor,
    })
  }
}
