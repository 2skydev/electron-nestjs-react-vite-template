import { Logger } from '@nestjs/common'

interface ExecuteLogOptions {
  startLog?: boolean
}

const yellow = (text: string) => `\x1B[38;5;3m${text}\x1B[39m`

export function ExecuteLog(options: ExecuteLogOptions = {}) {
  const { startLog } = options

  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
      const now = Date.now()

      startLog && Logger.log(`${target.constructor.name} ${key}()`, 'ExecuteLog')

      const result = await originalMethod.apply(this, args)

      Logger.log(
        `${target.constructor.name} ${key}() ${yellow(`+${Date.now() - now}ms`)}`,
        'ExecuteLog',
      )

      return result
    }

    return descriptor
  }
}
