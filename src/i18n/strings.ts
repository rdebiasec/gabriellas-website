import type { Locale } from './locales'

type CountFormatter = (value: number) => string
type RangeFormatter = (current: number, max: number) => string
type TitleFormatter = (title: string) => string

export type Strings = {
  nav: {
    home: string
    timeline: string
    photos: string
    videos: string
    wall: string
    book: string
  }
  header: {
    tagline: string
    menuHint: string
    menuHintButton: string
    openMenuAria: string
    closeMenuAria: string
  }
  languageToggle: {
    ariaLabel: string
    esLabel: string
    enLabel: string
    switchToSpanish: string
    switchToEnglish: string
  }
  hero: {
    kicker: string
    subtitle: string
    paragraphs: string[]
    imagePill: string
    imageAlt: string
    stats: {
      photos: string
      videos: string
      wall: string
      book: string
      comments: string
    }
  }
  wall: {
    kicker: string
    title: string
    description: string
    form: {
      nameLabel: string
      namePlaceholder: string
      messageLabel: string
      messagePlaceholder: string
      charCount: RangeFormatter
      submitIdle: string
      submitBusy: string
      download: string
      backupNote: string
      validation: {
        missingFields: string
        messageTooLong: RangeFormatter
      }
      success: string
      failure: string
    }
    feed: {
      header: string
      count: CountFormatter
      loading: string
      error: string
      retry: string
      empty: string
    }
  }
  photos: {
    title: string
    description: string
    searchPlaceholder: string
    noResults: string
    slideshowStart: string
    slideshowStop: string
    download: string
    lightboxClose: string
    lightboxPrev: string
    lightboxNext: string
  }
  videos: {
    title: string
    description: string
    searchPlaceholder: string
    noResults: string
    playLabel: TitleFormatter
    fullscreen: string
    download: string
    unsupported: string
  }
  timeline: {
    title: string
    description: string
    searchPlaceholder: string
    noResults: string
  }
  book: {
    kicker: string
    title: string
    paragraphs: string[]
    signature: string
    link: string
  }
  footer: {
    message: string
  }
  filters: {
    all: string
  }
  common: {
    close: string
    retry: string
  }
}

export const strings: Record<Locale, Strings> = {
  es: {
    nav: {
      home: 'Inicio',
      timeline: 'Cronología',
      photos: 'Fotos',
      videos: 'Videos',
      wall: 'Muro',
      book: 'Libro',
    },
    header: {
      tagline: 'CELEBRANDO LA VIDA DE GABRIELLA.',
      menuHint: 'Toca aquí para explorar fotos, videos, su cronología, el muro y su libro recuerdo.',
      menuHintButton: 'Entendido',
      openMenuAria: 'Abrir menú',
      closeMenuAria: 'Cerrar menú',
    },
    languageToggle: {
      ariaLabel: 'Cambiar idioma a español o inglés',
      esLabel: 'ES',
      enLabel: 'EN',
      switchToSpanish: 'Cambiar el sitio a español',
      switchToEnglish: 'Cambiar el sitio a inglés',
    },
    hero: {
      kicker: 'Un alma luminosa',
      subtitle: 'Una vida hermosa recordada',
      paragraphs: [
        'Esta es una colección de recuerdos, momentos y hitos del tiempo de Gabriella con nosotros. Cada foto, video y documento vibra con su risa, la curiosidad que la llevaba a nuevas aventuras y la alegría que compartía con todos.',
        'Fue una niña maravillosamente feliz, amada y extrañada profundamente por quienes la quieren, y este espacio celebra ese espíritu radiante con gratitud y sonrisas.',
      ],
      imagePill: 'Espíritu alegre',
      imageAlt: 'Gabriella sonriendo al aire libre',
      stats: {
        photos: 'Fotos',
        videos: 'Videos',
        wall: 'Muro',
        book: 'Libro',
        comments: 'Mensajes',
      },
    },
    wall: {
      kicker: 'El Muro de Gaby',
      title: 'Mensajes de amor desde todo el mundo',
      description:
        'Comparte una nota que celebre el espíritu alegre de Gabriella. Los mensajes se guardan de forma segura en nuestra base de datos y puedes descargarlos como un archivo JSON para conservarlos.',
      form: {
        nameLabel: 'Nombre completo',
        namePlaceholder: 'Tu nombre completo',
        messageLabel: 'Mensaje',
        messagePlaceholder: 'Escribe hasta 1024 caracteres...',
        charCount: (current, max) => `${current}/${max} caracteres`,
        submitIdle: 'Publicar en el Muro de Gaby',
        submitBusy: 'Compartiendo nota...',
        download: 'Descargar mensajes',
        backupNote:
          'Descargar las notas es ideal para mantener una copia personal o archivarlas en el repositorio cuando quieras un nuevo respaldo.',
        validation: {
          missingFields: 'Por favor comparte tu nombre completo y un mensaje.',
          messageTooLong: (_, max) => `Los mensajes están limitados a ${max} caracteres.`,
        },
        success: 'Tu nota se agregó al Muro de Gaby.',
        failure: 'No pudimos publicar tu nota en este momento. Intenta de nuevo pronto.',
      },
      feed: {
        header: 'Notas recientes',
        count: (value) => `${value} recuerdos compartidos`,
        loading: 'Cargando notas llenas de cariño...',
        error: 'No pudimos cargar las notas más recientes. Intenta de nuevo.',
        retry: 'Intentar nuevamente',
        empty: 'Sé la primera persona en dejar un mensaje para Gabriella.',
      },
    },
    photos: {
      title: 'Galería de fotos',
      description: 'Una colección de momentos hermosos capturados en el tiempo',
      searchPlaceholder: 'Buscar fotos...',
      noResults: 'No se encontraron fotos que coincidan con tu búsqueda.',
      slideshowStart: '▶ Presentación',
      slideshowStop: '⏸ Detener presentación',
      download: '⬇ Descargar',
      lightboxClose: 'Cerrar',
      lightboxPrev: 'Anterior',
      lightboxNext: 'Siguiente',
    },
    videos: {
      title: 'Galería de videos',
      description: 'Videos que capturan momentos especiales y recuerdos',
      searchPlaceholder: 'Buscar videos...',
      noResults: 'No se encontraron videos que coincidan con tu búsqueda.',
      playLabel: (title) => `Reproducir ${title}`,
      fullscreen: '⛶ Pantalla completa',
      download: '⬇ Descargar',
      unsupported: 'Tu navegador no admite la etiqueta de video.',
    },
    timeline: {
      title: 'Cronología',
      description: 'Un viaje cronológico a través de los recuerdos',
      searchPlaceholder: 'Buscar en la cronología...',
      noResults: 'No se encontraron elementos que coincidan con tu búsqueda.',
    },
    book: {
      kicker: 'El libro de Gaby',
      title: 'Una carta de amor en proceso',
      paragraphs: [
        'La mamá de Gabriella, Jimena Cortes, está terminando con cuidado un libro que reúne los momentos radiantes, las lecciones silenciosas y las historias alegres que definieron la vida de Gaby. El manuscrito se está finalizando ahora y se publicará el {{date}}, el día en que Gaby ganó sus alas.',
        'Este libro es una promesa para compartir cómo Gaby se movía por el mundo, con amabilidad, curiosidad y valentía. Cada página busca sentirse como una conversación cálida, un recordatorio de que su risa aún resuena en cada corazón que tocó. Está escrito con inmensa gratitud por todas las personas que la amaron y guiado por la creencia de que la alegría puede ser un legado.',
      ],
      signature: '— Jimena Cortes, mamá de Gabriella',
      link: 'Ver el libro (muy pronto)',
    },
    footer: {
      message: 'Por siempre en nuestros corazones ❤️',
    },
    filters: {
      all: 'Todas',
    },
    common: {
      close: 'Cerrar',
      retry: 'Intentar nuevamente',
    },
  },
  en: {
    nav: {
      home: 'Home',
      timeline: 'Timeline',
      photos: 'Photos',
      videos: 'Videos',
      wall: 'Wall',
      book: 'Book',
    },
    header: {
      tagline: "CELEBRATING GABRIELLA'S LIFE.",
      menuHint: 'Tap here to browse photos, videos, her timeline, wall, and keepsake book.',
      menuHintButton: 'Got it',
      openMenuAria: 'Open menu',
      closeMenuAria: 'Close menu',
    },
    languageToggle: {
      ariaLabel: 'Switch site language between Spanish and English',
      esLabel: 'ES',
      enLabel: 'EN',
      switchToSpanish: 'Switch the site to Spanish',
      switchToEnglish: 'Switch the site to English',
    },
    hero: {
      kicker: 'A luminous soul',
      subtitle: 'A beautiful life remembered',
      paragraphs: [
        "This is a collection of memories, moments, and milestones from Gabriella's time with us. Every photo, video, and document hums with her bright laughter, the curiosity that led her on new adventures, and the joy she shared so freely.",
        'She was a wonderfully happy girl, cherished and missed deeply by everyone who loves her, and this space celebrates that radiant spirit with gratitude and smiles.',
      ],
      imagePill: 'Joyful spirit',
      imageAlt: 'Gabriella smiling outdoors',
      stats: {
        photos: 'Photos',
        videos: 'Videos',
        wall: 'Wall',
        book: 'Book',
        comments: 'Comments',
      },
    },
    wall: {
      kicker: "Gaby's Wall",
      title: 'Messages of love from around the world',
      description:
        "Share a note that celebrates Gabriella's joyful spirit. Messages are stored securely via our memorial database, and you can download them as a JSON file to keep an archive.",
      form: {
        nameLabel: 'Full name',
        namePlaceholder: 'Your full name',
        messageLabel: 'Message',
        messagePlaceholder: 'Write up to 1024 characters...',
        charCount: (current, max) => `${current}/${max} characters`,
        submitIdle: "Post to Gaby's Wall",
        submitBusy: 'Sharing note...',
        download: 'Download entries',
        backupNote:
          'Downloaded notes are great for keeping a personal backup or archiving them in the repository whenever you’d like a snapshot in version control.',
        validation: {
          missingFields: 'Please share both your full name and a message.',
          messageTooLong: (_, max) => `Messages are limited to ${max} characters.`,
        },
        success: "Your note has been added to Gaby's Wall.",
        failure: 'We could not post your note right now. Please try again shortly.',
      },
      feed: {
        header: 'Recent notes',
        count: (value) => `${value} shared memories`,
        loading: 'Loading heartfelt notes...',
        error: 'We could not load the latest notes. Please try again.',
        retry: 'Try again',
        empty: 'Be the first to leave a message for Gabriella.',
      },
    },
    photos: {
      title: 'Photo Gallery',
      description: 'A collection of beautiful moments captured in time',
      searchPlaceholder: 'Search photos...',
      noResults: 'No photos found matching your search.',
      slideshowStart: '▶ Slideshow',
      slideshowStop: '⏸ Stop Slideshow',
      download: '⬇ Download',
      lightboxClose: 'Close',
      lightboxPrev: 'Previous',
      lightboxNext: 'Next',
    },
    videos: {
      title: 'Video Gallery',
      description: 'Videos that capture special moments and memories',
      searchPlaceholder: 'Search videos...',
      noResults: 'No videos found matching your search.',
      playLabel: (title) => `Play ${title}`,
      fullscreen: '⛶ Fullscreen',
      download: '⬇ Download',
      unsupported: 'Your browser does not support the video tag.',
    },
    timeline: {
      title: 'Timeline',
      description: 'A chronological journey through memories',
      searchPlaceholder: 'Search timeline...',
      noResults: 'No items found matching your search.',
    },
    book: {
      kicker: "Gaby's Book",
      title: 'A love letter in progress',
      paragraphs: [
        "Gabriella's mom, Jimena Cortes, is carefully completing a book that gathers the radiant moments, quiet lessons, and joyful stories that defined Gaby's life. The manuscript is being finalized now and will be released on {{date}}, the day Gaby earned her wings.",
        'This book is a promise to share how Gaby moved through the world—with kindness, curiosity, and courage. Every page is meant to feel like a warm conversation, a reminder that her laughter is still echoing in every heart she touched. It is written with immense gratitude for every person who loved her and guided by the belief that joy can be a legacy.',
      ],
      signature: '— Jimena Cortes, Mom of Gabriella',
      link: 'View the book (coming soon)',
    },
    footer: {
      message: 'Forever in our hearts ❤️',
    },
    filters: {
      all: 'All',
    },
    common: {
      close: 'Close',
      retry: 'Try again',
    },
  },
}

