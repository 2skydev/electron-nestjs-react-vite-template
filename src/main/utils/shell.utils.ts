import { exec } from 'node:child_process'

export const execPromise = (command: string) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) reject({ error, stdout, stderr })
      resolve(stdout)
    })
  })
}
