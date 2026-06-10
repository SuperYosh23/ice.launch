export interface Version {
  id: string
  name: string
  customName?: string
  version: string
  description: string
  size: number
  path: string
  launchArgs?: string[]
  installed: boolean
  screenshots?: string[]
}

export interface Settings {
  accentColor: 'pink' | 'blue' | 'green' | 'darkBlue' | 'red'
  osuWinePath: string
  userId: string
}

export interface DownloadProgress {
  versionId: string
  progress: number
  status: 'downloading' | 'extracting' | 'complete' | 'error'
}
