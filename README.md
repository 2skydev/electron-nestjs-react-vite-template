![image](https://github.com/2skydev/electron-nestjs-react-vite-template/assets/43225384/431d3d65-8292-4189-977a-f13bb3dedd5e)

# electron + react + nestjs + vite template

<br/>

## i18n support

The default language is set by detecting which language you use, and you can also change it directly on the Settings page.

<br/>

## Features

<br/>

## Architecture

> [Figma link](https://www.figma.com/board/BGt9EJBWBnjcPCvKgEeES3/electron-nestjs-react-vite-template?node-id=304-58&t=NB3gHvd2vgOlaHfb-1)

![image](https://github.com/2skydev/electron-nestjs-react-vite-template/assets/43225384/ac40caf1-9840-480f-8352-be3e573226f0)

## Github workflow

> [Figma link](https://www.figma.com/file/qJrFt4YVAZX5UdbeKLx6xA/LADA?type=whiteboard&t=oozV2tgJvZuRd6S4-1)

![image](https://github.com/2skydev/electron-nestjs-react-vite-template/assets/43225384/aa9301fe-a6d9-4075-b5bc-4126dbc03e1a)

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
