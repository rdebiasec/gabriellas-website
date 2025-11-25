# How to Add Content - Simple Guide

**You DON'T need to edit .tsx files anymore!** 
Instead, you just edit **JSON files** which are much simpler. JSON files are just plain text files with a specific format - like a list or dictionary.

## 📁 Where Everything Goes

### Folder Structure:
```
public/
├── photos/          ← Put your photos here (JPG, PNG, etc.)
├── videos/          ← Put your videos here (MP4, etc.)
│   └── thumbnails/  ← Put video thumbnails here (optional)
└── data/           ← Edit these JSON files to add content info
    ├── photos.json
    ├── videos.json
    └── wall.json    ← Notes for Gaby's Wall
```


## 📷 Adding Photos

### Step 1: Add the Photo File
1. Put your photo file in `public/photos/` folder
   - Example: `public/photos/gabriella-birthday-2020.jpg`

### Step 2: Edit `public/data/photos.json`

Open `public/data/photos.json` in any text editor and add a new entry:

```json
{
  "id": 11,
  "src": "/photos/gabriella-birthday-2020.jpg",
  "alt": "Gabriella's birthday celebration",
  "title": "Birthday 2020",
  "date": "2020",
  "category": "Celebration",
  "year": 2020
}
```

**Important Notes:**
- `id` should be unique (use the next number: 11, 12, 13, etc.)
- `src` should start with `/photos/` followed by your filename
- `category` can be: Family, Celebration, Adventure, or any you want
- `year` is a number (2020, not "2020")

### Example of Complete photos.json:
```json
[
  {
    "id": 1,
    "src": "/photos/gabriella-birthday-2020.jpg",
    "alt": "Birthday celebration",
    "title": "Birthday 2020",
    "date": "2020",
    "category": "Celebration",
    "year": 2020
  },
  {
    "id": 2,
    "src": "/photos/family-trip-2019.jpg",
    "alt": "Family vacation",
    "title": "Family Trip",
    "date": "2019",
    "category": "Family",
    "year": 2019
  }
]
```

## 🎥 Adding Videos

### Step 1: Add the Video File
1. Put your video in `public/videos/` folder
   - Example: `public/videos/gabriella-dancing.mp4`

### Step 2: Add a Thumbnail (Optional but Recommended)
1. Create a thumbnail image (screenshot from the video)
2. Put it in `public/videos/thumbnails/`
   - Example: `public/videos/thumbnails/gabriella-dancing-thumb.jpg`

### Step 3: Edit `public/data/videos.json`

```json
{
  "id": 4,
  "title": "Gabriella Dancing",
  "description": "Beautiful dance performance",
  "thumbnail": "/videos/thumbnails/gabriella-dancing-thumb.jpg",
  "videoUrl": "/videos/gabriella-dancing.mp4",
  "date": "2019",
  "category": "Family",
  "year": 2019
}
```

## 💌 Adding Gaby's Wall Notes

1. Open `public/data/wall.json`
2. Each entry needs:
   ```json
   {
     "id": "wall-1",
     "fullName": "Your name",
     "message": "Short note (max 1024 characters)",
     "createdAt": "2025-01-01T12:00:00.000Z"
   }
   ```
3. Keep `createdAt` in ISO format so it sorts correctly.
4. Visitors can also post notes in the UI; remind them to click **Download entries** and replace this JSON file so the notes become permanent.

## 📚 About Gaby's Book

Gaby's Book is now a single announcement written by Jimena Cortes with a button that will point to the published book on February 23. Update the URL in `src/components/GabysBook.tsx` when the real link is ready—no JSON edits are required.

## ✅ Quick Checklist

When adding a new photo:
- [ ] Photo file is in `public/photos/` folder
- [ ] Added entry to `public/data/photos.json`
- [ ] Used unique `id` number
- [ ] `src` path starts with `/photos/`
- [ ] Saved the JSON file

When adding a new wall message:
- [ ] Updated `public/data/wall.json`
- [ ] Used ISO timestamp in `createdAt`
- [ ] Saved & backed up the file

- No book checklist needed—the page is static until publication.

## 🚨 Common Mistakes to Avoid

1. **Wrong path format:**
   - ❌ Wrong: `"src": "photos/image.jpg"`
   - ✅ Correct: `"src": "/photos/image.jpg"` (note the leading `/`)

2. **Missing comma:**
   - ❌ Wrong: `{"id": 1} {"id": 2}`
   - ✅ Correct: `{"id": 1}, {"id": 2}` (comma between items)

3. **Wrong quotes:**
   - ❌ Wrong: `'title': 'My Photo'` (single quotes)
   - ✅ Correct: `"title": "My Photo"` (double quotes)

4. **Forgetting to save:**
   - Always save the JSON file after editing!

## 💡 Tips

- **Use a good text editor:** VS Code, Notepad++, or even TextEdit (Mac) / Notepad (Windows)
- **Validate JSON:** Use an online JSON validator if you get errors
- **Backup first:** Copy your JSON files before making big changes
- **Test locally:** Run `npm run dev` to see your changes immediately

## 🆘 Need Help?

If something doesn't work:
1. Check that your file paths are correct
2. Make sure your JSON syntax is valid (commas, quotes, brackets)
3. Check the browser console for errors (F12)
4. Make sure you saved the JSON file

---

**Remember:** You only edit JSON files now - no more .tsx files! 🎉


