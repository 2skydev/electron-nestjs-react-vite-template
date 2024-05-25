export interface IPCSenderOptions {
  channel?: string
  windowKeys: string[]
}

export interface IPCSenderMetadata {
  channel: string
  windowKeys: string[]
  handler: (...args: any[]) => any
  target: any
}

export const IPCSenderMap = new Map<string, IPCSenderMetadata>()

export function IPCSender(options: IPCSenderOptions) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const { channel = key, windowKeys } = options

    IPCSenderMap.set(channel, {
      channel,
      windowKeys,
      handler: descriptor.value,
      target: target.constructor,
    })
  }
}
