export interface IPCHandlerOptions {
  channel?: string
  type?: IPCHandlerType
}

export interface IPCHandlerMetadata {
  channel: string
  type: IPCHandlerType
  handler: (...args: any[]) => any
  target: any
}

export type IPCHandlerType = 'handle' | 'handleOnce' | 'on' | 'once'

export const IPCHandlerMap = new Map<string, IPCHandlerMetadata>()

/**
 * Renderer > Main 방향의 IPC 데코레이터
 *
 * @description 렌더러에서 메인 프로세스에 있는 함수를 호출해야할 때 사용합니다.
 * 메인 프로세스에서 메소드에 데코레이터를 붙이면 렌더러에서 해당 메소드를 호출할 수 있습니다.
 */
export function IPCHandler(options: IPCHandlerOptions = {}) {
  return function ipcHandlerDecorator(target: any, key: string, descriptor: PropertyDescriptor) {
    const { channel = key, type = 'handle' } = options

    IPCHandlerMap.set(channel, {
      channel,
      type,
      handler: descriptor.value,
      target: target.constructor,
    })
  }
}
