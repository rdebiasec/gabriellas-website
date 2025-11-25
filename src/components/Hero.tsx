import { useEffect, useState } from 'react'
import './Hero.css'

type MediaCounts = {
  photos: number
  videos: number
  wall: number
}

const WALL_STORAGE_KEY = 'gabys-wall-messages'

type HeroProps = {
  onNavigate: (tab: 'photos' | 'videos' | 'wall' | 'book') => void
}

const defaultCounts: MediaCounts = {
  photos: 0,
  videos: 0,
  wall: 0,
}

function Hero({ onNavigate }: HeroProps) {
  const [counts, setCounts] = useState<MediaCounts>(defaultCounts)
  const [countsLoaded, setCountsLoaded] = useState(false)
  const heroImage = `${import.meta.env.BASE_URL}images/gabriella-hero.jpg`

  useEffect(() => {
    let isActive = true

    const loadCounts = async () => {
      try {
        const [photosRes, videosRes, wallRes] = await Promise.all([
          fetch(`${import.meta.env.BASE_URL}data/photos.json`),
          fetch(`${import.meta.env.BASE_URL}data/videos.json`),
          fetch(`${import.meta.env.BASE_URL}data/wall.json`),
        ])

        if (!photosRes.ok || !videosRes.ok || !wallRes.ok) {
          throw new Error('Unable to fetch media data')
        }

        const [photos, videos, wallEntries] = await Promise.all([
          photosRes.json(),
          videosRes.json(),
          wallRes.json(),
        ])

        const normalizeWallEntries = () => {
          const baseEntries = Array.isArray(wallEntries) ? [...wallEntries] : []
          if (typeof window !== 'undefined') {
            const storedRaw = window.localStorage.getItem(WALL_STORAGE_KEY)
            if (storedRaw) {
              try {
                const stored: Array<{ id?: string }> = JSON.parse(storedRaw)
                const seen = new Set(baseEntries.map((entry) => entry?.id).filter(Boolean))
                stored.forEach((entry) => {
                  if (!entry) return
                  if (entry.id && seen.has(entry.id)) return
                  baseEntries.push(entry)
                  if (entry.id) {
                    seen.add(entry.id)
                  }
                })
              } catch (error) {
                console.error('Unable to parse stored wall entries', error)
              }
            }
          }
          return baseEntries.length
        }

        if (isActive) {
          setCounts({
            photos: Array.isArray(photos) ? photos.length : 0,
            videos: Array.isArray(videos) ? videos.length : 0,
            wall: normalizeWallEntries(),
          })
          setCountsLoaded(true)
        }
      } catch (error) {
        console.error(error)
      }
    }

    loadCounts()

    return () => {
      isActive = false
    }
  }, [])

  const formatCount = (value: number) => {
    if (!countsLoaded) return '...'
    return value.toString()
  }

  return (
    <section className="hero">
      <div className="hero-media-layer">
        <div className="hero-image">
          <img src={heroImage} alt="Gabriella smiling outdoors" loading="lazy" />
          <span className="image-pill">Joyful spirit</span>
        </div>
      </div>
      <div className="hero-content">
        <p className="hero-kicker">A luminous soul</p>
        <h2 className="hero-title">Gabriella</h2>
        <p className="hero-subtitle">A beautiful life remembered</p>
        <p className="hero-description">
          This is a collection of memories, moments, and milestones from Gabriella&apos;s time with us.
          Every photo, video, and document hums with her bright laughter, the curiosity that led her on new adventures, and the joy she shared so freely.
          She was a wonderfully happy girl, cherished and missed deeply by everyone who loves her, and this space celebrates that radiant spirit with gratitude and smiles.
        </p>
        <div className="hero-stats">
          <button className="stat" type="button" onClick={() => onNavigate('photos')}>
            <span className="stat-number">{formatCount(counts.photos)}</span>
            <span className="stat-label">Photos</span>
          </button>
          <button className="stat" type="button" onClick={() => onNavigate('videos')}>
            <span className="stat-number">{formatCount(counts.videos)}</span>
            <span className="stat-label">Videos</span>
          </button>
          <button className="stat wall-stat" type="button" onClick={() => onNavigate('wall')}>
            <span className="stat-number">{formatCount(counts.wall)}</span>
            <span className="wall-meta">Comments</span>
            <span className="stat-label">Wall</span>
          </button>
          <button className="stat" type="button" onClick={() => onNavigate('book')}>
            <span className="stat-number">1</span>
            <span className="stat-label">Book</span>
          </button>
        </div>
      </div>
    </section>
  )
}

export default Hero
export type { HeroProps }
