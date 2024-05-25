import { ipcRenderer } from 'electron';

import { ConfigController } from '@main/modules/config/config.controller';
import { DeveloperController } from '@main/modules/developer/developer.controller';
import { ElectronController } from '@main/modules/electron/electron.controller';
import { UpdateController } from '@main/modules/update/update.controller';

export const generatedIpcInvokeContext = {
  // ConfigController
  getConfig: async (...args: Parameters<typeof ConfigController.prototype.getConfig>): Promise<ReturnType<typeof ConfigController.prototype.getConfig>> => ipcRenderer.invoke('getConfig', ...args),
  setConfig: async (...args: Parameters<typeof ConfigController.prototype.setConfig>): Promise<ReturnType<typeof ConfigController.prototype.setConfig>> => ipcRenderer.invoke('setConfig', ...args),

  // DeveloperController
  ping: async (...args: Parameters<typeof DeveloperController.prototype.ping>): Promise<ReturnType<typeof DeveloperController.prototype.ping>> => ipcRenderer.invoke('ping', ...args),
  getStorePath: async (...args: Parameters<typeof DeveloperController.prototype.getStorePath>): Promise<ReturnType<typeof DeveloperController.prototype.getStorePath>> => ipcRenderer.invoke('getStorePath', ...args),
  getLogs: async (...args: Parameters<typeof DeveloperController.prototype.getLogs>): Promise<ReturnType<typeof DeveloperController.prototype.getLogs>> => ipcRenderer.invoke('getLogs', ...args),
  clearLogs: async (...args: Parameters<typeof DeveloperController.prototype.clearLogs>): Promise<ReturnType<typeof DeveloperController.prototype.clearLogs>> => ipcRenderer.invoke('clearLogs', ...args),

  // ElectronController
  getVersions: async (...args: Parameters<typeof ElectronController.prototype.getVersions>): Promise<ReturnType<typeof ElectronController.prototype.getVersions>> => ipcRenderer.invoke('getVersions', ...args),
  getAppVersion: async (...args: Parameters<typeof ElectronController.prototype.getAppVersion>): Promise<ReturnType<typeof ElectronController.prototype.getAppVersion>> => ipcRenderer.invoke('getAppVersion', ...args),
  appControl: (...args: Parameters<typeof ElectronController.prototype.appControl>): void => ipcRenderer.send('appControl', ...args),
  relaunch: (...args: Parameters<typeof ElectronController.prototype.relaunch>): void => ipcRenderer.send('relaunch', ...args),
  getCurrentI18nextResource: async (...args: Parameters<typeof ElectronController.prototype.getCurrentI18nextResource>): Promise<ReturnType<typeof ElectronController.prototype.getCurrentI18nextResource>> => ipcRenderer.invoke('getCurrentI18nextResource', ...args),
  getLanguageOptions: async (...args: Parameters<typeof ElectronController.prototype.getLanguageOptions>): Promise<ReturnType<typeof ElectronController.prototype.getLanguageOptions>> => ipcRenderer.invoke('getLanguageOptions', ...args),

  // UpdateController
  getUpdateStatus: async (...args: Parameters<typeof UpdateController.prototype.getUpdateStatus>): Promise<ReturnType<typeof UpdateController.prototype.getUpdateStatus>> => ipcRenderer.invoke('getUpdateStatus', ...args),
  checkForUpdate: async (...args: Parameters<typeof UpdateController.prototype.checkForUpdate>): Promise<ReturnType<typeof UpdateController.prototype.checkForUpdate>> => ipcRenderer.invoke('checkForUpdate', ...args),
  quitAndInstall: (...args: Parameters<typeof UpdateController.prototype.quitAndInstall>): void => ipcRenderer.send('quitAndInstall', ...args),
};
