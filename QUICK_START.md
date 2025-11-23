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
1. Create folder: `public/photos/`
2. Add your photos there
3. Edit `src/components/PhotoGallery.tsx` - replace the `photos` array with your photos

### Videos
1. Create folder: `public/videos/`
2. Add your videos there
3. Edit `src/components/VideoGallery.tsx` - replace the `videos` array with your videos

### Documents
1. Create folder: `public/documents/`
2. Add your documents there
3. Edit `src/components/Documents.tsx` - replace the `documents` array with your documents

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
✅ Documents section
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

