import { Version } from '../types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faCog, faShip, faUser } from '@fortawesome/free-solid-svg-icons'

interface SidebarProps {
  versions: Version[]
  selectedVersion: Version | null
  onVersionSelect: (version: Version) => void
  onOpenDownloadModal: () => void
  onOpenSettingsModal: () => void
  onOpenProfileModal: () => void
}

export default function Sidebar({
  versions,
  selectedVersion,
  onVersionSelect,
  onOpenDownloadModal,
  onOpenSettingsModal,
  onOpenProfileModal
}: SidebarProps) {

  return (
    <aside style={{ 
      width: '240px',
      minWidth: '60px',
      maxWidth: '400px',
      backgroundColor: 'var(--viso-bg-secondary)', 
      borderRight: '1px solid var(--glass-border)',
      display: 'flex',
      flexDirection: 'column',
      padding: '20px',
      flexShrink: 0,
      position: 'relative'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div style={{ marginBottom: '12px' }}>
          <FontAwesomeIcon 
            icon={faShip} 
            style={{ 
              fontSize: '48px',
              color: 'white'
            }} 
          />
        </div>
        <h1 style={{ 
          fontSize: '24px', 
          fontWeight: '700', 
          color: 'var(--viso-text-primary)', 
          margin: 0,
          letterSpacing: '0.1em'
        }}>
          ice.launch
        </h1>
      </div>

      {/* Versions Section */}
      <div style={{ 
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <div style={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px',
          paddingBottom: '12px',
          borderBottom: '1px solid var(--glass-border)'
        }}>
          <span style={{ 
            fontSize: '12px', 
            fontWeight: '600', 
            color: 'var(--viso-text-muted)', 
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Versions
          </span>
        </div>
        
        <div style={{ 
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {versions.map((version) => (
            <div
              key={version.id}
              onClick={() => onVersionSelect(version)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                background: selectedVersion?.id === version.id 
                  ? 'var(--viso-bg-tertiary)' 
                  : 'transparent',
                border: selectedVersion?.id === version.id 
                  ? '1px solid var(--viso-accent)' 
                  : '1px solid transparent'
              }}
              onMouseEnter={(e) => {
                if (selectedVersion?.id !== version.id) {
                  e.currentTarget.style.background = 'var(--viso-bg-tertiary)'
                }
              }}
              onMouseLeave={(e) => {
                if (selectedVersion?.id !== version.id) {
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ 
                  fontWeight: '600', 
                  fontSize: '14px',
                  color: 'var(--viso-text-primary)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {version.customName || version.name}
                </div>
                <div style={{ 
                  fontSize: '12px', 
                  color: 'var(--viso-text-muted)' 
                }}>
                  {version.version}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        marginTop: '16px'
      }}>
        <button
          onClick={onOpenProfileModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
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
        >
          <FontAwesomeIcon icon={faUser} />
          <span>Profile</span>
        </button>

        <button
          onClick={onOpenDownloadModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
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
        >
          <FontAwesomeIcon icon={faDownload} />
          <span>Download</span>
        </button>

        <button
          onClick={onOpenSettingsModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
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
        >
          <FontAwesomeIcon icon={faCog} />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  )
}
