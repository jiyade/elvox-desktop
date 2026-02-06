import { app, BrowserWindow, ipcMain } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import { getDeviceToken, removeDeviceToken, saveDeviceToken } from './deviceToken'
import { getDeviceId } from './deviceId'

const createWindow = () => {
  // Create the browser window with security settings
  const mainWindow = new BrowserWindow({
    fullscreen: true, // Lock to fullscreen
    frame: false, // Remove window frame/controls
    resizable: false, // Prevent resizing
    minimizable: false, // Prevent minimizing

    autoHideMenuBar: true, // Hide menu bar (File, Edit, etc.)
    ...(process.platform === 'linux' ? { icon } : {}), // Set icon on Linux

    webPreferences: {
      preload: join(__dirname, '../preload/index.js'), // Load preload script
      sandbox: false, // Disable sandbox for IPC access
      nodeIntegration: false, // Security: Don't expose Node.js to renderer
      contextIsolation: true, // Security: Isolate renderer context
      devTools: false
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

  // Disable right-click context menu
  mainWindow.webContents.on('context-menu', (e) => {
    e.preventDefault()
  })

  // Prevent navigation away from app (security measure)
  mainWindow.webContents.on('will-navigate', (e, url) => {
    if (!url.startsWith(mainWindow.webContents.getURL())) {
      e.preventDefault()
    }
  })

  // Load the app (dev server in development, local file in production)
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL']) // Dev: Vite server
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html')) // Prod: Built files
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

// Disable keyboard shortcuts (F11, F12, Ctrl+R, etc.) and custom shortcuts
app.on('browser-window-created', (_, window) => {
  const wc = window.webContents

  wc.on('before-input-event', (event, input) => {
    const isExitShortcut =
      input.control && input.shift && input.type === 'keyDown' && input.code === 'KeyQ'

    const isMinimizeShortcut =
      input.control && input.shift && input.type === 'keyDown' && input.code === 'KeyM'

    if (isExitShortcut) {
      app.quit()
      return
    }

    if (isMinimizeShortcut) {
      window.minimize()
      return
    }

    const isPasteShortcut =
      (input.control || input.meta) && input.type === 'keyDown' && input.code === 'KeyV'

    if (isPasteShortcut) {
      return
    }

    const isBlockedShortcut =
      (input.control || input.alt || input.meta || input.code.startsWith('F')) &&
      input.type === 'keyDown'

    if (isBlockedShortcut) {
      event.preventDefault()
    }
  })

  window.on('blur', () => {
    window.focus()
  })

  wc.on('devtools-opened', () => {
    wc.closeDevTools()
  })
})
