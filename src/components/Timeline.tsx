import { useState, useMemo, useEffect } from 'react'
import './Timeline.css'

interface TimelineItem {
  id: number
  type: 'photo' | 'video'
  title: string
  date: string
  year: number
  month?: number
  description?: string
  thumbnail?: string
  category: string
}

type PhotoEntry = {
  id: number
  title: string
  date?: string
  year: number
  category: string
  alt?: string
  src?: string
}

type VideoEntry = {
  id: number
  title: string
  description?: string
  date?: string
  year: number
  category: string
  thumbnail?: string
}

function Timeline() {
  const [photos, setPhotos] = useState<PhotoEntry[]>([])
  const [videos, setVideos] = useState<VideoEntry[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const resolveAssetUrl = (path?: string) => {
    if (!path) return undefined
    if (/^https?:\/\//i.test(path)) return path
    const normalized = path.startsWith('/') ? path.slice(1) : path
    return `${import.meta.env.BASE_URL}${normalized}`
  }

  // Load all data from JSON files
  useEffect(() => {
    // Use import.meta.env.BASE_URL to handle base path correctly
    const baseUrl = import.meta.env.BASE_URL
    Promise.all([
      fetch(`${baseUrl}data/photos.json`)
        .then(res => res.json() as Promise<PhotoEntry[]>)
        .catch(() => [] as PhotoEntry[]),
      fetch(`${baseUrl}data/videos.json`)
        .then(res => res.json() as Promise<VideoEntry[]>)
        .catch(() => [] as VideoEntry[]),
    ]).then(([photosData, videosData]) => {
      setPhotos(Array.isArray(photosData) ? photosData : [])
      setVideos(Array.isArray(videosData) ? videosData : [])
    })
  }, [])

  const timelineItems: TimelineItem[] = useMemo(() => {
    const items: TimelineItem[] = [
      ...photos.map(photo => ({
        id: photo.id,
        type: 'photo' as const,
        title: photo.title,
        date: photo.date || '',
        year: photo.year,
        month: 6, // Default month - you can add month to JSON if needed
        description: photo.alt,
        thumbnail: resolveAssetUrl(photo.src),
        category: photo.category
      })),
      ...videos.map(video => ({
        id: video.id + 100,
        type: 'video' as const,
        title: video.title,
        date: video.date || '',
        year: video.year,
        month: 6,
        description: video.description,
        thumbnail: resolveAssetUrl(video.thumbnail),
        category: video.category
      }))
    ]
    return items
  }, [photos, videos])

  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(timelineItems.map(item => item.category)))]
  }, [timelineItems])

  const filteredItems = useMemo(() => {
    return timelineItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory
      return matchesSearch && matchesCategory
    }).sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year
      return (b.month || 0) - (a.month || 0)
    })
  }, [timelineItems, searchQuery, selectedCategory])

  const groupedByYear = useMemo(() => {
    const groups: { [year: number]: TimelineItem[] } = {}
    filteredItems.forEach(item => {
      if (!groups[item.year]) {
        groups[item.year] = []
      }
      groups[item.year].push(item)
    })
    return groups
  }, [filteredItems])

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'photo':
        return '📷'
      case 'video':
        return '🎥'
      default:
        return '📌'
    }
  }

  return (
    <div className="timeline">
      <h2 className="section-title">Timeline</h2>
      <p className="section-description">
        A chronological journey through memories
      </p>

      <div className="timeline-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search timeline..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`category-button ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {Object.keys(groupedByYear).length === 0 ? (
        <div className="no-results">
          <p>No items found matching your search.</p>
        </div>
      ) : (
        <div className="timeline-container">
          {Object.keys(groupedByYear)
            .sort((a, b) => Number(b) - Number(a))
            .map(year => (
              <div key={year} className="timeline-year-group">
                <div className="timeline-year-marker">
                  <div className="year-line"></div>
                  <div className="year-badge">{year}</div>
                  <div className="year-line"></div>
                </div>
                <div className="timeline-items">
                  {groupedByYear[Number(year)]
                    .sort((a, b) => (b.month || 0) - (a.month || 0))
                    .map(item => (
                      <div key={item.id} className="timeline-item">
                        <div className="timeline-thumb">
                          {item.thumbnail ? (
                            <img src={item.thumbnail} alt={`${item.title} preview`} loading="lazy" />
                          ) : (
                            <span className="timeline-thumb-placeholder">{getTypeIcon(item.type)}</span>
                          )}
                        </div>
                        <div className="timeline-item-content">
                          <div className="timeline-item-header">
                            <div className="timeline-item-icon">{getTypeIcon(item.type)}</div>
                            <div className="timeline-item-meta">
                              <h3 className="timeline-item-title">{item.title}</h3>
                              <span className="timeline-item-date">
                                {item.month ? `${months[item.month - 1]} ` : ''}
                                {item.year}
                              </span>
                            </div>
                          </div>
                          {item.description && (
                            <p className="timeline-item-description">{item.description}</p>
                          )}
                          <span className="timeline-item-category">{item.category}</span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

export default Timeline
