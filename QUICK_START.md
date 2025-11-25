# Quick Start Guide

## 🚀 Getting Your Site Running Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   Navigate to `http://localhost:5173`

## 📝 Adding Your Real Content

### Photos
1. Add files to `public/photos/`
2. Update `public/data/photos.json` with entries that point to each file

### Videos
1. Add MP4 files to `public/videos/` (and thumbnails to `public/videos/thumbnails/`)
2. Update `public/data/videos.json` with the proper metadata

### Gaby's Wall & Book
- Edit `public/data/wall.json` to keep a permanent copy of short notes
- Gaby's Book is a static announcement from Jimena Cortes. Update the link in `GabysBook.tsx` once the book is published (planned for February 23).

## 🌐 Deploying to GitHub Pages

### Step 1: Create GitHub Repository
1. Go to GitHub and create a new repository named `gabriella-memorial`
2. Don't initialize with README (or delete it if you did)

### Step 2: Push Your Code
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/gabriella-memorial.git
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository Settings → Pages
2. Under "Source", select "GitHub Actions"
3. The site will automatically deploy!

Your site will be available at:
`https://YOUR_USERNAME.github.io/gabriella-memorial/`

## 🎨 Current Features

✅ Soft pastel color scheme
✅ Mobile-first responsive design
✅ Photo gallery with lightbox
✅ Video gallery with fullscreen
✅ Gaby's Wall for public notes
✅ Gaby's Book for long-form tributes
✅ Timeline view
✅ Search functionality
✅ Category filtering
✅ Slideshow mode
✅ Download options

## 💡 Tips

- **Testing locally first**: Always test your changes with `npm run dev` before deploying
- **Image optimization**: Compress large images before uploading for faster loading
- **File organization**: Keep your files organized in the `public` folder
- **Regular backups**: Commit your changes regularly to GitHub

## 🔒 Security Notes

- The site is public (as requested)
- All content is served over HTTPS via GitHub Pages
- No sensitive information should be committed to the repository
- Consider adding a privacy notice if needed

---

Need help? Check the main README.md for more detailed information.


