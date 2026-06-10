import { spawn, ChildProcess } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { SettingsService } from './settingsService';
import { InstalledVersion } from './versionService';

export class LaunchService {
  private settingsService: SettingsService;
  private activeProcesses: Map<string, ChildProcess> = new Map();
  
  constructor(settingsService: SettingsService) {
    this.settingsService = settingsService;
  }
  
  async launchVersion(version: InstalledVersion): Promise<boolean> {
    const osuWinePath = 'osu-wine';

    console.log('Launching version:', version.name);
    console.log('osu-wine path:', osuWinePath);
    console.log('Version path:', version.path);

    if (!fs.existsSync(version.path)) {
      throw new Error(`Version directory not found: ${version.path}`);
    }

    try {
      const args = ['--wine'];

      // Add custom launch arguments if specified
      if (version.launchArgs && version.launchArgs.length > 0) {
        args.push(...version.launchArgs);
      }

      // Add the version path with osu!.exe
      args.push(path.join(version.path, 'osu!.exe'));

      console.log('Launch command:', osuWinePath, args.join(' '));

      const process = spawn(osuWinePath, args, {
        detached: true,
        stdio: 'ignore'
      });

      this.activeProcesses.set(version.id, process);

      process.on('error', (err) => {
        console.error('Failed to start process:', err);
      });

      process.unref();

      console.log('Process started successfully');
      return true;
    } catch (error) {
      console.error('Error launching version:', error);
      throw error;
    }
  }
  
  async installOsuWine(): Promise<void> {
    // TODO: Implement actual osu-wine installation
    // This would typically involve:
    // 1. Cloning the osu-wine repository
    // 2. Running the installation script
    // 3. Setting the path in settings
    
    console.log('osu-wine installation not yet implemented');
  }
  
  terminateProcess(versionId: string): void {
    const process = this.activeProcesses.get(versionId);
    if (process) {
      process.kill();
      this.activeProcesses.delete(versionId);
    }
  }
}
