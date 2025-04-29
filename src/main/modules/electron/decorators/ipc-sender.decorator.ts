export interface IPCSenderOptions {
  windowKeys: string[]
  channel?: string
}

export interface IPCSenderMetadata {
  channel: string
  windowKeys: string[]
  handler: (...args: any[]) => any
  target: any
}

export const IPCSenderMap = new Map<string, IPCSenderMetadata>()

/**
 * Main > Renderer 방향의 IPC 데코레이터
 *
 * @description 메인 프로세스에서 렌더러로 데이터를 전달해야할 때 사용합니다. 메인 프로세스에서 메소드에 데코레이터를 붙이고 렌더러에서 리스너를 붙이면 트리거 시 데이터를 전달할 수 있습니다.
 */
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
