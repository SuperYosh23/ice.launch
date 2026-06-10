import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electronAPI', {
  getVersions: () => ipcRenderer.invoke('get-versions'),
  getAvailableVersions: () => ipcRenderer.invoke('get-available-versions'),
  downloadVersion: (versionId: string) => ipcRenderer.invoke('download-version', versionId),
  launchVersion: (versionId: string, args: string[]) => ipcRenderer.invoke('launch-version', versionId, args),
  deleteVersion: (versionId: string) => ipcRenderer.invoke('delete-version', versionId),
  updateVersionSettings: (versionId: string, settings: { customName?: string; launchArgs?: string[] }) => 
    ipcRenderer.invoke('update-version-settings', versionId, settings),
  saveSettings: (settings: any) => ipcRenderer.invoke('save-settings', settings),
  getSettings: () => ipcRenderer.invoke('get-settings'),
  installOsuWine: () => ipcRenderer.invoke('install-osu-wine'),
  openExternal: (url: string) => ipcRenderer.invoke('open-external', url),
  selectClientFile: () => ipcRenderer.invoke('select-client-file'),
  importClient: (filePath: string) => ipcRenderer.invoke('import-client', filePath),
  onDownloadProgress: (callback: (data: { versionId: string; progress: number; status: string }) => void) => {
    ipcRenderer.on('download-progress', (_, data) => callback(data));
  }
});
