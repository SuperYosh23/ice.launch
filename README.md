# ice.launch (Electron Rewrite)

A modern Electron-based launcher for Titanic osu! versions on Linux. This is a full rewrite of the original Python/CustomTkinter launcher, rebuilt with modern web technologies for better performance and maintainability.

## Features

### Core Functionality
- **Modern UI**: Clean, professional interface using React + TailwindCSS with dark/light mode support
- **API-Based Version Fetching**: Uses official Titanic API to find available versions
- **Smart Download**: Downloads and extracts game versions with progress tracking
- **Version Management**: Install, launch, and delete different versions
- **Progress Tracking**: Shows download and extraction progress with visual feedback
- **Size Display**: Shows installed version sizes in human-readable format
- **Linux Support**: Launches games using osu-wine --wine command

### Advanced Features
- **Per-Version Configuration**: Custom names and launch arguments for each version
- **Theme Customization**: Dark/light mode with accent color options (blue, green, dark-blue, red)
- **Download Preview**: View version descriptions before downloading
- **osu-wine Auto-Install**: One-click osu-wine installation with progress tracking
- **Persistent Settings**: All configurations saved automatically using electron-store
- **Console Logging**: Built-in console output for debugging and progress tracking

## Tech Stack

- **Electron**: Desktop application framework
- **React**: UI library
- **TypeScript**: Type-safe JavaScript
- **TailwindCSS**: Utility-first CSS framework
- **Vite**: Fast build tool
- **electron-store**: Persistent settings storage
- **axios**: HTTP client for API calls
- **adm-zip**: ZIP file extraction

## Requirements

- Node.js 18+ 
- npm or yarn
- Linux operating system
- osu-wine (can be installed through the launcher)

## Installation

1. Clone or download this repository:
```bash
git clone https://github.com/SuperYosh23/ice.launch.git
cd ice.launch
```

2. Install dependencies:
```bash
npm install
```

3. Run the launcher in development mode:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Usage

### Basic Workflow

1. **Install osu-wine** (if not already installed):
   - Click "⚙️ Options" in the sidebar
   - Click "📥 Download osu-wine" in the Tools section
   - Follow the installation prompts

2. **Download Clients**:
   - Click "📥 Download Clients" in the sidebar
   - Click "Load Available Versions" to fetch from Titanic API
   - Browse available versions with descriptions
   - Click "📥 Download" to install desired versions

3. **Configure Versions**:
   - Select an installed version from the sidebar
   - Expand "Version Settings" section
   - Set custom names and launch arguments
   - Click "💾 Save Settings"

4. **Launch Games**:
   - Select an installed version from the sidebar
   - Click "🎮 LAUNCH GAME" button
   - Game launches with your custom configuration

### Customization Options

- **Theme**: Switch between dark and light modes
- **Accent Colors**: Choose from blue, green, dark-blue, or red themes
- **Custom Names**: Rename versions for better organization
- **Launch Arguments**: Add custom arguments for each version

## Project Structure

```
ice.launch/
├── electron/
│   ├── main.ts              # Electron main process
│   ├── preload.ts           # Preload script for IPC
│   ├── services/
│   │   ├── apiService.ts    # Titanic API integration
│   │   ├── versionService.ts # Version management
│   │   ├── settingsService.ts # Settings persistence
│   │   └── launchService.ts  # Game launching
│   └── tsconfig.json
├── src/
│   ├── components/
│   │   ├── Sidebar.tsx      # Navigation sidebar
│   │   ├── MainContent.tsx  # Main content area
│   │   ├── InstalledView.tsx # Installed versions view
│   │   ├── DownloadView.tsx  # Download view
│   │   └── OptionsView.tsx   # Settings view
│   ├── App.tsx              # Main React component
│   ├── main.tsx             # React entry point
│   ├── types.ts             # TypeScript types
│   ├── global.d.ts          # Global type definitions
│   └── index.css            # Global styles
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

## Configuration

Settings are stored in `~/.config/iceberg/config.json` (Linux) and include:
- Theme preference (dark/light)
- Accent color selection
- osu-wine path
- Version-specific settings (custom names, launch arguments)

Installed versions are stored in `~/.iceberg/versions/` with metadata in `versions.json`.

## Development

### Running in Development Mode
```bash
npm run dev
```
This starts both the Vite dev server (port 5173) and Electron with hot reload.

### Building for Production
```bash
npm run build
```
This builds the React app and compiles the Electron TypeScript code.

### Adding New Features

1. **Backend (Electron)**: Add new IPC handlers in `electron/main.ts`
2. **Services**: Add new service methods in `electron/services/`
3. **Frontend**: Add new components in `src/components/`
4. **Types**: Update types in `src/types.ts` and `src/global.d.ts`

## Troubleshooting

### Common Issues

- **osu-wine not found**: Make sure osu-wine is installed and the path is configured in Options
- **Download fails**: Check your internet connection and Titanic API availability
- **Game won't launch**: Verify osu-wine installation and version path

### Debug Information

The console panel at the bottom of the application shows detailed logs for:
- API requests
- Download progress
- Installation steps
- Launch attempts
- Error messages

## Differences from Original Python Version

This Electron rewrite offers several improvements over the original Python/CustomTkinter version:

1. **Better Performance**: Electron and React provide smoother UI interactions
2. **Modern Stack**: Uses current web technologies with better tooling
3. **Type Safety**: TypeScript prevents many runtime errors
4. **Easier Maintenance**: Web technologies have larger community support
5. **Cross-platform Potential**: Can be adapted for Windows/macOS more easily
6. **Better Developer Experience**: Hot reload, modern debugging tools

## License

MIT License - See LICENSE file for details

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Acknowledgments

- Original launcher by SuperYosh23
- Titanic osu! project for providing the API
- osu-wine for Linux osu! support
