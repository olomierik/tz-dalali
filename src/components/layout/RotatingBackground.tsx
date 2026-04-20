import { useEffect, useMemo, useState } from 'react'
import { useBackgroundImages } from '@/hooks/useBackgroundImages'

interface RotatingBackgroundProps {
  /** Time each image stays fully visible, ms (default 6000). */
  intervalMs?: number
  /** Overlay darkness 0-1 to keep foreground readable (default 0.15 — very light). */
  overlayOpacity?: number
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/**
 * Fixed full-viewport rotating background of property photos.
 * Two layered <div>s crossfade between consecutive images every `intervalMs`.
 * Sits behind everything (z-index: -10) and is overlaid with a navy gradient
 * for legibility.
 */
export function RotatingBackground({
  intervalMs = 6000,
  overlayOpacity = 0.15,
}: RotatingBackgroundProps) {
  const { data: images = [] } = useBackgroundImages(24)
  const pool = useMemo(() => shuffle(images), [images])

  const [index, setIndex] = useState(0)
  // toggles which of the two layers is the "current" visible one
  const [showA, setShowA] = useState(true)
  const [imgA, setImgA] = useState<string | null>(null)
  const [imgB, setImgB] = useState<string | null>(null)

  // Initialize first image when pool arrives
  useEffect(() => {
    if (pool.length > 0 && imgA === null) {
      setImgA(pool[0])
    }
  }, [pool, imgA])

  // Crossfade ticker
  useEffect(() => {
    if (pool.length < 2) return
    const id = window.setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % pool.length
        const nextSrc = pool[next]
        // Preload, then swap the hidden layer and toggle
        const img = new Image()
        img.onload = () => {
          if (showA) setImgB(nextSrc)
          else setImgA(nextSrc)
          setShowA((s) => !s)
        }
        img.onerror = () => {
          // skip broken image
        }
        img.src = nextSrc
        return next
      })
    }, intervalMs)
    return () => window.clearInterval(id)
  }, [pool, intervalMs, showA])

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -10 }}
    >
      {/* Layer A */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ease-in-out"
        style={{
          backgroundImage: imgA ? `url("${imgA}")` : undefined,
          opacity: showA ? 1 : 0,
        }}
      />
      {/* Layer B */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ease-in-out"
        style={{
          backgroundImage: imgB ? `url("${imgB}")` : undefined,
          opacity: showA ? 0 : 1,
        }}
      />
      {/* Very light readability scrim — keeps images vivid, only slightly darkens edges */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, rgba(0,0,0,${overlayOpacity * 0.4}) 0%, rgba(0,0,0,0) 35%, rgba(0,0,0,0) 65%, rgba(0,0,0,${overlayOpacity}) 100%)`,
        }}
      />
    </div>
  )
}
