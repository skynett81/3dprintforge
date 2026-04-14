/**
 * Preload script — exposes a safe API to the renderer (web UI).
 * Uses contextBridge to keep contextIsolation enabled.
 */

const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Native notifications
  showNotification: (options) => ipcRenderer.invoke('notification:show', options),

  // App info
  getInfo: () => ipcRenderer.invoke('app:get-info'),

  // Auto-launch
  setAutoLaunch: (enabled) => ipcRenderer.invoke('app:set-auto-launch', enabled),
  getAutoLaunch: () => ipcRenderer.invoke('app:get-auto-launch'),

  // Updater
  checkForUpdates: () => ipcRenderer.invoke('updater:check'),
  getUpdateStatus: () => ipcRenderer.invoke('updater:status'),

  // Flag so the web app knows it's running inside Electron
  isElectron: true,
  platform: process.platform,
});
