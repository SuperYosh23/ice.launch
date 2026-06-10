import { Settings } from '../types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPalette, faWrench, faInfoCircle, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'

interface OptionsViewProps {
  settings: Settings
  onSettingsChange: (settings: Settings) => void
  onLog: (message: string) => void
}

export default function OptionsView({ settings, onSettingsChange, onLog }: OptionsViewProps) {
  const handleAccentColorChange = (accentColor: Settings['accentColor']) => {
    onSettingsChange({ ...settings, accentColor })
    onLog(`Accent color changed to ${accentColor}`)
  }

  const handleOpenOsuWineGuide = async () => {
    await window.electronAPI.openExternal('https://github.com/NelloKudo/osu-winello/blob/main/README.md')
    onLog('Opening osu-wine installation guide...')
  }

  const accentColors: { key: Settings['accentColor']; name: string; color: string }[] = [
    { key: 'pink', name: 'Pink', color: '#ffa2e4' },
    { key: 'blue', name: 'Blue', color: '#3b82f6' },
    { key: 'green', name: 'Green', color: '#22c55e' },
    { key: 'darkBlue', name: 'Dark Blue', color: '#1e3a8a' },
    { key: 'red', name: 'Red', color: '#ef4444' }
  ]

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ 
        fontSize: '32px', 
        fontWeight: '700', 
        color: 'var(--viso-text-primary)', 
        marginBottom: '24px',
        letterSpacing: '-0.025em'
      }}>
        Settings
      </h2>
      
      {/* Appearance Section */}
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
          <FontAwesomeIcon icon={faPalette} style={{ marginRight: '12px' }} /> Appearance
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* User ID */}
          <div>
            <label style={{ 
              fontSize: '12px', 
              fontWeight: '600', 
              color: 'var(--viso-text-muted)', 
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '12px',
              display: 'block'
            }}>
              User ID
            </label>
            <input
              type="text"
              value={settings.userId || ''}
              onChange={(e) => onSettingsChange({ ...settings, userId: e.target.value })}
              placeholder="Enter your osu! user ID"
              style={{
                width: '100%',
                padding: '12px 16px',
                fontSize: '16px',
                borderRadius: '8px',
                border: '2px solid var(--glass-border)',
                background: 'var(--viso-bg-tertiary)',
                color: 'var(--viso-text-primary)',
                outline: 'none',
                transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = 'var(--viso-accent)'
                e.currentTarget.style.boxShadow = '0 0 10px var(--viso-accent-glow)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'var(--glass-border)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
            <p style={{ 
              fontSize: '12px', 
              color: 'var(--viso-text-muted)', 
              marginTop: '8px' 
            }}>
              Enter your osu! user ID to view your profile
            </p>
          </div>

          {/* Accent Color */}
          <div>
            <label style={{ 
              fontSize: '12px', 
              fontWeight: '600', 
              color: 'var(--viso-text-muted)', 
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              marginBottom: '12px',
              display: 'block'
            }}>
              Accent Color
            </label>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {accentColors.map(({ key, name, color }) => (
                <button
                  key={key}
                  onClick={() => handleAccentColorChange(key)}
                  style={{
                    flex: '1 0 calc(20% - 9.6px)',
                    padding: '16px 24px',
                    fontSize: '16px',
                    fontWeight: '600',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                    border: settings.accentColor === key ? '2px solid white' : '2px solid transparent',
                    background: color,
                    color: 'white',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                  }}
                  title={name}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tools Section */}
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
          <FontAwesomeIcon icon={faWrench} style={{ marginRight: '12px' }} /> Tools
        </h3>
        
        {/* osu-wine Installation */}
        <div>
          <label style={{ 
            fontSize: '12px', 
            fontWeight: '600', 
            color: 'var(--viso-text-muted)', 
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '12px',
            display: 'block'
          }}>
            osu-wine
          </label>
          <p style={{ 
            fontSize: '14px', 
            color: 'var(--viso-text-primary)', 
            marginBottom: '16px',
            lineHeight: '1.5'
          }}>
            osu-wine is required to launch osu! on Linux. Click the button below to view the installation guide.
          </p>
          
          <button
            onClick={handleOpenOsuWineGuide}
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
            <FontAwesomeIcon icon={faExternalLinkAlt} /> Open Installation Guide
          </button>
        </div>
      </div>

      {/* About Section */}
      <div style={{ 
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid var(--glass-border)',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <h3 style={{ 
          fontSize: '20px', 
          fontWeight: '700', 
          color: 'var(--viso-text-primary)', 
          marginBottom: '20px',
          letterSpacing: '-0.025em'
        }}>
          <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '12px' }} /> About
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--viso-text-primary)' }}>
          <p><strong>ice.launch</strong></p>
          <p>Version 1.0.0</p>
          <p>A modern Electron launcher for Titanic osu! versions</p>
          <p style={{ 
            fontSize: '12px', 
            color: 'var(--viso-text-muted)', 
            marginTop: '16px' 
          }}>
            Rewritten from the original Python/CustomTkinter version
          </p>
        </div>
      </div>
    </div>
  )
}
