# In Memory of Gabriella

A beautiful, modern memorial website to preserve and share memories of Gabriella. The site features a mobile-first design with soft pastel colors, organized galleries for photos and videos, an interactive wall for heartfelt notes, and Gaby’s Book for long-form tributes.

## Features

- 🎨 **Soft Pastel Design** - Beautiful, gentle color scheme
- 📱 **Mobile-First** - Responsive design that works perfectly on all devices
- 📷 **Photo Gallery** - Browse photos with lightbox, slideshow, and download options
- 🎥 **Video Gallery** - Watch videos with fullscreen and download support
- 💌 **Gaby's Wall** - Collect short, public notes to Gabriella with exportable JSON backups
- 📚 **Gaby's Book** - Warm message from Jimena Cortes with a link to the upcoming book launch
- ⏱️ **Timeline View** - Chronological organization of all memories
- 🔍 **Search Functionality** - Search across all content
- 🏷️ **Categories** - Filter content by category
- ⬇️ **Download Options** - Download photos and videos directly
- 🎞️ **Slideshow** - Automatic slideshow for photos
- 🖼️ **Fullscreen Viewing** - Full-screen lightbox for photos and videos

## Technology Stack

- **React 19** - Modern React with TypeScript
- **Vite** - Fast build tool and dev server
- **TypeScript** - Type-safe development
- **CSS3** - Modern CSS with gradients and animations
- **GitHub Pages** - Free hosting

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd gabriella-memorial
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## Adding Your Content

### Adding Photos

1. Place your photo files in `public/photos/`
2. Update `public/data/photos.json` with entries that describe each photo (title, date, category, etc.)

Example:
```typescript
{
  id: 1,
  src: '/photos/image1.jpg',
  alt: 'Description of the photo',
  title: 'Photo Title',
  date: '2020',
  category: 'Family',
  year: 2020
}
```

### Adding Videos

1. Place your MP4 files in `public/videos/` (and optional thumbnails in `public/videos/thumbnails/`)
2. Update `public/data/videos.json` with the metadata for each video

### Adding Wall Entries

- **Wall (`public/data/wall.json`)**: List of short notes containing `fullName`, `message`, and `createdAt`. The UI lets visitors submit messages locally and download a JSON backup to keep the repository in sync.

### Gaby's Book Announcement

- The book page is a static announcement authored by Jimena Cortes with a button that will link to the published book on February 23. Update the link in `GabysBook.tsx` once the book is live.

## Deployment to GitHub Pages

### Automatic Deployment (Recommended)

1. Push your code to a GitHub repository
2. Go to Settings → Pages in your GitHub repository
3. Under "Source", select "GitHub Actions"
4. The workflow in `.github/workflows/deploy.yml` will automatically deploy your site

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Copy the contents of the `dist` folder to your GitHub Pages branch

3. Update `vite.config.ts` if your repository name is different:
```typescript
base: '/your-repo-name/'
```

### Automated Push Script

To streamline daily deployments, use the helper script `push.sh` (repo root):

1. Make it executable (one-time): `chmod +x push.sh`
2. Run `./push.sh`
   - Optional flags: `-m "Commit message"` and `-t "YOUR_PAT"` let you pass the values inline (otherwise the script will prompt interactively).
3. The script stages all changes, creates the commit, and pushes `HEAD` to `main` on `https://github.com/rdebiasec/gabriellas-website`.

The PAT is requested every run and isn’t stored anywhere in the repository. Because you paste the token into the terminal, consider clearing your shell history if you share the machine.

## Security Best Practices

- ✅ HTTPS enabled via GitHub Pages
- ✅ No sensitive data in the repository
- ✅ Content Security Policy headers (can be added via GitHub Pages settings)
- ✅ All external links use HTTPS
- ✅ No API keys or secrets in the code

## Customization

### Changing Colors

The color scheme uses soft pastels. To customize, update the CSS variables in:
- `src/App.css` - Main app colors
- `src/components/*.css` - Component-specific colors

Main color palette:
- Primary: `#8b7a9e` (Soft purple)
- Secondary: `#e8d5e8` (Light lavender)
- Background: `#fef5f5` (Soft pink)
- Accent: `#d4b8d4` (Medium lavender)

### Adding New Categories

Categories are automatically generated from your content. To add predefined categories, update the category arrays in each component.

## Project Structure

```
gabriella-memorial/
├── public/
│   ├── photos/                # Photo assets
│   ├── videos/                # Video assets + thumbnails
│   └── data/
│       ├── photos.json        # Photo metadata
│       ├── videos.json        # Video metadata
│       └── wall.json          # Seed entries for Gaby's Wall
├── src/
│   ├── components/
│   │   ├── GabysWall.tsx
│   │   ├── GabysBook.tsx
│   │   ├── Hero.tsx
│   │   ├── PhotoGallery.tsx
│   │   ├── VideoGallery.tsx
│   │   └── Timeline.tsx
│   ├── App.tsx
│   ├── App.css
│   └── main.tsx
├── .github/
│   └── workflows/
└── package.json
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

This project is private and personal.

## Support

For questions or issues, please refer to the code comments or create an issue in the repository.

---

**Forever in our hearts ❤️**
