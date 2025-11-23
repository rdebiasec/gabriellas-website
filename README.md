# In Memory of Gabriella

A beautiful, modern memorial website to preserve and share memories of Gabriella. This site features a mobile-first design with soft pastel colors, organized galleries for photos, videos, and documents, with timeline view, search functionality, and download capabilities.

## Features

- 🎨 **Soft Pastel Design** - Beautiful, gentle color scheme
- 📱 **Mobile-First** - Responsive design that works perfectly on all devices
- 📷 **Photo Gallery** - Browse photos with lightbox, slideshow, and download options
- 🎥 **Video Gallery** - Watch videos with fullscreen and download support
- 📄 **Documents Section** - Organized repository of important documents
- ⏱️ **Timeline View** - Chronological organization of all memories
- 🔍 **Search Functionality** - Search across all content
- 🏷️ **Categories** - Filter content by category
- ⬇️ **Download Options** - Download photos, videos, and documents
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

1. Add your photos to the `public/photos/` folder
2. Update `src/components/PhotoGallery.tsx`:
   - Replace the demo `photos` array with your actual photos
   - Update the `src` paths to point to your photos
   - Add titles, dates, categories, and years

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

1. Add your videos to the `public/videos/` folder
2. Update `src/components/VideoGallery.tsx`:
   - Replace the demo `videos` array with your actual videos
   - Update the `videoUrl` paths to point to your videos

### Adding Documents

1. Add your documents (PDFs, images, etc.) to the `public/documents/` folder
2. Update `src/components/Documents.tsx`:
   - Replace the demo `documents` array with your actual documents
   - Update the `fileUrl` paths to point to your documents

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
├── public/              # Static assets (photos, videos, documents)
├── src/
│   ├── components/     # React components
│   │   ├── Hero.tsx
│   │   ├── PhotoGallery.tsx
│   │   ├── VideoGallery.tsx
│   │   ├── Documents.tsx
│   │   └── Timeline.tsx
│   ├── App.tsx         # Main app component
│   ├── App.css         # Main styles
│   └── main.tsx        # Entry point
├── .github/
│   └── workflows/      # GitHub Actions for deployment
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
