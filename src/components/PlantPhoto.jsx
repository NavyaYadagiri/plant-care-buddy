export default function PlantPhoto({ plant, className = '' }) {
  if (plant.photo) {
    return <img className={`plant-photo ${className}`} src={plant.photo} alt={plant.name} />
  }
  return (
    <div className={`plant-photo plant-photo-placeholder ${className}`} aria-hidden="true">
      🪴
    </div>
  )
}
