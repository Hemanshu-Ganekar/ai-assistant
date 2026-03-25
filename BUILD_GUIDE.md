# AI Study Assistant - Build & Distribution Guide

## Overview

This guide explains how to build and package the AI Study Assistant for distribution to end users.

**Project Stack:**
- Frontend: React + Vite
- Desktop Framework: Electron
- AI Engine: Ollama (local, running on localhost:11434)
- Packaging: electron-builder (Windows .exe installer)

---

## Prerequisites

Before building, ensure you have:

1. **Node.js** (v16+) - [Download](https://nodejs.org)
2. **npm** (comes with Node.js)
3. **Ollama** installed and running on the target machine - [Download](https://ollama.ai)
4. **Windows** (build configured for Windows .exe)

### Verify Installation

```powershell
node --version    # Should be v16+
npm --version     # Should be v8+
ollama --version  # Should show Ollama version
```

---

## Project Structure

```
ai-assistant/
├── electron/
│   ├── main.js              # Main process (Electron)
│   ├── preload.js           # IPC bridge
│   ├── ragPipeline.js       # AI logic
│   └── ...other files
├── react-app/
│   ├── src/                 # React source
│   ├── dist/                # Built files (created on build)
│   └── vite.config.js
├── package.json             # Root config + electron-builder settings
├── BUILD_GUIDE.md           # This file
└── README.md
```

### After Building

```
ai-assistant/
├── dist-app/                # Installer output (from npm run dist)
│   ├── AI Study Assistant 1.0.0.exe
│   ├── builder-effective-config.yaml
│   └── ...
└── react-app/dist/          # Built React files
    ├── index.html
    └── assets/
```

---

## Build Steps

### Step 1: Install Dependencies

Run this once in the project root:

```powershell
npm install
npm --prefix react-app install
```

### Step 2: Build for Development (Testing)

To test the app locally before packaging:

```powershell
# Terminal 1: Start Ollama
ollama serve

# Terminal 2: Run dev server
npm run electron
```

**What happens:**
- Vite dev server starts on `http://localhost:5173`
- Electron window opens and loads from localhost
- You can edit React code and see hot-reload
- DevTools are open for debugging

### Step 3: Build for Production

Build the final installer:

```powershell
npm run dist
```

**What happens:**
1. `npm run build` - Builds React app (Vite) to `react-app/dist/`
2. `electron-builder` - Packages Electron app
3. Creates `.exe` installer in `dist-app/` folder
4. Installer file: `AI Study Assistant 1.0.0.exe` (~200-300 MB)

**Time:** 2-5 minutes depending on machine speed

### Output Location

```
dist-app/
├── AI Study Assistant 1.0.0.exe  ← **Distribution file**
├── AI Study Assistant 1.0.0.exe.blockmap
└── builder-effective-config.yaml
```

---

## Installer Features

**Created Installer (.exe) includes:**
- ✅ Electron + React bundle
- ✅ All dependencies (node_modules)
- ✅ Auto-update support (configured but optional)
- ✅ Windows desktop shortcut
- ✅ Start menu entry
- ✅ Uninstaller

**User Installation Process:**
1. Download `AI Study Assistant 1.0.0.exe`
2. Run installer
3. App has optional one-click or manual installation mode
4. Creates Start Menu shortcuts
5. Creates Desktop shortcut

**User Requirements:**
- Windows 7+ (tested on Windows 10/11)
- Ollama installed and running
- ~500 MB disk space (for app + dependencies)
- ~2GB RAM recommended

---

## Ollama Integration & Error Handling

### Automatic Checks

**On app startup:**
1. App checks if Ollama is running on `http://localhost:11434`
2. If **Ollama is NOT running:**
   - Error banner shown in app UI
   - User cannot send messages
   - Input field disabled with message: "Waiting for Ollama..."
   - Error message displays: "❌ Ollama is not running..."

3. If **Ollama is running:**
   - App fully functional
   - Input enabled
   - User sends questions to Phi model

### IPC Handler: `checkOllamaStatus()`

**In main.js:**
```javascript
ipcMain.handle('ollama:status', async () => {
  const available = await checkOllamaStatus()
  return { available, url: OLLAMA_URL }
})
```

**In preload.js:**
```javascript
checkOllamaStatus: () => ipcRenderer.invoke('ollama:status')
```

**In React (App.jsx):**
```javascript
const status = await window.electronAPI.checkOllamaStatus()
setOllamaAvailable(status?.available ?? false)
```

### Error Dialog on Launch

If Ollama is not running, a system dialog appears:

```
Ollama Not Found

The AI Study Assistant requires Ollama to be running.

Please:
1. Download Ollama from https://ollama.ai
2. Install and start the Ollama service
3. Pull required models:
   ollama pull phi

After Ollama is running, restart this application.
```

---

## Configuration

### package.json Build Configuration

Located in `package.json` under `"build"` key:

```json
{
  "build": {
    "appId": "com.study-assistant.app",
    "productName": "AI Study Assistant",
    "directories": {
      "buildResources": "assets",
      "output": "dist-app"
    },
    "files": [
      "electron/**/*",
      "react-app/dist/**/*",
      "node_modules/**/*",
      "package.json"
    ],
    "win": {
      "target": ["nsis"]
    },
    "nsis": {
      "oneClick": false,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true,
      "shortcutName": "AI Study Assistant"
    }
  }
}
```

### Customize Installer

Edit `package.json` `build` section:

- **Change App Name:** Edit `productName`
- **Change App ID:** Edit `appId` (must be unique)
- **One-Click Install:** Set `nsis.oneClick: true`
- **App Icon:** Add `icon.ico` to `assets/` folder and reference in build config

### Environment Variables

**Development:**
```powershell
$env:ELECTRON_START_URL = "http://localhost:5173"
npm run electron:app
```

**Production:**
- No env vars needed
- App loads from `react-app/dist/index.html`

---

## Scripts Reference

| Script | Purpose | Output |
|--------|---------|--------|
| `npm install` | Install all dependencies | node_modules/ |
| `npm run dev` | Start Vite dev server | http://localhost:5173 |
| `npm run electron` | Full dev mode (server + app) | Electron window + DevTools |
| `npm run build:react` | Build React only | react-app/dist/ |
| `npm run build` | Build React for production | react-app/dist/ |
| `npm run dist` | Build + Create installer | dist-app/*.exe |

---

## Common Errors & Fixes

### Error: "pdfParse is not a function"

**Cause:** Dependencies not installed

**Fix:**
```powershell
npm install
```

### Error: "Cannot find react-app/dist/index.html"

**Cause:** React app wasn't built

**Fix:**
```powershell
npm run build:react
```

### Error: "Ollama is not responding"

**Cause:** Ollama not running or wrong model

**Fix:**
1. Start Ollama: `ollama serve`
2. Pull model: `ollama pull phi`
3. Verify: `curl http://localhost:11434/api/tags`

### Error: "Port 5173 already in use"

**Cause:** Dev server already running

**Fix:**
```powershell
# Kill the process on port 5173
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Installer size too large (>400 MB)

**Cause:** node_modules included in package

**Solution:** Remove node_modules before building

```powershell
# electron-builder handles this, but if issues:
npm run dist --no-pack
```

### App won't load in production

**Cause:** Path issues or missing dist files

**Fix:**
1. Verify `react-app/dist/index.html` exists
2. Check `main.js` path handling:
   ```javascript
   const indexPath = path.join(__dirname, '../react-app/dist/index.html')
   mainWindow.loadFile(indexPath)
   ```
3. Rebuild: `npm run dist`

### Ollama error dialog appears on every launch

**Cause:** Ollama not running or wrong port

**Fix:**
1. Ensure Ollama is running: `ollama serve`
2. Check port is 11434: `netstat -an | findstr 11434`
3. Verify connectivity: `Invoke-WebRequest http://localhost:11434/api/tags`

---

## Distribution for End Users

### Package Your Installer

1. Build the app:
   ```powershell
   npm run dist
   ```

2. Locate installer:
   ```
   dist-app/AI Study Assistant 1.0.0.exe
   ```

3. Share via:
   - GitHub Releases
   - Google Drive / OneDrive
   - Website download page
   - Email

### Installation Instructions for Users

**Before installing:**
1. [Download & Install Ollama](https://ollama.ai)
2. Start Ollama: `ollama serve`
3. Pull Phi model: `ollama pull phi` (happens automatically on first use)

**To install the app:**
1. Download `AI Study Assistant 1.0.0.exe`
2. Run the installer
3. Follow prompts (choose custom install if preferred)
4. App will be installed in `C:\Program Files\AI Study Assistant\`

**To use:**
1. Ensure Ollama is running
2. Launch from Start Menu or Desktop shortcut
3. Ask questions in the chat interface

**Troubleshooting:**
- If app says "Ollama is not running", ensure Ollama service is active
- Check [https://ollama.ai](https://ollama.ai) for Ollama issues
- Try restarting both Ollama and the app

---

## Advanced: Code Signing & Auto-Updates

### Add Code Signing (Optional)

For distribution, you may want to code-sign the installer:

```json
{
  "build": {
    "win": {
      "certificateFile": "path/to/cert.pfx",
      "certificatePassword": "password",
      "signingHashAlgorithms": ["sha256"],
      "sign": "./customSign.js"
    }
  }
}
```

### Enable Auto-Updates (Optional)

Configure GitHub releases for auto-updates:

```json
{
  "build": {
    "publish": {
      "provider": "github",
      "owner": "yourusername",
      "repo": "ai-assistant"
    }
  }
}
```

Usage: `npm run dist:publish`

---

## File Locations Reference

| File | Purpose | Dev/Prod |
|------|---------|----------|
| `electron/main.js` | Entry point | Both |
| `electron/preload.js` | IPC bridge | Both |
| `react-app/src/` | React source | Dev |
| `react-app/dist/` | Built React | Prod |
| `react-app/dist/index.html` | App HTML | Prod |
| `node_modules/` | Dependencies | Both |
| `dist-app/*.exe` | Installer | Prod (output) |

---

## Summary

**Local Development:**
```powershell
npm install
npm run electron
```

**Production Build:**
```powershell
npm run dist
# Output: dist-app/AI Study Assistant 1.0.0.exe
```

**Key Points:**
- ✅ React builds to `react-app/dist/`
- ✅ Electron loads built HTML in production
- ✅ Ollama must be running for app to work
- ✅ App checks Ollama status on startup
- ✅ Friendly error messages if Ollama isn't available
- ✅ Installer is ~250-300 MB
- ✅ Users need Ollama installed separately

---

## Support & Troubleshooting

**Common Issues Checklist:**

- [ ] Node.js v16+ installed
- [ ] npm dependencies installed (`npm install`)
- [ ] React app built (`npm run build:react`)
- [ ] Ollama installed and running
- [ ] Port 11434 available (Ollama)
- [ ] Port 5173 available (dev server)
- [ ] All files in correct paths
- [ ] electron-builder installed (`npm install --save-dev electron-builder`)

**Need Help?**
1. Check error messages carefully
2. Review console output line by line
3. Try rebuilding: `npm run dist`
4. Verify Ollama: `ollama serve`
5. Check file paths are absolute

---

## Version History

- **v1.0.0** - Initial release with Phi model, single-document mode, Ollama integration

---

**Last Updated:** March 2026
