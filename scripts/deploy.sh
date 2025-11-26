#!/usr/bin/env bash
set -euo pipefail

# Simple deployment script - just say "deploy" or "push" to trigger
# Usage: ./scripts/deploy.sh [commit message]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$REPO_ROOT"

COMMIT_MESSAGE="${1:-Update from Cursor}"

echo "🚀 Deploying to GitHub Pages..."
echo "📝 Commit message: $COMMIT_MESSAGE"
echo ""

# Run the push script
"$REPO_ROOT/push.sh" -m "$COMMIT_MESSAGE"

echo ""
echo "✅ Deployment initiated! Check GitHub Actions for build status."

