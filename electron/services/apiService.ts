import * as https from 'https';

export interface TitanicVersion {
  id: string;
  name: string;
  version: string;
  description: string;
  size: number;
  downloadUrl: string;
  screenshots: string[];
  category: string;
  known_bugs: string | null;
  supported: boolean;
  preview: boolean;
  created_at: string;
}

export class ApiService {
  private static readonly TITANIC_API_URL = 'https://api.titanic.sh';
  
  static async fetchAvailableVersions(): Promise<TitanicVersion[]> {
    return new Promise((resolve, reject) => {
      https.get(`${this.TITANIC_API_URL}/releases`, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          try {
            const releases = JSON.parse(data);
            
            // Map the API response to our internal format
            const versions = releases.map((release: any) => ({
              id: release.name,
              name: release.name,
              version: release.name,
              description: release.description || 'No description available',
              size: 0, // Size will be determined during download
              downloadUrl: release.downloads[0] || '',
              screenshots: release.screenshots || [],
              category: release.category,
              known_bugs: release.known_bugs,
              supported: release.supported,
              preview: release.preview,
              created_at: release.created_at
            }));
            
            resolve(versions);
          } catch (error) {
            console.error('Error parsing versions from Titanic API:', error);
            reject(error);
          }
        });
      }).on('error', (error) => {
        console.error('Error fetching versions from Titanic API:', error);
        reject(error);
      });
    });
  }
}
