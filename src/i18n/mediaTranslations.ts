import type { Locale } from './locales'

type LocaleText = Partial<Record<Locale, string>>

const photoText: Record<
  number,
  {
    title?: LocaleText
    alt?: LocaleText
  }
> = {
  1: { title: { es: 'Un día especial' }, alt: { es: 'Momento hermoso' } },
  2: { title: { es: 'Tiempo en familia' }, alt: { es: 'Recuerdo apreciado' } },
  3: { title: { es: 'Celebración' }, alt: { es: 'Momento alegre' } },
  4: { title: { es: 'Tiempos felices' }, alt: { es: 'Sonrisa hermosa' } },
  5: { title: { es: 'Evento memorable' }, alt: { es: 'Ocasión especial' } },
  6: { title: { es: 'Juntos' }, alt: { es: 'Recuerdo hermoso' } },
  7: { title: { es: 'Amor' }, alt: { es: 'Momento precioso' } },
  8: { title: { es: 'Aventuras' }, alt: { es: 'Momento atesorado' } },
  9: { title: { es: 'Rayos de sol' }, alt: { es: 'Día hermoso' } },
  10: { title: { es: 'Para siempre' }, alt: { es: 'Recuerdo preciado' } },
  11: { title: { es: 'Risas en el parque' }, alt: { es: 'Amigos riendo al aire libre' } },
  12: { title: { es: 'Paseo al atardecer dorado' }, alt: { es: 'Horizonte urbano al atardecer' } },
  13: { title: { es: 'Campo de flores silvestres' }, alt: { es: 'Sentada en la hierba alta' } },
  14: { title: { es: 'Celebración de verano' }, alt: { es: 'Celebración con luces en el crepúsculo' } },
  15: { title: { es: 'Tarde acogedora' }, alt: { es: 'Leyendo en una cafetería' } },
  16: { title: { es: 'Alegría de cumpleaños' }, alt: { es: 'Lanzando confeti colorido' } },
  17: { title: { es: 'Brisa costera' }, alt: { es: 'Caminando junto a acantilados' } },
  18: { title: { es: 'Alegría pura' }, alt: { es: 'Retrato con sonrisa alegre' } },
  19: { title: { es: 'Aventura en el sendero' }, alt: { es: 'Excursión por el bosque' } },
  20: { title: { es: 'Canciones al anochecer' }, alt: { es: 'Tocando guitarra al aire libre' } },
}

const videoText: Record<
  number,
  {
    title?: LocaleText
    description?: LocaleText
  }
> = {
  1: {
    title: { es: 'Recuerdos hermosos' },
    description: { es: 'Una colección de momentos valiosos' },
  },
  2: {
    title: { es: 'Momentos en familia' },
    description: { es: 'Tiempo compartido' },
  },
  3: {
    title: { es: 'Celebraciones' },
    description: { es: 'Momentos llenos de alegría' },
  },
}

const categoryMap: Record<
  string,
  {
    key: string
    labels: Record<Locale, string>
  }
> = {
  family: { key: 'family', labels: { en: 'Family', es: 'Familia' } },
  celebration: { key: 'celebration', labels: { en: 'Celebration', es: 'Celebración' } },
  adventure: { key: 'adventure', labels: { en: 'Adventure', es: 'Aventura' } },
  friends: { key: 'friends', labels: { en: 'Friends', es: 'Amigos' } },
  nature: { key: 'nature', labels: { en: 'Nature', es: 'Naturaleza' } },
  music: { key: 'music', labels: { en: 'Music', es: 'Música' } },
  portrait: { key: 'portrait', labels: { en: 'Portrait', es: 'Retrato' } },
  'quiet-moments': { key: 'quiet-moments', labels: { en: 'Quiet Moments', es: 'Momentos tranquilos' } },
}

const slugify = (value: string) => value.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-')

const getCategoryEntry = (label: string) => {
  const slug = slugify(label)
  return categoryMap[slug] || {
    key: slug,
    labels: { en: label, es: label },
  }
}

export type LocalizedCategory = {
  key: string
  label: string
}

export type LocalizedPhoto<T extends { id: number; category: string; title: string; alt: string }> = T & {
  categoryKey: string
  categoryLabel: string
  title: string
  alt: string
}

export type LocalizedVideo<T extends { id: number; category: string; title: string; description: string }> = T & {
  categoryKey: string
  categoryLabel: string
  title: string
  description: string
}

export function localizePhoto<T extends { id: number; category: string; title: string; alt: string }>(
  photo: T,
  locale: Locale
): LocalizedPhoto<T> {
  const categoryEntry = getCategoryEntry(photo.category)
  const translation = photoText[photo.id]
  return {
    ...photo,
    categoryKey: categoryEntry.key,
    categoryLabel: categoryEntry.labels[locale] ?? photo.category,
    title: translation?.title?.[locale] ?? photo.title,
    alt: translation?.alt?.[locale] ?? photo.alt,
  }
}

export function localizeVideo<T extends { id: number; category: string; title: string; description: string }>(
  video: T,
  locale: Locale
): LocalizedVideo<T> {
  const categoryEntry = getCategoryEntry(video.category)
  const translation = videoText[video.id]
  return {
    ...video,
    categoryKey: categoryEntry.key,
    categoryLabel: categoryEntry.labels[locale] ?? video.category,
    title: translation?.title?.[locale] ?? video.title,
    description: translation?.description?.[locale] ?? video.description,
  }
}

export function translateCategoryKey(key: string, locale: Locale) {
  const entry = getCategoryEntry(key)
  return entry.labels[locale] ?? key
}

