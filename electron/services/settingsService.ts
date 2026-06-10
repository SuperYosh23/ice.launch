import Store from 'electron-store';
import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

export interface Settings {
  theme: 'dark' | 'light';
  accentColor: 'blue' | 'green' | 'darkBlue' | 'red';
  osuWinePath: string;
}

export class SettingsService {
  private store: Store<Settings>;
  
  constructor() {
    this.store = new Store<Settings>({
      defaults: {
        theme: 'dark',
        accentColor: 'blue',
        osuWinePath: ''
      }
    });
    
    // Auto-detect osu-wine if not configured (disabled due to crash)
    // this.autoDetectOsuWine();
  }
  
  private autoDetectOsuWine(): void {
    const currentPath = this.getOsuWinePath();
    if (currentPath && fs.existsSync(currentPath)) {
      return; // Already configured and exists
    }
    
    // Try to find osu-wine in common locations
    const commonPaths = [
      '/usr/local/bin/osu-wine',
      '/usr/bin/osu-wine',
      '/home/linuxbrew/.linuxbrew/bin/osu-wine',
      path.join(process.env.HOME || '', '.local/bin/osu-wine'),
      path.join(process.env.HOME || '', 'bin/osu-wine')
    ];
    
    for (const checkPath of commonPaths) {
      if (fs.existsSync(checkPath)) {
        this.setOsuWinePath(checkPath);
        console.log(`Auto-detected osu-wine at: ${checkPath}`);
        return;
      }
    }
    
    // Try using 'which' command to find osu-wine in PATH
    try {
      const whichPath = execSync('which osu-wine', { encoding: 'utf-8' }).trim();
      if (whichPath && fs.existsSync(whichPath)) {
        this.setOsuWinePath(whichPath);
        console.log(`Auto-detected osu-wine via which at: ${whichPath}`);
      }
    } catch (error) {
      // osu-wine not found in PATH
      console.log('osu-wine not found in system PATH');
    }
  }
  
  getSettings(): Settings {
    return this.store.store;
  }
  
  setSettings(settings: Partial<Settings>): void {
    this.store.set(settings as any);
  }
  
  getTheme(): 'dark' | 'light' {
    return this.store.get('theme', 'dark');
  }
  
  setTheme(theme: 'dark' | 'light'): void {
    this.store.set('theme', theme);
  }
  
  getAccentColor(): Settings['accentColor'] {
    return this.store.get('accentColor', 'blue');
  }
  
  setAccentColor(color: Settings['accentColor']): void {
    this.store.set('accentColor', color);
  }
  
  getOsuWinePath(): string {
    return this.store.get('osuWinePath', '');
  }
  
  setOsuWinePath(path: string): void {
    this.store.set('osuWinePath', path);
  }
}
