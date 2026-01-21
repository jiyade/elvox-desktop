import fs from 'fs'
import path from 'path'
import { app } from 'electron'

const resolvePaths = () => {
  const userData = app.getPath('userData')
  const authDir = path.join(userData, 'auth')
  const tokenFile = path.join(authDir, 'device-token.json')

  return { authDir, tokenFile }
}

export const saveDeviceToken = (token) => {
  const { authDir, tokenFile } = resolvePaths()

  fs.mkdirSync(authDir, { recursive: true })
  fs.writeFileSync(tokenFile, JSON.stringify({ token }), 'utf8')
}

export const getDeviceToken = () => {
  try {
    const { tokenFile } = resolvePaths()

    if (!fs.existsSync(tokenFile)) return null

    const raw = fs.readFileSync(tokenFile, 'utf8')
    const parsed = JSON.parse(raw)

    return parsed?.token ?? null
  } catch (err) {
    console.error('Failed to read device token:', err)
    return null
  }
}

export const removeDeviceToken = () => {
  try {
    const { tokenFile } = resolvePaths()

    if (fs.existsSync(tokenFile)) {
      fs.unlinkSync(tokenFile)
    }
  } catch (err) {
    console.error('Failed to remove device token:', err)
  }
}
