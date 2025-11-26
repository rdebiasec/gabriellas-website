import { useState, useMemo, useEffect } from 'react'
import './Timeline.css'
import { useLocale, useStrings } from '../i18n/LocaleProvider'
import { localizePhoto, localizeVideo, translateCategoryKey } from '../i18n/mediaTranslations'

interface TimelineItem {
  id: number
  type: 'photo' | 'video'
  title: string
  date: string
  year: number
  month?: number
  description?: string
  thumbnail?: string
  categoryKey: string
  categoryLabel: string
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
  const [selectedCategory, setSelectedCategory] = useState('all')
  const { locale } = useLocale()
  const strings = useStrings()

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
      ...photos.map(photo => {
        const localized = localizePhoto(
          {
            ...photo,
            alt: photo.alt ?? '',
            src: photo.src ?? '',
          },
          locale
        )
        return {
          id: photo.id,
          type: 'photo' as const,
          title: localized.title,
          date: photo.date || '',
          year: photo.year,
          month: 6,
          description: localized.alt,
          thumbnail: resolveAssetUrl(photo.src),
          categoryKey: localized.categoryKey,
          categoryLabel: translateCategoryKey(localized.categoryKey, locale),
        }
      }),
      ...videos.map(video => {
        const localized = localizeVideo(
          {
            ...video,
            description: video.description ?? '',
          },
          locale
        )
        return {
          id: video.id + 100,
          type: 'video' as const,
          title: localized.title,
          date: video.date || '',
          year: video.year,
          month: 6,
          description: localized.description,
          thumbnail: resolveAssetUrl(video.thumbnail),
          categoryKey: localized.categoryKey,
          categoryLabel: translateCategoryKey(localized.categoryKey, locale),
        }
      }),
    ]
    return items
  }, [photos, videos, locale])

  const categories = useMemo(() => {
    const uniqueKeys = Array.from(new Set(timelineItems.map(item => item.categoryKey)))
    return [
      { key: 'all', label: strings.filters.all },
      ...uniqueKeys.map(key => ({
        key,
        label: translateCategoryKey(key, locale),
      })),
    ]
  }, [timelineItems, locale, strings.filters.all])

  const filteredItems = useMemo(() => {
    return timelineItems.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || item.categoryKey === selectedCategory
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

  const monthFormatter = useMemo(() => {
    return new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : 'en-US', { month: 'short' })
  }, [locale])

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
      <h2 className="section-title">{strings.timeline.title}</h2>
      <p className="section-description">{strings.timeline.description}</p>

      <div className="timeline-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder={strings.timeline.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="category-filters">
          {categories.map(cat => (
            <button
              key={cat.key}
              className={`category-button ${selectedCategory === cat.key ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.key)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {Object.keys(groupedByYear).length === 0 ? (
        <div className="no-results">
          <p>{strings.timeline.noResults}</p>
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
                                {item.month ? `${monthFormatter.format(new Date(2020, (item.month ?? 1) - 1, 1))} ` : ''}
                                {item.year}
                              </span>
                            </div>
                          </div>
                          {item.description && (
                            <p className="timeline-item-description">{item.description}</p>
                          )}
                          <span className="timeline-item-category">{item.categoryLabel}</span>
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
