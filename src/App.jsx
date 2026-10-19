import { useEffect, useMemo, useState } from 'react'
import { loadPlants, savePlants } from './storage.js'
import { daysUntilWatering, getMood, todayISO } from './plantUtils.js'
import PlantCard from './components/PlantCard.jsx'
import AddPlantForm from './components/AddPlantForm.jsx'
import PlantDetail from './components/PlantDetail.jsx'

export default function App() {
  const [plants, setPlants] = useState(loadPlants)
  const [isAdding, setIsAdding] = useState(false)
  const [selectedId, setSelectedId] = useState(null)
  const [saveFailed, setSaveFailed] = useState(false)

  useEffect(() => {
    setSaveFailed(!savePlants(plants))
  }, [plants])

  // Most urgent plants first.
  const sortedPlants = useMemo(
    () => [...plants].sort((a, b) => daysUntilWatering(a) - daysUntilWatering(b)),
    [plants],
  )

  const counts = useMemo(() => {
    const result = { happy: 0, due: 0, overdue: 0 }
    plants.forEach((plant) => result[getMood(plant).status]++)
    return result
  }, [plants])

  const selectedPlant = plants.find((plant) => plant.id === selectedId)

  function addPlant(plant) {
    setPlants((prev) => [...prev, { ...plant, id: crypto.randomUUID() }])
    setIsAdding(false)
  }

  function updatePlant(id, changes) {
    setPlants((prev) => prev.map((plant) => (plant.id === id ? { ...plant, ...changes } : plant)))
  }

  function waterPlant(id) {
    updatePlant(id, { lastWatered: todayISO() })
  }

  function deletePlant(id) {
    setPlants((prev) => prev.filter((plant) => plant.id !== id))
    setSelectedId(null)
  }

  return (
    <div className="app">
      <header className="app-header">
        <div>
          <h1>🌿 Plant Care Buddy</h1>
          <p className="subtitle">So no plant gets forgotten.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsAdding(true)}>
          + Add plant
        </button>
      </header>

      {saveFailed && (
        <div className="banner banner-warning">
          Your browser's storage is full, so recent changes may not be saved. Try removing a
          plant photo or two.
        </div>
      )}

      {plants.length > 0 && (
        <div className="summary">
          <span className="summary-pill overdue">😢 {counts.overdue} overdue</span>
          <span className="summary-pill due">😐 {counts.due} due today</span>
          <span className="summary-pill happy">😊 {counts.happy} happy</span>
        </div>
      )}

      {plants.length === 0 ? (
        <div className="empty-state">
          <div className="empty-emoji">🪴</div>
          <h2>No plants yet</h2>
          <p>Add your first plant to start tracking its watering schedule.</p>
          <button className="btn btn-primary" onClick={() => setIsAdding(true)}>
            + Add your first plant
          </button>
        </div>
      ) : (
        <main className="plant-grid">
          {sortedPlants.map((plant) => (
            <PlantCard
              key={plant.id}
              plant={plant}
              onOpen={() => setSelectedId(plant.id)}
              onWater={() => waterPlant(plant.id)}
            />
          ))}
        </main>
      )}

      {isAdding && <AddPlantForm onSave={addPlant} onCancel={() => setIsAdding(false)} />}

      {selectedPlant && (
        <PlantDetail
          plant={selectedPlant}
          onClose={() => setSelectedId(null)}
          onWater={() => waterPlant(selectedPlant.id)}
          onUpdate={(changes) => updatePlant(selectedPlant.id, changes)}
          onDelete={() => deletePlant(selectedPlant.id)}
        />
      )}
    </div>
  )
}
