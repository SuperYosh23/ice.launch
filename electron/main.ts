import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as path from 'path';
import { ApiService } from './services/apiService';
import { VersionService, InstalledVersion } from './services/versionService';
import { SettingsService, Settings } from './services/settingsService';
import { LaunchService } from './services/launchService';
const shell = require('electron').shell;

let mainWindow: BrowserWindow | null = null;

// Initialize services
const settingsService = new SettingsService();
const versionService = new VersionService();
const launchService = new LaunchService(settingsService);

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    titleBarStyle: 'default',
    backgroundColor: '#1e1e1e'
  });

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers for version management
ipcMain.handle('get-versions', async () => {
  try {
    return versionService.getInstalledVersions();
  } catch (error) {
    console.error('Error getting versions:', error);
    return [];
  }
});

ipcMain.handle('get-available-versions', async () => {
  try {
    return await ApiService.fetchAvailableVersions();
  } catch (error) {
    console.error('Error fetching available versions:', error);
    return [];
  }
});

ipcMain.handle('download-version', async (event, versionId: string) => {
  try {
    const availableVersions = await ApiService.fetchAvailableVersions();
    const version = availableVersions.find(v => v.id === versionId);
    
    if (!version) {
      return { success: false, error: 'Version not found' };
    }
    
    // Set up progress listener
    versionService.on('download-progress', (data) => {
      if (mainWindow) {
        mainWindow.webContents.send('download-progress', data);
      }
    });
    
    await versionService.downloadVersion(version);
    return { success: true };
  } catch (error) {
    console.error('Error downloading version:', error);
    return { success: false, error: String(error) };
  }
});

ipcMain.handle('launch-version', async (event, versionId: string, args: string[]) => {
  try {
    const versions = versionService.getInstalledVersions();
    const version = versions.find(v => v.id === versionId);
    
    if (!version) {
      return { success: false, error: 'Version not found' };
    }
    
    await launchService.launchVersion(version);
    return { success: true };
  } catch (error) {
    console.error('Error launching version:', error);
    return { success: false, error: String(error) };
  }
});

ipcMain.handle('delete-version', async (event, versionId: string) => {
  try {
    versionService.deleteVersion(versionId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting version:', error);
    return { success: false, error: String(error) };
  }
});

ipcMain.handle('update-version-settings', async (event, versionId: string, settings: { customName?: string; launchArgs?: string[] }) => {
  try {
    versionService.updateVersionSettings(versionId, settings);
    return { success: true };
  } catch (error) {
    console.error('Error updating version settings:', error);
    return { success: false, error: String(error) };
  }
});

ipcMain.handle('save-settings', async (event, settings: Partial<Settings>) => {
  try {
    settingsService.setSettings(settings);
    return { success: true };
  } catch (error) {
    console.error('Error saving settings:', error);
    return { success: false, error: String(error) };
  }
});

ipcMain.handle('get-settings', async () => {
  try {
    return settingsService.getSettings();
  } catch (error) {
    console.error('Error getting settings:', error);
    return {};
  }
});

ipcMain.handle('install-osu-wine', async () => {
  try {
    await launchService.installOsuWine();
    return { success: true };
  } catch (error) {
    console.error('Error installing osu-wine:', error);
    return { success: false, error: String(error) };
  }
});

ipcMain.handle('open-external', async (event, url: string) => {
  try {
    shell.openExternal(url);
    return { success: true };
  } catch (error) {
    console.error('Error opening external URL:', error);
    return { success: false, error: String(error) };
  }
});

ipcMain.handle('select-client-file', async () => {
  try {
    const result = await dialog.showOpenDialog({
      title: 'Select Client File',
      properties: ['openFile'],
      filters: [
        { name: 'Client Files', extensions: ['zip', 'iceclient', '7z'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });

    if (result.canceled || result.filePaths.length === 0) {
      return { success: false, canceled: true };
    }

    return { success: true, filePath: result.filePaths[0] };
  } catch (error) {
    console.error('Error selecting file:', error);
    return { success: false, error: String(error) };
  }
});

ipcMain.handle('import-client', async (event, filePath: string) => {
  try {
    // Set up progress listener
    versionService.on('download-progress', (data) => {
      if (mainWindow) {
        mainWindow.webContents.send('download-progress', data);
      }
    });

    await versionService.importClient(filePath);
    return { success: true };
  } catch (error) {
    console.error('Error importing client:', error);
    return { success: false, error: String(error) };
  }
});
