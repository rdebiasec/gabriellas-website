import './GabysBook.css'
import { useLocale, useStrings } from '../i18n/LocaleProvider'

function GabysBook() {
  const { locale } = useLocale()
  const publicationDate = locale === 'es' ? '23 de febrero' : 'February 23'
  const strings = useStrings()
  return (
    <section className="book" id="gabys-book">
      <div className="section-heading">
        <p className="kicker">{strings.book.kicker}</p>
        <h2 className="section-title">{strings.book.title}</h2>
        <p className="section-description">
          {strings.book.paragraphs[0].replace('{{date}}', publicationDate)}
        </p>
      </div>

      <div className="book-story">
        <p>{strings.book.paragraphs[1]}</p>
        <p className="signature">{strings.book.signature}</p>
        <a className="book-link" href="https://example.com/gabys-book" target="_blank" rel="noreferrer">
          {strings.book.link}
        </a>
      </div>
    </section>
  )
}

export default GabysBook

