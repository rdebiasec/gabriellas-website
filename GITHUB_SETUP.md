# GitHub Repository Setup Guide

## Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name:** `gabriella-memorial` (or your preferred name)
   - **Description:** "A beautiful memorial website for Gabriella"
   - **Visibility:** Choose **Public** (as requested) or Private
   - **DO NOT** check "Initialize with README" (we already have files)
   - **DO NOT** add .gitignore or license (we already have them)
5. Click **"Create repository"**

## Step 2: Connect and Push Your Code

After creating the repository, GitHub will show you commands. Use these:

```bash
cd /Users/ricardodebiase/Documents/gabriella-memorial

# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/gabriella-memorial.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (top menu)
3. Scroll down to **Pages** (left sidebar)
4. Under **Source**, select **"GitHub Actions"**
5. The site will automatically deploy!

Your site will be available at:
`https://YOUR_USERNAME.github.io/gabriella-memorial/`

## Important Notes

- The repository is already initialized and has an initial commit
- All files are ready to push
- GitHub Actions workflow is already configured for automatic deployment
- The site will automatically rebuild and deploy when you push changes

## Quick Commands Reference

```bash
# Check status
git status

# Add changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push

# View remote
git remote -v
```

## Troubleshooting

**If you get "repository not found":**
- Check that you've created the repository on GitHub first
- Verify the repository name matches exactly
- Make sure you're using the correct GitHub username

**If push is rejected:**
- Make sure you've created the repository on GitHub first
- Check that the remote URL is correct

**For authentication:**
- GitHub may ask for your username and password
- Consider using a Personal Access Token instead of password
- Or use SSH: `git@github.com:YOUR_USERNAME/gabriella-memorial.git`


