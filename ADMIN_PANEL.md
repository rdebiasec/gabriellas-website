# Admin Panel

The admin panel allows you to manage videos on the website through a user-friendly interface.

## Access

Navigate to `/admin` on the website (e.g., `https://yourdomain.com/admin`)

## Features

- **Login**: Password-protected access
- **Add YouTube Videos**: Paste a YouTube URL and the system automatically extracts metadata
- **Add Local Videos**: Add videos that are uploaded to the `public/videos/` folder
- **Edit Videos**: Update video information
- **Delete Videos**: Remove videos from the collection
- **View All Videos**: See a list of all videos with their details

## Configuration

The admin panel connects to the Admin API deployed on Vercel. By default, it uses:
```
https://gaby-website-admin.vercel.app/api/admin
```

To use a different API URL, create a `.env.local` file in the project root:
```
VITE_ADMIN_API_URL=https://your-custom-api-url.com/api/admin
```

## Usage

### Adding a YouTube Video

1. Click "Add YouTube Video"
2. Paste the YouTube URL (or just the video ID)
3. Select a category
4. Optionally enter a date (format: YYYY)
5. Click "Add Video"

The system will automatically:
- Extract the video title, description, and thumbnail from YouTube
- Get the publish date
- Add it to the videos.json file
- Commit the changes to GitHub

### Adding a Local Video

1. First, upload your video file to `public/videos/` in the repository
2. Optionally upload a thumbnail to `public/videos/thumbnails/`
3. Click "Add Local Video"
4. Fill in the form:
   - Title (required)
   - Description (optional)
   - Video URL: `/videos/your-video.mp4` (required)
   - Thumbnail URL: `/videos/thumbnails/your-thumb.jpg` (optional)
   - Category (required)
   - Date: YYYY format (optional)
5. Click "Add Video"

### Editing a Video

1. Find the video in the list
2. Click "Edit"
3. Update the fields
4. Click "Update Video"

### Deleting a Video

1. Find the video in the list
2. Click "Delete"
3. Confirm the deletion

## Security

- The admin panel requires a password to access
- The password is set in the Vercel environment variable `ADMIN_PASSWORD`
- Tokens expire after 24 hours
- All API requests are authenticated with JWT tokens

## Troubleshooting

### "Token expired. Please login again."
- Your session has expired (24 hours)
- Simply log in again

### "Failed to load videos"
- Check that the Admin API is deployed and accessible
- Verify environment variables are set in Vercel
- Check browser console for detailed error messages

### "Failed to add video"
- For YouTube videos: Verify the YouTube API key is set in Vercel
- For local videos: Make sure the video file path is correct
- Check that GitHub token has write permissions

## Notes

- Changes are automatically committed to the GitHub repository
- GitHub Actions will automatically rebuild and deploy the website
- It may take a few minutes for changes to appear on the live site

