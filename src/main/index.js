import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { getDeviceToken, removeDeviceToken, saveDeviceToken } from './deviceToken'
import { getDeviceId } from './deviceId'

const createWindow = () => {
  // Create the browser window with security settings
  const mainWindow = new BrowserWindow({
    // ===== DEVELOPMENT SETTINGS (Comment out for production) =====
    width: 1200,
    height: 800,
    show: false, // Don't show until ready (prevents flash)

    // ===== PRODUCTION SETTINGS (Uncomment for production) =====
    // fullscreen: true, // Lock to fullscreen
    // frame: false, // Remove window frame/controls
    // resizable: false, // Prevent resizing
    // minimizable: false, // Prevent minimizing

    // ===== COMMON SETTINGS =====
    autoHideMenuBar: true, // Hide menu bar (File, Edit, etc.)
    ...(process.platform === 'linux' ? { icon } : {}), // Set icon on Linux

    webPreferences: {
      preload: join(__dirname, '../preload/index.js'), // Load preload script
      sandbox: false, // Disable sandbox for IPC access
      nodeIntegration: false, // Security: Don't expose Node.js to renderer
      contextIsolation: true // Security: Isolate renderer context

      // ===== PRODUCTION SETTINGS (Uncomment for production) =====
      // devTools: false, // Disable DevTools in production
    }
  })

  // Show window when ready (prevents white flash on startup)
  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  // Security: Prevent opening new windows (open links in external browser instead)
  mainWindow.webContents.setWindowOpenHandler(() => {
    // If someone tries to open a link, open it in system browser
    // This prevents popup windows and potential security issues
    return { action: 'deny' }
  })

  // ===== PRODUCTION SETTINGS (Uncomment for production) =====
  // Disable right-click context menu
  // mainWindow.webContents.on('context-menu', (e) => {
  //   e.preventDefault()
  // })

  // Prevent navigation away from app (security measure)
  // mainWindow.webContents.on('will-navigate', (e, url) => {
  //   if (!url.startsWith(mainWindow.webContents.getURL())) {
  //     e.preventDefault()
  //   }
  // })

  // Load the app (dev server in development, local file in production)
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']) // Dev: Vite server
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html')) // Prod: Built files
  }

  // ===== DEVELOPMENT ONLY (Comment out for production) =====
  // Open DevTools automatically in development
  if (is.dev) {
    mainWindow.webContents.openDevTools()
  }
}

// App initialization - runs when Electron is ready
app.whenReady().then(() => {
  // Set app identifier (used by Windows for notifications, taskbar, etc.)
  // Change 'com.electron' to your app ID like 'com.elvox.voting'
  // electronApp.setAppUserModelId('com.elvox.voting')

  // ===== IPC HANDLERS =====

  // Handle app quit request from renderer (for Exit button)
  ipcMain.on('quit-app', () => {
    app.quit()
  })

  //Get device unique id
  ipcMain.handle('get-device-id', () => {
    return getDeviceId()
  })

  // Get device token
  ipcMain.handle('get-device-token', () => {
    return getDeviceToken()
  })

  // Set device token
  ipcMain.handle('save-device-token', (_, token) => {
    saveDeviceToken(token)
  })

  // Remove device token
  ipcMain.handle('remove-device-token', () => {
    removeDeviceToken()
    return null
  })

  // Create the main window
  createWindow()

  // macOS specific: Re-create window when dock icon is clicked
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit app when all windows are closed (except on macOS)
app.on('window-all-closed', () => {
  // On macOS, apps typically stay open even when all windows are closed
  // On Windows/Linux, quit the app
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// ===== PRODUCTION SETTINGS (Uncomment for production) =====
// Disable keyboard shortcuts (F11, F12, Ctrl+R, etc.)
// app.on('browser-window-created', (_, window) => {
//   window.webContents.on('before-input-event', (event, input) => {
//     // Block F11 (fullscreen toggle)
//     if (input.key === 'F11') {
//       event.preventDefault()
//     }
//     // Block F12 (DevTools)
//     if (input.key === 'F12') {
//       event.preventDefault()
//     }
//     // Block Ctrl+Shift+I (DevTools)
//     if (input.control && input.shift && input.key === 'I') {
//       event.preventDefault()
//     }
//     // Block Ctrl+R / Cmd+R (Reload)
//     if ((input.control || input.meta) && input.key === 'r') {
//       event.preventDefault()
//     }
//     // Block Ctrl+W / Cmd+W (Close window)
//     if ((input.control || input.meta) && input.key === 'w') {
//       event.preventDefault()
//     }
//   })
// })
