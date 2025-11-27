import { groupBy } from 'es-toolkit'

import {
  IPCHandlerMap,
  type IPCHandlerMetadata,
} from '@main/modules/electron/decorators/ipc-handler.decorator'
import {
  IPCSenderMap,
  type IPCSenderMetadata,
} from '@main/modules/electron/decorators/ipc-sender.decorator'

const pascalToKebab = (input: string): string => {
  return (
    input
      // 소문자/숫자 뒤에 대문자가 오는 경우 하이픈 삽입 (예: someHTML -> some-HTML)
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      // 대문자 뒤에 대문자와 소문자가 오는 경우 하이픈 삽입 (예: specialHTTPRequest -> special-HTTP-Request)
      .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2')
      // 전체 문자열을 소문자로 변환
      .toLowerCase()
  )
}

/**
 * 공통된 IPC Context Preload 파일 텍스트를 생성합니다.
 */
const generateCommonText = (map: Map<string, IPCSenderMetadata | IPCHandlerMetadata>) => {
  const controllers = groupBy([...map.values()], item => item.target.name as string)

  let result = ''
  let importText = `import { ipcRenderer } from 'electron';`
  let methodsTypeText = '// prettier-ignore\ntype Methods ='
  let channelNamesText = 'const channelNames = ['

  const entries = Object.entries(controllers)

  entries.forEach(([controllerName, items], index) => {
    const controllerFilename = pascalToKebab(controllerName.replace('Controller', ''))
    const isLast = index === entries.length - 1

    importText += `import type { ${controllerName} } from '@main/modules/${controllerFilename}/${controllerFilename}.controller';\n`
    methodsTypeText += `\n  Pick<\n    ${controllerName},`

    items.forEach(item => {
      methodsTypeText += `\n    | '${item.handler.name}'`
      channelNamesText += `'${item.handler.name}',`
    })

    methodsTypeText += `\n  >${isLast ? '' : ' &'}`
  })

  channelNamesText += `]`
  result += `${importText}\n\n`
  result += `${methodsTypeText}\n\n`
  result += `${channelNamesText}\n\n`

  return result
}

export const generateIPCInvokeContextPreloadFileText = () => {
  let result = generateCommonText(IPCHandlerMap)

  result += `
    type GeneratedIpcInvokeContext = {
      [key in keyof Methods]: (...args: Parameters<Methods[key]>) => Promise<ReturnType<Methods[key]>>
    }

    export const generatedIpcInvokeContext: GeneratedIpcInvokeContext = channelNames.reduce(
      (acc, channelName) => {
        acc[channelName] = (...args: any[]) => ipcRenderer.invoke(channelName, ...args)
        return acc
      },
      {} as GeneratedIpcInvokeContext,
    )
  `

  return result
}

export const generateIPCOnContextPreloadFileText = () => {
  let result = generateCommonText(IPCSenderMap)

  result += `
    type Unsubscribe = () => void

    type GeneratedIpcOnContext = {
      [key in keyof Methods]: (
        callback: (data: ReturnType<Methods[key]>) => void,
      ) => Unsubscribe
    }

    export const generatedIpcOnContext: GeneratedIpcOnContext = channelNames.reduce(
      (acc, channelName) => {
        acc[channelName] = (callback: (data: any) => void): Unsubscribe => {
          const handler = (_: any, data: any[]) => callback(data)
          ipcRenderer.on(channelName, handler)
          return () => ipcRenderer.off(channelName, handler)
        }

        return acc
      },
      {} as GeneratedIpcOnContext,
    )
  `

  return result
}
