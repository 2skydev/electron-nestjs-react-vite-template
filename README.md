# electron + react + nestjs + vite template

<br/>

## i18n support

The default language is set by detecting which language you use, and you can also change it directly on the Settings page.

<br/>

## Features

<br/>

## Architecture

> [Figma link](https://www.figma.com/file/qJrFt4YVAZX5UdbeKLx6xA/LADA?type=whiteboard&t=oozV2tgJvZuRd6S4-1)

![image](https://github.com/2skydev/LADA/assets/43225384/a4de6e74-4788-424c-a3f0-a329c853789a)

## Github workflow

> [Figma link](https://www.figma.com/file/qJrFt4YVAZX5UdbeKLx6xA/LADA?type=whiteboard&t=oozV2tgJvZuRd6S4-1)

![image](https://github.com/2skydev/LADA/assets/43225384/69dc01b1-0fab-4305-9e69-6821555119fe)

<br/>

## Start develop

#### dev mode

```bash
pnpm dev
```

#### vite & electron build

```bash
pnpm build
```

<br/>

## Overview framework & library

- App framework: [`electron`](https://www.electronjs.org/)
- App build tool: [`electron-builder`](https://www.electron.build/)
- App storage: [`electron-store`](https://github.com/sindresorhus/electron-store)
- App auto updater: [`electron-updater`](https://www.electron.build/auto-update)
- Bundle tool: [`vite`](https://vitejs.dev/) + [`electron-vite`](https://electron-vite.org/)
- Main process framework: [`nestjs`](https://nestjs.com/)
- Renderer process framework: [`react`](https://react.dev/) + [`typescript`](https://www.typescriptlang.org/)
- Code style: `eslint` + `prettier` + [`@trivago/prettier-plugin-sort-imports`](https://github.com/trivago/prettier-plugin-sort-imports)
- File system based router: [`react-router-dom v6`](https://reactrouter.com/docs/en/v6) + custom (src/components/FileSystemRoutes)
- i18n: [`i18next`](https://www.i18next.com/) + [`react-i18next`](https://react.i18next.com/)
