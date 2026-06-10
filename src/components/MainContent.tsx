import { useState } from 'react'
import { Version } from '../types'
import InstalledView from './InstalledView'

interface MainContentProps {
  selectedVersion: Version | null
  onVersionUpdate: () => void
}

export default function MainContent({
  selectedVersion,
  onVersionUpdate
}: MainContentProps) {
  const [consoleLogs, setConsoleLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setConsoleLogs(prev => [...prev, `[${timestamp}] ${message}`])
  }

  return (
    <main style={{ 
      flex: 1, 
      display: 'flex', 
      flexDirection: 'column', 
      backgroundColor: 'var(--viso-bg-primary)',
      height: '100vh',
      overflow: 'hidden'
    }}>
      {/* Main Content Area */}
      <div style={{ 
        flex: 1, 
        overflowY: 'auto',
        padding: '32px'
      }}>
        <InstalledView
          selectedVersion={selectedVersion}
          onVersionUpdate={onVersionUpdate}
          onLog={addLog}
        />
      </div>

      {/* Console */}
      {consoleLogs.length > 0 && (
        <div style={{ 
          height: '200px', 
          backgroundColor: 'var(--viso-bg-secondary)', 
          borderTop: '1px solid var(--glass-border)',
          padding: '16px',
          overflowY: 'auto',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px) saturate(180%)'
        }}>
          <h3 style={{ 
            fontSize: '12px', 
            fontWeight: '600', 
            color: 'var(--viso-text-muted)', 
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '12px'
          }}>
            Console
          </h3>
          <div style={{ 
            fontFamily: 'monospace', 
            fontSize: '12px', 
            color: 'var(--viso-text-primary)',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            {consoleLogs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </div>
        </div>
      )}
    </main>
  )
}
