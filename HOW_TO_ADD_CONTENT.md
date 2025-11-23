# How to Add Content - Simple Guide

## 🎯 The Simple Answer

**You DON'T need to edit .tsx files anymore!** 

Instead, you just edit **JSON files** which are much simpler. JSON files are just plain text files with a specific format - like a list or dictionary.

## 📁 Where Everything Goes

### Folder Structure:
```
public/
├── photos/          ← Put your photos here (JPG, PNG, etc.)
├── videos/          ← Put your videos here (MP4, etc.)
│   └── thumbnails/  ← Put video thumbnails here (optional)
├── documents/       ← Put your documents here (PDF, etc.)
└── data/           ← Edit these JSON files to add content info
    ├── photos.json
    ├── videos.json
    └── documents.json
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

## 📄 Adding Documents

### Step 1: Add the Document File
1. Put your document in `public/documents/` folder
   - Example: `public/documents/birth-certificate.pdf`

### Step 2: Edit `public/data/documents.json`

```json
{
  "id": 7,
  "title": "Birth Certificate",
  "type": "Certificate",
  "date": "2010",
  "description": "Official birth registration",
  "icon": "📄",
  "category": "Certificate",
  "fileUrl": "/documents/birth-certificate.pdf"
}
```

**Icon Options:** 📄 📚 🏥 🎨 📝 🏆 💌 🎓

## ✅ Quick Checklist

When adding a new photo:
- [ ] Photo file is in `public/photos/` folder
- [ ] Added entry to `public/data/photos.json`
- [ ] Used unique `id` number
- [ ] `src` path starts with `/photos/`
- [ ] Saved the JSON file

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

