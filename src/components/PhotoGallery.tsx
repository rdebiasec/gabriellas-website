import { useState, useMemo, useEffect } from 'react'
import './PhotoGallery.css'
import { useLocale, useStrings } from '../i18n/LocaleProvider'
import { localizePhoto, translateCategoryKey, type LocalizedPhoto } from '../i18n/mediaTranslations'

export interface Photo {
  id: number
  src: string
  alt: string
  title: string
  date?: string
  category: string
  year: number
}

// Photos are now loaded from /public/data/photos.json
// This makes it MUCH easier to add/edit photos - just edit the JSON file!

function PhotoGallery() {
  const [photosData, setPhotosData] = useState<Photo[]>([])
  const [selectedPhotoId, setSelectedPhotoId] = useState<number | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isSlideshow, setIsSlideshow] = useState(false)
  const { locale } = useLocale()
  const strings = useStrings()

  // Load photos from JSON file on component mount
  useEffect(() => {
    // Use import.meta.env.BASE_URL to handle base path correctly
    fetch(`${import.meta.env.BASE_URL}data/photos.json`)
      .then(res => res.json())
      .then(data => {
        setPhotosData(data)
      })
      .catch(err => {
        console.error('Error loading photos:', err)
        // Fallback to empty array if JSON fails
        setPhotosData([])
      })
  }, [])

  const localizedPhotos = useMemo<LocalizedPhoto<Photo>[]>(() => {
    return photosData.map((photo) => localizePhoto(photo, locale))
  }, [photosData, locale])

  const selectedPhoto = useMemo(() => {
    if (selectedPhotoId == null) return null
    return localizedPhotos.find((photo) => photo.id === selectedPhotoId) ?? null
  }, [localizedPhotos, selectedPhotoId])

  const categories = useMemo(() => {
    const uniqueKeys = Array.from(new Set(localizedPhotos.map((p) => p.categoryKey)))
    return [
      { key: 'all', label: strings.filters.all },
      ...uniqueKeys.map((key) => ({
        key,
        label: translateCategoryKey(key, locale),
      })),
    ]
  }, [localizedPhotos, locale, strings.filters.all])

  const filteredPhotos = useMemo(() => {
    return localizedPhotos.filter(photo => {
      const matchesSearch =
        photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        photo.alt.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || photo.categoryKey === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [localizedPhotos, searchQuery, selectedCategory])

  const handleDownload = (photo: LocalizedPhoto<Photo>) => {
    const link = document.createElement('a')
    link.href = photo.src
    link.download = `${photo.title.replace(/\s+/g, '_')}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleNext = () => {
    if (filteredPhotos.length === 0) return
    const nextIndex = (currentIndex + 1) % filteredPhotos.length
    setCurrentIndex(nextIndex)
    setSelectedPhotoId(filteredPhotos[nextIndex].id)
  }

  const handlePrev = () => {
    if (filteredPhotos.length === 0) return
    const prevIndex = (currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length
    setCurrentIndex(prevIndex)
    setSelectedPhotoId(filteredPhotos[prevIndex].id)
  }

  const openPhoto = (photo: LocalizedPhoto<Photo>) => {
    const index = filteredPhotos.findIndex(p => p.id === photo.id)
    setCurrentIndex(index)
    setSelectedPhotoId(photo.id)
  }

  const startSlideshow = () => {
    if (filteredPhotos.length === 0) return
    setIsSlideshow(true)
    setSelectedPhotoId(filteredPhotos[0].id)
    setCurrentIndex(0)
  }

  return (
    <div className="photo-gallery">
      <h2 className="section-title">{strings.photos.title}</h2>
      <p className="section-description">{strings.photos.description}</p>

      <div className="gallery-controls">
        <div className="row">
          <div className="search-container">
            <input
              type="text"
              placeholder={strings.photos.searchPlaceholder}
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

        {filteredPhotos.length > 0 && (
          <button className="slideshow-button" onClick={startSlideshow}>
            {strings.photos.slideshowStart}
          </button>
        )}
      </div>

      {filteredPhotos.length === 0 ? (
        <div className="no-results">
          <p>{strings.photos.noResults}</p>
        </div>
      ) : (
        <>
          <div className="photos-grid">
            {filteredPhotos.map((photo) => (
              <div 
                key={photo.id} 
                className="photo-card"
                onClick={() => openPhoto(photo)}
              >
                <div className="photo-wrapper">
                  <img 
                    src={photo.src} 
                    alt={photo.alt}
                    loading="lazy"
                  />
                  <div className="photo-overlay">
                    <h3 className="photo-title">{photo.title}</h3>
                    {photo.date && <span className="photo-date">{photo.date}</span>}
                    <span className="photo-category">{translateCategoryKey(photo.categoryKey, locale)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedPhoto && (
            <div 
              className="lightbox"
                onClick={() => {
                  setSelectedPhotoId(null)
                  setIsSlideshow(false)
                }}
            >
              <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                <button 
                  className="lightbox-close"
                  onClick={() => {
                    setSelectedPhotoId(null)
                    setIsSlideshow(false)
                  }}
                  aria-label={strings.photos.lightboxClose}
                >
                  ×
                </button>
                
                <button 
                  className="lightbox-nav lightbox-prev"
                  onClick={handlePrev}
                  aria-label={strings.photos.lightboxPrev}
                >
                  ‹
                </button>
                
                <img 
                  src={selectedPhoto.src} 
                  alt={selectedPhoto.alt}
                  className="lightbox-image"
                />
                
                <button 
                  className="lightbox-nav lightbox-next"
                  onClick={handleNext}
                  aria-label={strings.photos.lightboxNext}
                >
                  ›
                </button>

                <div className="lightbox-info">
                  <h3>{selectedPhoto.title}</h3>
                  <div className="lightbox-tags">
                    {selectedPhoto.date && <span className="lightbox-tag">{selectedPhoto.date}</span>}
                    <span className="lightbox-tag">{translateCategoryKey(selectedPhoto.categoryKey, locale)}</span>
                  </div>
                </div>

                <div className="lightbox-actions">
                  <button 
                    className="download-button"
                    onClick={() => handleDownload(selectedPhoto)}
                  >
                    {strings.photos.download}
                  </button>
                  {isSlideshow && (
                    <button 
                      className="stop-slideshow-button"
                      onClick={() => setIsSlideshow(false)}
                    >
                      {strings.photos.slideshowStop}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {isSlideshow && selectedPhoto && (
            <SlideshowTimer 
              onNext={handleNext}
              interval={5000}
            />
          )}
        </>
      )}
    </div>
  )
}

function SlideshowTimer({ onNext, interval }: { onNext: () => void; interval: number }) {
  useEffect(() => {
    const timer = setInterval(onNext, interval)
    return () => clearInterval(timer)
  }, [onNext, interval])
  return null
}

export default PhotoGallery
