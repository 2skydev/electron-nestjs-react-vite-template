const CACHE_MAP_PROPERTY_NAME = '_returnValueCachingMap'

export function ReturnValueCaching() {
  return function returnValueCachingDecorator(
    target: any,
    key: string,
    descriptor: PropertyDescriptor,
  ) {
    if (!Object.hasOwn(target, CACHE_MAP_PROPERTY_NAME)) {
      target[CACHE_MAP_PROPERTY_NAME] = new Map<string, any>()
    }

    const originalMethod = descriptor.value

    descriptor.value = function (...args: any[]) {
      const cacheMap = target[CACHE_MAP_PROPERTY_NAME]

      if (cacheMap.has(key)) {
        return cacheMap.get(key)
      }

      const result = originalMethod.apply(this, args)

      cacheMap.set(key, result)

      return result
    }
  }
}
