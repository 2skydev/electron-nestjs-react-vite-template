export interface AppWindowOptions {
  key?: string
}

export interface AppWindowMetadata {
  target: any
  propertyName: string
}

export const AppWindowMap = new Map<string, AppWindowMetadata>()

export function AppWindow(key?: string) {
  return function (target: any, propertyName: string) {
    AppWindowMap.set(key || propertyName, {
      propertyName,
      target: target.constructor,
    })
  }
}
