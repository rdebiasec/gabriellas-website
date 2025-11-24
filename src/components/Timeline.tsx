import { useState, useMemo, useEffect } from 'react'
import './Timeline.css'

interface TimelineItem {
  id: number
  type: 'photo' | 'video' | 'document'
  title: string
  date: string
  year: number
  month?: number
  description?: string
  thumbnail?: string
  category: string
}

function Timeline() {
  const [photos, setPhotos] = useState<any[]>([])
  const [videos, setVideos] = useState<any[]>([])
  const [documents, setDocuments] = useState<any[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Load all data from JSON files
  useEffect(() => {
    // Use import.meta.env.BASE_URL to handle base path correctly
    const baseUrl = import.meta.env.BASE_URL
    Promise.all([
      fetch(`${baseUrl}data/photos.json`).then(res => res.json()).catch(() => []),
      fetch(`${baseUrl}data/videos.json`).then(res => res.json()).catch(() => []),
      fetch(`${baseUrl}data/documents.json`).then(res => res.json()).catch(() => [])
    ]).then(([photosData, videosData, documentsData]) => {
      setPhotos(photosData)
      setVideos(videosData)
      setDocuments(documentsData)
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
        thumbnail: photo.src,
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
        category: video.category
      })),
      ...documents.map(doc => ({
        id: doc.id + 200,
        type: 'document' as const,
        title: doc.title,
        date: doc.date || '',
        year: parseInt(doc.date) || 2020,
        month: 1,
        description: doc.description,
        category: doc.category
      }))
    ]
    return items
  }, [photos, videos, documents])

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
      case 'photo': return '📷'
      case 'video': return '🎥'
      case 'document': return '📄'
      default: return '📌'
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
                        <div className="timeline-item-icon">
                          {getTypeIcon(item.type)}
                        </div>
                        <div className="timeline-item-content">
                          <div className="timeline-item-header">
                            <h3 className="timeline-item-title">{item.title}</h3>
                            <span className="timeline-item-date">
                              {item.month ? `${months[item.month - 1]} ` : ''}{item.year}
                            </span>
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
