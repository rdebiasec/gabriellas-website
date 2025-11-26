#!/usr/bin/env bash
set -euo pipefail

# Simple deployment script - just say "deploy" or "push" to trigger
# Usage: ./scripts/deploy.sh [commit message]
# Or say: "deploy with message: your message here"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$REPO_ROOT"

# Get commit message from argument or prompt
if [[ -n "${1:-}" ]]; then
  COMMIT_MESSAGE="$1"
else
  read -rp "📝 Enter commit message (or press Enter for default): " COMMIT_MESSAGE
  COMMIT_MESSAGE="${COMMIT_MESSAGE:-Update from Cursor}"
fi

echo "🚀 Deploying to GitHub Pages..."
echo "📝 Commit message: $COMMIT_MESSAGE"
echo ""

# Run the push script
"$REPO_ROOT/push.sh" -m "$COMMIT_MESSAGE"

echo ""
echo "✅ Deployment initiated! Check GitHub Actions for build status."

