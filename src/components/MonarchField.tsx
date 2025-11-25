import { useEffect, useMemo, useState, type CSSProperties } from 'react'
import './MonarchField.css'

const STORAGE_KEY = 'monarch-flight-played'
const CLEANUP_DELAY_MS = 14000
const DEFAULT_MONARCH_COUNT = 12

const isMonarchFeatureEnabled = () => import.meta.env.VITE_ENABLE_MONARCHS !== 'false'

type MonarchSpec = {
  id: string
  delay: number
  duration: number
  startX: number
  verticalOffset: number
  horizontalShift: number
  size: number
  flutterScale: number
  hueRotate: number
  mirrored: boolean
}

const getInitialShouldRender = () => {
  if (typeof window === 'undefined') {
    return true
  }
  try {
    return window.localStorage.getItem(STORAGE_KEY) !== 'true'
  } catch {
    return true
  }
}

const getPrefersReducedMotion = () => {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return false
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

const getMonarchCount = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_MONARCH_COUNT
  }
  if (window.innerWidth < 640) {
    return 7
  }
  if (window.innerWidth > 1440) {
    return DEFAULT_MONARCH_COUNT + 4
  }
  return DEFAULT_MONARCH_COUNT
}

const createMonarchSpecs = (options?: { gentle?: boolean }): MonarchSpec[] => {
  const baseCount = getMonarchCount()
  const count = options?.gentle ? Math.min(6, Math.ceil(baseCount / 2)) : baseCount
  return Array.from({ length: count }, (_, index) => {
    const startX = 5 + Math.random() * 90
    const verticalOffset = -12 + Math.random() * 18
    const horizontalBase = options?.gentle ? 12 : 18
    const horizontalRange = options?.gentle ? 18 : 28
    const horizontalShift = (Math.random() > 0.5 ? horizontalBase : -horizontalBase) + Math.random() * horizontalRange
    const durationBase = options?.gentle ? 8000 : 10000
    const duration = durationBase + Math.random() * 4500
    const delay = index * 220 + Math.random() * 400
    const sizeBase = options?.gentle ? 42 : 48
    const size = sizeBase + Math.random() * 32
    const hueRotate = -10 + Math.random() * 20
    const flutterScale = options?.gentle ? 0.92 + Math.random() * 0.12 : 0.9 + Math.random() * 0.25
    return {
      id: `monarch-${index}`,
      delay,
      duration,
      startX,
      verticalOffset,
      horizontalShift,
      size,
      flutterScale,
      hueRotate,
      mirrored: Math.random() > 0.5,
    }
  })
}

function MonarchField() {
  const featureEnabled = isMonarchFeatureEnabled()
  const [shouldRender, setShouldRender] = useState(() => (featureEnabled ? getInitialShouldRender() : false))
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => getPrefersReducedMotion())

  const butterflies = useMemo(
    () => (featureEnabled ? createMonarchSpecs({ gentle: prefersReducedMotion }) : []),
    [featureEnabled, prefersReducedMotion]
  )

  useEffect(() => {
    if (!featureEnabled || !shouldRender) {
      return
    }

    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, 'true')
      }
    } catch {
      // Swallow storage errors silently; animation is still optional flair.
    }

    const timer = window.setTimeout(() => setShouldRender(false), CLEANUP_DELAY_MS)
    return () => window.clearTimeout(timer)
  }, [featureEnabled, shouldRender])

  useEffect(() => {
    if (!featureEnabled) {
      return
    }
    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      const media = window.matchMedia('(prefers-reduced-motion: reduce)')
      const handleChange = () => setPrefersReducedMotion(media.matches)
      if (typeof media.addEventListener === 'function') {
        media.addEventListener('change', handleChange)
      } else if (typeof media.addListener === 'function') {
        media.addListener(handleChange)
      }
      return () => {
        if (typeof media.removeEventListener === 'function') {
          media.removeEventListener('change', handleChange)
        } else if (typeof media.removeListener === 'function') {
          media.removeListener(handleChange)
        }
      }
    }
    return undefined
  }, [featureEnabled])

  if (!featureEnabled || !shouldRender) {
    return null
  }

  return (
    <div
      className={`monarch-field${prefersReducedMotion ? ' monarch-field--soft' : ''}`}
      aria-hidden="true"
    >
      {butterflies.map((butterfly) => {
        const style = {
          '--delay': `${butterfly.delay}ms`,
          '--duration': `${butterfly.duration}ms`,
          '--start-x': `${butterfly.startX}%`,
          '--vertical-offset': `${butterfly.verticalOffset}%`,
          '--horizontal-shift': `${butterfly.horizontalShift}%`,
          '--size': `${butterfly.size}px`,
          '--flutter-scale': butterfly.flutterScale,
          '--hue-rotate': `${butterfly.hueRotate}deg`,
        } as CSSProperties
        return (
          <div
            key={butterfly.id}
            className={`monarch-field__butterfly${butterfly.mirrored ? ' monarch-field__butterfly--mirrored' : ''}`}
            style={style}
          >
            <svg viewBox="0 0 64 64" role="presentation">
              <defs>
                <linearGradient id={`monarch-wing-${butterfly.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#ffb347" />
                  <stop offset="100%" stopColor="#f45c43" />
                </linearGradient>
              </defs>
              <path
                d="M32 30C25 16 14 9 9 14c-5 5 4 15 10 18-8 2-13 10-7 14s15 1 21-10"
                fill={`url(#monarch-wing-${butterfly.id})`}
                stroke="#5a2c42"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M32 30c7-14 18-21 23-16s-4 15-10 18c8 2 13 10 7 14s-15 1-21-10"
                fill={`url(#monarch-wing-${butterfly.id})`}
                stroke="#5a2c42"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M30 18c3-4 7-4 10 0 5 7 6 16 1 26-3 7-9 7-12 0-5-10-4-19 1-26z"
                fill="#3a1f2f"
                stroke="#1e0f17"
                strokeWidth="1.5"
              />
              <circle cx="32" cy="17" r="2" fill="#f8f3ea" />
              <path d="M30 16c-4-5-7-7-10-6M34 16c4-5 7-7 10-6" stroke="#3a1f2f" strokeWidth="1.5" />
            </svg>
          </div>
        )
      })}
    </div>
  )
}

export default MonarchField

