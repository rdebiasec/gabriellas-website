# Quick Deployment Guide

## One-Time Setup: Store Your GitHub PAT

Run this once to store your GitHub Personal Access Token:

```bash
./scripts/set-pat.sh
```

Your PAT will be securely stored in `.github-pat` (gitignored, never committed).

## Deploy with a Keyword

Simply say **"deploy"** or **"push"** and I'll run:

```bash
./scripts/deploy.sh "Your commit message"
```

Or you can run it directly:

```bash
# With custom message
./scripts/deploy.sh "Fixed photo thumbnails brightness"

# With default message
./scripts/deploy.sh
```

## How It Works

1. **First time**: Run `./scripts/set-pat.sh` to store your PAT
2. **Every deployment**: Just say "deploy" or run `./scripts/deploy.sh`
3. **Automatic**: GitHub Actions builds and deploys to GitHub Pages

## What Happens

1. All changes are staged (`git add -A`)
2. Changes are committed with your message
3. Code is pushed to `main` branch
4. GitHub Actions automatically builds and deploys to GitHub Pages

## Update Your PAT

If you need to update your stored PAT:

```bash
./scripts/set-pat.sh
```

## Security

- PAT is stored in `.github-pat` (gitignored)
- File permissions are set to 600 (read/write for owner only)
- PAT is never committed to git
- PAT is only used during the push command

