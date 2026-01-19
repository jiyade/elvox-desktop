import fs from 'fs'
import path from 'path'
import { app } from 'electron'

const AUTH_DIR = path.join(app.getPath('userData'), 'auth')
const TOKEN_FILE = path.join(AUTH_DIR, 'device-token.json')

export const saveDeviceToken = (token) => {
  fs.mkdirSync(AUTH_DIR, { recursive: true })
  fs.writeFileSync(TOKEN_FILE, JSON.stringify({ token }), 'utf8')
}

export const getDeviceToken = () => {
  try {
    if (!fs.existsSync(TOKEN_FILE)) return null
    return JSON.parse(fs.readFileSync(TOKEN_FILE, 'utf8')).token
  } catch {
    return null
  }
}
