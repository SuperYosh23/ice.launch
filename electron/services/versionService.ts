import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as https from 'https';
import * as http from 'http';
import AdmZip from 'adm-zip';
import { TitanicVersion } from './apiService';
import { EventEmitter } from 'events';

export interface InstalledVersion {
  id: string;
  name: string;
  customName?: string;
  version: string;
  description: string;
  size: number;
  path: string;
  launchArgs?: string[];
  installed: boolean;
  screenshots?: string[];
}

export class VersionService extends EventEmitter {
  private versionsPath: string;
  private installedVersions: Map<string, InstalledVersion> = new Map();
  
  constructor() {
    super();
    this.versionsPath = path.join(os.homedir(), '.iceberg', 'versions');
    this.ensureVersionsDirectory();
    this.loadInstalledVersions();
  }
  
  private ensureVersionsDirectory(): void {
    if (!fs.existsSync(this.versionsPath)) {
      fs.mkdirSync(this.versionsPath, { recursive: true });
    }
  }
  
  private loadInstalledVersions(): void {
    try {
      const versionsFile = path.join(this.versionsPath, 'versions.json');
      if (fs.existsSync(versionsFile)) {
        const data = fs.readFileSync(versionsFile, 'utf-8');
        const versions: InstalledVersion[] = JSON.parse(data);
        versions.forEach(v => this.installedVersions.set(v.id, v));
      }
    } catch (error) {
      console.error('Error loading installed versions:', error);
    }
  }
  
  private saveInstalledVersions(): void {
    try {
      const versionsFile = path.join(this.versionsPath, 'versions.json');
      const versions = Array.from(this.installedVersions.values());
      fs.writeFileSync(versionsFile, JSON.stringify(versions, null, 2));
    } catch (error) {
      console.error('Error saving installed versions:', error);
    }
  }
  
  getInstalledVersions(): InstalledVersion[] {
    return Array.from(this.installedVersions.values());
  }
  
  async downloadVersion(version: TitanicVersion): Promise<void> {
    const versionPath = path.join(this.versionsPath, version.id);
    const zipPath = path.join(this.versionsPath, `${version.id}.zip`);
    
    try {
      this.emit('download-progress', { versionId: version.id, progress: 0, status: 'downloading' });
      
      // Download the file using native https/http
      const url = new URL(version.downloadUrl);
      const protocol = url.protocol === 'https:' ? https : http;
      
      return new Promise<void>((resolve, reject) => {
        protocol.get(version.downloadUrl, (res) => {
          const contentLength = res.headers['content-length'];
          const totalLength = contentLength ? parseInt(contentLength, 10) : 0;
          let downloadedLength = 0;
          
          const writer = fs.createWriteStream(zipPath);
          
          res.on('data', (chunk: Buffer) => {
            downloadedLength += chunk.length;
            const progress = Math.round((downloadedLength / totalLength) * 100);
            this.emit('download-progress', { versionId: version.id, progress, status: 'downloading' });
          });
          
          res.pipe(writer);
          
          writer.on('finish', () => {
            this.emit('download-progress', { versionId: version.id, progress: 100, status: 'extracting' });
            
            // Extract the zip
            const zip = new AdmZip(zipPath);
            zip.extractAllTo(versionPath, true);
            
            // Clean up zip file
            fs.unlinkSync(zipPath);
            
            // Add to installed versions
            const installedVersion: InstalledVersion = {
              ...version,
              path: versionPath,
              installed: true
            };
            
            this.installedVersions.set(version.id, installedVersion);
            this.saveInstalledVersions();
            
            this.emit('download-progress', { versionId: version.id, progress: 100, status: 'complete' });
            resolve();
          });
          
          writer.on('error', (error) => {
            this.emit('download-progress', { versionId: version.id, progress: 0, status: 'error' });
            reject(error);
          });
        }).on('error', (error) => {
          this.emit('download-progress', { versionId: version.id, progress: 0, status: 'error' });
          reject(error);
        });
      });
    } catch (error) {
      this.emit('download-progress', { versionId: version.id, progress: 0, status: 'error' });
      throw error;
    }
  }
  
  deleteVersion(versionId: string): void {
    const version = this.installedVersions.get(versionId);
    if (version) {
      // Delete the version directory
      if (fs.existsSync(version.path)) {
        fs.rmSync(version.path, { recursive: true, force: true });
      }
      
      // Remove from installed versions
      this.installedVersions.delete(versionId);
      this.saveInstalledVersions();
    }
  }
  
  updateVersionSettings(versionId: string, settings: { customName?: string; launchArgs?: string[] }): void {
    const version = this.installedVersions.get(versionId);
    if (version) {
      if (settings.customName !== undefined) {
        version.customName = settings.customName;
      }
      if (settings.launchArgs !== undefined) {
        version.launchArgs = settings.launchArgs;
      }
      this.saveInstalledVersions();
    }
  }
  
  getVersionSize(versionId: string): number {
    const version = this.installedVersions.get(versionId);
    if (version && fs.existsSync(version.path)) {
      return this.getDirectorySize(version.path);
    }
    return 0;
  }
  
  private getDirectorySize(dirPath: string): number {
    let totalSize = 0;
    const files = fs.readdirSync(dirPath);
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isDirectory()) {
        totalSize += this.getDirectorySize(filePath);
      } else {
        totalSize += stats.size;
      }
    }
    
    return totalSize;
  }

  async importClient(filePath: string): Promise<void> {
    try {
      // Generate a version ID from the filename
      const fileName = path.basename(filePath, path.extname(filePath));
      const versionId = `imported-${fileName}-${Date.now()}`;
      const versionPath = path.join(this.versionsPath, versionId);

      this.emit('download-progress', { versionId, progress: 0, status: 'extracting' });

      // Extract the zip file
      const zip = new AdmZip(filePath);
      zip.extractAllTo(versionPath, true);

      // Get the size of the extracted directory
      const size = this.getDirectorySize(versionPath);

      // Create an installed version entry
      const installedVersion: InstalledVersion = {
        id: versionId,
        name: fileName,
        version: fileName,
        description: 'Imported client',
        size,
        path: versionPath,
        installed: true
      };

      this.installedVersions.set(versionId, installedVersion);
      this.saveInstalledVersions();

      this.emit('download-progress', { versionId, progress: 100, status: 'complete' });
    } catch (error) {
      this.emit('download-progress', { versionId: 'import', progress: 0, status: 'error' });
      throw error;
    }
  }
}
