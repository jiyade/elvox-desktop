import { contextBridge, ipcRenderer } from 'electron'

// Define custom APIs that will be available in React as window.electron
const api = {
  // Quit the application (for Exit button)
  quitApp: () => {
    ipcRenderer.send('quit-app')
  },
  getDeviceId: () => ipcRenderer.invoke('get-device-id'),
  getDeviceToken: () => ipcRenderer.invoke('get-device-token'),
  saveDeviceToken: (token) => ipcRenderer.invoke('save-device-token', token)
}

// Safely expose APIs to renderer process (React)
// This makes them available as window.electron in React components
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', api)
  } catch (error) {
    console.error('Failed to expose electron APIs:', error)
  }
} else {
  // Fallback if context isolation is disabled
  window.electron = api
}
