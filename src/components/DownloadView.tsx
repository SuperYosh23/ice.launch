import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faSpinner } from '@fortawesome/free-solid-svg-icons'

interface DownloadViewProps {
  onVersionUpdate: () => void
  onLog: (message: string) => void
}

interface AvailableVersion {
  id: string
  name: string
  version: string
  description: string
  size: number
  screenshots: string[]
}

export default function DownloadView({ onVersionUpdate, onLog }: DownloadViewProps) {
  const [availableVersions, setAvailableVersions] = useState<AvailableVersion[]>([])
  const [selectedVersion, setSelectedVersion] = useState<AvailableVersion | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`
  }

  const loadAvailableVersions = async () => {
    setIsLoading(true)
    onLog('Fetching available versions from Titanic API...')
    
    try {
      const versions = await window.electronAPI.getAvailableVersions()
      setAvailableVersions(versions)
      onLog(`Found ${versions.length} available versions`)
    } catch (error) {
      onLog(`Error fetching versions: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Auto-load versions when component mounts
  useEffect(() => {
    loadAvailableVersions()
  }, [])

  const handleDownload = async () => {
    if (!selectedVersion) return
    
    setIsDownloading(true)
    setDownloadProgress(0)
    onLog(`Starting download of ${selectedVersion.name}...`)
    
    // Set up progress listener
    window.electronAPI.onDownloadProgress((data) => {
      if (data.versionId === selectedVersion.id) {
        setDownloadProgress(data.progress)
        onLog(`Download progress: ${data.progress}% - ${data.status}`)
      }
    })
    
    try {
      const result = await window.electronAPI.downloadVersion(selectedVersion.id)
      
      if (result.success) {
        onLog('Download completed successfully!')
        onVersionUpdate()
      } else {
        onLog(`Download failed: ${result.error}`)
      }
    } catch (error) {
      onLog(`Error downloading version: ${error}`)
    } finally {
      setIsDownloading(false)
      setDownloadProgress(0)
    }
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ 
        fontSize: '32px', 
        fontWeight: '700', 
        color: 'var(--viso-text-primary)', 
        marginBottom: '24px',
        letterSpacing: '-0.025em'
      }}>
        Download Clients
      </h2>

      {isLoading && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          padding: '64px 0'
        }}>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: '16px' 
          }}>
            <div style={{ fontSize: '40px', color: 'var(--viso-accent)' }}>
              <FontAwesomeIcon icon={faSpinner} spin />
            </div>
            <p style={{ fontSize: '16px', color: 'var(--viso-text-secondary)' }}>
              Loading available versions...
            </p>
          </div>
        </div>
      )}

      {/* Version List */}
      {availableVersions.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {availableVersions.map((version) => (
            <div
              key={version.id}
              style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(20px) saturate(180%)',
                border: selectedVersion?.id === version.id 
                  ? '2px solid var(--viso-accent)' 
                  : '1px solid var(--glass-border)',
                borderRadius: '12px',
                padding: '24px',
                cursor: 'pointer',
                transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: 'var(--shadow-sm)'
              }}
              onClick={() => setSelectedVersion(version)}
              onMouseEnter={(e) => {
                if (selectedVersion?.id !== version.id) {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                  e.currentTarget.style.borderColor = 'var(--viso-accent)'
                }
              }}
              onMouseLeave={(e) => {
                if (selectedVersion?.id !== version.id) {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                  e.currentTarget.style.borderColor = 'var(--glass-border)'
                }
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '12px' 
              }}>
                <div>
                  <h3 style={{ 
                    fontSize: '24px', 
                    fontWeight: '700', 
                    color: 'var(--viso-text-primary)',
                    marginBottom: '4px',
                    letterSpacing: '-0.025em'
                  }}>
                    {version.name}
                  </h3>
                  <p style={{ fontSize: '16px', color: 'var(--viso-text-secondary)' }}>
                    {version.version}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ 
                    fontSize: '16px', 
                    fontWeight: '600', 
                    color: 'var(--viso-text-primary)' 
                  }}>
                    {formatSize(version.size)}
                  </p>
                </div>
              </div>
              <p style={{ 
                fontSize: '16px', 
                color: 'var(--viso-text-primary)', 
                marginBottom: '16px',
                lineHeight: '1.5'
              }}>
                {version.description}
              </p>
              
              {selectedVersion?.id === version.id && (
                <div style={{ 
                  paddingTop: '16px', 
                  borderTop: '1px solid var(--glass-border)' 
                }}>
                  {isDownloading ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        fontSize: '14px', 
                        color: 'var(--viso-text-secondary)' 
                      }}>
                        <span>Downloading...</span>
                        <span>{downloadProgress}%</span>
                      </div>
                      <div style={{ 
                        width: '100%', 
                        height: '8px', 
                        backgroundColor: 'var(--viso-bg-tertiary)', 
                        borderRadius: '9999px',
                        overflow: 'hidden'
                      }}>
                        <div
                          style={{
                            height: '100%',
                            background: 'linear-gradient(90deg, var(--viso-accent-dim), var(--viso-accent))',
                            borderRadius: '9999px',
                            transition: 'width 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                            boxShadow: '0 0 10px var(--viso-accent-glow)',
                            width: `${downloadProgress}%`
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDownload()
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        padding: '16px 24px',
                        fontSize: '16px',
                        fontWeight: '700',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                        border: '2px solid transparent',
                        background: 'linear-gradient(145deg, var(--viso-accent-dim), var(--viso-accent))',
                        color: 'var(--viso-bg-primary)',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)'
                        e.currentTarget.style.boxShadow = 'var(--shadow-md), var(--shadow-glow)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                      }}
                    >
                      <FontAwesomeIcon icon={faDownload} /> Download
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
