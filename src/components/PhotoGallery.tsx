import { useState, useMemo, useEffect } from 'react'
import './PhotoGallery.css'

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
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isSlideshow, setIsSlideshow] = useState(false)

  // Load photos from JSON file on component mount
  useEffect(() => {
    fetch('/data/photos.json')
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

  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(photosData.map(p => p.category)))]
  }, [photosData])

  const filteredPhotos = useMemo(() => {
    return photosData.filter(photo => {
      const matchesSearch = photo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           photo.alt.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || photo.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [photosData, searchQuery, selectedCategory])

  const handleDownload = (photo: Photo) => {
    const link = document.createElement('a')
    link.href = photo.src
    link.download = `${photo.title.replace(/\s+/g, '_')}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredPhotos.length)
    setSelectedPhoto(filteredPhotos[(currentIndex + 1) % filteredPhotos.length])
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length)
    setSelectedPhoto(filteredPhotos[(currentIndex - 1 + filteredPhotos.length) % filteredPhotos.length])
  }

  const openPhoto = (photo: Photo) => {
    const index = filteredPhotos.findIndex(p => p.id === photo.id)
    setCurrentIndex(index)
    setSelectedPhoto(photo)
  }

  const startSlideshow = () => {
    if (filteredPhotos.length === 0) return
    setIsSlideshow(true)
    setSelectedPhoto(filteredPhotos[0])
    setCurrentIndex(0)
  }

  return (
    <div className="photo-gallery">
      <h2 className="section-title">Photo Gallery</h2>
      <p className="section-description">
        A collection of beautiful moments captured in time
      </p>

      <div className="gallery-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search photos..."
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

        {filteredPhotos.length > 0 && (
          <button className="slideshow-button" onClick={startSlideshow}>
            ▶ Slideshow
          </button>
        )}
      </div>

      {filteredPhotos.length === 0 ? (
        <div className="no-results">
          <p>No photos found matching your search.</p>
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
                    <span className="photo-category">{photo.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedPhoto && (
            <div 
              className="lightbox"
              onClick={() => {
                setSelectedPhoto(null)
                setIsSlideshow(false)
              }}
            >
              <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
                <button 
                  className="lightbox-close"
                  onClick={() => {
                    setSelectedPhoto(null)
                    setIsSlideshow(false)
                  }}
                  aria-label="Close"
                >
                  ×
                </button>
                
                <button 
                  className="lightbox-nav lightbox-prev"
                  onClick={handlePrev}
                  aria-label="Previous"
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
                  aria-label="Next"
                >
                  ›
                </button>

                <div className="lightbox-info">
                  <h3>{selectedPhoto.title}</h3>
                  {selectedPhoto.date && <p>{selectedPhoto.date}</p>}
                  <span className="lightbox-category">{selectedPhoto.category}</span>
                </div>

                <div className="lightbox-actions">
                  <button 
                    className="download-button"
                    onClick={() => handleDownload(selectedPhoto)}
                  >
                    ⬇ Download
                  </button>
                  {isSlideshow && (
                    <button 
                      className="stop-slideshow-button"
                      onClick={() => setIsSlideshow(false)}
                    >
                      ⏸ Stop Slideshow
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
