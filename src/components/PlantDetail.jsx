import { useState } from 'react'
import { getCareTips } from '../careTips.js'
import { formatDate, getMood, nextWateringDate, toISODate } from '../plantUtils.js'
import Modal from './Modal.jsx'
import PlantPhoto from './PlantPhoto.jsx'
import { useEmojiBurst } from './useEmojiBurst.jsx'

export default function PlantDetail({ plant, onClose, onWater, onUpdate, onDelete }) {
  const mood = getMood(plant)
  const { tips, isGeneral } = getCareTips(plant)
  const [confirmingDelete, setConfirmingDelete] = useState(false)
  const [burst, triggerBurst] = useEmojiBurst()

  function handleWater() {
    triggerBurst()
    onWater()
  }

  function handleScheduleChange(event) {
    const days = Number(event.target.value)
    if (days >= 1) onUpdate({ waterEveryDays: days })
  }

  return (
    <Modal title={plant.name} onClose={onClose}>
      <div className="detail-header">
        <PlantPhoto plant={plant} className="detail-photo" />
        <div>
          <h2>
            {plant.name} <span className="detail-mood">{mood.emoji}</span>
          </h2>
          {plant.species && <p className="species">{plant.species}</p>}
          <p className={`mood-label mood-text-${mood.status}`}>{mood.label}</p>
        </div>
      </div>

      <section className="detail-section detail-watering">
        {burst}
        <h3>Watering</h3>
        <dl className="detail-facts">
          <dt>Last watered</dt>
          <dd>{formatDate(plant.lastWatered)}</dd>
          <dt>Next watering</dt>
          <dd>{formatDate(toISODate(nextWateringDate(plant)))}</dd>
          <dt>Schedule</dt>
          <dd>
            Every{' '}
            <input
              className="inline-number"
              type="number"
              min="1"
              max="365"
              defaultValue={plant.waterEveryDays}
              onChange={handleScheduleChange}
              aria-label="Water every how many days"
            />{' '}
            days
          </dd>
        </dl>
        <button className="btn btn-water btn-block" onClick={handleWater}>
          💧 I watered it today
        </button>
      </section>

      <section className="detail-section">
        <h3>Care tips</h3>
        {isGeneral && (
          <p className="hint">
            {plant.species
              ? `No specific tips for “${plant.species}” yet, so here are general ones.`
              : 'Add a species to get tailored tips. For now, here are general ones.'}
          </p>
        )}
        <ul className="tips">
          {tips.map((tip) => (
            <li key={tip}>{tip}</li>
          ))}
        </ul>
      </section>

      <div className="detail-footer">
        {confirmingDelete ? (
          <>
            <span>Remove {plant.name}?</span>
            <button className="btn btn-secondary" onClick={() => setConfirmingDelete(false)}>
              Keep
            </button>
            <button className="btn btn-danger" onClick={onDelete}>
              Remove
            </button>
          </>
        ) : (
          <button className="btn btn-link-danger" onClick={() => setConfirmingDelete(true)}>
            Remove plant
          </button>
        )}
      </div>
    </Modal>
  )
}
