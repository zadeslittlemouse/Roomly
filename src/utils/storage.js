// LocalStorage persistence. Each room has its own key, so rooms never overwrite each other.
// Designs live only in this browser, nothing is sent anywhere.
import { sanitize } from './design.js'

const VERSION = 1
const key = (roomId) => `roomly:v${VERSION}:${roomId}`

export function loadDesign(roomId) {
  try {
    const text = localStorage.getItem(key(roomId))
    if (!text) return null
    const data = JSON.parse(text)
    if (data?.version !== VERSION) return null // outdated format: start fresh
    return sanitize(roomId, data.design)
  } catch {
    return null // corrupted data: ignore it
  }
}

export function saveDesign(roomId, design) {
  try {
    localStorage.setItem(key(roomId), JSON.stringify({ version: VERSION, savedAt: Date.now(), design }))
    return true
  } catch {
    return false // storage full or blocked (private mode)
  }
}

export function clearDesign(roomId) {
  try {
    localStorage.removeItem(key(roomId))
  } catch {
    /* nothing to do */
  }
}

export function hasSaved(roomId) {
  try {
    return localStorage.getItem(key(roomId)) !== null
  } catch {
    return false
  }
}
