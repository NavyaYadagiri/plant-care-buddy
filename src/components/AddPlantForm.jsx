import { useState } from 'react'
import { resizeImage } from '../imageUtils.js'
import { todayISO } from '../plantUtils.js'
import Modal from './Modal.jsx'

export default function AddPlantForm({ onSave, onCancel }) {
  const [name, setName] = useState('')
  const [species, setSpecies] = useState('')
  const [waterEveryDays, setWaterEveryDays] = useState(7)
  const [lastWatered, setLastWatered] = useState(todayISO())
  const [photo, setPhoto] = useState(null)
  const [photoError, setPhotoError] = useState('')
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false)

  async function handlePhoto(event) {
    const file = event.target.files[0]
    if (!file) return
    setIsProcessingPhoto(true)
    setPhotoError('')
    try {
      setPhoto(await resizeImage(file))
    } catch (error) {
      setPhotoError(error.message)
    } finally {
      setIsProcessingPhoto(false)
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    onSave({
      name: name.trim(),
      species: species.trim(),
      waterEveryDays: Number(waterEveryDays),
      lastWatered,
      photo,
    })
  }

  return (
    <Modal title="Add a plant" onClose={onCancel}>
      <h2>Add a plant</h2>
      <form className="plant-form" onSubmit={handleSubmit}>
        <label className="photo-picker">
          {isProcessingPhoto ? (
            <span className="photo-picker-empty">
              ⏳
              <small>Preparing photo…</small>
            </span>
          ) : photo ? (
            <img src={photo} alt="Plant preview" />
          ) : (
            <span className="photo-picker-empty">
              📷
              <small>Add a photo</small>
            </span>
          )}
          <input type="file" accept="image/*,.heic,.heif" onChange={handlePhoto} hidden />
        </label>
        {photoError && <p className="form-error">{photoError}</p>}

        <label>
          Name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. Monty"
            required
            autoFocus
          />
        </label>

        <label>
          Species
          <input
            value={species}
            onChange={(event) => setSpecies(event.target.value)}
            placeholder="e.g. Monstera deliciosa"
          />
        </label>

        <div className="form-row">
          <label>
            Water every (days)
            <input
              type="number"
              min="1"
              max="365"
              value={waterEveryDays}
              onChange={(event) => setWaterEveryDays(event.target.value)}
              required
            />
          </label>

          <label>
            Last watered
            <input
              type="date"
              value={lastWatered}
              max={todayISO()}
              onChange={(event) => setLastWatered(event.target.value)}
              required
            />
          </label>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={isProcessingPhoto}>
            Save plant
          </button>
        </div>
      </form>
    </Modal>
  )
}
