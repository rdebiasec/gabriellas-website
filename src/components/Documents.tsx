import { useState, useMemo, useEffect } from 'react'
import './Documents.css'

interface Document {
  id: number
  title: string
  type: string
  date: string
  description: string
  icon: string
  category: string
  fileUrl?: string
}

function Documents() {
  const [documentsData, setDocumentsData] = useState<Document[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  // Load documents from JSON file on component mount
  useEffect(() => {
    // Use import.meta.env.BASE_URL to handle base path correctly
    fetch(`${import.meta.env.BASE_URL}data/documents.json`)
      .then(res => res.json())
      .then(data => {
        setDocumentsData(data)
      })
      .catch(err => {
        console.error('Error loading documents:', err)
        setDocumentsData([])
      })
  }, [])

  const categories = useMemo(() => {
    return ['All', ...Array.from(new Set(documentsData.map(d => d.category)))]
  }, [documentsData])

  const filteredDocuments = useMemo(() => {
    return documentsData.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           doc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           doc.type.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [documentsData, searchQuery, selectedCategory])

  const handleDownload = (doc: Document) => {
    if (doc.fileUrl && doc.fileUrl !== '#') {
      const link = document.createElement('a')
      link.href = doc.fileUrl
      link.download = `${doc.title.replace(/\s+/g, '_')}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } else {
      alert('File URL not available. Please add the actual file path in the documents.json file.')
    }
  }

  return (
    <div className="documents">
      <h2 className="section-title">Documents</h2>
      <p className="section-description">
        Important documents, certificates, and records
      </p>

      <div className="gallery-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search documents..."
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

      {filteredDocuments.length === 0 ? (
        <div className="no-results">
          <p>No documents found matching your search.</p>
        </div>
      ) : (
        <>
          <div className="documents-grid">
            {filteredDocuments.map((doc) => (
              <div key={doc.id} className="document-card">
                <div className="document-icon">{doc.icon}</div>
                <div className="document-content">
                  <h3 className="document-title">{doc.title}</h3>
                  <p className="document-description">{doc.description}</p>
                  <div className="document-meta">
                    <span className="document-type">{doc.type}</span>
                    <span className="document-date">{doc.date}</span>
                  </div>
                  <button 
                    className="download-doc-button"
                    onClick={() => handleDownload(doc)}
                  >
                    ⬇ Download
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="documents-note">
            <p>
              💡 <strong>Note:</strong> To add your documents, place them in the <code>public/documents/</code> folder 
              and update the <code>public/data/documents.json</code> file with the file paths.
            </p>
          </div>
        </>
      )}
    </div>
  )
}

export default Documents
