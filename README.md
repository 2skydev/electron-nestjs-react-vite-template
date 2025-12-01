![image](https://github.com/2skydev/electron-nestjs-react-vite-template/assets/43225384/431d3d65-8292-4189-977a-f13bb3dedd5e)

# Electron + NestJS + React + Vite template

Electron starter kit with multiple features

<img width="708" height="379" alt="electron-update" src="https://github.com/user-attachments/assets/c7e40cdb-1e94-4e2c-957c-c3f00ff73152" />

<br/>

## Features

- Electron
  - Electron builder
  - Electron store (json storage)
  - Auto updater
    - Update loading screen
  - Auto launch
  - NestJS
    - [Standalone application](https://docs.nestjs.com/standalone-applications)
    - IPC handler, sender decorator
  - IPC preload script auto generate
- React
  - File system based router (nextjs pages router like)
- i18n
  - The default language is set by detecting which language you use

<br/>

## Overview framework & library

- App framework: [`electron`](https://www.electronjs.org/)
- App build tool: [`electron-builder`](https://www.electron.build/)
- App storage: [`electron-store`](https://github.com/sindresorhus/electron-store)
- App auto updater: [`electron-updater`](https://www.electron.build/auto-update)
- Bundle tool: [`vite`](https://vitejs.dev/) + [`electron-vite`](https://electron-vite.org/)
- Main process framework: [`nestjs`](https://nestjs.com/)
- Renderer process framework: [`react`](https://react.dev/) + [`typescript`](https://www.typescriptlang.org/)
- Code style: [`@biomejs/biome`](https://biomejs.dev/)
- UI components: [`shadcn/ui`](https://ui.shadcn.com/) + [`radix-ui`](https://www.radix-ui.com/)
- Styling: [`tailwindcss`](https://tailwindcss.com/)
- File system based router: [`react-router-dom v7`](https://reactrouter.com/docs/en/v7) + custom (src/components/core/FileSystemRoutes)
- Form handling: [`react-hook-form`](https://react-hook-form.com/) + [`zod`](https://zod.dev/)
- Data fetching: [`swr`](https://swr.vercel.app/)
- i18n: [`i18next`](https://www.i18next.com/) + [`react-i18next`](https://react.i18next.com/)
- Utility library: [`es-toolkit`](https://es-toolkit.slash.page/)

<br/>

## Architecture

> [Figma link](https://www.figma.com/board/BGt9EJBWBnjcPCvKgEeES3/electron-nestjs-react-vite-template?node-id=304-58&t=NB3gHvd2vgOlaHfb-1)

![image](https://github.com/2skydev/electron-nestjs-react-vite-template/assets/43225384/ac40caf1-9840-480f-8352-be3e573226f0)

## Github workflow

> [Figma link](https://www.figma.com/board/BGt9EJBWBnjcPCvKgEeES3/electron-nestjs-react-vite-template?node-id=304-58&t=NB3gHvd2vgOlaHfb-1)

![image](https://github.com/2skydev/electron-nestjs-react-vite-template/assets/43225384/aa9301fe-a6d9-4075-b5bc-4126dbc03e1a)

<br/>

## Getting started

#### use template

- Create a repository from this template or fork this repository
- Create dev branch from main
- Set secret from github repository settings (Settings > Secrets and variables > Actions > New repository secret)
  - `PERSONAL_TOKEN`: Github personal access token (repo scope)

#### dev mode

```bash
pnpm dev
```

#### vite & electron build

```bash
pnpm build
```

## known error

- [%1 is not a valid Win32 application](https://github.com/pnpm/pnpm/issues/5638#issuecomment-1327988206)
- Github Action
  - Update package.json version
    - `pathspec 'dev' did not match any file(s) known to git`
      - DO: create `dev` branch from `main`
