const STORAGE_KEY = 'plant-care-buddy.plants'

export function loadPlants() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

// Returns false when the browser refuses the write (usually storage full from photos).
export function savePlants(plants) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(plants))
    return true
  } catch {
    return false
  }
}
