import { useState } from 'react'
import { Version } from '../types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGamepad, faTrash, faSave, faFolderOpen, faEdit } from '@fortawesome/free-solid-svg-icons'

interface InstalledViewProps {
  selectedVersion: Version | null
  onVersionUpdate: () => void
  onLog: (message: string) => void
}

export default function InstalledView({
  selectedVersion,
  onVersionUpdate,
  onLog
}: InstalledViewProps) {
  const [isLaunching, setIsLaunching] = useState(false)
  const [customName, setCustomName] = useState(selectedVersion?.customName || '')
  const [launchArgs, setLaunchArgs] = useState(selectedVersion?.launchArgs?.join(' ') || '')
  const [showSettings, setShowSettings] = useState(false)

  const handleLaunch = async () => {
    if (!selectedVersion) return
    setIsLaunching(true)
    onLog(`Launching ${selectedVersion.name}...`)
    
    try {
      const args = launchArgs.split(' ').filter(arg => arg.length > 0)
      const result = await window.electronAPI.launchVersion(selectedVersion.id, args)
      if (result.success) {
        onLog('Game launched successfully!')
      } else {
        onLog('Failed to launch game')
      }
    } catch (error) {
      onLog(`Error launching game: ${error}`)
    } finally {
      setIsLaunching(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedVersion) return
    if (!confirm(`Are you sure you want to delete ${selectedVersion.name}?`)) return
    
    onLog(`Deleting ${selectedVersion.name}...`)
    try {
      const result = await window.electronAPI.deleteVersion(selectedVersion.id)
      if (result.success) {
        onLog('Version deleted successfully')
        onVersionUpdate()
      } else {
        onLog('Failed to delete version')
      }
    } catch (error) {
      onLog(`Error deleting version: ${error}`)
    }
  }

  const handleSaveSettings = async () => {
    if (!selectedVersion) return
    onLog('Saving version settings...')
    
    try {
      const args = launchArgs.split(' ').filter(arg => arg.length > 0)
      const result = await window.electronAPI.updateVersionSettings(selectedVersion.id, {
        customName: customName || undefined,
        launchArgs: args.length > 0 ? args : undefined
      })
      
      if (result.success) {
        onLog('Settings saved successfully')
        onVersionUpdate()
        setShowSettings(false)
      } else {
        onLog(`Failed to save settings: ${result.error}`)
      }
    } catch (error) {
      onLog(`Error saving settings: ${error}`)
    }
  }

  if (!selectedVersion) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        height: '100%'
      }}>
        <div style={{ 
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid var(--glass-border)',
          borderRadius: '12px',
          padding: '32px',
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <h2 style={{ 
            fontSize: '24px', 
            fontWeight: '700', 
            color: 'var(--viso-text-primary)', 
            marginBottom: '8px'
          }}>
            Select a Version
          </h2>
          <p style={{ fontSize: '14px', color: 'var(--viso-text-secondary)' }}>
            Choose a version from the sidebar or download a new one to get started.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Instance Header */}
      <div style={{ 
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h2 style={{ 
          fontSize: '32px', 
          fontWeight: '700', 
          color: 'var(--viso-text-primary)', 
          letterSpacing: '-0.025em',
          margin: 0
        }}>
          {selectedVersion.customName || selectedVersion.name}
        </h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
              border: '2px solid var(--glass-border)',
              background: 'linear-gradient(145deg, var(--viso-bg-tertiary), var(--viso-bg-secondary))',
              color: 'var(--viso-text-primary)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--viso-accent)'
              e.currentTarget.style.color = 'var(--viso-accent)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--glass-border)'
              e.currentTarget.style.color = 'var(--viso-text-primary)'
            }}
            title="Open Folder"
          >
            <FontAwesomeIcon icon={faFolderOpen} />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
              border: '2px solid var(--glass-border)',
              background: 'linear-gradient(145deg, var(--viso-bg-tertiary), var(--viso-bg-secondary))',
              color: 'var(--viso-text-primary)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--viso-accent)'
              e.currentTarget.style.color = 'var(--viso-accent)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--glass-border)'
              e.currentTarget.style.color = 'var(--viso-text-primary)'
            }}
            title="Settings"
          >
            <FontAwesomeIcon icon={faEdit} />
          </button>
        </div>
      </div>

      {/* Instance Settings */}
      <div style={{ 
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid var(--glass-border)',
        borderRadius: '12px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <label style={{ 
              fontSize: '12px', 
              fontWeight: '600', 
              color: 'var(--viso-text-muted)', 
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '8px',
              display: 'block'
            }}>
              Version
            </label>
            <p style={{ fontSize: '16px', color: 'var(--viso-text-primary)', margin: 0 }}>
              {selectedVersion.version}
            </p>
          </div>

          <div>
            <label style={{ 
              fontSize: '12px', 
              fontWeight: '600', 
              color: 'var(--viso-text-muted)', 
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '8px',
              display: 'block'
            }}>
              Path
            </label>
            <p style={{ 
              fontSize: '14px', 
              color: 'var(--viso-text-primary)',
              margin: 0,
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap' 
            }}>
              {selectedVersion.path}
            </p>
          </div>

          <div>
            <label style={{ 
              fontSize: '12px', 
              fontWeight: '600', 
              color: 'var(--viso-text-muted)', 
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '8px',
              display: 'block'
            }}>
              Description
            </label>
            <p style={{ fontSize: '16px', color: 'var(--viso-text-primary)', margin: 0 }}>
              {selectedVersion.description}
            </p>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div style={{ 
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid var(--glass-border)',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: '700', 
            color: 'var(--viso-text-primary)', 
            marginBottom: '20px',
            letterSpacing: '-0.025em'
          }}>
            Settings
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ 
                fontSize: '12px', 
                fontWeight: '600', 
                color: 'var(--viso-text-muted)', 
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '8px',
                display: 'block'
              }}>
                Custom Name
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '2px solid var(--glass-border)',
                  borderRadius: '8px',
                  color: 'var(--viso-text-primary)',
                  fontSize: '14px',
                  transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                placeholder="Enter custom name"
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--viso-accent)'
                  e.currentTarget.style.boxShadow = '0 0 0 3px var(--viso-accent-glow)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--glass-border)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>
            <div>
              <label style={{ 
                fontSize: '12px', 
                fontWeight: '600', 
                color: 'var(--viso-text-muted)', 
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '8px',
                display: 'block'
              }}>
                Launch Arguments
              </label>
              <input
                type="text"
                value={launchArgs}
                onChange={(e) => setLaunchArgs(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '2px solid var(--glass-border)',
                  borderRadius: '8px',
                  color: 'var(--viso-text-primary)',
                  fontSize: '14px',
                  transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)'
                }}
                placeholder="Enter launch arguments"
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = 'var(--viso-accent)'
                  e.currentTarget.style.boxShadow = '0 0 0 3px var(--viso-accent-glow)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'var(--glass-border)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>
            <button
              onClick={handleSaveSettings}
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
              <FontAwesomeIcon icon={faSave} /> Save Settings
            </button>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <button
          onClick={handleLaunch}
          disabled={isLaunching}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '16px 24px',
            fontSize: '16px',
            fontWeight: '700',
            borderRadius: '8px',
            cursor: isLaunching ? 'not-allowed' : 'pointer',
            transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
            border: '2px solid transparent',
            background: 'linear-gradient(145deg, var(--viso-accent-dim), var(--viso-accent))',
            color: 'var(--viso-bg-primary)',
            boxShadow: 'var(--shadow-sm)',
            opacity: isLaunching ? 0.5 : 1
          }}
          onMouseEnter={(e) => {
            if (!isLaunching) {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = 'var(--shadow-md), var(--shadow-glow)'
            }
          }}
          onMouseLeave={(e) => {
            if (!isLaunching) {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
            }
          }}
        >
          {isLaunching ? 'Launching...' : <><FontAwesomeIcon icon={faGamepad} /> Launch</>}
        </button>

        <button
          onClick={handleDelete}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            padding: '16px 24px',
            fontSize: '16px',
            fontWeight: '600',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
            border: '2px solid var(--glass-border)',
            background: 'linear-gradient(145deg, var(--viso-bg-tertiary), var(--viso-bg-secondary))',
            color: 'var(--viso-text-primary)',
            boxShadow: 'var(--shadow-sm)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--viso-red)'
            e.currentTarget.style.color = 'var(--viso-red)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--glass-border)'
            e.currentTarget.style.color = 'var(--viso-text-primary)'
          }}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </div>
  )
}
