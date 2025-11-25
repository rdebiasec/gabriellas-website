import './GabysBook.css'

function GabysBook() {
  const publicationDate = 'February 23'
  return (
    <section className="book" id="gabys-book">
      <div className="section-heading">
        <p className="kicker">Gaby&apos;s Book</p>
        <h2 className="section-title">A love letter in progress</h2>
        <p className="section-description">
          Gabriella&apos;s mom, Jimena Cortes, is carefully completing a book that gathers the radiant moments,
          quiet lessons, and joyful stories that defined Gaby&apos;s life. The manuscript is being finalized now
          and will be released on {publicationDate}, the day Gaby earned her wings.
        </p>
      </div>

      <div className="book-story">
        <p>
          This book is a promise to share how Gaby moved through the world—with kindness, curiosity, and courage. Every page is meant to feel like a warm conversation, a reminder that her laughter
          is still echoing in every heart she touched. It is written with immense gratitude for every person who loved her and guided by the belief that joy can be a legacy.
        </p>
        <p className="signature">— Jimena Cortes, Mom of Gabriella</p>
        <a className="book-link" href="https://example.com/gabys-book" target="_blank" rel="noreferrer">
          View the book (coming soon)
        </a>
      </div>
    </section>
  )
}

export default GabysBook

