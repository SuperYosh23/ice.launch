import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'
import Modal from './components/Modal'
import DownloadView from './components/DownloadView'
import OptionsView from './components/OptionsView'
import ProfileView from './components/ProfileView'
import { Version, Settings } from './types'

function App() {
  const [versions, setVersions] = useState<Version[]>([])
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null)
  const [settings, setSettings] = useState<Settings>({
    accentColor: 'pink',
    osuWinePath: '',
    userId: ''
  })
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  useEffect(() => {
    loadSettings()
    loadInstalledVersions()
  }, [])

  const loadSettings = async () => {
    try {
      const savedSettings = await window.electronAPI.getSettings()
      if (savedSettings) {
        setSettings(savedSettings)
        applyTheme(savedSettings.accentColor)
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }

  const loadInstalledVersions = async () => {
    try {
      const installed = await window.electronAPI.getVersions()
      setVersions(installed)
    } catch (error) {
      console.error('Failed to load versions:', error)
    }
  }

  const applyTheme = (accentColor: string) => {
    const html = document.documentElement
    
    // Apply accent color via viso.css CSS variables
    const accentColors: Record<string, { accent: string; dim: string; glow: string }> = {
      pink: { accent: '#ffa2e4', dim: '#ff80d1', glow: 'rgba(255, 162, 228, 0.4)' },
      blue: { accent: '#3b82f6', dim: '#2563eb', glow: 'rgba(59, 130, 246, 0.4)' },
      green: { accent: '#22c55e', dim: '#16a34a', glow: 'rgba(34, 197, 94, 0.4)' },
      darkBlue: { accent: '#1e3a8a', dim: '#1e40af', glow: 'rgba(30, 58, 138, 0.4)' },
      red: { accent: '#ef4444', dim: '#dc2626', glow: 'rgba(239, 68, 68, 0.4)' }
    }
    const colors = accentColors[accentColor] || accentColors.pink
    html.style.setProperty('--viso-accent', colors.accent)
    html.style.setProperty('--viso-accent-dim', colors.dim)
    html.style.setProperty('--viso-accent-glow', colors.glow)
  }

  const handleSettingsChange = async (newSettings: Settings) => {
    setSettings(newSettings)
    applyTheme(newSettings.accentColor)
    await window.electronAPI.saveSettings(newSettings)
  }

  const handleVersionSelect = (version: Version) => {
    setSelectedVersion(version)
  }

  const handleVersionUpdate = () => {
    loadInstalledVersions()
  }

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: 'var(--viso-bg-primary)', color: 'var(--viso-text-primary)' }}>
      <Sidebar
        versions={versions}
        selectedVersion={selectedVersion}
        onVersionSelect={handleVersionSelect}
        onOpenDownloadModal={() => setIsDownloadModalOpen(true)}
        onOpenSettingsModal={() => setIsSettingsModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
      />
      <MainContent
        selectedVersion={selectedVersion}
        onVersionUpdate={handleVersionUpdate}
      />
      
      {/* Profile Modal */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title="Profile"
      >
        <ProfileView
          userId={settings.userId || ''}
          onLog={(message) => console.log(message)}
        />
      </Modal>

      {/* Download Modal */}
      <Modal
        isOpen={isDownloadModalOpen}
        onClose={() => setIsDownloadModalOpen(false)}
        title="Download Clients"
      >
        <DownloadView
          onVersionUpdate={handleVersionUpdate}
          onLog={(message) => console.log(message)}
        />
      </Modal>

      {/* Settings Modal */}
      <Modal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        title="Settings"
      >
        <OptionsView
          settings={settings}
          onSettingsChange={handleSettingsChange}
          onLog={(message) => console.log(message)}
        />
      </Modal>
    </div>
  )
}

export default App
