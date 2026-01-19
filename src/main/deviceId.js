import fs from 'fs'
import path from 'path'
import { app } from 'electron'
import crypto from 'crypto'

const AUTH_DIR = path.join(app.getPath('userData'), 'auth')
const DEVICE_FILE = path.join(AUTH_DIR, 'device-id.json')

export const getDeviceId = () => {
  try {
    if (fs.existsSync(DEVICE_FILE)) {
      return JSON.parse(fs.readFileSync(DEVICE_FILE, 'utf8')).id
    }

    const id = crypto.randomUUID()
    fs.mkdirSync(AUTH_DIR, { recursive: true })
    fs.writeFileSync(DEVICE_FILE, JSON.stringify({ id }), 'utf8')
    return id
  } catch {
    return null
  }
}
