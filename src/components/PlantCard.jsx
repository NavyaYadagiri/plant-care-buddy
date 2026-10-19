import { getMood } from '../plantUtils.js'
import PlantPhoto from './PlantPhoto.jsx'
import { useEmojiBurst } from './useEmojiBurst.jsx'

export default function PlantCard({ plant, onOpen, onWater }) {
  const mood = getMood(plant)
  const [burst, triggerBurst] = useEmojiBurst()

  function handleWater() {
    triggerBurst()
    onWater()
  }

  return (
    <article className={`plant-card mood-${mood.status}`}>
      <button className="plant-card-body" onClick={onOpen} aria-label={`Open ${plant.name}`}>
        <div className="plant-card-photo-wrap">
          <PlantPhoto plant={plant} />
          <span className="mood-badge" title={mood.label}>
            {mood.emoji}
          </span>
        </div>
        <div className="plant-card-info">
          <h3>{plant.name}</h3>
          {plant.species && <p className="species">{plant.species}</p>}
          <p className={`mood-label mood-text-${mood.status}`}>{mood.label}</p>
        </div>
      </button>
      {mood.status !== 'happy' && (
        <button className="btn btn-water" onClick={handleWater}>
          💧 Watered
        </button>
      )}
      {burst}
    </article>
  )
}
