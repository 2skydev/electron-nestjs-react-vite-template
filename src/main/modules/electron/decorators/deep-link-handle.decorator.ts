export interface DeepLinkHandleMetadata {
  path: string
  handler: (params: object) => void
  target: any
}

export const DeepLinkHandleMap = new Map<string, DeepLinkHandleMetadata>()

export function DeepLinkHandle(path: string) {
  return function (target: any, _, descriptor: PropertyDescriptor) {
    DeepLinkHandleMap.set(path, { path, handler: descriptor.value, target: target.constructor })
  }
}
