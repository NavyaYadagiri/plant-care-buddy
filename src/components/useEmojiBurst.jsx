import { useCallback, useState } from 'react'

const BURST_EMOJIS = ['💧', '🌱', '✨', '💚', '💧', '🍃', '✨']
const BURST_DURATION_MS = 1900

// Returns [burstElement, triggerBurst]. Render burstElement inside a position: relative parent.
export function useEmojiBurst() {
  const [bursts, setBursts] = useState([])

  const triggerBurst = useCallback(() => {
    const id = crypto.randomUUID()
    const particles = BURST_EMOJIS.map((emoji, index) => ({
      emoji,
      left: 35 + Math.random() * 30,
      dx: (Math.random() - 0.5) * 140,
      rotate: (Math.random() - 0.5) * 60,
      delay: index * 70,
    }))
    setBursts((prev) => [...prev, { id, particles }])
    setTimeout(() => setBursts((prev) => prev.filter((burst) => burst.id !== id)), BURST_DURATION_MS)
  }, [])

  const burstElement = (
    <span className="emoji-burst" aria-hidden="true">
      {bursts.map((burst) =>
        burst.particles.map((particle, index) => (
          <span
            key={`${burst.id}-${index}`}
            className="emoji-burst-particle"
            style={{
              left: `${particle.left}%`,
              animationDelay: `${particle.delay}ms`,
              '--dx': `${particle.dx}px`,
              '--rotate': `${particle.rotate}deg`,
            }}
          >
            {particle.emoji}
          </span>
        )),
      )}
    </span>
  )

  return [burstElement, triggerBurst]
}
