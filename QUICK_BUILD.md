# Quick Build Reference

## TL;DR - Build & Distribute in 3 Commands

### 1. Install Dependencies (One-time)
```powershell
npm install
npm --prefix react-app install
npm install --save-dev electron-builder
```

### 2. Build for Testing (Optional)
```powershell
npm run electron
# Opens app in development mode with hot-reload
# Press Ctrl+C to exit
```

### 3. Build for Distribution
```powershell
npm run dist
```

**Output:** `dist-app/AI Study Assistant 1.0.0.exe` ✓

---

## Before Building

- ✅ Node.js v16+ installed
- ✅ Ollama installed
- ✅ Project dependencies installed

### Pre-Build Checklist

```powershell
# Verify Node.js
node --version

# Verify npm
npm --version

# Install/update dependencies
npm install

# Verify Ollama
ollama --version

# Start Ollama in a separate terminal
ollama serve
```

---

## Building Steps

### Step 1: Development Build (Optional Testing)

```powershell
# Terminal 1 - Start Ollama
ollama serve

# Terminal 2 - Start development environment
npm run electron
```

**What to expect:**
- Vite dev server starts
- Electron window opens
- App loads from `http://localhost:5173`
- DevTools are visible
- You can edit React code and see changes immediately

**Exit:** Press `Ctrl+C` in the terminal

### Step 2: Production Build

```powershell
npm run dist
```

**What happens:**
1. React app builds to `react-app/dist/`
2. electron-builder packages everything
3. Windows installer created: `dist-app/AI Study Assistant 1.0.0.exe`

**Time:** 2-5 minutes

**Output files:**
```
dist-app/
├── AI Study Assistant 1.0.0.exe          ← Distribution file
├── AI Study Assistant 1.0.0.exe.blockmap
└── builder-effective-config.yaml
```

---

## Installer Details

**File:** `AI Study Assistant 1.0.0.exe`

**Size:** ~250-300 MB

**Installation:**
- User runs .exe
- Can choose: one-click install or custom path
- Creates Start Menu shortcut
- Creates Desktop shortcut
- Installs to: `C:\Program Files\AI Study Assistant\`

**Requirements for users:**
- Windows 7+
- Ollama installed separately
- ~500 MB disk space

---

## After Building

### Option A: Test the Installer

```powershell
# Run the installer
dist-app\AI\ Study\ Assistant\ 1.0.0.exe
```

### Option B: Distribute to Users

```powershell
# Copy this file to users:
dist-app\AI\ Study\ Assistant\ 1.0.0.exe

# Users should:
# 1. Have Ollama installed
# 2. Run the installer
# 3. Launch from Start Menu
```

---

## Key Configuration

### package.json Build Settings

```json
{
  "build": {
    "appId": "com.study-assistant.app",
    "productName": "AI Study Assistant",
    "directories": {
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
      "createDesktopShortcut": true
    }
  }
}
```

---

## Troubleshooting

### Build Fails: "Cannot find react-app/dist"
```powershell
npm run build:react
npm run dist
```

### Build Fails: "electron-builder not found"
```powershell
npm install --save-dev electron-builder
npm run dist
```

### Port 5173 already in use
```powershell
netstat -ano | findstr :5173
taskkill /PID <PID> /F
npm run electron
```

### Ollama not detected
```powershell
# Terminal 1
ollama serve

# Terminal 2 - Verify connection
Invoke-WebRequest http://localhost:11434/api/tags
npm run electron
```

### Installer size too large (>400 MB)
- Already handled by electron-builder
- If persists, check node_modules size

---

## Common Commands

| Command | Purpose |
|---------|---------|
| `npm install` | Install root dependencies |
| `npm --prefix react-app install` | Install React dependencies |
| `npm run electron` | Test app (dev mode) |
| `npm run build:react` | Build React only |
| `npm run build` | Build React for production |
| `npm run dist` | Build + Create .exe installer |
| `ollama serve` | Start Ollama service |
| `ollama pull phi` | Download Phi model |

---

## File Structure After Build

```
ai-assistant/
├── electron/                 # Source code
├── react-app/
│   ├── src/                 # Source
│   └── dist/                # Built files ✓
├── node_modules/            # Dependencies
├── dist-app/                # Installer output
│   └── AI Study Assistant 1.0.0.exe  ← **Your installer**
├── package.json
└── BUILD_GUIDE.md
```

---

## That's It! 🚀

**To distribute:**
1. Run: `npm run dist`
2. Share file: `dist-app/AI Study Assistant 1.0.0.exe`
3. Users install and run
4. They need Ollama running to use the app

---

## Need More Details?

See **BUILD_GUIDE.md** for:
- Detailed setup instructions
- Ollama integration details
- Error handling & debugging
- Advanced configuration
- Distribution guidelines
