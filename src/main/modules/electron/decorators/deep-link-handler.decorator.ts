export interface DeepLinkHandlerMetadata {
  path: string
  handler: (params: object) => void
  target: any
}

export const DeepLinkHandlerMap = new Map<string, DeepLinkHandlerMetadata>()

export function DeepLinkHandler(path: string) {
  return function (target: any, _, descriptor: PropertyDescriptor) {
    DeepLinkHandlerMap.set(path, { path, handler: descriptor.value, target: target.constructor })
  }
}
