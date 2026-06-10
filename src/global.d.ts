export interface ElectronAPI {
  getVersions: () => Promise<import('./types').Version[]>
  getAvailableVersions: () => Promise<any[]>
  downloadVersion: (versionId: string) => Promise<{ success: boolean; error?: string }>
  launchVersion: (versionId: string, args: string[]) => Promise<{ success: boolean; error?: string }>
  deleteVersion: (versionId: string) => Promise<{ success: boolean; error?: string }>
  updateVersionSettings: (versionId: string, settings: { customName?: string; launchArgs?: string[] }) => Promise<{ success: boolean; error?: string }>
  saveSettings: (settings: any) => Promise<{ success: boolean; error?: string }>
  getSettings: () => Promise<any>
  installOsuWine: () => Promise<{ success: boolean; error?: string }>
  openExternal: (url: string) => Promise<{ success: boolean; error?: string }>
  onDownloadProgress: (callback: (data: { versionId: string; progress: number; status: string }) => void) => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}
